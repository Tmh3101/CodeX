/**
 * Custom error class for API errors.
 * This class extends the built-in Error class to include a status code and a message.
 */

class ApiError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ApiError;
