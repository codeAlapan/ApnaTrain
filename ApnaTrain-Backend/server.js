const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const errorHandler = require('./middlewares/errorHandler.middleware.js');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes:
const authRoutes = require('./routes/auth.routes.js');
const trainRoutes = require('./routes/train.routes.js');
const stationRoutes = require('./routes/station.routes.js');
const reservationRoutes = require('./routes/reservation.routes.js');

app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/station', stationRoutes);
app.use('/api/reservations', reservationRoutes);

// 404 handler
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
