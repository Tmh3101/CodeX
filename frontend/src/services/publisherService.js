import api from "./api.js";

/**
 * Publisher Service - Quản lý các API calls liên quan đến nhà xuất bản
 */
export const publisherService = {
  /**
   * Lấy danh sách nhà xuất bản với phân trang và lọc
   * @param {Object} params - Các tham số tìm kiếm
   * @returns {Promise} - Promise chứa danh sách nhà xuất bản
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/publishers", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching publishers with params:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết nhà xuất bản theo ID
   * @param {string} id - ID của nhà xuất bản
   * @returns {Promise} - Promise chứa thông tin nhà xuất bản
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/publishers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching publisher ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tạo nhà xuất bản mới
   * @param {Object} publisherData - Dữ liệu nhà xuất bản
   * @returns {Promise} - Promise chứa nhà xuất bản đã tạo
   */
  create: async (publisherData) => {
    try {
      const response = await api.post("/publishers", publisherData);
      return response.data;
    } catch (error) {
      console.error("Error creating publisher:", error);
      throw error;
    }
  },

  /**
   * Cập nhật nhà xuất bản
   * @param {string} id - ID của nhà xuất bản
   * @param {Object} publisherData - Dữ liệu cập nhật
   * @returns {Promise} - Promise chứa nhà xuất bản đã cập nhật
   */
  update: async (id, publisherData) => {
    try {
      const response = await api.put(`/publishers/${id}`, publisherData);
      return response.data;
    } catch (error) {
      console.error(`Error updating publisher ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa nhà xuất bản
   * @param {string} id - ID của nhà xuất bản
   * @returns {Promise} - Promise chứa kết quả xóa
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/publishers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting publisher ${id}:`, error);
      throw error;
    }
  },
};

export default publisherService;
