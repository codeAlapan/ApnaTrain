const express = require("express");
const router = express.Router();
const {registerPassenger,loginPassenger} = require("../controllers/auth.controller.js")

router.post("/register",registerPassenger);
router.post("/login",loginPassenger);

module.exports = router;