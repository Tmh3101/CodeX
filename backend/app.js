const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const ApiError = require("./app/api-error");

const app = express();
const authRouter = require("./app/routes/auth.route");

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

// Auth routes
app.use("/api/auth", authRouter);

// 404 handler
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// Middleware to handle errors
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
