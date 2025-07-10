/**
 * Category routes
 * This module defines the routes for category management
 */

const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const categoryController = require("../controllers/category.controller");
const Role = require("../enums/role.enum");

const router = express.Router();

// CRUD operations for categories
router
  .route("")
  .get(categoryController.getAllCategories) // Get all categories
  .post(
    authMiddleware,
    authorize(Role.STAFF),
    categoryController.createCategory
  ); // Create new category

// Avoid conflict: get by name
router.route("/name/:name").get(categoryController.getCategoryByName); // Get category by name

router
  .route("/:id")
  .get(categoryController.getCategoryById) // Get category by ID
  .put(
    authMiddleware,
    authorize(Role.STAFF),
    categoryController.updateCategoryById
  ) // Update category by ID
  .delete(
    authMiddleware,
    authorize(Role.STAFF),
    categoryController.deleteCategoryById
  ); // Delete category by ID

module.exports = router;
