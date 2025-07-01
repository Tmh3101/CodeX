const mongoose = require("mongoose");
const Gender = require("../enums/gender.enum");

const readerSchema = new mongoose.Schema(
  {
    _id: { type: String, ref: "User" },
    readerId: { type: String, unique: true, required: true },
    gender: { type: String, enum: Object.values(Gender) },
  },
  {
    _id: false, // không để Mongoose tự sinh ObjectId
    versionKey: false, // không sử dụng trường __v
  }
);

const Reader = mongoose.model("Reader", readerSchema);

module.exports = Reader;
