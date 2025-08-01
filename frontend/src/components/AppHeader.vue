<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container-custom py-3 flex justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center">
          <img src="@/assets/images/logo.png" alt="CodeX Logo" class="h-16" />
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-14">
        <!-- Authenticated user menu -->
        <template v-if="isAuthenticated">
          <router-link
            to="/my-borrows"
            class="text-text-dark hover:text-primary hover:underline font-medium"
          >
            Sách mượn
          </router-link>

          <!-- User dropdown -->
          <div class="relative" ref="userDropdown">
            <button
              @click="toggleUserDropdown"
              class="flex items-center justify-center w-10 h-10 rounded-full border-[1px] border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 focus:outline-none"
            >
              <i class="pi pi-user text-sm"></i>
            </button>

            <!-- Dropdown menu -->
            <div
              v-if="userDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-text-dark hover:bg-primary hover:text-white"
                @click="closeUserDropdown"
              >
                Hồ sơ
              </router-link>
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-text-dark hover:bg-primary hover:text-white"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </template>

        <!-- Guest user menu -->
        <template v-else>
          <router-link
            to="/register"
            class="text-primary hover:underline font-medium"
          >
            Đăng ký
          </router-link>
          <router-link
            to="/login"
            class="text-text-dark hover:underline font-medium"
          >
            Đăng nhập
          </router-link>
        </template>
      </nav>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden text-text-dark focus:outline-none"
        @click="toggleMobileMenu"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            v-if="!mobileMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white py-2 shadow-md">
      <div class="container-custom flex flex-col space-y-3">
        <router-link
          to="/"
          class="text-text-dark hover:text-primary font-medium py-1"
          @click="mobileMenuOpen = false"
        >
          Trang chủ
        </router-link>

        <!-- Authenticated mobile menu -->
        <template v-if="isAuthenticated">
          <router-link
            to="/borrows"
            class="text-text-dark hover:text-primary font-medium py-1"
            @click="mobileMenuOpen = false"
          >
            Sách mượn
          </router-link>
          <router-link
            to="/profile"
            class="text-text-dark hover:text-primary font-medium py-1"
            @click="mobileMenuOpen = false"
          >
            Hồ sơ
          </router-link>
          <button
            class="text-text-dark hover:text-primary font-medium py-1 text-left"
            @click="logout"
          >
            Đăng xuất
          </button>
        </template>

        <!-- Guest mobile menu -->
        <template v-else>
          <router-link
            to="/login"
            class="text-text-dark hover:text-primary font-medium py-1"
            @click="mobileMenuOpen = false"
          >
            Đăng nhập
          </router-link>
          <router-link
            to="/register"
            class="text-text-dark hover:text-primary font-medium py-1"
            @click="mobileMenuOpen = false"
          >
            Đăng ký
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const mobileMenuOpen = ref(false);
const userDropdownOpen = ref(false);
const userDropdown = ref(null);

// Computed property to check authentication status
const isAuthenticated = computed(() => authStore.token !== null);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const toggleUserDropdown = () => {
  userDropdownOpen.value = !userDropdownOpen.value;
};

const closeUserDropdown = () => {
  userDropdownOpen.value = false;
};

const logout = () => {
  authStore.logout();
  router.push("/");
  mobileMenuOpen.value = false;
  userDropdownOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (userDropdown.value && !userDropdown.value.contains(event.target)) {
    userDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
