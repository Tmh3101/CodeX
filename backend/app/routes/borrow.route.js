/**
 * Borrow routes
 * This module defines the routes for borrow management
 */

const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const borrowController = require("../controllers/borrow.controller");
const Role = require("../enums/role.enum");

const router = express.Router(); // Express router instance

router.route("").post(
  authMiddleware,
  authorize(Role.READER), // Allow both readers and staff to create borrows
  borrowController.createBorrow
);

router.route("/cancel/:id").post(
  authMiddleware,
  authorize(Role.READER), // Allow readers to cancel their own borrows
  borrowController.cancelBorrow
);

router.route("/approve/:id").post(
  authMiddleware,
  authorize(Role.STAFF), // Only staff can approve borrows
  borrowController.approveBorrow
);

router.route("/confirm-return/:id").post(
  authMiddleware,
  authorize(Role.STAFF), // Only staff can confirm returns
  borrowController.confirmBorrowReturn
);

module.exports = router;
