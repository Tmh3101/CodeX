import api from "./api.js";

/**
 * Book Service - Quản lý các API calls liên quan đến sách
 */
export const bookService = {
  /**
   * Lấy danh sách tất cả sách
   * @param {Object} params - Query parameters (page, limit, search, category, etc.)
   * @returns {Promise} - Promise chứa danh sách sách
   */
  getAllBooks: async (params = {}) => {
    try {
      const response = await api.get("/books", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một cuốn sách
   * @param {string} bookId - ID của cuốn sách
   * @returns {Promise} - Promise chứa thông tin sách
   */
  getBookById: async (bookId) => {
    try {
      const response = await api.get(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching book:", error);
      throw error;
    }
  },

  /**
   * Tạo sách mới (dành cho admin/staff)
   * @param {Object} bookData - Dữ liệu sách mới
   * @returns {Promise} - Promise chứa thông tin sách đã tạo
   */
  createBook: async (bookData) => {
    try {
      const response = await api.post("/books", bookData);
      return response.data;
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin sách
   * @param {string} bookId - ID của cuốn sách
   * @param {Object} bookData - Dữ liệu cập nhật
   * @returns {Promise} - Promise chứa thông tin sách đã cập nhật
   */
  updateBook: async (bookId, bookData) => {
    try {
      const response = await api.put(`/books/${bookId}`, bookData);
      return response.data;
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  },

  /**
   * Xóa sách
   * @param {string} bookId - ID của cuốn sách
   * @returns {Promise} - Promise xác nhận xóa
   */
  deleteBook: async (bookId) => {
    try {
      const response = await api.delete(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  },

  /**
   * Tìm kiếm sách
   * @param {string} query - Từ khóa tìm kiếm
   * @param {Object} filters - Bộ lọc (category, author, publisher, etc.)
   * @returns {Promise} - Promise chứa kết quả tìm kiếm
   */
  searchBooks: async (query, filters = {}) => {
    try {
      const params = {
        search: query,
        ...filters,
      };
      const response = await api.get("/books/search", { params });
      return response.data;
    } catch (error) {
      console.error("Error searching books:", error);
      throw error;
    }
  },

  /**
   * Lấy sách theo category
   * @param {string} categoryId - ID của category
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise chứa danh sách sách trong category
   */
  getBooksByCategory: async (categoryId, params = {}) => {
    try {
      const response = await api.get(`/books/category/${categoryId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching books by category:", error);
      throw error;
    }
  },
};

export default bookService;
