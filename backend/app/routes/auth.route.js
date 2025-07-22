/**
 * Auth Routes
 * This module defines the routes for user authentication
 */

const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
