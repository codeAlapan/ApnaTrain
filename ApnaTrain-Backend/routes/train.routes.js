const express = require("express");
const protect = require("../middlewares/auth.middleware.js");
const { getAllTrains, addTrain, getTrainById, searchAvailableTrains } = require("../controllers/train.controller.js");
const authorizedRoles = require("../middlewares/role.middleware.js");

const router = express.Router();

// accessible to admin
router.post('/add',protect,authorizedRoles('admin'),addTrain);

// accessible to both
router.get('/', protect, authorizedRoles('admin', 'passenger'), getAllTrains); 

router.get('/:id',protect,authorizedRoles('admin','passenger'),getTrainById);

router.post('/search-trains', searchAvailableTrains);



module.exports = router;