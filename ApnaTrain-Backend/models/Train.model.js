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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
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
    route: [
      {
        station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station' },
        arrivalTime: String,
        departureTime: String,
        dayOffset: Number,
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Train', trainSchema);
