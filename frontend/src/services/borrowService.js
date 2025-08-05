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

  /**
   * Mượn sách
   * @param {Object} borrowData - Dữ liệu mượn sách (bao gồm bookId, quantity, note)
   * @return {Promise} - Promise chứa thông tin mượn sách mới
   * @throws {Error} - Nếu mượn sách thất bại
   */
  borrowBook: async (borrowData) => {
    try {
      const response = await api.post("/borrows", borrowData);
      return response.data;
    } catch (error) {
      console.error("Error borrowing book:", error);
      throw error;
    }
  },

  /**
   * Hủy yêu cầu mượn sách
   * @param {string} borrowId - ID của yêu cầu mượn sách
   * @return {Promise} - Promise chứa thông tin yêu cầu đã hủy
   * @throws {Error} - Nếu hủy yêu cầu mượn sách thất bại
   */
  cancelBorrow: async (borrowId) => {
    try {
      const response = await api.post(`/borrows/cancel/${borrowId}`);
      return response.data;
    } catch (error) {
      console.error("Error canceling borrow request:", error);
      throw error;
    }
  },

  /**
   * [STAFF] Lấy tất cả danh sách mượn sách
   * @param {Object} params - Query parameters (page, limit, status, etc.)
   * @return {Promise} - Promise chứa danh sách mượn sách
   * @throws {Error} - Nếu lấy danh sách mượn sách thất bại
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/borrows", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching all borrows:", error);
      throw error;
    }
  },

  /**
   * [STAFF] Duyệt yêu cầu mượn sách
   * @param {string} borrowId - ID của yêu cầu mượn sách
   * @return {Promise} - Promise chứa thông tin yêu cầu đã duyệt
   * @throws {Error} - Nếu duyệt yêu cầu mượn sách thất bại
   */
  approve: async (borrowId) => {
    try {
      const response = await api.post(`/borrows/approve/${borrowId}`);
      return response.data;
    } catch (error) {
      console.error("Error approving borrow request:", error);
      throw error;
    }
  },

  /**
   * [STAFF] Từ chối yêu cầu mượn sách
   * @param {string} borrowId - ID của yêu cầu mượn sách
   * @return {Promise} - Promise chứa thông tin yêu cầu đã từ chối
   * @throws {Error} - Nếu từ chối yêu cầu mượn sách thất bại
   */
  reject: async (borrowId) => {
    try {
      const response = await api.post(`/borrows/reject/${borrowId}`);
      return response.data;
    } catch (error) {
      console.error("Error rejecting borrow request:", error);
      throw error;
    }
  },

  /**
   * [STAFF] Xác nhận đã trả sách (/confirm-return)
   * @param {string} borrowId - ID của yêu cầu mượn sách
   * @return {Promise} - Promise chứa thông tin đã xác nhận trả sách
   * @throws {Error} - Nếu xác nhận trả sách thất bại
   */
  confirmReturn: async (borrowId) => {
    try {
      const response = await api.post(`/borrows/confirm-return/${borrowId}`);
      return response.data;
    } catch (error) {
      console.error("Error confirming return of borrow:", error);
      throw error;
    }
  },
};

export default borrowService;
