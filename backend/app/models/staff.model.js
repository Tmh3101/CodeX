const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  _id: { type: String, ref: "User" },
  position: { type: String },
});

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
