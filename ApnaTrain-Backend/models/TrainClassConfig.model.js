const mongoose = require('mongoose');

const trainClassConfigSchema = new mongoose.Schema(
  {
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: true,
    },
    fromStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    },
    toStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    },
    classCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainClass',
      required: true,
    },
    seatCount: {
      type: Number,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const TrainClassConfig = mongoose.model(
  'TrainClassConfig',
  trainClassConfigSchema
);
module.exports = TrainClassConfig;
