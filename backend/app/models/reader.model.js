const mongoose = require("mongoose");
const Gender = require("../enums/gender.enum");

const readerSchema = new mongoose.Schema({
  _id: { type: String, ref: "User" },
  gender: { type: String, enum: Object.values(Gender) },
});

const Reader = mongoose.model("Reader", readerSchema);

module.exports = Reader;
