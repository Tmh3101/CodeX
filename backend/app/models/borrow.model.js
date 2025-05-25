const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
  readerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reader",
    required: true,
  },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: {
    type: String,
    enum: ["pending", "approved", "returned", "rejected"],
    default: "pending",
  },
});

const Borrow = mongoose.model("Borrow", borrowSchema);

module.exports = Borrow;
