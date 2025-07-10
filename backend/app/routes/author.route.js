/**
 * Author routes
 * This module defines the routes for author management
 */

const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const authorController = require("../controllers/author.controller");
const Role = require("../enums/role.enum");

const router = express.Router();

router
  .route("")
  .get(authorController.getAllAuthors) // Get all authors
  .post(authMiddleware, authorize(Role.STAFF), authorController.createAuthor); // Create new author

router.route("/name/:name").get(authorController.getAuthorByName); // Get author by name

router
  .route("/:id")
  .get(authorController.getAuthorById) // Get author by ID
  .put(authMiddleware, authorize(Role.STAFF), authorController.updateAuthorById) // Update author by ID
  .delete(
    authMiddleware,
    authorize(Role.STAFF),
    authorController.deleteAuthorById
  ); // Delete author by ID

module.exports = router;
