/**
 * Statistics routes
 * Defines routes for statistical data endpoints
 */

const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const statisticsController = require("../controllers/statistics.controller");
const Role = require("../enums/role.enum");

const router = express.Router();
router.use(authMiddleware);

/**
 * Statistics routes - Only accessible by staff
 * All statistics endpoints require staff authorization
 */

// Get borrow/return statistics
router.get(
  "/borrows",
  authorize(Role.STAFF),
  statisticsController.getBorrowStatistics
);

// Get book statistics
router.get(
  "/books",
  authorize(Role.STAFF),
  statisticsController.getBookStatistics
);

// Get user statistics
router.get(
  "/users",
  authorize(Role.STAFF),
  statisticsController.getUserStatistics
);

// Get dashboard overview statistics
router.get(
  "/dashboard",
  authorize(Role.STAFF),
  statisticsController.getDashboardStats
);

module.exports = router;
