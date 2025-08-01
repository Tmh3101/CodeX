/**
 * Auth service
 * Handles user authentication operations such as sign up, sign in, and email verification
 * This service interacts with Supabase Auth for user management
 * and uses the local User model for additional user data management into the DB
 */

const supabase = require("../utils/supabaseClient");
const ApiError = require("../api-error");
const User = require("../models/user.model");
const readerService = require("./reader.service");
const {
  convertToSupabaseUser,
  convertToUser,
  checkPasswordStrength,
} = require("../utils/user.util");

/**
 * Sign up service to create a new user with email verification
 * This function creates a new user in Supabase and local database
 * @param {Object} signUpData - User sign up data containing email, password, firstName, lastName
 * @returns {Promise<Object>} - Returns the newly created reader profile
 */
const signUp = async (signUpData) => {
  try {
    const { email, password, firstName, lastName } = signUpData;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email is already registered");
    }

    // Validate password strength
    checkPasswordStrength(password);

    // Create a new user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: convertToSupabaseUser({
          email,
          firstName,
          lastName,
        }),
      },
    });

    if (error) {
      console.error("Supabase sign up error:", error);
      throw new ApiError(400, error.message || "Sign up failed");
    }

    // Create a new user in the local database
    const newUser = await User.create(convertToUser(data.user));

    // create a reader profile for the new user
    const newReader = await readerService.createReader(newUser._id);
    const readerInfo = await newReader.getUserInfo();

    return readerInfo;
  } catch (err) {
    throw new Error(`Sign up failed: ${err.message}`);
  }
};

/** * Sign in service to authenticate a user
 * This function checks the user's credentials and returns access and refresh tokens
 * @param {Object} signInData - User sign in data containing email and password
 * @returns {Promise<Object>} - Returns access and refresh tokens
 */
const signIn = async (signInData) => {
  const { email, password } = signInData;

  // Check if the user exists and is active
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "Email is not registered");
  if (!user.isActive) throw new ApiError(403, "Account is not active");

  // Authenticate the user with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase sign in error:", error);
    if (!user.emailVerified) {
      throw new ApiError(403, "Email is not verified");
    }
    throw new ApiError(400, "Password is incorrect");
  }

  // If login is successful, update the user's email verification status
  if (!user.emailVerified) {
    user.emailVerified = true;
    await user.save();
  }

  // Return access token and refresh token from the Supabase session
  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
};

/**
 * Reset password service to send a password reset email
 * This function sends a password reset email to the user
 * @param {string} email - User's email address
 * @returns {Promise<void>} - Returns nothing if successful
 * @throws {ApiError} - If the user is not found or email sending fails
 */
const resetPassword = async (email) => {
  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "Email is not registered");
  }
  // Send password reset email using Supabase
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://example.com/update-password", // Replace with your actual redirect URL (frontend URL)
  });

  if (error) {
    console.error("Supabase reset password error:", error);
    throw new ApiError(400, "Failed to send password reset email");
  }
};

module.exports = {
  signUp,
  signIn,
  resetPassword,
};
