const path = require('path');
// This line ensures the .env file is loaded even if you are in a subfolder
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const config = require('./config/env');

// 1. Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

// 2. Connect to Database
connectDB();

// 3. Start Server
const PORT = config.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(
    `🚀 Server running in ${config.NODE_ENV} mode on port ${PORT}`
  );
});

// 4. Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});