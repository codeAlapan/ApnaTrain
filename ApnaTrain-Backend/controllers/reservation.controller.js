const Train = require('../models/Train.model.js');
const TrainClassConfig = require('../models/TrainClassConfig.model.js');
const Reservation = require('../models/Reservation.model.js');
const bookSeats = require('../utils/bookSeats.js');
const createTicket = require('../utils/createTicket.js');

const bookTicket = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      trainId,
      fromStation,
      toStation,
      classCode,
      seatsBooked,
      journeyDate,
      passengers,
    } = req.body;
    if (seatsBooked <= 0) {
      return res
        .status(400)
        .json({ message: 'Seats booked must be greater than zero' });
    }
    if (!Array.isArray(passengers) || passengers.length !== seatsBooked) {
      return res
        .status(400)
        .json({ message: 'Passengers count must match seats booked' });
    }
    // check if the train exist
    const train = await Train.findById(trainId).populate('route.station');
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // get the index of from and to station
    const routeStations = train.route.map((r) => {
      return r.station._id.toString();
    });
    const fromIndex = routeStations.indexOf(fromStation);
    const toIndex = routeStations.indexOf(toStation);

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex)
      return res.status(400).json({ message: 'Invalid from/to station' });

    //  Book seats segment-wise
    const bookingResult = await bookSeats({
      trainId,
      fromStation,
      toStation,
      classCode,
      seatsBooked,
    });

    //  Create reservation entry
    const newReservation = await Reservation.create({
      userId,
      trainId,
      fromStation,
      toStation,
      classCode,
      seatsBooked,
      journeyDate,
      fare: bookingResult.totalFare,
    });

    // Book the ticket
    const ticket = await createTicket({
      userId,
      trainId,
      classCode,
      fromStation,
      toStation,
      journeyDate,
      passengers,
      seatsBooked,
      totalFare: bookingResult.totalFare,
    });

    //  Respond with confirmation
    res.status(201).json({
      message: 'Ticket booked successfully',
      reservationId: newReservation._id,
      totalFare: bookingResult.totalFare,
      seatsBooked: bookingResult.seatsBooked,
      ticket: ticket,
    });
  } catch (err) {
    if (
      err.message === 'Not enough seats available' ||
      err.message === 'Invalid station selection' ||
      err.message === 'Segment config not found' ||
      err.message === 'Fare config not found for this route'
    ) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const userId = req.user._id;
    const reservations = await Reservation.find({ userId })
       .populate('trainId', 'trainName trainNumber')
      .populate('fromStation toStation classCode')
      .sort({ bookingDate: -1 });

    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.user._id;

    const reservation = await Reservation.findOne({
      _id: reservationId,
      userId,
    });

    if (!reservation) {
      return res
        .status(404)
        .json({ message: 'Reservation not found or unauthorized' });
    }

    // ✅ Fetch the train to get full route
    const train = await Train.findById(reservation.trainId).populate(
      'route.station'
    );
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // ✅ Get station indexes
    const route = train.route.map((r) => r.station._id.toString());
    const fromIndex = route.indexOf(reservation.fromStation.toString());
    const toIndex = route.indexOf(reservation.toStation.toString());

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
      return res
        .status(400)
        .json({ message: 'Invalid station route in reservation' });
    }

    // ✅ Create all segments
    const segments = [];
    for (let i = fromIndex; i < toIndex; i++) {
      segments.push({
        fromStation: train.route[i].station._id,
        toStation: train.route[i + 1].station._id,
      });
    }

    // ✅ Prepare bulk update to restore seats
    const bulkOps = segments.map((seg) => ({
      updateOne: {
        filter: {
          train: reservation.trainId,
          classCode: reservation.classCode,
          fromStation: seg.fromStation,
          toStation: seg.toStation,
        },
        update: {
          $inc: { seatCount: reservation.seatsBooked },
        },
      },
    }));

    await TrainClassConfig.bulkWrite(bulkOps);

    // ✅ Delete the reservation
    await Reservation.findByIdAndDelete(reservationId);

    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('❌ Cancel Reservation Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId', 'fullName gender email')
      .populate('trainId', 'trainName trainNumber')
      .populate('fromStation toStation classCode')
      .exec();

    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  bookTicket,
  getUserReservations,
  cancelReservation,
  getAllReservations,
};
