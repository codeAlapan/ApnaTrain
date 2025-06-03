// controllers/adminReservationController.js
const Reservation = require('../models/Reservation.model');
const Train = require('../models/Train.model');

const getReservationsWithFilters = async (req, res) => {
  try {
    const { trainId, startDate, endDate, classCode } = req.query;

    // Validate date formats if provided
    if (startDate && !isValidDate(startDate)) {
      return res.status(400).json({ message: 'Invalid start date format' });
    }
    if (endDate && !isValidDate(endDate)) {
      return res.status(400).json({ message: 'Invalid end date format' });
    }

    // Validate trainId if provided
    if (trainId) {
      const train = await Train.findById(trainId);
      if (!train) {
        return res.status(404).json({ message: 'Train not found' });
      }
    }

    const filter = {};

    if (trainId) filter.trainId = trainId;
    if (classCode) filter.classCode = classCode;

    if (startDate || endDate) {
      filter.journeyDate = {};
      if (startDate) filter.journeyDate.$gte = startDate;
      if (endDate) filter.journeyDate.$lte = endDate;
    }

    const reservations = await Reservation.find(filter)
      .populate('userId', 'fullName email')
      .populate('trainId', 'trainName trainNumber')
      .populate('fromStation toStation classCode')
      .sort({ journeyDate: 1 });

    if (!reservations.length) {
      return res.status(200).json({ 
        message: 'No reservations found for the given filters',
        reservations: [] 
      });
    }

    res.json({ 
      message: 'Reservations retrieved successfully',
      reservations 
    });
  } catch (err) {
    console.error('Error in getReservationsWithFilters:', err);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Helper function to validate date format
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

module.exports = {
  getReservationsWithFilters
};
