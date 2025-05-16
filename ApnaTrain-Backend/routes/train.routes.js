const express = require("express");
const protect = require("../middlewares/auth.middleware.js");
const { getAllTrains } = require("../controllers/train.controller.js");
const authorizedRoles = require("../middlewares/role.middleware.js");

const router = express.Router();


// accessible to both
router.get('/', protect, authorizedRoles('admin', 'passenger'), getAllTrains); 

// accessible to admin only
router.post('/add', protect, authorizedRoles('admin'), (req, res) => {
  res.json({ message: 'Train added by admin only' });
});

module.exports = router;