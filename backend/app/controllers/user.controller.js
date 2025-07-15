/**
 * User Controller
 * This controller handles user managment requests
 */

const ApiError = require("../api-error");
const userService = require("../services/user.service");

/**
 * Controller function to handle user creation request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with created user data or error
 * @throws {ApiError} - if request body is empty or an error occurs during user
 */
const createUser = async (req, res, next) => {
  // Check if request body is empty
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  try {
    const { email, password, firstName, lastName, role } = req.body;
    const response = await userService.createUser({
      email,
      password,
      firstName,
      lastName,
      role,
    });
    return res.status(201).json({
      message: "User created successfully",
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
 * Controller function to handle user listing request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with list of users or error
 * @throws {ApiError} - if an error occurs during fetching users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const response = await userService.getAllUsers(skip, limit);
    return res.status(200).json({
      message: "Users retrieved successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/** * Controller function to handle fetching a user by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with user data or error
 * @throws {ApiError} - if an error occurs during fetching user by ID
 */
const getUserById = async (req, res, next) => {
  const userID = req.params.id;
  try {
    const response = await userService.getUserById(userID);
    return res.status(200).json({
      message: "User retrieved successfully",
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
 * Get current user profile
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @return {import('express').Response} - JSON response with current user profile or error
 * @throws {ApiError} - if an error occurs during fetching current user profile
 */
const getCurrentUserProfile = async (req, res, next) => {
  const user = req.user; // Get the authenticated user from the request
  try {
    const response = await userService.getCurrentUserProfile(user);
    return res.status(200).json({
      message: "Current user profile retrieved successfully",
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
 * Controller function to handle user update request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with updated user data or error
 * @throws {ApiError} - if an error occurs during user update
 */
const updateUser = async (req, res, next) => {
  const userID = req.params.id;
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  try {
    const response = await userService.updateUser(userID, req.body);
    return res.status(200).json({
      message: "User updated successfully",
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
 * Controller function to handle user deletion request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with deletion status or error
 * @throws {ApiError} - if an error occurs during user deletion
 */
const deleteUser = async (req, res, next) => {
  const userID = req.params.id;
  try {
    await userService.deleteUser(userID);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle user profile update request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with updated user profile or error
 * @throws {ApiError} - if an error occurs during user profile update
 */
const updateUserProfile = async (req, res, next) => {
  const user = req.user;
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  try {
    const response = await userService.updateUserProfile(user._id, req.body);
    return res.status(200).json({
      message: "User profile updated successfully",
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
 * Controller function to handle user password change request
 * Just change password on Supabase Auth
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with password change status or error
 * @throws {ApiError} - if an error occurs during user password change
 */
const changeUserPassword = async (req, res, next) => {
  const user = req.user;
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  if (!req.body.currentPassword) {
    return next(new ApiError(400, "Current password is required"));
  }

  if (!req.body.newPassword) {
    return next(new ApiError(400, "New password is required"));
  }

  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changeUserPassword(
      user._id,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      message: "User password changed successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle user avatar upload request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @return {import('express').Response} - JSON response with avatar upload status or error
 * @throws {ApiError} - if an error occurs during avatar upload
 */
const uploadAvatar = async (req, res, next) => {
  const user = req.user;
  if (!req.file) {
    return next(new ApiError(400, "No file uploaded"));
  }

  try {
    const response = await userService.uploadAvatar(user._id, req.file);
    return res.status(200).json({
      message: "Avatar uploaded successfully",
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
 * Controller function to handle user avatar deletion request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with avatar deletion status or error
 * @throws {ApiError} - if an error occurs during avatar deletion
 */
const deleteAvatar = async (req, res, next) => {
  const user = req.user;
  try {
    await userService.deleteAvatar(user._id);
    return res.status(200).json({
      message: "Avatar deleted successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getCurrentUserProfile,
  updateUser,
  deleteUser,
  updateUserProfile,
  changeUserPassword,
  uploadAvatar,
  deleteAvatar,
};
