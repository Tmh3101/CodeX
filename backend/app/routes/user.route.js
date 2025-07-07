/**
 * User Routes
 * This module defines the routes for user management
 */

const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const userController = require("../controllers/user.controller");
const Role = require("../enums/role.enum");

const router = express.Router(); // Express router instance

/**
 * Define routes for user management - Staff (admin) only
 * These routes are protected and require staff authorization
 * to access user management functionalities.
 */

router.use(authMiddleware); // Apply authentication middleware to all routes

// Create new user and get all users
router
  .route("")
  .post(authorize(Role.STAFF), userController.createUser)
  .get(authorize(Role.STAFF), userController.getAllUsers);

// Get, update, and delete user by ID
router
  .route("/:id")
  .get(authorize(Role.STAFF), userController.getUserById)
  .put(authorize(Role.STAFF), userController.updateUser)
  .delete(authorize(Role.STAFF), userController.deleteUser);

/**
 * Define routes for user management - Public access
 * These routes are accessible to all users
 * without any authentication or authorization.
 */

module.exports = router;
