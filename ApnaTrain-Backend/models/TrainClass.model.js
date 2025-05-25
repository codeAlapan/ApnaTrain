const mongoose = require('mongoose');

const trainClassSchema = new mongoose.Schema(
  {
    classCode: {
      type: String,
      required: true,
      unique: true,
    },
    className: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainClass', trainClassSchema);
