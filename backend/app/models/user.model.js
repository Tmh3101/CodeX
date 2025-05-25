const mongoose = require("mongoose");
const Role = require("../enums/role.enum");

const userSchema = new mongoose.Schema(
  {
    // id get from supabase auth (uuid)
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, default: null },
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
    _id: false, // không để Mongoose tự sinh ObjectId
    versionKey: false, // không sử dụng trường __v
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
