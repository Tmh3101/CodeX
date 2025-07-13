/**
 * Borrow service
 * This service handles borrow operations such as creating, updating, and retrieving borrow records.
 */

const Borrow = require("../models/borrow.model");
const Book = require("../models/book.model");
const Reader = require("../models/reader.model");
const Staff = require("../models/staff.model");
const ApiError = require("../api-error");
const BorrowStatus = require("../enums/borrowStatus.enum");

// Function to get number of avilable books for a borrow
// Available books are those with quantity files subtracted by the number of approved & pending borrows
const getAvailableBookQuantity = async (bookId) => {
  // Tổng số quantity sách đang PENDING hoặc APPROVED
  const aggregateResult = await Borrow.aggregate([
    {
      $match: {
        bookId: bookId,
        status: { $in: [BorrowStatus.PENDING, BorrowStatus.APPROVED] },
      },
    },
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: "$quantity" },
      },
    },
  ]);

  const totalBorrowed = aggregateResult[0]?.totalQuantity || 0;

  // Lấy tổng quantity sách từ books collection
  const book = await Book.findOne({ bookId: bookId });
  const availableQuantity = book.quantity - totalBorrowed;

  return Math.max(0, availableQuantity);
};

/**
 * Create a borrow
 * @param {String} userId - The ID of the user creating the borrow
 * @param {Object} borrowData - The borrow data to create
 * @return {Promise<Object>} - The created borrow document
 * @throws {Error} - If the borrow creation fails
 */
const createBorrow = async (userId, borrowData) => {
  try {
    // Get reader by userId
    const reader = await Reader.findById(userId);
    if (!reader) {
      throw new ApiError(404, "Reader not found");
    }

    // Check if the book exists
    const book = await Book.findOne({ bookId: borrowData.bookId });
    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    // Check if the book is active
    if (!book.isActive) {
      throw new ApiError(400, "This book is not available for borrowing");
    }

    // Check available quantity
    const availableQuantity = await getAvailableBookQuantity(borrowData.bookId);
    if (availableQuantity < borrowData.quantity) {
      throw new ApiError(400, "Not enough available books for this borrow");
    }

    // Create a new borrow instance
    const newBorrow = new Borrow({
      readerId: reader.readerId,
      bookId: borrowData.bookId,
      staffId: null,
      quantity: borrowData.quantity,
      status: BorrowStatus.PENDING, // Default status is PENDING
      returnDate: null,
      note: borrowData.note || "",
    });
    // Save the borrow to the database
    const savedBorrow = await newBorrow.save();
    const borrowInfo = await savedBorrow.getInfo();

    return borrowInfo;
  } catch (error) {
    console.error("Error creating borrow:", error);
    throw new Error("Failed to create borrow: " + error.message);
  }
};

/**
 * Cancel a borrow
 * @param {String} userId - The ID of the user cancelling the borrow
 * @param {String} borrowId - The ID of the borrow to cancel
 * @return {Promise<Object>} - The updated borrow document
 * @throws {Error} - If the borrow cancellation fails
 */
const cancelBorrow = async (userId, borrowId) => {
  try {
    // Find the borrow by ID
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      throw new ApiError(404, "Borrow not found");
    }

    // Check if the user is the borrower
    const reader = await Reader.findById(userId);
    if (!reader) {
      throw new ApiError(404, "Reader not found");
    }

    if (borrow.readerId !== reader.readerId) {
      throw new ApiError(403, "You are not authorized to cancel this borrow");
    }

    // Check if the borrow is already returned or cancelled
    if (borrow.status !== BorrowStatus.PENDING) {
      throw new ApiError(400, "This borrow cannot be cancelled");
    }

    // Update the borrow status to CANCELLED
    borrow.status = BorrowStatus.CANCELLED;
    const updatedBorrow = await borrow.save();

    return {
      borrowId: updatedBorrow._id,
      status: updatedBorrow.status,
    };
  } catch (error) {
    console.error("Error cancelling borrow:", error);
    throw new Error("Failed to cancel borrow: " + error.message);
  }
};

/**
 * Approve a borrow
 * @param {String} borrowId - The ID of the borrow to approve
 * @return {Promise<Object>} - The updated borrow document
 * @throws {Error} - If the borrow approval fails
 */
const approveBorrow = async (userId, borrowId) => {
  try {
    // Find the borrow by ID
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      throw new ApiError(404, "Borrow not found");
    }

    // Check if the user is a staff member
    const staff = await Staff.findById(userId);
    if (!staff) {
      throw new ApiError(403, "You are not authorized to approve this borrow");
    }

    // Check if the borrow is already approved or cancelled
    if (borrow.status !== BorrowStatus.PENDING) {
      throw new ApiError(400, "This borrow cannot be approved");
    }

    // Update the borrow status to APPROVED
    borrow.status = BorrowStatus.APPROVED;
    borrow.returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Set return date to 14 days after approval
    borrow.approvedStaffId = staff.staffId; // Set the staff who approved the borrow

    const updatedBorrow = await borrow.save();

    return updatedBorrow.getInfo();
  } catch (error) {
    console.error("Error approving borrow:", error);
    throw new Error("Failed to approve borrow: " + error.message);
  }
};

/**
 * Comfirm borrow returned
 * @param {String} borrowId - The ID of the borrow to confirm return
 * @return {Promise<Object>} - The updated borrow document
 * @throws {Error} - If the borrow return confirmation fails
 */
const confirmBorrowReturn = async (userId, borrowId) => {
  try {
    // Find the borrow by ID
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      throw new ApiError(404, "Borrow not found");
    }

    // Check if the user is a staff member
    const staff = await Staff.findById(userId);
    if (!staff) {
      throw new ApiError(403, "You are not authorized to confirm this return");
    }

    // Check if the borrow is already returned or cancelled
    if (borrow.status !== BorrowStatus.APPROVED) {
      throw new ApiError(400, "This borrow cannot be confirmed as returned");
    }

    // Update the borrow status to RETURNED
    borrow.status = BorrowStatus.RETURNED;
    borrow.returnedStaffId = staff.staffId; // Set the staff who processed the return

    const updatedBorrow = await borrow.save();

    return updatedBorrow.getInfo();
  } catch (error) {
    console.error("Error confirming borrow returned:", error);
    throw new Error("Failed to confirm borrow returned: " + error.message);
  }
};

module.exports = {
  createBorrow,
  cancelBorrow,
  approveBorrow,
  confirmBorrowReturn,
};
