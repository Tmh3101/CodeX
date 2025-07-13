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
const authorRouter = require("./app/routes/author.route");
const categoryRouter = require("./app/routes/category.route");
const publisherRouter = require("./app/routes/publisher.route");
const bookRouter = require("./app/routes/book.route");
const borrowRouter = require("./app/routes/borrow.route");

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

// Author routes
app.use("/api/authors", authorRouter);

// Category routes
app.use("/api/categories", categoryRouter);

// Publisher routes
app.use("/api/publishers", publisherRouter);

// Book routes
app.use("/api/books", bookRouter);

// Borrow routes
app.use("/api/borrows", borrowRouter);

// Handle 404 Not Found
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
