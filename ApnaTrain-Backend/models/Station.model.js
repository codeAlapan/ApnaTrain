const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema(
  {
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
},
 {
  timestamps: true,
});

module.exports = mongoose.model('Station', stationSchema);
