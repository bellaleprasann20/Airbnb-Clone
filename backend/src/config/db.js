const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Assuming you use the logger in your utils

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options help maintain a stable connection in production
      autoIndex: true, 
    });

    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
});

module.exports = connectDB;