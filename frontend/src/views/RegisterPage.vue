<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div
      class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div class="text-center mb-8">
          <img
            src="@/assets/images/logo.png"
            alt="CodeX Logo"
            class="h-12 mx-auto mb-4"
            onerror="this.src='/assets/images/fallback-logo.png'; this.onerror=null;"
          />
          <h2 class="text-3xl font-bold text-text-dark">Đăng ký tài khoản</h2>
          <p class="mt-2 text-sm text-gray-600">
            Tham gia để khám phá kho sách phong phú và tiện lợi.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleRegister">
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm"
          >
            {{ error }}
          </div>

          <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div>
              <label
                for="firstName"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Tên
              </label>
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                autocomplete="firstName"
                placeholder="Nhập tên của bạn"
                required
                class="placeholder:text-sm placeholder:italic appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                for="lastName"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Họ
              </label>
              <input
                id="lastName"
                v-model="lastName"
                type="text"
                autocomplete="family-name"
                placeholder="Nhập họ của bạn"
                required
                class="placeholder:text-sm placeholder:italic appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
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
              class="placeholder:text-sm placeholder:italic appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
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
              autocomplete="new-password"
              placeholder="Nhập mật khẩu của bạn"
              required
              class="placeholder:text-sm placeholder:italic appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Nhập lại mật khẩu
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Nhập lại mật khẩu của bạn"
              required
              class="placeholder:text-sm placeholder:italic appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              v-model="acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              Tôi đồng ý với
              <a href="#" class="text-primary hover:text-primary-hover">
                điều khoản sử dụng</a
              >
              và
              <a href="#" class="text-primary hover:text-primary-hover"
                >chính sách bảo mật</a
              >
            </label>
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
                Đang tạo tài khoản...
              </span>
              <span v-else> Tạo tài khoản </span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Đã có tài khoản?
            <router-link
              to="/login"
              class="font-medium text-primary hover:text-primary-hover"
            >
              Đăng nhập
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
import { useRouter } from "vue-router";
import AppFooter from "../components/AppFooter.vue";
import { authService } from "@/services";

const router = useRouter();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const acceptTerms = ref(false);
const isLoading = ref(false);
const error = ref("");

const handleRegister = async () => {
  // Basic form validation
  if (
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    error.value = "Please fill in all fields.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match.";
    return;
  }

  if (!acceptTerms.value) {
    error.value = "You must accept the terms and conditions.";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    const response = await authService.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });

    if (response.success) {
      // Redirect to login page after successful registration
      router.push("/login");
    } else {
      error.value =
        response.message || "Registration failed. Please try again.";
    }

    // For demo purposes, simulate a successful registration
    alert(`Account created for ${email.value}! Please sign in.`);
    router.push("/login");
  } catch (err) {
    console.error("Registration error:", err);
    error.value = "An error occurred during registration. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
