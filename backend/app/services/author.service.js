/**
 * Author service
 * This service handles author-related operations such as creating and syncing authors
 * from the User model to the Author model.
 */

const ApiError = require("../api-error");
const Author = require("../models/author.model");

/**
 * Create an author in the database
 * @param {Object} authorName - The author data to create
 * @return {Promise<Object>} - The created author document
 */
const createAuthor = async (authorName) => {
  try {
    const author = new Author(authorName);
    return await author.save();
  } catch (error) {
    console.error("Error creating author:", error);
    throw new Error("Failed to create author");
  }
};

/**
 * Get all authors from the database
 * @return {Promise<Array>} - An array of author documents
 */
const getAllAuthors = async () => {
  try {
    return await Author.find({});
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw new Error("Failed to fetch authors");
  }
};

/**
 * Get author by Name
 * @param {String} authorName - The name of the author to find
 * @return {Promise<Object|null>} - The found author document or null if not found
 */
const getAuthorByName = async (authorName) => {
  try {
    const author = await Author.findOne({ name: authorName });
    if (!author) {
      throw new ApiError(404, "Author not found");
    }
    return author;
  } catch (error) {
    console.error("Error finding author by name:", error);
    throw new Error("Failed to find author by name");
  }
};

/**
 * Get author by ID
 * @param {String} authorId - The ID of the author to find
 * @return {Promise<Object|null>} - The found author document or null if not found
 */
const getAuthorById = async (authorId) => {
  try {
    const author = await Author.findById(authorId);
    if (!author) {
      throw new ApiError(404, "Author not found");
    }
    return author;
  } catch (error) {
    console.error("Error finding author by ID:", error);
    throw new Error("Failed to find author by ID");
  }
};

/**
 * Update author by ID
 * @param {String} authorId - The ID of the author to update
 * @param {Object} updateData - The data to update the author with
 * @return {Promise<Object>} - The updated author document
 * @throws {ApiError} - If the author is not found or update fails
 */
const updateAuthorById = async (authorId, updateData) => {
  try {
    const author = await Author.findByIdAndUpdate(authorId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!author) {
      throw new ApiError(404, "Author not found");
    }
    return author;
  } catch (error) {
    console.error("Error updating author:", error);
    throw new Error("Failed to update author");
  }
};

/**
 * Delete author by ID
 * @param {String} authorId - The ID of the author to delete
 * @return {Promise<Object>} - The deleted author document
 * @throws {ApiError} - If the author is not found or deletion fails
 */
const deleteAuthorById = async (authorId) => {
  try {
    const author = await Author.findByIdAndDelete(authorId);
    if (!author) {
      throw new ApiError(404, "Author not found");
    }
    return author;
  } catch (error) {
    console.error("Error deleting author:", error);
    throw new Error("Failed to delete author");
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
