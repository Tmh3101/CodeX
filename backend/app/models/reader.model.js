/**
 * Reader model
 * Represents reader members synced from User model
 *
 * Fields:
 * - _id: User ID (String, ref to User model)
 * - readerId: Unique reader identifier (String) with format "DG<3-digit-number>"
 */

const mongoose = require("mongoose");
const Gender = require("../enums/gender.enum");

const readerSchema = new mongoose.Schema(
  {
    _id: { type: String, ref: "User" },
    readerId: { type: String, unique: true, required: true },
    gender: { type: String, enum: Object.values(Gender), default: null },
  },
  {
    _id: false, // do not create a separate _id field
    versionKey: false, // do not create __v field
  }
);

/**
 * Get user info for reader
 * Populates the _id field with User data
 */
readerSchema.methods.getUserInfo = async function () {
  await this.populate("_id");

  const data = this.toObject();
  data.user = data._id;
  delete data._id;

  return data;
};

const Reader = mongoose.model("Reader", readerSchema);

module.exports = Reader;
