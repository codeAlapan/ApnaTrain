const Station = require('../models/Station.model.js');

const addStation = async (req, res) => {
  try {
    const station = await Station.create(req.body);
    res.status(201).json({ succes: true, data: station });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//get all users
const getAllStation = async (_req, res) => {
  try {
    const station = await Station.find();
    res.json({ success: true, data: station });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addStation,
  getAllStation,
};
