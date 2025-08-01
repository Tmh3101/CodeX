import { defineStore } from "pinia";
import { authService, userService } from "@/services";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isStaff: (state) => state.user?.user.role === "staff",
    isReader: (state) => state.user?.user.role === "reader",
    canCheckRole: (state) => state.user !== null,
  },

  actions: {
    async initialize() {
      if (this.initialized) return;

      const token = localStorage.getItem("token");
      if (token && !this.token) {
        this.token = token;
        await this.fetchUserInfo();
      }

      this.initialized = true;
    },

    async fetchUserInfo() {
      try {
        const userInfo = await userService.getMe();
        this.user = userInfo.data;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        this.logout();
      }
    },

    async login(email, password) {
      // call API sign-in
      const response = await authService.login({ email, password });
      this.token = response.data.accessToken;

      localStorage.setItem("token", this.token);

      // call API get user info
      await this.fetchUserInfo();

      console.log("User logged in:", this.user.user.role);

      // Redirect based on role
      return this.getRedirectPath();
    },

    getRedirectPath() {
      if (this.isStaff) {
        return "/staff/dashboard";
      }
      return "/";
    },

    getStaffRedirectPath(currentPath) {
      if (this.isStaff) {
        if (currentPath.startsWith("/staff")) {
          return currentPath;
        }
        return "/staff/dashboard";
      }

      return "/";
    },

    logout() {
      this.user = null;
      this.token = null;
      this.initialized = false;

      localStorage.removeItem("token");
    },
  },
});
