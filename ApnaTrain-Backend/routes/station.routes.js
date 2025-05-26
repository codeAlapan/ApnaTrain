const express = require('express');
const router = express.Router();

const {
  createStation,
  getAllStations,
  updateStation,
  deleteStation,
} = require('../controllers/station.controller.js');

const protect = require('../middlewares/auth.middleware.js');
const authorizedRoles = require('../middlewares/role.middleware.js');

// Admin routes
router.post('/create', protect, authorizedRoles('admin'), createStation);
router.put('/update/:id', protect, authorizedRoles('admin'), updateStation);
router.delete('/delete/:id', protect, authorizedRoles('admin'), deleteStation);

// Both admin and passenger can read stations
router.get('/', protect, authorizedRoles('admin', 'passenger'), getAllStations);

module.exports = router;
