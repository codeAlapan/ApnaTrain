const express = require('express');
const router = express.Router();

const {
  addConfig,
  getAllConfigs,
  getConfigById,
  updateConfig,
  deleteConfig,
} = require('../controllers/trainClassConfig.controller.js');

const protect = require('../middlewares/auth.middleware');
const authorizedRoles = require('../middlewares/role.middleware');

// Admin Routes
router.post('/add', protect, authorizedRoles('admin'), addConfig);
router.patch('/:id', protect, authorizedRoles('admin'), updateConfig);
router.delete('/:id', protect, authorizedRoles('admin'), deleteConfig);

// Public Routes (admin + passenger)
router.get('/', protect, authorizedRoles('admin', 'passenger'), getAllConfigs);
router.get('/:id', protect, authorizedRoles('admin', 'passenger'), getConfigById);

module.exports = router;
