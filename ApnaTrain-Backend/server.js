const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const errorHandler = require('./middlewares/errorHandler.middleware.js');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
const authRoutes = require('./routes/auth.routes.js');
const trainRoutes = require('./routes/train.routes.js');
const stationRoutes = require('./routes/station.routes.js');
const reservationRoutes = require('./routes/reservation.routes.js');
const trainClassConfigRoutes = require('./routes/trainClassConfig.routes.js');
const adminRoutes = require('./routes/admin.routes.js');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/stations', stationRoutes); // Fixed plural form for consistency
app.use('/api/reservations', reservationRoutes);
app.use('/api/configs', trainClassConfigRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
});

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
