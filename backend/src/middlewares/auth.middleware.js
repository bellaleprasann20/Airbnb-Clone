const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User.model');

/**
 * Protect Routes: Ensures the user is logged in
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in Headers or Cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2. Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // 4. Attach user to the request object
    // We select '-password' to ensure the hash is never passed around
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this id',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired',
    });
  }
};