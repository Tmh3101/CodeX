/**
 * User service
 * Handles user management operations and staff seeding
 */

const supabase = require("../utils/supabaseClient");
const staffService = require("./staff.service");
const readerService = require("./reader.service");
const Role = require("../enums/role.enum");
const User = require("../models/user.model");
const Staff = require("../models/staff.model");
const {
  convertToSupabaseUser,
  convertToUser,
  checkPasswordStrength,
} = require("../utils/user.util");

/**
 * Create a new user in Supabase and sync with local database with role handling
 * @param {Object} userData - user info from request body
 * @returns {Promise<Object>} - newly created user info
 * @throws {Error} - if user already exists or Supabase error occurs
 */
const createUser = async (userData) => {
  try {
    // Check if user already exists in local database
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Validate password strength
    checkPasswordStrength(userData.password);

    // Create user in Supabase Auth using admin API without email confirmation
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: convertToSupabaseUser(userData),
    });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to create user in Supabase");
    }

    let newUser = new User(convertToUser(data.user));
    await newUser.save();

    if (newUser.role === Role.STAFF) {
      newUser = await staffService.createStaff(newUser._id);
    } else {
      newUser = await readerService.createReader(newUser._id);
    }

    // Get full user info including populated fields
    const newUserFullInfo = await newUser.getUserInfo();
    return newUserFullInfo;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user: " + error.message);
  }
};

/**
 * Get all users from the local database
 * @returns {Promise<Array>} - list of all users
 * @throws {Error} - if fetching users fails
 */
const getAllUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users: " + error.message);
  }
};

/**
 * Get a user by ID from the local database
 * @param {string} userID - ID of the user to fetch
 * @returns {Promise<Object>} - user info
 * @throws {Error} - if user not found or fetching fails
 */
const getUserById = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user: " + error.message);
  }
};

/**
 * Update a user in the local database and Supabase
 * Update local user info and sync with Supabase Auth
 * @param {string} userID - ID of the user to update
 * @param {Object} updateData - fields to update
 * @returns {Promise<Object>} - updated user info
 */
const updateUser = async (userID, updateData) => {
  try {
    // Check role field in updateData and remove it if present
    if (updateData.role) {
      delete updateData.role;
    }

    // Validate password strength if password is being updated
    if (updateData.password) {
      checkPasswordStrength(updateData.password);
    }

    // Update user in local database
    const updatedUser = await User.findByIdAndUpdate(userID, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Update user in Supabase Auth
    const { error } = await supabase.auth.admin.updateUserById(userID, {
      user_metadata: convertToSupabaseUser(updatedUser),
    });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to update user in Supabase");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user: " + error.message);
  }
};

/**
 * Delete a user from the local database and Supabase
 * @param {string} userID - ID of the user to delete
 * @returns {Promise<void>}
 * @throws {Error} - if user not found or deletion fails
 */
const deleteUser = async (userID) => {
  try {
    // Find user in local database
    const user = await User.findById(userID);
    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(userID);
    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to delete user in Supabase");
    }

    // Delete user from local database
    await User.findByIdAndDelete(userID);

    // If user is a staff, delete from Staff collection
    if (user.role === Role.STAFF) {
      await staffService.deleteStaff(userID);
    } else if (user.role === Role.READER) {
      await readerService.deleteReader(userID);
    }

    console.log(`User ${userID} deleted successfully`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user: " + error.message);
  }
};

/**
 * Update user's personal information, but not email, phone or isActive fields
 * This is used when the user updates their profile
 * @param {string} userID - ID of the user to update
 * @param {Object} updateData - fields to update
 * @returns {Promise<Object>} - updated user info
 * @throws {Error} - if user not found or update fails
 */
const updateUserProfile = async (userID, updateData) => {
  try {
    // Check if user exists
    const user = await User.findById(userID);
    if (!user) {
      throw new Error("User not found");
    }

    // Remove fields that should not be updated
    if (updateData.email) delete updateData.email;
    if (updateData.phone) delete updateData.phone;
    if (updateData.password) delete updateData.password;
    if (updateData.isActive) delete updateData.isActive;

    // Update gender if is reader
    if (user.role === Role.READER && updateData.gender) {
      await readerService.updateReader(userID, {
        gender: updateData.gender,
      });
      // Remove gender from updateData
      delete updateData.gender;
    }

    // Update user in local database
    const updatedUser = await User.findByIdAndUpdate(userID, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new Error("Failed to update user profile");
    }

    // Update user in Supabase Auth
    const { error } = await supabase.auth.admin.updateUserById(userID, {
      user_metadata: convertToSupabaseUser(updatedUser),
    });
    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to update user in Supabase");
    }

    // Return updated user info
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile: " + error.message);
  }
};

/**
 * Change user's password in Supabase Auth
 * This is used when the user changes their password
 * @param {string} userID - ID of the user to update
 * @param {string} currentPassword - current password (not used in Supabase)
 * @param {string} newPassword - new password to set
 * @returns {Promise<void>}
 * @throws {Error} - if user not found or password change fails
 */
const changeUserPassword = async (userID, currentPassword, newPassword) => {
  try {
    // Check if user exists
    const user = await User.findById(userID);
    if (!user) {
      throw new Error("User not found");
    }

    // Check current password
    const { data, error: curPwdError } = await supabase.auth.signInWithPassword(
      {
        email: user.email,
        password: currentPassword,
      }
    );

    if (curPwdError) {
      console.error("Supabase error:", curPwdError);
      throw new Error("Current password is incorrect");
    }

    // Validate new password strength
    checkPasswordStrength(newPassword);

    // Change password in Supabase Auth
    const { error: changePwdError } = await supabase.auth.admin.updateUserById(
      userID,
      { password: newPassword }
    );

    if (changePwdError) {
      console.error("Supabase error:", changePwdError);
      throw new Error("Failed to change user password in Supabase");
    }

    console.log(`Password for user ${userID} changed successfully`);
  } catch (error) {
    console.error("Error changing user password:", error);
    throw new Error("Failed to change user password: " + error.message);
  }
};

/**
 * Seed default staff account if it doesn't exist as a admin account
 * This is used when the server starts
 * @throws {Error} - if seeding fails
 */
const seedStaff = async () => {
  try {
    // Check if staff account already exists
    const staffExist = await Staff.countDocuments({});
    if (staffExist > 0) {
      console.log("Staff account already exists. Skipping seed.");
      return;
    }

    // Create default staff account
    const defaultStaff = {
      email: "staff001@gmail.com",
      password: "12345678",
      firstName: "Staff",
      lastName: "001",
      role: Role.STAFF,
    };
    const newStaff = await createUser(defaultStaff);

    console.log("Default staff account created:", newStaff);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  changeUserPassword,
  seedStaff,
};
