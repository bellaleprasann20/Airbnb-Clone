const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate a JWT Token
 * @param {string} id - The User ID from the database
 * @param {string} role - The User role (guest/host/admin)
 * @returns {string} - Signed JWT
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, 
    config.JWT_SECRET, 
    { expiresIn: config.JWT_EXPIRES_IN || '30d' }
  );
};

/**
 * Verify a JWT Token
 * @param {string} token - The token from headers or cookies
 * @returns {object} - Decoded payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

/**
 * Send Token via Cookie
 * Sets the token in an HTTP-only cookie for better security
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (config.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
    sameSite: 'Lax'
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    user
  });
};

module.exports = {
  generateToken,
  verifyToken,
  sendTokenResponse
};