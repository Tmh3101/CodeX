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
    return next(
      new ApiError(
        500,
        error.message || "Some error occurred while creating the user."
      )
    );
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
    const response = await userService.getAllUsers();
    return res.status(200).json({
      message: "Users retrieved successfully",
      data: response,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || "Some error occurred while retrieving users."
      )
    );
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
    return next(
      new ApiError(
        500,
        error.message || "Some error occurred while retrieving the user."
      )
    );
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
    return next(
      new ApiError(
        500,
        error.message || "Some error occurred while updating the user."
      )
    );
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
    return next(
      new ApiError(
        500,
        error.message || "Some error occurred while deleting the user."
      )
    );
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
