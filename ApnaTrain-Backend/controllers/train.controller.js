const Train = require("../models/Train.model.js");

const getAllTrains = (req, res) => {
  res.json({ message: 'Here are all trains' });
};

module.exports = {
    getAllTrains,
}