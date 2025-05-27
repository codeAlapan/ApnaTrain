const Schedule = require('../models/Schedule.model.js');
const Train = require('../models/Train.model.js');
const TrainClass = require('../models/TrainClass.model.js');
const TrainClassConfig = require('../models/TrainClassConfig.model.js');

// ✅ Add Train (Admin only)
const addTrain = async (req, res) => {
  try {
    const {
      trainName,
      trainNumber,
      source,
      destination,
      departureTime,
      arrivalTime,
      route, // 👈 Accept full route array from frontend
    } = req.body;

    // Optional: validate route array format
    if (!Array.isArray(route) || route.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Route must be a non-empty array of stations.',
      });
    }

    const newTrain = new Train({
      trainName,
      trainNumber,
      source,
      destination,
      departureTime,
      arrivalTime,
      route, // 👈 Saved directly
    });

    await newTrain.save();
    res.status(201).json({ success: true, data: newTrain });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get All Trains (Admin + Passenger)
const getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find().populate(
      'source destination route.station'
    ); // 👈 Populate station refs
    res.json({ success: true, data: trains });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Single Train by ID
const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id).populate(
      'source destination route.station'
    ); // 👈 Populate station refs
    if (!train) {
      return res
        .status(404)
        .json({ success: false, message: 'Train not found' });
    }
    res.json({ success: true, data: train });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const searchAvailableTrains = async (req, res) => {
  try {
    const { from, to, journeyDate, classCode } = req.body;
    const weekday = new Date(journeyDate).getDay(); // 0 (Sun) to 6 (Sat)

    /*

    //  find the objectID for the classCOde string
    const classObj = await TrainClass.findOne({classCode});
    if(!classObj){
      return res.status(400).json({ success: false, message: "Invalid class code" });
    }
    const classObjId = classObj._id;

    */

    // Find configs that match the route and the class
    const configs = await TrainClassConfig.find({
      fromStation: from,
      toStation: to,
      classCode,
    }).populate('train');

    const matchingTrains = [];

    for (let config of configs) {
      const schedule = await Schedule.findOne({ train: config.train._id });

      const runNormally =
        schedule?.runsOnDays.includes(weekday) &&
        !schedule.excludeDates.includes(journeyDate);

      const forceRun = schedule?.includeDates.includes(journeyDate);

      if (runNormally || forceRun) {
        matchingTrains.push({
          trainId: config.train._id,
          trainName: config.train.trainName,
          departureTime: config.train.departureTime,
          arrivalTime: config.train.arrivalTime,
          classCode: config.classCode,
          fare: config.fare,
        });
      }
    }

    res.status(200).json({ success: true, data: matchingTrains });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addTrain,
  getAllTrains,
  getTrainById,
  searchAvailableTrains,
};
