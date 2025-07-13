const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const bookService = require("../app/services/book.service");
const authorService = require("../app/services/author.service");
const categoryService = require("../app/services/category.service");
const publisherService = require("../app/services/publisher.service");

const fectchBookDataByISBN = async (isbn) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

  try {
    const res = await axios.get(url);
    if (res.data.totalItems === 0) {
      console.log(`Not found ISBN ${isbn}`);
      return null;
    }

    const info = res.data.items[0].volumeInfo;

    // Check and parse the published year
    const publishedYear = parseInt(info.publishedDate.split("-")[0], 10);

    return {
      title: info.title || null,
      authors: info.authors || null,
      categories: info.categories || null,
      description: info.description || null,
      pageCount: info.pageCount ? parseInt(info.pageCount, 10) : null,
      publishedYear: isNaN(publishedYear) ? null : publishedYear,
      publisher: info.publisher || null,
    };
  } catch (error) {
    console.error(`Error fetching book data for ISBN ${isbn}:`, error.message);
    return null;
  }
};

const seedBooks = async () => {
  // Check book exists
  const data = await bookService.getAllBooks();
  if (data.books.length > 0) {
    console.log(`Found book data in the database`);
    return;
  }

  const maxBooks = 100; // Number of books to seed
  console.log(`\nSeeding a maximum of ${maxBooks} books...`);

  // Read the CSV file
  let bookDatas = [];
  fs.createReadStream("seedData/book_data.csv")
    .pipe(csv())
    .on("data", (row) => {
      bookDatas.push(row);
    })
    .on("end", async () => {
      console.log(`Read ${bookDatas.length} books from CSV file.`);
      let countBook = 0;
      for (const bookData of bookDatas) {
        console.log("---");
        console.log(`Processing book with ISBN: ${bookData.isbn}`);

        // Fetch book data by ISBN
        const bookInfo = await fectchBookDataByISBN(bookData.isbn);
        if (!bookInfo) {
          continue;
        }

        // Check published year (>= 2010)
        if (bookInfo.publishedYear < 2010) {
          console.log(
            `Skipping book with ISBN ${bookData.isbn} due to published year < 2010 (${bookInfo.publishedYear}).`
          );
          continue;
        }

        // Check page count (!= 0)
        if (bookInfo.pageCount === 0) {
          console.log(
            `Skipping book with ISBN ${bookData.isbn} due to page count = 0.`
          );
          continue;
        }

        // Dowload cover image with bookData.img field (e.g. "https://example.com/cover.jpg")
        let coverImg = null;
        if (bookData.img) {
          try {
            const response = await axios.get(bookData.img, {
              responseType: "arraybuffer",
            });
            coverImg = {
              buffer: Buffer.from(response.data, "binary"),
              originalname: bookData.img.split("/").pop() || "cover.jpg",
              mimetype: response.headers["content-type"] || "image/jpeg",
            };
          } catch (error) {
            console.error(
              `Error downloading cover image for ISBN ${bookData.isbn}:`,
              error.message
            );
          }
        }

        if (!coverImg) {
          console.log(
            `Skipping book with ISBN ${bookData.isbn} due to missing cover image.`
          );
          continue;
        }

        // Kiểm tra tất cả các trường required
        if (
          !bookInfo.title ||
          !bookInfo.description ||
          !bookInfo.pageCount ||
          !bookInfo.publisher ||
          !bookInfo.publishedYear
        ) {
          console.log(
            `Skipping book with ISBN ${bookData.isbn} due to missing required fields.`
          );
          continue;
        }

        // Create or get author
        let authorIds = [];
        for (const authorName of bookInfo.authors || []) {
          let author = await authorService.getAuthorByName(authorName);
          if (!author) {
            author = await authorService.createAuthor({ name: authorName });
          }
          authorIds.push(author._id);
        }

        // Create or get categories
        let categoryIds = [];
        for (const categoryName of bookInfo.categories || []) {
          let category = await categoryService.getCategoryByName(categoryName);
          if (!category) {
            category = await categoryService.createCategory({
              name: categoryName,
            });
          }
          categoryIds.push(category._id);
        }

        // Create or get publisher
        let publisher = await publisherService.getPublisherByName(
          bookInfo.publisher
        );

        if (!publisher) {
          const publisherName = bookInfo.publisher.trim();
          publisher = await publisherService.createPublisher({
            name: publisherName,
          });
        }

        // Random price and quantity
        const price = Math.floor(Math.random() * 10000) + 1000;
        const quantity = Math.floor(Math.random() * 100) + 1;

        // Create book object
        const book = {
          title: bookInfo.title,
          authors: authorIds,
          categories: categoryIds,
          description: bookInfo.description,
          pageCount: bookInfo.pageCount,
          price: price,
          quantity: quantity,
          publishedYear: bookInfo.publishedYear,
          publisher: publisher._id,
        };

        // Create book in database
        try {
          const createdBook = await bookService.createBook(book, coverImg);
          console.log(
            `Created book: ${createdBook.bookId} - ${createdBook.title}`
          );
        } catch (error) {
          console.error(
            `Error creating book with ISBN ${bookData.isbn}:`,
            error.message
          );
        }

        countBook += 1;
        console.log(`Processed book ${countBook}: ${bookData.isbn}`);

        // Kiểm tra xem đã đạt đủ số lượng sách cần tạo hay chưa
        if (countBook >= maxBooks) {
          console.log(`Reached the limit of ${maxBooks} books. Stopping.`);
          break;
        }
      }
    });
};

module.exports = seedBooks;
