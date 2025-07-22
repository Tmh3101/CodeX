import { defineStore } from "pinia";
import { authService } from "@/services";
import { userService } from "@/services";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {
    async initialize() {
      const token = localStorage.getItem("token");
      if (token && !this.token) {
        this.token = token;
        await this.fetchUserInfo();
      }
    },

    async fetchUserInfo() {
      try {
        const userInfo = await userService.getMe();
        this.user = userInfo.data;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        this.logout(); // token có thể hết hạn
      }
    },

    async login(email, password) {
      // call API sign-in
      const response = await authService.login({ email, password });
      this.token = response.data.accessToken;

      localStorage.setItem("token", this.token);

      // call API get user info
      await this.fetchUserInfo();
    },

    logout() {
      this.user = null;
      this.token = null;

      localStorage.removeItem("token");
    },
  },
});
