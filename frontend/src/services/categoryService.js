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
};

export default categoryService;
