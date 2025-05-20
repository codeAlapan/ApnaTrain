const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger',
    required: true,
  },
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true,
  },
  seatsBooked: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  fare: {
    type: Number,
    required: false,  // optional but good to have for fare calculation
  },
});

module.exports = mongoose.model('Reservation', reservationSchema);
