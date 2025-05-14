const express = require("express");
const router = express.Router();
const { loginAdmin, registerAdmin } = require("../controllers/auth.controller.js");
const {registerPassenger,loginPassenger} = require("../controllers/auth.controller.js")

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.get("/test",async(req,res) => {
    res.status(200).json({ message: 'API is working fine 🚀' });
});
router.post("/register",registerPassenger);
router.post("/login",loginPassenger);

module.exports = router;