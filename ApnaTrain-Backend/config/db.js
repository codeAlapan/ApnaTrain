const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'URI is present' : 'URI is missing');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed. Error details:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
