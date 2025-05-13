const express = require("express");
const router = express.Router();

router.get("/test",async(req,res) => {
    res.status(200).json({ message: 'API is working fine 🚀' });
});

module.exports = router;