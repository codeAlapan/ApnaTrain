const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
});

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
  },
  classCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainClass',
  },
  fromStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
  },
  toStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
  },
  journeyDate: {
    type: Date,
    required: true,
  },
  passengers: [passengerSchema],
  seatsBooked: Number,
  totalFare: Number,
  pnr: String, // Random 10-digit string
  bookingDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ticket', ticketSchema);
