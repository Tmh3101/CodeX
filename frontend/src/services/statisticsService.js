// services/statisticsService.js
import api from "./api";

export const statisticsService = {
  // Get borrow/return statistics
  getBorrowStatistics: async (timeRange = "month") => {
    try {
      const response = await api.get(
        `/statistics/borrows?timeRange=${timeRange}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting borrow statistics:", error);
      throw error;
    }
  },

  // Get book statistics
  getBookStatistics: async () => {
    try {
      const response = await api.get("/statistics/books");
      return response.data;
    } catch (error) {
      console.error("Error getting book statistics:", error);
      throw error;
    }
  },

  // Get user statistics
  getUserStatistics: async (timeRange = "month") => {
    try {
      const response = await api.get(
        `/statistics/users?timeRange=${timeRange}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting user statistics:", error);
      throw error;
    }
  },

  // Get dashboard overview statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get("/statistics/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error getting dashboard statistics:", error);
      throw error;
    }
  },
};
