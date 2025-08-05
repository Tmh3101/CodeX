/**
 * Statistics controller
 * Handles HTTP requests for statistical data
 */

const statisticsService = require("../services/statistics.service");
const ApiError = require("../api-error");

/**
 * Get borrow/return statistics
 * GET /api/statistics/borrows
 */
const getBorrowStatistics = async (req, res, next) => {
  try {
    const { timeRange } = req.query;
    const result = await statisticsService.getBorrowStatistics(timeRange);

    res.json({
      success: true,
      message: "Borrow statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in getBorrowStatistics:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving borrow statistics")
    );
  }
};

/**
 * Get book statistics
 * GET /api/statistics/books
 */
const getBookStatistics = async (req, res, next) => {
  try {
    const result = await statisticsService.getBookStatistics();

    res.json({
      success: true,
      message: "Book statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in getBookStatistics:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving book statistics")
    );
  }
};

/**
 * Get user statistics
 * GET /api/statistics/users
 */
const getUserStatistics = async (req, res, next) => {
  try {
    const { timeRange } = req.query;
    const result = await statisticsService.getUserStatistics(timeRange);

    res.json({
      success: true,
      message: "User statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in getUserStatistics:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving user statistics")
    );
  }
};

/**
 * Get dashboard overview statistics
 * GET /api/statistics/dashboard
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const result = await statisticsService.getDashboardStats();

    res.json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return next(
      new ApiError(
        500,
        "An error occurred while retrieving dashboard statistics"
      )
    );
  }
};

module.exports = {
  getBorrowStatistics,
  getBookStatistics,
  getUserStatistics,
  getDashboardStats,
};
