/**
 * Publisher routes
 * This module defines the routes for publisher management
 */

const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const publisherController = require("../controllers/publisher.controller");
const Role = require("../enums/role.enum");

const router = express.Router();
router.use(authMiddleware);

// CRUD operations for publishers
router
  .route("")
  .get(publisherController.getAllPublishers) // Get all publishers
  .post(authorize(Role.STAFF), publisherController.createPublisher); // Create new publisher

// Avoid conflict: get by name
router.route("/name/:name").get(publisherController.getPublisherByName); // Get publisher by name

router
  .route("/:id")
  .get(publisherController.getPublisherById) // Get publisher by ID
  .put(authorize(Role.STAFF), publisherController.updatePublisherById) // Update publisher by ID
  .delete(authorize(Role.STAFF), publisherController.deletePublisherById); // Delete publisher by ID

module.exports = router;
