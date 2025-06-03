// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getReservationsWithFilters } = require('../controllers/adminreservation.controller');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/reservations', adminMiddleware, getReservationsWithFilters);

module.exports = router;
