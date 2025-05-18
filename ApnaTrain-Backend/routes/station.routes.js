const express = require("express");
const router = express.Router();
const { addStation, getAllStation } = require("../controllers/station.controller.js");
const protect = require("../middlewares/auth.middleware.js");
const authorizedRoles = require("../middlewares/role.middleware.js");

router.post("/add",protect,authorizedRoles('admin'), addStation);
router.get("/",protect,authorizedRoles('admin','passenger'), getAllStation);

module.exports = router;
