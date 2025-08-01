<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div
      class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div class="text-center mb-6">
          <img
            src="@/assets/images/logo.png"
            alt="CodeX Logo"
            class="h-12 mx-auto mb-4"
            onerror="this.src='/assets/images/fallback-logo.png'; this.onerror=null;"
          />
          <h2 class="text-3xl font-bold text-text-dark">Đăng nhập</h2>
          <p class="mt-2 text-sm text-gray-600">
            Nhập thông tin đăng nhập của bạn để tiếp tục.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm"
          >
            {{ error }}
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="Nhập địa chỉ email của bạn"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 placeholder:text-sm placeholder:italic focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Nhập mật khẩu của bạn"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 placeholder:text-sm placeholder:italic focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-primary hover:text-primary-hover"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang đăng nhập...
              </span>
              <span v-else>Đăng nhập</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Chưa có tài khoản?
            <router-link
              to="/register"
              class="font-medium text-primary hover:text-primary-hover"
            >
              Đăng ký ngay
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from "vue";
import AppFooter from "../components/AppFooter.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const isLoading = ref(false);
const error = ref("");

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = "Please enter both email and password.";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    const redirectPath = await auth.login(email.value, password.value);
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.push("/");
    }
  } catch (err) {
    console.error("Login error:", err);
    error.value = err || "An error occurred during login. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
