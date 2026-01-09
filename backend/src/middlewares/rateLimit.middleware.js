const rateLimit = require('express-rate-limit');

/**
 * Global Rate Limiter
 * Standard protection for all API routes
 */
exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict Rate Limiter
 * Used for Auth routes (Login/Register) to prevent brute force
 */
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // Limit each IP to 10 failed attempts per hour
  message: {
    success: false,
    message: 'Too many login attempts, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});