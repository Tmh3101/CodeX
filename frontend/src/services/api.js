import axios from "axios";

// Helper function để kiểm tra token có hết hạn không
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // Kiểm tra exp claim (expiration time)
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error parsing token:", error);
    return true; // Nếu không parse được token thì coi như hết hạn
  }
};

// Helper function để xóa tất cả dữ liệu auth
const clearAuthData = () => {
  localStorage.removeItem("token");
};

// Tạo instance axios với cấu hình base
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - thêm token vào header nếu có
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Kiểm tra token có hết hạn không trước khi gửi request
      if (isTokenExpired(token)) {
        console.log("Token expired, clearing auth data...");
        clearAuthData();

        // Nếu không phải trang login thì redirect
        if (window.location.pathname !== "/login") {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          window.location.href = "/login";
        }

        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý response và error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      console.log("Token expired or invalid, clearing auth data...");

      // Xóa tất cả dữ liệu auth
      clearAuthData();

      // Hiển thị thông báo cho người dùng
      if (window.location.pathname !== "/login") {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

        // Redirect to login page
        window.location.href = "/login";
      }
    }

    // Xử lý lỗi 403 (Forbidden) - có thể do quyền truy cập
    if (error.response?.status === 403) {
      console.error(
        "Access forbidden. User may not have permission for this resource."
      );

      // Nếu là endpoint /users/me và bị 403, có thể token không đúng format
      if (error.config?.url === "/users/me") {
        console.error(
          "Failed to get user info - token may be invalid or user not found"
        );

        // Có thể token bị hỏng, xóa và yêu cầu đăng nhập lại
        clearAuthData();

        if (window.location.pathname !== "/login") {
          alert("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
          window.location.href = "/login";
        }
      }
    }

    // Xử lý lỗi 500 (Server Error)
    if (error.response?.status >= 500) {
      console.error("Server error occurred");
      alert("Lỗi server. Vui lòng thử lại sau.");
    }

    return Promise.reject(error);
  }
);

export default api;
