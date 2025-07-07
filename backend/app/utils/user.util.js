/**
 * Utility functions to convert user data between Supabase and application format
 */

const Role = require("../enums/role.enum");

/**
 * Converts a user object from application format to Supabase user format
 * @param {User} user - User object in application format
 * @returns {Object} - User object in Supabase format
 */
const convertToSupabaseUser = (user) => {
  return {
    email: user.email || null,
    phone: user.phone || null,
    first_name: user.firstName || null,
    last_name: user.lastName || null,
    date_of_birth: user.dateOfBirth || null,
    address: user.address || null,
    email_verified: user.emailVerified || false,
    phone_verified: user.phoneVerified || false,
    is_active: user.isActive || true,
    avatar_url: user.avatarUrl || null,
    role: user.role || Role.READER,
    created_at: user.createdAt || new Date(),
  };
};

/**
 * Converts a Supabase user object to application user format,
 * use the Supabase user ID as the MongoDB _id
 * @param {Object} user - User object in Supabase format
 * @returns {User} - User object in application format
 */
const convertToUser = (user) => {
  const { id, user_metadata } = user;
  return {
    _id: id,
    email: user_metadata.email,
    phone: user_metadata.phone || null,
    firstName: user_metadata.first_name || null,
    lastName: user_metadata.last_name || null,
    dateOfBirth: user_metadata.date_of_birth || null,
    address: user_metadata.address || null,
    emailVerified: user_metadata.email_verified,
    phoneVerified: user_metadata.phone_verified,
    isActive: user_metadata.is_active || true,
    avatarUrl: user_metadata.avatar_url || null,
    role: user_metadata.role || Role.READER,
  };
};

module.exports = {
  convertToSupabaseUser,
  convertToUser,
};
