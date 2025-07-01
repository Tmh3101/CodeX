const User = require("../models/user.model");
const supabase = require("../utils/supabaseClient");
const { convertToSupabaseUser, convertToUser } = require("../utils/user.util");

const createUser = async (userData) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create user on Supabase Auth
    // Using admin.createUser to bypass email confirmation for initial setup
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Automatically confirm the email
      user_metadata: convertToSupabaseUser(userData),
    });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to create user in Supabase");
    }

    // Create a new user & save the new user to the database
    const newUser = new User(convertToUser(data.user));
    await newUser.save();

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

module.exports = {
  createUser,
};
