/**
 * User service
 * Handles user management operations and staff seeding
 */

const supabase = require("../utils/supabaseClient");
const staffService = require("./staff.service");
const readerService = require("./reader.service");
const Role = require("../enums/role.enum");
const ApiError = require("../api-error");
const User = require("../models/user.model");
const Staff = require("../models/staff.model");
const Reader = require("../models/reader.model");
const {
  convertToSupabaseUser,
  convertToUser,
  checkPasswordStrength,
} = require("../utils/user.util");
const {
  uploadFileToSupabase,
  deleteFileFromSupabase,
  getPublicUrl,
} = require("../utils/file.util");

/**
 * Create a new user in Supabase and sync with local database with role handling
 * @param {Object} userData - user info from request body
 * @returns {Promise<Object>} - newly created user info
 * @throws {Error} - if user already exists or Supabase error occurs
 */
const createUser = async (userData) => {
  // Check if user already exists in local database
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(400, "Email is already registered");
  }

  console.log("Creating user in Supabase:", userData);

  try {
    // Validate password strength
    checkPasswordStrength(userData.password);
  } catch (error) {
    console.error("Password validation error:", error);
    throw new ApiError(400, error.message || "Invalid password");
  }

  try {
    // Create user in Supabase Auth using admin API without email confirmation
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: convertToSupabaseUser(userData),
    });

    if (error) {
      console.error("Supabase error:", error);
      throw new ApiError(
        400,
        error.message || "Failed to create user in Supabase"
      );
    }

    let newUser = new User(convertToUser(data.user));
    await newUser.save();

    if (newUser.role === Role.STAFF) {
      newUser = await staffService.createStaff(newUser._id);
    } else {
      newUser = await readerService.createReader(
        newUser._id,
        userData.gender || null
      );
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
 * @param {number} skip - number of users to skip for pagination
 * @param {number} limit - maximum number of users to return
 * @returns {Promise<Array>} - list of all users
 * @throws {Error} - if fetching users fails
 */
const getAllUsers = async (filter = {}, skip = 0, limit = 10) => {
  try {
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).skip(skip).limit(limit);

    const userData = await Promise.all(
      users.map(async (user) => {
        if (user.role === Role.STAFF) {
          const staff = await Staff.findById(user._id);
          return {
            ...user.toObject(),
            staffId: staff.staffId,
          };
        }
        const reader = await Reader.findById(user._id);
        return {
          ...user.toObject(),
          readerId: reader.readerId,
          gender: reader.gender,
        };
      })
    );

    return {
      totalUsers: total,
      totalPages: Math.ceil(total / limit),
      limit,
      currentPage: Math.ceil(skip / limit) + 1,
      users: userData,
    };
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
      throw new ApiError(404, "User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user: " + error.message);
  }
};

/**
 * Get current user profile
 * This is used when the user requests their own profile
 * @param {string} userID - ID of the current user
 * @param {string} role - role of the user (staff or reader)
 * @returns {Promise<Object>} - current user profile info
 * @throws {Error} - if user not found or fetching fails
 */
const getCurrentUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let userData = null;
    if (user.role === Role.STAFF) {
      userData = await Staff.findById(user._id);
    } else {
      userData = await Reader.findById(user._id);
    }

    const userInfo = await userData.getUserInfo();
    return userInfo;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw new Error("Failed to fetch current user profile: " + error.message);
  }
};

/**
 * Update a user in the local database and Supabase
 * Update local user info and sync with Supabase Auth
 * @param {string} userID - ID of the user to update
 * @param {Object} updateData - fields to update
 * @returns {Promise<Object>} - updated user info
 * @throws {Error} - if user not found or update fails
 */
const updateUser = async (userID, updateData) => {
  try {
    if (updateData.role === Role.READER && updateData.gender) {
      // Update reader
      await Reader.findByIdAndUpdate(userID, {
        gender: updateData.gender,
      });
    }

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
      throw new ApiError(404, "User not found");
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
      throw new ApiError(404, "User not found");
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
      throw new ApiError(404, "User not found");
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
  // Check if user exists
  const user = await User.findById(userID);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as current password"
    );
  }

  // Check current password
  const { data, error: curPwdError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (curPwdError) {
    console.error("Supabase error:", curPwdError);
    throw new ApiError(400, "Current password is incorrect or user not found");
  }

  // Validate new password strength
  try {
    checkPasswordStrength(newPassword);
  } catch (error) {
    console.error("Password validation error:", error);
    throw new ApiError(400, error.message || "Invalid new password");
  }

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
};

/**
 * Delete user avatar from Supabase storage
 * This is used when the user deletes their avatar
 * @param {string} userID - ID of the user to update
 * @returns {Promise<Object>} - updated user info with avatar URL removed
 * @throws {Error} - if user not found or deletion fails
 */
const deleteAvatar = async (userID) => {
  try {
    // Check if user exists
    const user = await User.findById(userID);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // If no avatar URL, nothing to delete
    if (!user.avatarUrl) {
      console.log("No avatar to delete for user:", userID);
      return user;
    }

    // Delete avatar from Supabase storage
    const fileName = user.avatarUrl.split("/").pop();
    await deleteFileFromSupabase("avatars", fileName);

    // Update user's avatar URL in local database and Supabase Auth
    const updatedUser = await updateUserProfile(userID, {
      avatarUrl: null,
    });

    console.log(`Avatar for user ${userID} deleted successfully`);
    return updatedUser;
  } catch (error) {
    console.error("Error deleting user avatar:", error);
    throw new Error("Failed to delete user avatar: " + error.message);
  }
};

/**
 * Upload user avatar to Supabase storage
 * This is used when the user uploads their avatar
 * @param {string} userID - ID of the user to update
 * @param {Buffer} file - avatar image
 * @returns {Promise<Object>} - updated user info with avatar URL
 * @throws {Error} - if user not found or upload fails
 */
const uploadAvatar = async (userID, file) => {
  try {
    // Check if user exists
    const user = await User.findById(userID);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Save old avatar URL if exists
    let oldAvatarUrl = null;
    if (user.avatarUrl) {
      oldAvatarUrl = user.avatarUrl;
    }

    // Upload avatar to Supabase storage and get public URL
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${user._id}_${Date.now()}.${fileExt}`;

    const data = await uploadFileToSupabase("avatars", file, fileName);
    const publicUrl = getPublicUrl("avatars", data.path);
    console.log(`Avatar uploaded to Supabase storage: ${publicUrl}`);

    // Update user's information with new avatar URL
    const updatedUser = await updateUserProfile(userID, {
      avatarUrl: publicUrl,
    });

    // If old avatar exists, delete it from Supabase storage
    if (oldAvatarUrl) {
      console.log(`Deleting old avatar: ${oldAvatarUrl}`);
      const oldFileName = oldAvatarUrl.split("/").pop();
      await deleteFileFromSupabase("avatars", oldFileName);
    }

    console.log(`Avatar for user ${userID} uploaded successfully`);
    return updatedUser;
  } catch (error) {
    console.error("Error uploading user avatar:", error);
    throw new Error("Failed to upload user avatar: " + error.message);
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
      password: "<nKyKN72",
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
  getCurrentUserProfile,
  updateUser,
  deleteUser,
  updateUserProfile,
  changeUserPassword,
  deleteAvatar,
  uploadAvatar,
  seedStaff,
};
