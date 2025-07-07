/**
 * Middleware to authorize user roles
 * @param  {...any} allowedRoles
 * @returns {void}
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Check if user has a role
    if (!req.user?.role) {
      return res.status(403).json({ message: "Access denied. No role found." });
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.user_metadata.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have permission." });
    }

    next();
  };
};

module.exports = authorize;
