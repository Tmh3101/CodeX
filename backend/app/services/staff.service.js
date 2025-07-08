/**
 * Staff service
 * Handles staff management operations
 */

const ApiError = require("../api-error");
const Staff = require("../models/staff.model");

// Funtion to create a unique staffId based on max existing staff id (max + 1)
const getNextStaffId = async () => {
  try {
    const lastStaff = await Staff.findOne().sort({ staffId: -1 });
    if (!lastStaff) return "NV001"; // If no staff exists, start with NV001

    const lastId = parseInt(lastStaff.staffId.replace("NV", ""), 10);
    const nextId = lastId + 1;
    return `NV${String(nextId).padStart(3, "0")}`; // e.g. NV002, NV003, etc.
  } catch (error) {
    console.error("Error getting next staff ID:", error);
    throw new Error("Failed to generate next staff ID");
  }
};

/**
 * Create a new staff member in the local database referencing User model
 * Generates a unique staffId based on existing staff count
 * @param {String} userID - User ID from User model (Supabase Auth UUID)
 * @returns {Promise<Object>} - Newly created staff member info
 * @throws {Error} - if staff creation fails
 */
const createStaff = async (userID) => {
  try {
    const newStaff = new Staff({
      _id: userID,
      staffId: getNextStaffId(),
    });
    await newStaff.save();

    return newStaff;
  } catch (error) {
    console.error("Error creating staff:", error);
    throw new Error("Failed to create staff member: " + error.message);
  }
};

/**
 * Delete a staff member by user ID
 * @param {String} userID - User ID from User model (Supabase Auth UUID
 * @returns {Promise<void>} - Resolves when staff is deleted
 * @throws {Error} - if staff deletion fails
 */
const deleteStaff = async (userID) => {
  try {
    const result = await Staff.findByIdAndDelete(userID);
    if (!result) {
      throw new ApiError(404, "Staff not found");
    }
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw new Error("Failed to delete staff member: " + error.message);
  }
};

module.exports = {
  createStaff,
  deleteStaff,
};
