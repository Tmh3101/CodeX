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

// Function to check due date of a borrow
const isBorrowOverdue = (borrow) => {
  if (borrow.status !== BorrowStatus.APPROVED) return false; // Only check overdue for approved borrows
  const now = new Date();
  return borrow.dueDate < now;
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

    // Check current borrow of user (current borrows + new borrow <= 5)
    const currentBorrows = await Borrow.find({
      readerId: reader.readerId,
      status: { $in: [BorrowStatus.PENDING, BorrowStatus.APPROVED] },
    });

    const countCurrentBorrows = currentBorrows.reduce(
      (count, borrow) => count + borrow.quantity,
      0
    );

    if (countCurrentBorrows + borrowData.quantity > 5) {
      throw new ApiError(400, "Bạn không thể mượn quá 5 cuốn sách cùng lúc");
    }

    // Create a new borrow instance
    const newBorrow = new Borrow({
      readerId: reader.readerId,
      bookId: borrowData.bookId,
      quantity: borrowData.quantity,
      note: borrowData.note,
    });
    // Save the borrow to the database
    const savedBorrow = await newBorrow.save();
    const borrowInfo = await savedBorrow.getInfo();

    return borrowInfo;
  } catch (error) {
    console.error("Error creating borrow:", error.message);
    throw new ApiError(400, error.message);
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
    throw new ApiError(400, "Failed to cancel borrow: " + error.message);
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
    borrow.borrowDate = new Date(); // Set borrow date to now
    borrow.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Set due date to 14 days after approval
    borrow.approvedStaffId = staff.staffId; // Set the staff who approved the borrow

    const updatedBorrow = await borrow.save();
    const borrowInfo = await updatedBorrow.getInfo();

    return borrowInfo;
  } catch (error) {
    console.error("Error approving borrow:", error);
    throw new Error("Failed to approve borrow: " + error.message);
  }
};

/**
 * Reject a borrow
 * @param {String} userId - The ID of the user rejecting the borrow
 * @param {String} borrowId - The ID of the borrow to reject
 * @return {Promise<Object>} - The updated borrow document
 * @throws {Error} - If the borrow rejection fails
 */
const rejectBorrow = async (userId, borrowId) => {
  try {
    // Find the borrow by ID
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      throw new ApiError(404, "Borrow not found");
    }

    // Check if the user is a staff member
    const staff = await Staff.findById(userId);
    if (!staff) {
      throw new ApiError(403, "You are not authorized to reject this borrow");
    }

    // Check if the borrow is already approved or cancelled
    if (borrow.status !== BorrowStatus.PENDING) {
      throw new ApiError(400, "This borrow cannot be rejected");
    }

    // Update the borrow status to REJECTED
    borrow.status = BorrowStatus.REJECTED;
    borrow.approvedStaffId = staff.staffId; // Set the staff who processed the rejection

    const updatedBorrow = await borrow.save();
    const borrowInfo = await updatedBorrow.getInfo();

    return borrowInfo;
  } catch (error) {
    console.error("Error rejecting borrow:", error);
    throw new Error("Failed to reject borrow: " + error.message);
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
    borrow.returnDate = new Date(); // Set the return date to now

    const updatedBorrow = await borrow.save();
    const borrowInfo = await updatedBorrow.getInfo();

    return {
      ...borrowInfo,
      isOverdue: isBorrowOverdue(updatedBorrow),
    };
  } catch (error) {
    console.error("Error confirming borrow returned:", error);
    throw new Error("Failed to confirm borrow returned: " + error.message);
  }
};

/**
 * Get all borrows
 * @param {Object} filter - The filter criteria for retrieving borrows
 * @param {Number} skip - Number of documents to skip for pagination
 * @param {Number} limit - Number of documents to return
 * @return {Promise<Array>} - An array of borrow documents
 */
const getAllBorrows = async (filters, skip, limit) => {
  try {
    // remove undefined properties from filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined || filters[key] === null) {
        delete filters[key];
      }
    });

    if (filters.status === "overdue") {
      filters.status = BorrowStatus.APPROVED; // Only check overdue for approved borrows
      filters.dueDate = { $lt: new Date() }; // Filter for overdue borrows
    }

    // Find borrows with pagination and filter, sorting by createdAt descending
    const borrows = await Borrow.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    let borrowInfo = await Promise.all(
      borrows.map(async (borrow) => {
        const borrowDetails = await borrow.getInfo();
        borrowDetails.reader = await borrowDetails.reader.getUserInfo();
        return {
          ...borrowDetails,
          isOverdue: isBorrowOverdue(borrow), // Check if the borrow is overdue
        };
      })
    );

    // Apply search filter if provided
    if (filters.search) {
      borrowInfo = borrowInfo.filter(
        (borrow) =>
          borrow.reader.user.firstName
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          borrow.reader.user.lastName
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          borrow.book.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.fromDate || filters.toDate) {
      const fromDate = filters.fromDate
        ? new Date(filters.fromDate)
        : new Date(0);
      const toDate = filters.toDate ? new Date(filters.toDate) : new Date();

      borrowInfo = borrowInfo.filter((borrow) => {
        const createdAt = new Date(borrow.createdAt);
        const returnDate = new Date(borrow.returnDate);
        return (
          (createdAt >= fromDate && createdAt <= toDate) ||
          (returnDate >= fromDate && returnDate <= toDate)
        );
      });
    }

    const allBorrows = await Borrow.find();
    const totalBorrows = allBorrows.length;
    const totalPending = allBorrows.filter(
      (b) => b.status === BorrowStatus.PENDING
    ).length;
    const totalApproved = allBorrows.filter(
      (b) => b.status === BorrowStatus.APPROVED
    ).length;

    return {
      totalPages: Math.ceil(totalBorrows / limit),
      limit,
      currentPage: Math.ceil(skip / limit) + 1,
      totalBorrows: totalBorrows,
      borrows: borrowInfo,
      pendingQuantity: totalPending,
      approvedQuantity: totalApproved,
      overdueQuantity: borrowInfo.filter(isBorrowOverdue).length,
    };
  } catch (error) {
    console.error("Error getting all borrows:", error);
    throw new Error("Failed to retrieve borrows: " + error.message);
  }
};

/**
 * Get my borrows
 * @param {String} userId - The ID of the user to get borrows for
 * @param {Object} filter - The filter criteria for retrieving borrows
 * @return {Promise<Array>} - An array of borrow documents
 * @throws {Error} - If the borrow retrieval fails
 */
const getMyBorrows = async (userId, filter = {}) => {
  try {
    // Get reader by userId
    const reader = await Reader.findById(userId);

    // Find borrows by readerId
    const borrows = await Borrow.find({
      readerId: reader.readerId,
      ...filter,
    });

    const borrowInfo = await Promise.all(
      borrows.map(async (borrow) => {
        const borrowDetails = await borrow.getInfo();
        return {
          ...borrowDetails,
          isOverdue: isBorrowOverdue(borrow),
        };
      })
    );

    return borrowInfo;
  } catch (error) {
    console.error("Error getting my borrows:", error);
    throw new Error("Failed to get my borrows: " + error.message);
  }
};

/**
 * Get borrow by ID
 * @param {String} borrowId - The ID of the borrow to retrieve
 * @return {Promise<Object>} - The borrow document
 * @throws {Error} - If the borrow retrieval fails
 */
const getBorrowById = async (borrowId) => {
  try {
    // Find borrow by ID
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      throw new ApiError(404, "Borrow not found");
    }

    const borrowInfo = await borrow.getInfo();
    borrowInfo.reader = await borrowInfo.reader.getUserInfo();
    return {
      ...borrowInfo,
      isOverdue: isBorrowOverdue(borrow), // Check if the borrow is overdue
    };
  } catch (error) {
    console.error("Error getting borrow by ID:", error);
    throw new Error("Failed to retrieve borrow: " + error.message);
  }
};

module.exports = {
  createBorrow,
  cancelBorrow,
  approveBorrow,
  rejectBorrow,
  confirmBorrowReturn,
  getAllBorrows,
  getMyBorrows,
  getBorrowById,
};
