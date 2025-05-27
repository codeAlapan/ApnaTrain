const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true
  },
  runsOnDays: [Number], // 0 = Sunday ... 6 = Saturday
  excludeDates: [String], // ISO date strings
  includeDates: [String]  // Optional overrides
});

module.exports = mongoose.model('Schedule', scheduleSchema);
