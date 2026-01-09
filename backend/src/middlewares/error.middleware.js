const config = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for the developer
  console.error(`❌ Error: ${err.message}`.red);

  // 1. Mongoose Bad ObjectId (CastError)
  // Happens when someone enters an invalid ID in the URL
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // 2. Mongoose Duplicate Key (MongoServerError code 11000)
  // Happens when a user tries to register with an existing email
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // 3. Mongoose Validation Error
  // Happens when required fields are missing in a model
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Invalid token. Please log in again.', statusCode: 401 };
  }
  
  if (err.name === 'TokenExpiredError') {
    error = { message: 'Your session has expired. Please log in again.', statusCode: 401 };
  }

  // Final Response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    // In development, show the stack trace; in production, hide it.
    stack: config.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;