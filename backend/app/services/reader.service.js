/**
 * Reader service
 * Handles reader management operations
 */

const Gender = require("../enums/gender.enum");
const ApiError = require("../api-error");
const Reader = require("../models/reader.model");

// Funtion to create a unique readerId based on max existing staff id (max + 1)
const getNextReaderId = async () => {
  try {
    const lastReader = await Reader.findOne().sort({ readerId: -1 });
    if (!lastReader) return "DG001"; // If no staff exists, start with DG001

    const lastId = parseInt(lastReader.readerId.replace("DG", ""), 10);
    const nextId = lastId + 1;
    return `NV${String(nextId).padStart(3, "0")}`; // e.g. DG002, DG003, etc.
  } catch (error) {
    console.error("Error getting next reader ID:", error);
    throw new Error("Failed to generate next reader ID");
  }
};

/**
 * Create a new reader member in the local database referencing User model
 * Generates a unique readerId based on existing reader count
 * @param {String} userID - User ID from User model (Supabase Auth UUID)
 * @returns {Promise<Object>} - Newly created reader member info
 * @throws {Error} - if reader creation fails
 */
const createReader = async (userID) => {
  try {
    const newReader = new Reader({
      _id: userID,
      readerId: getNextReaderId(),
    });
    await newReader.save();

    return newReader;
  } catch (error) {
    console.error("Error creating reader:", error);
    throw new Error("Failed to create reader member: " + error.message);
  }
};

/**
 * Update a reader member's information
 * @param {String} userID - User ID from User model (Supabase Auth UUID
 * @param {Object} updateData - Object containing fields to update
 * @returns {Promise<Object>} - Updated reader member info
 */
const updateReader = async (userID, updateData) => {
  try {
    // Validate gender if provided
    if (updateData.gender) {
      const validGenders = Object.values(Gender);
      if (!validGenders.includes(updateData)) {
        throw new ApiError(
          400,
          `Gender must be one of: ${validGenders.join(", ")}`
        );
      }
    }

    const updatedReader = await Reader.findByIdAndUpdate(userID, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedReader) {
      throw new ApiError(404, "Reader not found");
    }
    return updatedReader;
  } catch (error) {
    console.error("Error updating reader:", error);
    throw new Error("Failed to update reader member: " + error.message);
  }
};

/**
 * Delete a reader member by user ID
 * @param {String} userID - User ID from User model (Supabase Auth UUID)
 * @returns {Promise<void>} - Resolves when reader is deleted
 * @throws {Error} - if reader deletion fails
 */
const deleteReader = async (userID) => {
  try {
    const result = await Reader.findByIdAndDelete(userID);
    if (!result) {
      throw new ApiError(404, "Reader not found");
    }
  } catch (error) {
    console.error("Error deleting reader:", error);
    throw new Error("Failed to delete reader member: " + error.message);
  }
};

module.exports = {
  createReader,
  updateReader,
  deleteReader,
};
