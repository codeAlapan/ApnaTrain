const TrainClassConfig = require('../models/TrainClassConfig.model');

//  Add a new config (Admin only)
const addConfig = async (req, res) => {
  try {
    const config = await TrainClassConfig.create(req.body);
    res.status(201).json({ success: true, data: config });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//  Get all configs (Admin + Passenger)
const getAllConfigs = async (_req, res) => {
  try {
    const configs = await TrainClassConfig.find()
      .populate('train', 'trainName trainNumber')
      .populate('fromStation toStation', 'name code')
      .populate('classCode', 'className classCode');
    res.json({ success: true, data: configs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get single config by ID (Admin + Passenger)
const getConfigById = async (req, res) => {
  try {
    const config = await TrainClassConfig.findById(req.params.id)
      .populate('train', 'trainName trainNumber')
      .populate('fromStation toStation', 'name code')
      .populate('classCode', 'className classCode');

    if (!config) {
      return res.status(404).json({ success: false, message: 'Config not found' });
    }

    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Update config by ID (Admin only)
const updateConfig = async (req, res) => {
  try {
    const config = await TrainClassConfig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!config) {
      return res.status(404).json({ success: false, message: 'Config not found' });
    }

    res.json({ success: true, data: config });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//  Delete config by ID (Admin only)
const deleteConfig = async (req, res) => {
  try {
    const config = await TrainClassConfig.findByIdAndDelete(req.params.id);

    if (!config) {
      return res.status(404).json({ success: false, message: 'Config not found' });
    }

    res.json({ success: true, message: 'Config deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addConfig,
  getAllConfigs,
  getConfigById,
  updateConfig,
  deleteConfig,
};
