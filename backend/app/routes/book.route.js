/**
 * Book routes
 * This module defines the routes for book management
 */

const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const upload = require("../middlewares/upload.middleware");
const bookController = require("../controllers/book.controller");
const Role = require("../enums/role.enum");

const router = express.Router(); // Express router instance

router
  .route("")
  .post(
    authMiddleware,
    authorize(Role.STAFF),
    upload.single("coverImage"), // Middleware to handle file upload with field name 'coverImage' of the form data
    bookController.createBook
  )
  .get(bookController.getAllBooks);

router
  .route("/:id")
  .get(bookController.getBookById)
  .put(
    authMiddleware,
    authorize(Role.STAFF),
    upload.single("coverImage"), // Middleware to handle file upload with field name 'coverImage' of the form data
    bookController.updateBookById
  )
  .delete(authMiddleware, authorize(Role.STAFF), bookController.deleteBookById);

module.exports = router;
