const Train = require('../models/Train.model.js');
const TrainClassConfig = require('../models/TrainClassConfig.model.js');
const Reservation = require('../models/Reservation.model.js');

const bookTicket = async (req, res) => {
  try {
    const userId = req.user._id;
    const { trainId, fromStation, toStation, classCode, seatsBooked } = req.body;

    // Check if train exists
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // Get seat config for class + route
    const config = await TrainClassConfig.findOne({
      train: trainId,
      fromStation,
      toStation,
      classCode,
    });

    if (!config) {
      return res.status(404).json({ message: 'Class config not found for this route' });
    }

    if (config.seatCount < seatsBooked) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const totalFare = config.fare * seatsBooked;

    const reservation = await Reservation.create({
      userId,
      trainId,
      fromStation,
      toStation,
      classCode,
      seatsBooked,
      fare: totalFare,
    });

    // Update seat count
    config.seatCount -= seatsBooked;
    await config.save();

    res.status(201).json({
      message: 'Ticket booked successfully',
      reservation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const userId = req.user._id;
    const reservations = await Reservation.find({ userId })
      .populate('userId', 'fullName gender email')
      .populate('trainId', 'trainName trainNumber')
      .populate('fromStation toStation classCode')
      .exec();

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
      return res.status(404).json({ message: 'Reservation not found or unauthorized' });
    }

    // Restore seat count in TrainClassConfig
    const config = await TrainClassConfig.findOne({
      train: reservation.trainId,
      fromStation: reservation.fromStation,
      toStation: reservation.toStation,
      classCode: reservation.classCode,
    });

    if (config) {
      config.seatCount += reservation.seatsBooked;
      await config.save();
    }

    await Reservation.findByIdAndDelete(reservationId);

    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
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
