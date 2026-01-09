const dotenv = require('dotenv');
const path = require('path');

// Load .env file from the root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const _config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGO_URI: process.env.MONGO_URI,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Payments
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  
  // Email (Matching your .env names exactly)
  EMAIL_HOST: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
  EMAIL_PORT: process.env.EMAIL_PORT || 2525,
  EMAIL_USER: process.env.EMAIL_USER ||'0b9ac5772fc80f',
  EMAIL_PASS: process.env.EMAIL_PASS ||'8dc999991ec143',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@airbnbclone.com',
  FROM_NAME: process.env.FROM_NAME  || 'AirbnbClone',
};

// Optimization: Check if all critical variables are present
const requiredKeys = [
  'MONGO_URI', 
  'JWT_SECRET', 
  'STRIPE_SECRET_KEY', 
  'RAZORPAY_KEY_ID',
  'EMAIL_USER',
  'EMAIL_PASS'
];

requiredKeys.forEach((key) => {
  if (!_config[key]) {
    console.error(`❌ Config Error: ${key} is missing in .env file`);
  }
});

module.exports = Object.freeze(_config);