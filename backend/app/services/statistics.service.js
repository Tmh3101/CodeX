/**
 * Statistics service
 * This service handles statistical data operations for dashboard and reports
 */

const Borrow = require("../models/borrow.model");
const Book = require("../models/book.model");
const User = require("../models/user.model");
const Reader = require("../models/reader.model");
const Staff = require("../models/staff.model");
const Category = require("../models/category.model");
const BorrowStatus = require("../enums/borrowStatus.enum");
const ApiError = require("../api-error");
const { all } = require("../routes/statistics.route");

/**
 * Get borrow/return statistics
 */
const getBorrowStatistics = async (timeRange = "month") => {
  try {
    const now = new Date();
    let startDate;

    // Calculate date range
    switch (timeRange) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // month
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Fetch all borrows since startDate and status is not pending
    const allBorrows = await Borrow.find({
      createdAt: { $gte: startDate },
      status: { $ne: BorrowStatus.PENDING },
    });

    // Summary statistics
    const totalBorrows = allBorrows.length;
    const onTimeBorrows = allBorrows.filter(
      (borrow) =>
        borrow.status === BorrowStatus.RETURNED &&
        borrow.returnDate <= borrow.dueDate
    ).length;

    const overdueBorrows = allBorrows.filter(
      (borrow) =>
        borrow.status === BorrowStatus.RETURNED &&
        borrow.returnDate > borrow.dueDate
    ).length;

    const activeBorrows = allBorrows.filter(
      (borrow) => borrow.status === BorrowStatus.APPROVED
    ).length;

    // Trend data
    const trendData = await getBorrowTrendData(startDate, timeRange);

    // Status distribution
    const statusData = {
      returned: allBorrows.filter(
        (borrow) => borrow.status === BorrowStatus.RETURNED
      ).length,
      rejected: allBorrows.filter(
        (borrow) => borrow.status === BorrowStatus.REJECTED
      ).length,
      cancelled: allBorrows.filter(
        (borrow) => borrow.status === BorrowStatus.CANCELLED
      ).length,
    };

    return {
      summary: {
        total: totalBorrows,
        onTime: onTimeBorrows,
        overdue: overdueBorrows,
        active: activeBorrows,
      },
      trend: trendData,
      status: statusData,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Error getting borrow statistics: " + error.message
    );
  }
};

/**
 * Get book statistics
 */
const getBookStatistics = async () => {
  try {
    // Basic book counts
    const totalBooks = await Book.countDocuments();
    const categories = await Category.countDocuments();

    // Books currently borrowed
    const allBorrows = await Borrow.find();

    const borrowedBooks = allBorrows.reduce((count, borrow) => {
      if (borrow.status === BorrowStatus.APPROVED) {
        return count + borrow.quantity;
      }
      return count;
    }, 0);

    // Available books calculation
    const allBooks = await Book.find();
    const totalQuantity = allBooks.reduce((sum, book) => {
      return sum + book.quantity;
    }, 0);
    const availableBooks = totalQuantity - borrowedBooks;

    const countBorrowedBooks = {};
    allBorrows.forEach((borrow) => {
      if (
        borrow.status !== BorrowStatus.PENDING &&
        borrow.status !== BorrowStatus.CANCELLED
      ) {
        countBorrowedBooks[borrow.bookId] =
          (countBorrowedBooks[borrow.bookId] || 0) + borrow.quantity;
      }
    });

    // Top borrowed books
    let topBorrowedBooks = Object.entries(countBorrowedBooks)
      .map(([bookId, count]) => ({ bookId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    topBorrowedBooks = await Promise.all(
      topBorrowedBooks.map(async (item) => {
        const book = await Book.findOne({ bookId: item.bookId });
        if (book) {
          const fullInfo = await book.getFullInfo();
          return {
            ...fullInfo,
            borrowCount: item.count,
          };
        }
        return null;
      })
    );

    // Category statistics
    const categoryStats = await getCategoryStatistics();

    return {
      summary: {
        total: totalBooks,
        borrowed: borrowedBooks,
        available: availableBooks,
        categories: categories,
      },
      topBorrowed: topBorrowedBooks,
      availability: {
        available: availableBooks,
        borrowed: borrowedBooks,
        unavailable: 0, // Could be calculated based on damaged books if you have that field
      },
      categoryStats: categoryStats,
    };
  } catch (error) {
    throw new ApiError(500, "Error getting book statistics: " + error.message);
  }
};

/**
 * Get user statistics
 */
const getUserStatistics = async (timeRange = "month") => {
  try {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // User counts
    const totalUsers = await User.countDocuments();
    const readers = await Reader.countDocuments();
    const staff = await Staff.countDocuments();

    // New users this month
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: currentMonth },
    });

    const allBorrows = await Borrow.find();

    const allBorrowsDetails = await Promise.all(
      allBorrows.map(async (borrow) => {
        const reader = await Reader.findOne({ readerId: borrow.readerId });
        if (reader) {
          const userInfo = await reader.getUserInfo();
          return {
            ...borrow.toObject(),
            reader: userInfo,
          };
        }
        return null;
      })
    );

    // Aggregate borrow counts by user
    const borrowCounts = allBorrowsDetails.reduce((acc, borrow) => {
      const userId = borrow.reader.readerId;
      if (!acc[userId]) {
        acc[userId] = { count: 0, reader: borrow.reader };
      }
      acc[userId].count += borrow.quantity;
      return acc;
    }, {});

    // Convert to array and sort by borrow count
    const topBorrowers = Object.values(borrowCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 9)
      .map((item) => ({
        name: `${item.reader.user.firstName} ${item.reader.user.lastName}`,
        email: item.reader.user.email,
        borrowCount: item.count,
      }));

    // Top borrowers
    const topBorrowers2 = await Borrow.aggregate([
      {
        $group: {
          _id: "$readerId",
          borrowCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "readers",
          localField: "_id",
          foreignField: "_id",
          as: "reader",
        },
      },
      {
        $unwind: "$reader",
      },
      {
        $lookup: {
          from: "users",
          localField: "reader.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          name: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          email: "$user.email",
          borrowCount: 1,
        },
      },
      {
        $sort: { borrowCount: -1 },
      },
      {
        $limit: 9,
      },
    ]);

    // New user trend
    const newUserTrend = await getNewUserTrendData(timeRange);

    return {
      summary: {
        total: totalUsers,
        readers: readers,
        staff: staff,
        newThisMonth: newThisMonth,
      },
      topBorrowers: topBorrowers,
      roleDistribution: {
        readers: readers,
        staff: staff,
      },
      newUserTrend: newUserTrend,
    };
  } catch (error) {
    throw new ApiError(500, "Error getting user statistics: " + error.message);
  }
};

/**
 * Get dashboard overview statistics
 */
const getDashboardStats = async () => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeBorrows = await Borrow.countDocuments({
      status: { $in: [BorrowStatus.APPROVED, BorrowStatus.BORROWED] },
    });
    const pendingBorrows = await Borrow.countDocuments({
      status: BorrowStatus.PENDING,
    });

    return {
      totalBooks,
      totalUsers,
      activeBorrows,
      pendingBorrows,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Error getting dashboard statistics: " + error.message
    );
  }
};

// Helper functions
const getBorrowTrendData = async (startDate, timeRange) => {
  let groupFormat;
  let labels = [];

  switch (timeRange) {
    case "week":
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
      // Generate last 7 days labels
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toISOString().split("T")[0]);
      }
      break;
    case "year":
      groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
      // Generate last 12 months labels
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        labels.push(
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        );
      }
      break;
    default: // month or quarter
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
      const days = timeRange === "quarter" ? 90 : 30;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toISOString().split("T")[0]);
      }
  }

  const trendResult = await Borrow.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupFormat,
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Map results to labels
  const dataMap = {};
  trendResult.forEach((item) => {
    dataMap[item._id] = item.count;
  });

  const data = labels.map((label) => dataMap[label] || 0);

  return { labels, data };
};

const getCategoryStatistics = async () => {
  const allCategories = await Category.find();
  const allBooks = await Book.find();
  const allBorrows = await Borrow.find();

  const categoryStats = allCategories.map((category) => {
    const booksInCategory = allBooks.filter((book) =>
      book.categories.includes(category._id)
    );

    const borrowed = allBorrows.filter((borrow) =>
      booksInCategory.map((b) => b.bookId).includes(borrow.bookId)
    );

    return {
      name: category.name,
      bookCount: booksInCategory.length,
      borrowCount: borrowed.length,
    };
  });

  return {
    labels: categoryStats.map((cat) => cat.name),
    bookCounts: categoryStats.map((cat) => cat.bookCount),
    borrowCounts: categoryStats.map((cat) => cat.borrowCount),
  };
};

const getNewUserTrendData = async (timeRange) => {
  const now = new Date();
  let startDate;
  let groupFormat;
  let labels = [];

  switch (timeRange) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toISOString().split("T")[0]);
      }
      break;
    case "year":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        labels.push(
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        );
      }
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toISOString().split("T")[0]);
      }
  }

  const newUserData = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupFormat,
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const dataMap = {};
  newUserData.forEach((item) => {
    dataMap[item._id] = item.count;
  });

  const data = labels.map((label) => dataMap[label] || 0);

  return { labels, data };
};

module.exports = {
  getBorrowStatistics,
  getBookStatistics,
  getUserStatistics,
  getDashboardStats,
};
