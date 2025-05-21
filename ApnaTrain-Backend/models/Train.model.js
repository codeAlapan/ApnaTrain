const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema(
  {
    trainName: {
      type: String,
      required: true,
    },
    trainNumber: {
      type: String,
      required: true,
      unique: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    farePerSeat: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Train', trainSchema);
