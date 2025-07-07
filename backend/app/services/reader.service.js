/**
 * Reader service
 * Handles reader management operations
 */

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
    throw error;
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
      throw new Error("Reader not found");
    }
  } catch (error) {
    console.error("Error deleting reader:", error);
    throw error;
  }
};

module.exports = {
  createReader,
  deleteReader,
};
