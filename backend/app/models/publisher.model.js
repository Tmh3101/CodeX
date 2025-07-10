/**
 * Publisher model
 *
 * Fields:
 * - _id: publisher ID (String)
 * - name: publisher's name (String)
 */

const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema(
  {
    // _id field is automatically created by MongoDB
    name: { type: String, required: true, unique: true }, // publisher's name
  },
  {
    versionKey: false, // do not create __v field
  }
);

const Publisher = mongoose.model("Publisher", publisherSchema);

module.exports = Publisher;
