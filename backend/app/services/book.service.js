/**
 * Book service
 * This service handles book-related operations such as creating and syncing books
 * from the Book model to the database, and retrieving books by various criteria.
 */

const ApiError = require("../api-error");
const Book = require("../models/book.model");
const Borrows = require("../models/borrow.model");
const BorrowStatus = require("../enums/borrowStatus.enum");
const {
  uploadFileToSupabase,
  getPublicUrl,
  deleteFileFromSupabase,
} = require("../utils/file.util");

// Function to generate the next book ID with format "S<3-digit-number>"
const getNextBookId = async () => {
  try {
    // Find the last book by _id and extract the numeric part
    const lastBook = await Book.findOne().sort({ bookId: -1 });
    if (!lastBook) return "S001"; // If no books exist, start with S001

    const lastId = parseInt(lastBook.bookId.replace("S", ""), 10);
    const nextId = lastId + 1;
    return `S${String(nextId).padStart(3, "0")}`; // e.g. S002, S003, etc.
  } catch (error) {
    console.error("Error getting next book ID:", error);
    throw new Error("Failed to generate next book ID");
  }
};

// Get number of pending borrows, approved borrows and available books by bookId
const getBookStats = async (bookId) => {
  try {
    const borrows = await Borrows.find({ bookId: bookId });

    const stats = borrows.reduce(
      (acc, borrow) => {
        if (borrow.status === BorrowStatus.PENDING) acc.pendingQuantity++;
        if (borrow.status === BorrowStatus.APPROVED) acc.approvedQuantity++;
        return acc;
      },
      { pendingQuantity: 0, approvedQuantity: 0 }
    );

    return stats;
  } catch (error) {
    console.error("Error getting book stats:", error);
    throw new Error("Failed to retrieve book stats");
  }
};

/**
 * Create a book in the database
 * @param {Object} bookData - The book data to create
 * @return {Promise<Object>} - The created book document
 * @throws {ApiError} - If the book creation fails
 */
const createBook = async (bookData, coverFile) => {
  try {
    // Generate the next book ID
    const nexBookId = await getNextBookId();

    // Create a new book instance
    const newBook = new Book({
      bookId: nexBookId,
      title: bookData.title,
      authors: bookData.authors,
      categories: bookData.categories,
      description: bookData.description,
      pageCount: bookData.pageCount,
      price: bookData.price,
      quantity: bookData.quantity,
      publishedYear: bookData.publishedYear,
      publisher: bookData.publisher,
    });

    // Save the book to the database
    const book = await newBook.save();

    // Upload cover to Supabase storage and get public URL
    const fileExt = coverFile.originalname.split(".").pop();
    const fileName = `${book._id}_${Date.now()}.${fileExt}`;

    const data = await uploadFileToSupabase("book-covers", coverFile, fileName);
    const publicUrl = getPublicUrl("book-covers", data.path);

    // Update the book with the cover URL
    book.coverUrl = publicUrl;
    const updatedBook = await book.save();
    const bookInfo = await updatedBook.getFullInfo();

    return bookInfo;
  } catch (error) {
    console.error("Error creating book:", error);
    throw new Error("Failed to create book");
  }
};

/**
 * Get all books from the database
 * @param {Number} skip - Number of documents to skip for pagination
 * @param {Number} limit - Maximum number of documents to return
 * @param {String} search - Search query for book title
 * @param {String} categories - Filter by category IDs
 * @param {String} authors - Filter by author IDs
 * @param {String} publisher - Filter by publisher IDs
 * @return {Promise<Array>} - An array of book documents
 * @throws {ApiError} - If the retrieval fails
 */
const getAllBooks = async (
  skip = 0,
  limit = 10,
  search = "",
  categories = "",
  authors = "",
  publisher = ""
) => {
  try {
    // get all active books with pagination
    const books = await Book.find({
      isActive: true,
      title: { $regex: search.trim(), $options: "i" }, // case-insensitive search
      ...(categories && { categories }), // filter by category if provided
      ...(authors && { authors: { $in: authors } }), // filter by authors if provided
      ...(publisher && { publisher: { $in: publisher } }), // filter by publishers if provided
    })
      .skip(search ? 0 : skip)
      .limit(limit);

    const bookFullInfo = await Promise.all(
      books.map((book) => {
        return book.getFullInfo().then((info) => {
          return getBookStats(book.bookId).then((stats) => {
            return {
              ...info,
              ...stats,
              availableQuantity:
                info.quantity - stats.pendingQuantity - stats.approvedQuantity,
            };
          });
        });
      })
    );

    const total = await Book.countDocuments({
      isActive: true,
      title: { $regex: search.trim(), $options: "i" },
      ...(categories && { categories }),
    });

    return {
      totalBooks: total,
      totalPages: Math.ceil(total / limit),
      limit,
      currentPage: Math.ceil(skip / limit) + 1,
      books: bookFullInfo,
      skip,
    };
  } catch (error) {
    console.error("Error getting all books:", error);
    throw new Error("Failed to retrieve books");
  }
};

/**
 * Get book by ID
 * @param {String} bookId - The ID of the book to find
 * @return {Promise<Object|null>} - The found book document or null if not found
 * @throws {ApiError} - If the book is not found
 */
const getBookById = async (bookId) => {
  try {
    const book = await Book.findOne({ bookId });
    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    if (!book.isActive) {
      throw new ApiError(400, "This book is not available");
    }

    const bookInfo = await book.getFullInfo();
    const stats = await getBookStats(bookId);

    return {
      ...bookInfo,
      ...stats,
      availableQuantity:
        bookInfo.quantity - stats.pendingQuantity - stats.approvedQuantity,
    };
  } catch (error) {
    console.error("Error finding book by ID:", error);
    throw new Error("Failed to find book by ID");
  }
};

/**
 * Update book by ID
 * @param {String} bookId - The ID of the book to update
 * @param {Object} updateData - The data to update the book with
 * @return {Promise<Object>} - The updated book document
 * @throws {ApiError} - If the book is not found or update fails
 */
const updateBookById = async (bookId, updateData, coverFile) => {
  try {
    const book = await Book.findOne({ bookId });
    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    if (!book.isActive) {
      throw new ApiError(400, "This book is not available for update");
    }

    if (coverFile) {
      // Upload new cover file if provided
      const fileExt = coverFile.originalname.split(".").pop();
      const fileName = `${bookId}_${Date.now()}.${fileExt}`;
      const data = await uploadFileToSupabase(
        "book-covers",
        coverFile,
        fileName
      );
      const publicUrl = getPublicUrl("book-covers", data.path);
      updateData.coverUrl = publicUrl;

      // Optionally delete old cover file if it exists
      if (book.coverUrl) {
        const oldFileName = book.coverUrl.split("/").pop();
        await deleteFileFromSupabase("book-covers", oldFileName);
      }
    }

    const updatedBook = await Book.findOneAndUpdate({ bookId }, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) {
      throw new ApiError(404, "Book not found");
    }
    const bookInfo = await updatedBook.getFullInfo();
    return bookInfo;
  } catch (error) {
    console.error("Error updating book:", error);
    throw new Error("Failed to update book: " + error.message);
  }
};

/**
 * Delete book by ID
 * @param {String} bookId - The ID of the book to delete
 * @return {Promise<void>} - Resolves when book is deleted
 * @throws {ApiError} - If book deletion fails
 */
const deleteBookById = async (bookId) => {
  try {
    const book = await Book.findOne({ bookId });
    if (!book) {
      throw new ApiError(404, "Book not found");
    }
    // Delete cover file from Supabase if it exists
    if (book.coverUrl) {
      const fileName = book.coverUrl.split("/").pop();
      await deleteFileFromSupabase("book-covers", fileName);
    }
    // Delete the book document
    await Book.deleteOne({ bookId });
  } catch (error) {
    console.error("Error deleting book:", error);
    throw new Error("Failed to delete book: " + error.message);
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
