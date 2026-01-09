/**
 * Middleware to restrict access to specific roles
 * @param  {...string} roles - The roles allowed to access the route (e.g., 'host', 'admin')
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // 1. Ensure user exists (should be populated by auth middleware)
    if (!req.user) {
      return res.status(500).json({
        success: false,
        message: 'Auth middleware must be called before role middleware'
      });
    }

    // 2. Check if the user's role is included in the permitted roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource`
      });
    }

    next();
  };
};