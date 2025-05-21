const Train = require("../models/Train.model.js");

// Addtrain (admin only)
const addTrain = async (req, res) => {
  try {
    const {
      trainName,
      trainNumber,
      source,
      destination,
      departureTime,
      arrivalTime,
      totalSeats,
      fare,
      availableSeats,
      farePerSeat
    } = req.body;
    const newTrain = new Train({
      trainName,
      trainNumber,
      source,
      destination,
      departureTime,
      arrivalTime,
      totalSeats,
      fare,
      availableSeats,
      farePerSeat
    });

    await newTrain.save();
    res.status(201).json({ success: true, data: newTrain });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get All Trains (Admin + Passenger)
const getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.json({ success: true, data: trains });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Train by ID
const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ success: false, message: "Train not found" });
    }
    res.json({ success: true, data: train });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addTrain,
  getAllTrains,
  getTrainById,
};
