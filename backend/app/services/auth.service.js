/**
 * Auth service
 * Handles user authentication operations such as sign up, sign in, and email verification
 * This service interacts with Supabase Auth for user management
 * and uses the local User model for additional user data management into the DB
 */

const supabase = require("../utils/supabaseClient");
const userService = require("./user.service");
const ApiError = require("../api-error");
const User = require("../models/user.model");
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

    return newUser;
  } catch (err) {
    throw new Error(`Sign up failed: ${err.message}`);
  }
};

/** * Callback function to verify email after sign up
 * This function updates the user's email verification status in the local database
 * @param {string} userID - JWT token containing user ID (sub)
 */
const verifyEmailCallback = async (userID) => {
  try {
    // Check if the user exists in the local database
    const existingUser = await User.findById(userID);
    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    // Update the user's email verification status in the local database
    await User.findByIdAndUpdate(userID, { emailVerified: true });
  } catch (err) {
    throw new Error(`Email verification failed: ${err.message}`);
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
  if (!user.emailVerified) throw new ApiError(403, "Email is not verified");
  if (!user.isActive) throw new ApiError(403, "Account is not active");

  // Authenticate the user with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase sign in error:", error);
    throw new ApiError(400, "Password is incorrect");
  }

  // Return access token and refresh token from the Supabase session
  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
};

module.exports = {
  signUp,
  verifyEmailCallback,
  signIn,
};
