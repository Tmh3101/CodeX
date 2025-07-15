/**
 * User Routes
 * This module defines the routes for user management
 */

const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const upload = require("../middlewares/upload.middleware");
const userController = require("../controllers/user.controller");
const Role = require("../enums/role.enum");

const router = express.Router(); // Express router instance
router.use(authMiddleware); // Apply authentication middleware to all routes

/**
 * Define routes for user management - Staff (admin) only
 * These routes are protected and require staff authorization
 * to access user management functionalities.
 */

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
 * Define routes for user profile management
 * These routes allow users to update their own profile
 */

// Get current user profile
router.get("/me", userController.getCurrentUserProfile);

// Update user profile
router.put("/me/update-profile", userController.updateUserProfile);

// Change user password
router.put("/me/change-password", userController.changeUserPassword);

// Upload user avatar
router.put(
  "/me/upload-avatar",
  upload.single("avatar"), // Middleware to handle file upload with field name 'avatar' of the form data
  userController.uploadAvatar
);

// Delete user avatar
router.put("/me/delete-avatar", userController.deleteAvatar);

module.exports = router;
