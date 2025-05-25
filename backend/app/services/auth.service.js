const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");
const Role = require("../enums/role.enum");
const User = require("../models/user.model");

require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSRK = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseSRK);

// Create a user metadata with UserScheme to store in Supabase
const extractUserMetadata = (data) => {
  return {
    email: data.email || "",
    phone: data.phone || "",
    first_name: data.firstName || "",
    last_name: data.lastName || "",
    date_of_birth: data.dateOfBirth || null,
    address: data.address || "",
    email_verified: data.emailVerified || false,
    phone_verified: data.phoneVerified || false,
    is_active: data.isActive || true,
    avatar_url: data.avatarUrl || "",
    role: data.role || Role.READER,
    created_at: data.createdAt || new Date(),
  };
};

// Sign up service to create a new user
const signUp = async (email, password, firstName, lastName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: extractUserMetadata({
        email,
        firstName,
        lastName,
      }),
    },
  });

  if (error) throw new Error(error.message);
  const userMetadata = data.user.user_metadata;

  // Create a new User in mongoDB from the Supabase user_metadata
  const newUser = new User({
    _id: data.user.id, // Use the Supabase user ID as the MongoDB _id
    email: userMetadata.email,
    firstName: userMetadata.first_name,
    lastName: userMetadata.last_name,
    emailVerified: userMetadata.email_verified,
    phoneVerified: userMetadata.phone_verified,
    role: userMetadata.role,
    createdAt: userMetadata.created_at,
  });

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
