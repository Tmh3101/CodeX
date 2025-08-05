/**
 * Borrow model
 * Fields:
 * - _id: borrow ID (String)
 * - userId: ID of the user who borrowed (String)
 * - bookId: ID of the borrowed book (String)
 * - staffId: ID of the staff who processed the borrow (String)
 * - quantity: quantity of books borrowed (Number)
 * - status: borrow status (String, enum)
 * - borrowDate: date when the book was borrowed (Date)
 * - returnDate: date when the book is expected to be returned (Date)
 * - note: additional notes (String, optional)
 * - createdAt: timestamp when the borrow was created (Date)
 * - updatedAt: timestamp when the borrow was last updated (Date)
 */

const mongoose = require("mongoose");
const Book = require("./book.model");
const Reader = require("./reader.model");
const Staff = require("./staff.model");
const BorrowStatus = require("../enums/borrowStatus.enum");

const borrowSchema = new mongoose.Schema(
  {
    readerId: { type: String, required: true }, // ID of the user who borrowed
    bookId: { type: String, required: true }, // ID of the borrowed book
    approvedStaffId: { type: String, default: null }, // ID of the staff who processed the borrow
    returnedStaffId: { type: String, default: null }, // ID of the staff who processed the return
    quantity: { type: Number, required: true, min: 1 }, // total quantity of books
    status: {
      type: String,
      enum: Object.values(BorrowStatus), // use enum for borrow status
      default: BorrowStatus.PENDING,
    },
    borrowDate: { type: Date, default: null }, // date when the book was borrowed
    dueDate: { type: Date, default: null }, // date when the book is due
    returnDate: { type: Date, default: null }, // date when the book is expected to be returned
    note: { type: String, default: null }, // additional notes (optional)
  },
  {
    timestamps: true, // automatically create createdAt and updatedAt fields
    versionKey: false, // do not create __v field
  }
);

borrowSchema.methods.getInfo = async function () {
  const reader = await Reader.findOne({ readerId: this.readerId });

  const book = await Book.findOne({ bookId: this.bookId });
  const bookInfo = await book.getFullInfo();

  let approvedStaff = this.approvedStaffId
    ? await Staff.findOne({ staffId: this.approvedStaffId })
    : null;

  if (approvedStaff) {
    approvedStaff = await approvedStaff.getUserInfo();
  }

  let returnedStaff = this.returnedStaffId
    ? await Staff.findOne({ staffId: this.returnedStaffId })
    : null;

  if (returnedStaff) {
    returnedStaff = await returnedStaff.getUserInfo();
  }

  const data = this.toObject();

  (data.reader = reader), (data.book = bookInfo);
  data.approvedStaff = approvedStaff;
  data.returnedStaff = returnedStaff;
  delete data.readerId;
  delete data.bookId;
  delete data.approvedStaffId;
  delete data.returnedStaffId;
  return data;
};

const Borrow = mongoose.model("Borrow", borrowSchema);

module.exports = Borrow;
