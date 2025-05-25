const express = require("express");
const auth = require("../controllers/auth.controller");

const router = express.Router();

router.post("/sign-up", auth.signUp);
router.post("/verify-email", auth.verifyEmailCallback);
router.post("/sign-in", auth.signIn);

module.exports = router;
