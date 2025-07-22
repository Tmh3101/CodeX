import api from "./api.js";

/**
 * Get me Service - Quản lý các API calls liên quan đến người dùng
 * Chứa các phương thức lấy thông tin người dùng hiện tại
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
};

export default userService;
