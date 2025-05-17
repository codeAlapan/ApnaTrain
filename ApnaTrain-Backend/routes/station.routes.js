const express = require("express");
const router = express.Router();
const { addStation, getAllStation } = require("../controllers/station.controller.js");

router.post("/add", addStation);
router.get("/", getAllStation);

module.exports = router;
