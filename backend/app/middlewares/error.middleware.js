/**
 * Middleware handle errors in the application
 * This middleware handles 404 errors and centralized error handling.
 */

const ApiError = require("../api-error");

/**
 * Middleware to handle 404 errors
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @return {void}
 */
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, "Resource not found"));
};

/** * Middleware to handle errors
 * This middleware catches errors thrown in the application and sends a JSON response.
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @return {void}
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal server error";
  res.status(statusCode).json({
    message: errorMessage,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
