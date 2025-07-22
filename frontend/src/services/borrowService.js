import api from "./api.js";

/**
 * Borrow Service - Quản lý các API calls liên quan đến mượn sách
 */
export const borrowService = {
  /**
   * Lấy danh sách các mượn sách của người dùng
   * @param {Object} params - Query parameters (page, limit, status, etc.)
   * @return {Promise} - Promise chứa danh sách mượn sách
   * @throws {Error} - Nếu lấy danh sách mượn sách thất bại
   */
  getUserBorrows: async (params = {}) => {
    try {
      const response = await api.get("/borrows/my-borrows/all", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching user borrows:", error);
      throw error;
    }
  },
};

export default borrowService;
