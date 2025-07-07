/**
 * Staff model
 * Represents staff members synced from User model
 *
 * Fields:
 * - _id: User ID (String, ref to User model)
 * - staffId: Unique staff identifier (String) with format "NV<3-digit-number>"
 */

const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    _id: { type: String, ref: "User" },
    staffId: { type: String, unique: true, required: true },
  },
  {
    _id: false, // do not create a separate _id field
    versionKey: false, // do not create __v field
  }
);

/**
 * Get user info for staff
 * Populates the _id field with User data
 */
staffSchema.methods.getUserInfo = async function () {
  await this.populate("_id");

  const data = this.toObject();
  data.user = data._id;
  delete data._id;

  return data;
};

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
