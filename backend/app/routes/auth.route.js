/**
 * Auth Routes
 * This module defines the routes for user authentication
 */

const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/sign-up", authController.signUp);

router.post(
  "/verify-email",
  authMiddleware,
  authController.verifyEmailCallback
);

router.post("/sign-in", authController.signIn);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
