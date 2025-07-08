/**
 * User model
 * Represents users synced from Supabase Auth
 *
 * Fields:
 * - _id: Supabase Auth UUID
 * - email, phone, etc.
 *
 * Partial unique index on phone:
 * MongoDB allows multiple null phone values,
 * but enforces uniqueness when phone is not null.
 */

const mongoose = require("mongoose");
const Role = require("../enums/role.enum");

// *NOTE(fix): Nên tách user model ra thêm một model nữa là auth model
// - auth model sẽ lưu thông tin cho user_metadata
// - user model sẽ lưu thông tin cho profile của user
// --> Giảm kích thước payload của jwt, vì supabase auth sử dụng user_metadata để làm pyload
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: null },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, default: null },
    address: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    avatarUrl: { type: String, default: null },
    role: { type: String, enum: Object.values(Role), default: Role.READER },
    createdAt: { type: Date, default: Date.now },
  },
  {
    _id: false, // do not create a separate _id field
    versionKey: false, // do not create __v field
  }
);

// MongoDB partial index to allow multiple users with null phone
// Without this, MongoDB considers multiple nulls as duplicates
userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $exists: true, $ne: null },
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
