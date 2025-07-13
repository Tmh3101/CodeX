/**
 * Book model
 * * Fields:
 * - _id: book ID (String)
 * - title: book title (String)
 * - authors: array of author IDs (Array of Strings)
 * - categories: array of category IDs (Array of Strings)
 * - description: book description (String)
 * - price: book price (Number)
 * - quantity: book quantity (Number)
 * - publishedYear: book published year (Number)
 * - publisher: publisher ID (String)
 * - coverUrl: URL of the book cover image (String)
 */

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // _id field is automatically created by MongoDB
    bookId: { type: String, unique: true, required: true }, // unique book ID
    title: { type: String, required: true },
    authors: [{ type: String, ref: "Author", required: true }], // array of author IDs
    categories: [{ type: String, ref: "Category", required: true }], // array of category IDs
    description: { type: String, required: true },
    pageCount: { type: Number, required: true }, // number of pages in the book
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }, // book quantity
    publishedYear: { type: Number, required: true },
    publisher: { type: String, ref: "Publisher", required: true }, // publisher ID
    isActive: { type: Boolean, default: true }, // book status
    coverUrl: { type: String }, // URL of the book cover image
  },
  {
    versionKey: false, // do not create __v field
  }
);

// Create method to get full information of the book
bookSchema.methods.getFullInfo = async function () {
  await this.populate("authors categories publisher");

  const data = this.toObject();
  data.authors = data.authors.map((author) => author.name);
  data.categories = data.categories.map((category) => category.name);
  data.publisher = data.publisher.name;

  return data;
};

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
