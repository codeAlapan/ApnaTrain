const Train = require('../models/Train.model.js');
const Reservation = require('../models/Reservation.model.js');

const bookTicket = async (req, res) => {
  try {
    const userId = req.user._id;
    const { trainId, seatsBooked } = req.body;

    // check if train exists
    const ifTrainExist = await Train.findById(trainId);
    if (!ifTrainExist) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // check if seats are available
    if (ifTrainExist.availableSeats < seatsBooked) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // calculate fare
    const fare = seatsBooked * ifTrainExist.farePerSeat;

    // create reservation
    const newReservation = await Reservation.create({
      userId,
      trainId,
      seatsBooked,
      fare,
    });

    // update train seats
    ifTrainExist.availableSeats -= seatsBooked;
    await ifTrainExist.save();

    res
      .status(201)
      .json({ message: 'Ticket booked successfully', newReservation });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const userId = req.user._id;
    const reservations = await Reservation.find({ userId })
      .populate('userId', 'fullName gender email')
      .populate('trainId', 'trainName trainNumber farePerSeat')
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
      return res
        .status(404)
        .json({ message: 'Reservation not found or unauthorized' });
    }

    // Update train seats back
    const train = await Train.findById(reservation.trainId);
    if (train) {
      train.availableSeats += reservation.seatsBooked;
      await train.save();
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
      .populate('trainId', 'trainName trainNumber farePerSeat')
      .exec();
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookTicket,
  getUserReservations,
  cancelReservation,
  getAllReservations,
};
