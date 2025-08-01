import api from "./api.js";

/**
 * Category Service - Quản lý các API calls liên quan đến thể loại sách
 */
export const categoryService = {
  /**
   * Lấy danh sách tất cả thể loại sách
   * @returns {Promise} - Promise chứa danh sách thể loại
   */
  getAllCategories: async () => {
    try {
      const response = await api.get("/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách thể loại với phân trang và lọc
   * @param {Object} params - Các tham số tìm kiếm
   * @returns {Promise} - Promise chứa danh sách thể loại
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/categories", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories with params:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết thể loại theo ID
   * @param {string} id - ID của thể loại
   * @returns {Promise} - Promise chứa thông tin thể loại
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tạo thể loại mới
   * @param {Object} categoryData - Dữ liệu thể loại
   * @returns {Promise} - Promise chứa thể loại đã tạo
   */
  create: async (categoryData) => {
    try {
      const response = await api.post("/categories", categoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thể loại
   * @param {string} id - ID của thể loại
   * @param {Object} categoryData - Dữ liệu cập nhật
   * @returns {Promise} - Promise chứa thể loại đã cập nhật
   */
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa thể loại
   * @param {string} id - ID của thể loại
   * @returns {Promise} - Promise chứa kết quả xóa
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};

export default categoryService;
