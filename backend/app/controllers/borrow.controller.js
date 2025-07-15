/**
 * Borrow Controller
 * Handles borrow-related operations such as creating a borrow, getting available book quantity, etc.
 */

const ApiError = require("../api-error");
const borrowService = require("../services/borrow.service");

/**
 * Create a borrow
 * @param {Object} req - The request object containing borrow data
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 * @throws {ApiError} - If the borrow creation fails
 */
const createBorrow = async (req, res, next) => {
  const borrowData = req.body;
  const userId = req.user._id; // Assuming user ID is stored in req.user by auth middleware

  try {
    const createdBorrow = await borrowService.createBorrow(userId, borrowData);
    res.status(201).json({
      message: "Borrow created successfully",
      data: createdBorrow,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Cancel a borrow
 * @param {Object} req - The request object containing borrow ID
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 * @throws {ApiError} - If the borrow cancellation fails
 */
const cancelBorrow = async (req, res, next) => {
  const borrowId = req.params.id; // Assuming borrow ID is passed as a URL parameter
  const userId = req.user._id; // Assuming user ID is stored in req.user by auth middleware

  try {
    const updatedBorrow = await borrowService.cancelBorrow(userId, borrowId);
    res.status(200).json({
      message: "Borrow cancelled successfully",
      data: updatedBorrow,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Approve a borrow
 * @param {Object} req - The request object containing borrow ID
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 * @throws {ApiError} - If the borrow approval fails
 */
const approveBorrow = async (req, res, next) => {
  const borrowId = req.params.id; // Assuming borrow ID is passed as a URL parameter
  const userId = req.user._id; // Assuming user ID is stored in req.user by auth middleware

  try {
    const updatedBorrow = await borrowService.approveBorrow(userId, borrowId);
    res.status(200).json({
      message: "Borrow approved successfully",
      data: updatedBorrow,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Confirm a borrow return
 * @param {Object} req - The request object containing borrow ID
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 * @throws {ApiError} - If the borrow return confirmation fails
 */
const confirmBorrowReturn = async (req, res, next) => {
  const borrowId = req.params.id; // Assuming borrow ID is passed as a URL parameter
  const userId = req.user._id; // Assuming user ID is stored in req.user by auth middleware

  try {
    const updatedBorrow = await borrowService.confirmBorrowReturn(
      userId,
      borrowId
    );
    res.status(200).json({
      message: "Borrow returned successfully",
      data: updatedBorrow,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Get all borrows
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Promise<void>} - The response containing all borrows
 * @throws {ApiError} - If the borrow retrieval fails
 */
const getAllBorrows = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const borrows = await borrowService.getAllBorrows(filter, skip, limit);
    res.status(200).json({
      message: "All borrows retrieved successfully",
      data: borrows,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Get my borrows
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Promise<void>} - The response containing the user's borrows
 * @throws {ApiError} - If the borrow retrieval fails
 */
const getMyBorrows = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const borrows = await borrowService.getMyBorrows(req.user._id, filter);
    res.status(200).json({
      message: "My borrows retrieved successfully",
      data: borrows,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Get borrow by ID
 * @param {Object} req - The request object containing borrow ID
 * @param {Object} res - The response object
 * @return {Promise<void>} - The response containing the borrow details
 * @throws {ApiError} - If the borrow retrieval fails
 */
const getBorrowById = async (req, res, next) => {
  const userId = req.user._id; // Assuming user ID is stored in req.user by auth middleware
  const borrowId = req.params.id; // Assuming borrow ID is passed as a URL parameter

  try {
    const borrow = await borrowService.getBorrowById(borrowId, userId);
    if (!borrow) {
      return next(new ApiError(404, "Borrow not found"));
    }
    res.status(200).json({
      message: "Borrow retrieved successfully",
      data: borrow,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

module.exports = {
  createBorrow,
  cancelBorrow,
  approveBorrow,
  confirmBorrowReturn,
  getAllBorrows,
  getMyBorrows,
  getBorrowById,
};
