const express = require('express');
const router = express.Router();
const {
  bookTicket,
  getUserReservations,
  getAllReservations,
  cancelReservation,
} = require('../controllers/reservation.controller.js');

const protect = require('../middlewares/auth.middleware.js');
const authorizedRoles = require('../middlewares/role.middleware.js');

router.post('/book', protect, bookTicket);
router.get('/my-bookings', protect, getUserReservations);
router.delete('/cancel/:id', protect, cancelReservation);
router.get('/all', protect, authorizedRoles('admin'), getAllReservations);

module.exports = router;
