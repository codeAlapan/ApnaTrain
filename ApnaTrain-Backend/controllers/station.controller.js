const Station = require('../models/Station.model.js');

// Get all stations
const getAllStations = async (req, res) => {
  try {
    const stations = await Station.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: stations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get station by ID
const getStationById = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ success: false, message: 'Station not found' });
    res.status(200).json({ success: true, data: station });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Create a new station
const createStation = async (req, res) => {
  try {
    const { name, code, city } = req.body;

    const existing = await Station.findOne({ code });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Station code already exists' });
    }

    const newStation = await Station.create({ name, code, city });
    res.status(201).json({ success: true, data: newStation });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid data', error: err.message });
  }
};

// Update station
const updateStation = async (req, res) => {
  try {
    const updated = await Station.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Station not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid data', error: err.message });
  }
};

// Delete station
const deleteStation = async (req, res) => {
  try {
    const deleted = await Station.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Station not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


module.exports = {
  getAllStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
};
