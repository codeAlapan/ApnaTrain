const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js"); // ← Check this

dotenv.config();
connectDB();

const app = express();

app.use(express.json());


// Routes:
const authRoutes = require("./routes/auth.routes.js");



app.use("/api/auth",authRoutes);



// ✅ 404 handler
app.use((req, res, next) => {
    res.status(404);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error);
});

// ✅ Basic error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
