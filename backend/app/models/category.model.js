/**
 * Categories Model
 *
 * Fields:
 * - _id: category ID (String)
 * - name: category name (String)
 */

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // _id field is automatically created by MongoDB
    name: { type: String, required: true, unique: true }, // category name
  },
  {
    versionKey: false, // do not create __v field
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
