const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js"); 
const errorHandler = require("./middlewares/errorHandler.middleware.js");

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

// Error Handler
app.use(errorHandler);


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
