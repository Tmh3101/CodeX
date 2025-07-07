const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {
  errorHandler,
  notFoundHandler,
} = require("./app/middlewares/error.middleware");

const app = express();
const authRouter = require("./app/routes/auth.route");
const userRouter = require("./app/routes/user.route");

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

// Auth routes
app.use("/api/auth", authRouter);

// User routes
app.use("/api/users", userRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
