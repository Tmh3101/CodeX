/**
 * Book controller
 * Handles book-related operations requests such as creating, updating, deleting, and retrieving books
 */

const ApiError = require("../api-error");
const bookService = require("../services/book.service");

/**
 * Controller function to handle book creation request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with created book data or error
 * @throws {ApiError} - if request body is empty or an error occurs during book
 */
const createBook = async (req, res, next) => {
  // Check if request body is empty
  const bookDataRaw = req.body.data;
  if (!bookDataRaw) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  const bookData = JSON.parse(bookDataRaw);

  // Check if request file is empty
  const coverImage = req.file;
  if (!coverImage) {
    return next(new ApiError(400, "Cover image is required!"));
  }

  try {
    const response = await bookService.createBook(bookData, coverImage);

    return res.status(201).json({
      message: "Book created successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle book retrieval request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with book data or error
 * @throws {ApiError} - if an error occurs during book retrieval
 */
const getAllBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const categories = req.query.categories || "";
    const authors = req.query.authors || "";
    const publisher = req.query.publisher || "";

    const response = await bookService.getAllBooks(
      skip,
      limit,
      search,
      categories,
      authors,
      publisher
    );
    return res.status(200).json({
      message: "Books retrieved successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle book retrieval by ID request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with book data or error
 * @throws {ApiError} - if an error occurs during book retrieval
 */
const getBookById = async (req, res, next) => {
  const bookId = req.params.id;

  try {
    const response = await bookService.getBookById(bookId);
    return res.status(200).json({
      message: "Book retrieved successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle book update by ID request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with updated book data or error
 * @throws {ApiError} - if an error occurs during book update
 */
const updateBookById = async (req, res, next) => {
  const bookId = req.params.id;
  const coverImage = req.file;
  const bookData = JSON.parse(req.body.data);

  try {
    const response = await bookService.updateBookById(
      bookId,
      bookData,
      coverImage
    );
    return res.status(200).json({
      message: "Book updated successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle book deletion by ID request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with deletion status or error
 * @throws {ApiError} - if an error occurs during book deletion
 */
const deleteBookById = async (req, res, next) => {
  const bookId = req.params.id;

  try {
    await bookService.deleteBookById(bookId);
    return res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
