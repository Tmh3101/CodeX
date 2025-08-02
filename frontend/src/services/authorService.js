import api from "./api.js";

/**
 * Author Service - Quản lý các API calls liên quan đến tác giả
 */
export const authorService = {
  /**
   * Lấy danh sách tác giả với phân trang và lọc
   * @returns {Promise} - Promise chứa danh sách tác giả
   */
  getAll: async () => {
    try {
      const response = await api.get("/authors");
      return response.data;
    } catch (error) {
      console.error("Error fetching authors:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết tác giả theo ID
   * @param {string} id - ID của tác giả
   * @returns {Promise} - Promise chứa thông tin tác giả
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/authors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching author ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết tác giả theo tên
   * @param {string} name - Tên của tác giả
   * @returns {Promise} - Promise chứa thông tin tác giả
   */
  getByName: async (name) => {
    try {
      const response = await api.get(`/authors/name/${name}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching author ${name}:`, error);
      throw error;
    }
  },

  /**
   * Tạo tác giả mới
   * @param {Object} authorData - Dữ liệu tác giả
   * @returns {Promise} - Promise chứa tác giả đã tạo
   */
  create: async (authorData) => {
    try {
      const response = await api.post("/authors", authorData);
      return response.data;
    } catch (error) {
      console.error("Error creating author:", error);
      throw error;
    }
  },

  /**
   * Cập nhật tác giả
   * @param {string} id - ID của tác giả
   * @param {Object} authorData - Dữ liệu cập nhật
   * @returns {Promise} - Promise chứa tác giả đã cập nhật
   */
  update: async (id, authorData) => {
    try {
      const response = await api.put(`/authors/${id}`, authorData);
      return response.data;
    } catch (error) {
      console.error(`Error updating author ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa tác giả
   * @param {string} id - ID của tác giả
   * @returns {Promise} - Promise chứa kết quả xóa
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/authors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting author ${id}:`, error);
      throw error;
    }
  },
};

export default authorService;
