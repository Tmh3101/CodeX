/**
 * Author Controller
 * Handles author-related requests and responses
 */

const ApiError = require("../api-error");
const authorService = require("../services/author.service");

/**
 * Controller function to handle author creation request
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with created author data or error
 * @throws {ApiError} - if request body is empty or an error occurs during author
 */
const createAuthor = async (req, res, next) => {
  // Check if request body is empty
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  try {
    const { name } = req.body;
    const response = await authorService.createAuthor({ name });
    return res.status(201).json({
      message: "Author created successfully",
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
 * Controller function to handle fetching all authors
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with list of authors or error
 * @throws {ApiError} - if request body is empty or an error occurs during author
 */
const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await authorService.getAllAuthors();
    return res.status(200).json({
      message: "Authors retrieved successfully",
      data: authors,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle fetching an author by name
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with author data or error
 * @throws {ApiError} - if request body is empty or an error occurs during author
 */
const getAuthorByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const author = await authorService.getAuthorByName(name);
    return res.status(200).json({
      message: "Author retrieved successfully",
      data: author,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle fetching an author by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with author data or error
 * @throws {ApiError} - if request body is empty or an error occurs during author
 */
const getAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await authorService.getAuthorById(id);
    return res.status(200).json({
      message: "Author retrieved successfully",
      data: author,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/** * Controller function to handle updating an author by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with updated author data or error
 * @throws {ApiError} - if request body is empty or an error occurs during author update
 */
const updateAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const author = await authorService.updateAuthorById(id, updateData);
    return res.status(200).json({
      message: "Author updated successfully",
      data: author,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

/**
 * Controller function to handle deleting an author by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {import('express').Response} - JSON response with deletion confirmation or error
 * @throws {ApiError} - if an error occurs during author deletion
 */
const deleteAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await authorService.deleteAuthorById(id);
    return res.status(200).json({
      message: "Author deleted successfully",
      data: author,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorByName,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
};
