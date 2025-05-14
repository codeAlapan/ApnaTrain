
//for admin pannel

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.model.js");

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Admin login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Internal Server error", error: err.message });
  }
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Passenger = require('../models/Passenger.model.js');

// Register Passenger
const registerPassenger = async (req, res) => {
  try {
    const { fullName, userName, age, gender, email, phoneNo, password } =
      req.body;

    // Check if existing user is trying to register
    const isExistingUser = await Passenger.findOne({ email });
    if (isExistingUser) {
      return res.status(400).json({ message: 'Passenger already exists' });
    }
    // Hash the given password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new passeger instance
    const newPassenger = new Passenger({
      fullName,
      userName,
      age,
      gender,
      email,
      phoneNo,
      password: hashedPassword,
    });

    //save the passenger
    await newPassenger.save();

    res.status(201).json({ message: 'Passenger registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login Passenger
const loginPassenger = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the person is already registered
    const passenger = await Passenger.findOne({ email });
    if (!passenger){
      return res.status(404).json({ message: 'Passenger not found' });
    }

    // check if the password is matching
    const isMatch = await bcrypt.compare(password, passenger.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    // Token generation
    const token = jwt.sign(
      { id: passenger._id, role: 'passenger' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  registerPassenger,
  loginPassenger,
};
