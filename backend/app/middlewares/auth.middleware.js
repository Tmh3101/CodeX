/**
 * Auth Middleware
 * This middleware handles authentication by verifying JWT tokens
 * and attaching user data to the request object.
 */

const config = require("../config");
const jwt = require("jsonwebtoken");

// JWT secret key from configuration
const JWT_SECRET = config.baas.jwtSecret;

/**
 * Auth middleware function to verify JWT tokens
 * and attach user data to the request object.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const authMiddleware = (req, res, next) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Change sub → _id
    if (decoded.sub) {
      decoded._id = decoded.sub;
      delete decoded.sub;
    }

    // Attach user data to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
