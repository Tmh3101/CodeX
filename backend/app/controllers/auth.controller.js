/**
 * Auth Controller
 * This controller handles user authentication requests
 */

const ApiError = require("../api-error");
const authService = require("../services/auth.service");

/**
 * Controller function to handle user sign up requests
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
const signUp = async (req, res, next) => {
  // Check if request body is empty
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  try {
    const { email, password, firstName, lastName } = req.body;
    const response = await authService.signUp({
      email,
      password,
      firstName,
      lastName,
    });

    return res.status(201).json({
      message: "User registered successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle user sign in requests
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
const signIn = async (req, res, next) => {
  // Check if request body is empty
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  try {
    const { email, password } = req.body;
    const response = await authService.signIn({ email, password });
    return res.status(200).json({
      message: "User signed in successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle password reset requests
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
const resetPassword = async (req, res, next) => {
  // Check if request body is empty
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  try {
    const { email } = req.body;
    await authService.resetPassword(email);
    return res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

module.exports = {
  signUp,
  signIn,
  resetPassword,
};
