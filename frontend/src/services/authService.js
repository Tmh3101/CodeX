import api from "./api.js";

/**
 * Auth Service - Quản lý các API calls liên quan đến xác thực người dùng
 * Chứa các phương thức đăng nhập, đăng ký, và lấy thông tin người dùng
 */
export const authService = {
  /**
   * Đăng nhập người dùng
   * @param {Object} credentials - Thông tin đăng nhập (email, password)
   * @returns {Promise} - Promise chứa thông tin người dùng và token
   * @throws {Error} - Nếu đăng nhập thất bại
   */
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/sign-in", credentials);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error(
        error.response.data.message ||
          "Login failed. Please check your credentials."
      );
    }
  },
  /**
   * Đăng ký người dùng mới
   * @param {Object} userData - Thông tin người dùng mới (name, email, password)
   * @returns {Promise} - Promise chứa thông tin người dùng đã đăng ký
   * @throws {Error} - Nếu đăng ký thất bại
   */
  register: async (userData) => {
    try {
      const response = await api.post("/auth/sign-up", userData);
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw new Error(
        error.response.data.message || "Registration failed. Please try again."
      );
    }
  },
};

export default authService;
