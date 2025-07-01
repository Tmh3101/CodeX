// Create a user metadata with UserScheme to store in Supabase
const convertToSupabaseUser = (user) => {
  return {
    email: user.email || "",
    phone: user.phone || "",
    first_name: user.firstName || "",
    last_name: user.lastName || "",
    date_of_birth: user.dateOfBirth || null,
    address: user.address || "",
    email_verified: user.emailVerified || false,
    phone_verified: user.phoneVerified || false,
    is_active: user.isActive || true,
    avatar_url: user.avatarUrl || "",
    role: user.role || Role.READER,
    created_at: user.createdAt || new Date(),
  };
};

const convertToUser = (user) => {
  return {
    _id: user.id, // Use the Supabase user ID as the MongoDB _id
    email: user.user_metadata.email,
    phone: user.user_metadata.phone,
    firstName: user.user_metadata.first_name,
    lastName: user.user_metadata.last_name,
    dateOfBirth: user.user_metadata.date_of_birth,
    address: user.user_metadata.address,
    emailVerified: user.user_metadata.email_verified,
    phoneVerified: user.user_metadata.phone_verified,
    isActive: user.user_metadata.is_active,
    avatarUrl: user.user_metadata.avatar_url,
    role: user.user_metadata.role || Role.READER,
  };
};

module.exports = {
  convertToSupabaseUser,
  convertToUser,
};
