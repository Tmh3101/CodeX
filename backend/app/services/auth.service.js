const supabase = require("../utils/supabaseClient");
const jwt = require("jsonwebtoken");
const userService = require("./user.service");
const { convertToSupabaseUser, convertToUser } = require("../utils/user.util");

require("dotenv").config();

// Sign up service to create a new user
const signUp = async (email, password, firstName, lastName) => {
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

  if (error) throw new Error(error.message);

  // Create a new User in mongoDB from the Supabase user_metadata
  const newUser = userService.createUser(convertToUser(data.user));

  // Save the new user to MongoDB
  try {
    await newUser.save();
  } catch (dbError) {
    throw new Error(`Database error: ${dbError.message}`);
  }
  return newUser;
};

// Verify email callback service to update the user's email verification status
const verifyEmailCallback = async (token) => {
  try {
    // Decode token để lấy user_id (sub)
    const decoded = jwt.decode(token);
    const userId = decoded?.sub;
    if (!userId) throw new Error("Invalid token: user ID not found");

    await User.findByIdAndUpdate(userId, { emailVerified: true });
  } catch (err) {
    throw new Error(`Email verification failed: ${err.message}`);
  }
};

// Sign in service to authenticate a user
const signIn = async (email, password) => {
  // Check if the user exists and is active
  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    throw new Error("Account is not active or does not exist");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  const response = {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
  return response;
};

module.exports = {
  signUp,
  verifyEmailCallback,
  signIn,
};
