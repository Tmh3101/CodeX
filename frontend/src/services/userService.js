import api from "./api.js";

/**
 * User Service - Quản lý các API calls liên quan đến người dùng
 * Chứa các phương thức lấy thông tin người dùng hiện tại và quản lý người dùng (staff)
 */
export const userService = {
  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Promise} - Promise chứa thông tin người dùng
   * @throws {Error} - Nếu lấy thông tin người dùng thất bại
   * */
  getMe: async () => {
    try {
      const response = await api.get("/users/me/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw new Error("Failed to fetch user information.");
    }
  },

  // Get current user profile
  getCurrentProfile: async () => {
    try {
      const response = await api.get("/users/me/profile");
      return response.data;
    } catch (error) {
      console.error("Error getting current profile:", error);
      throw error;
    }
  },

  /**
   * [STAFF] Lấy danh sách tất cả người dùng
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise} - Promise chứa danh sách người dùng
   * @throws {Error} - Nếu lấy danh sách người dùng thất bại
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/users", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  /**
   * [STAFF] Lấy thông tin chi tiết người dùng theo ID
   * @param {string} id - ID của người dùng
   * @returns {Promise} - Promise chứa thông tin người dùng
   * @throws {Error} - Nếu lấy thông tin người dùng thất bại
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  /**
   * [STAFF] Tạo người dùng mới
   * @param {Object} userData - Dữ liệu người dùng
   * @returns {Promise} - Promise chứa người dùng đã tạo
   * @throws {Error} - Nếu tạo người dùng thất bại
   */
  create: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  /**
   * [STAFF] Cập nhật thông tin người dùng
   * @param {string} id - ID của người dùng
   * @param {Object} userData - Dữ liệu cập nhật
   * @returns {Promise} - Promise chứa người dùng đã cập nhật
   * @throws {Error} - Nếu cập nhật người dùng thất bại
   */
  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  /**
   * [STAFF] Chuyển đổi trạng thái hoạt động của người dùng
   * @param {string} id - ID của người dùng
   * @returns {Promise} - Promise chứa kết quả chuyển đổi trạng thái
   * @throws {Error} - Nếu chuyển đổi trạng thái thất bại
   */
  toggleStatus: async (id) => {
    try {
      const response = await api.put(`/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling user ${id} status:`, error);
      throw error;
    }
  },

  /**
   * [STAFF] Xóa người dùng
   * @param {string} id - ID của người dùng
   * @returns {Promise} - Promise chứa kết quả xóa
   * @throws {Error} - Nếu xóa người dùng thất bại
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin người dùng hiện tại
   * @param {Object} profileData - Dữ liệu cập nhật thông tin người dùng
   * @returns {Promise} - Promise chứa thông tin người dùng đã cập nhật
   * @throws {Error} - Nếu cập nhật thông tin người dùng thất bại
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/users/me/update-profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put("/users/me/change-password", passwordData);
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (formData) => {
    try {
      const response = await api.put("/users/me/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },

  // Delete avatar
  deleteAvatar: async () => {
    try {
      const response = await api.put("/users/me/delete-avatar");
      return response.data;
    } catch (error) {
      console.error("Error deleting avatar:", error);
      throw error;
    }
  },
};

export default userService;
