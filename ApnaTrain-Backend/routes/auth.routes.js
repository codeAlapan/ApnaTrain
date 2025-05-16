const express = require('express');
const router = express.Router();
const {
  registerPassenger,
  loginPassenger,
  loginAdmin,
} = require('../controllers/auth.controller.js');


router.post('/register', registerPassenger);
router.post('/login', loginPassenger);
router.post('/admin/login', loginAdmin);


module.exports = router;
