const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema(
  {
    stationCode: {
      type: String,
      unique: true,
      required: true,
    },
    stationName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Station', stationSchema);
