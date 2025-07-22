<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container-custom py-3 flex justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center">
        <router-link
          to="/"
          class="flex items-center"
        >
          <img
            src="/assets/images/logo.png"
            alt="CodeX Logo"
            class="h-10"
            onerror="this.src='/assets/images/fallback-logo.png'; this.onerror=null;"
          >
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-6">
        <router-link
          to="/"
          class="text-text-dark hover:text-primary font-medium"
        >
          Trang chủ
        </router-link>
        <router-link
          to="/borrows"
          class="text-text-dark hover:text-primary font-medium"
        >
          Sách mượn
        </router-link>
        <router-link
          to="/profile"
          class="text-text-dark hover:text-primary font-medium"
        >
          Trang cá nhân
        </router-link>
        <button
          class="text-text-dark hover:text-primary font-medium"
          @click="logout"
        >
          Đăng xuất
        </button>
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
    <div
      v-if="mobileMenuOpen"
      class="md:hidden bg-white py-2 shadow-md"
    >
      <div class="container-custom flex flex-col space-y-3">
        <router-link
          to="/"
          class="text-text-dark hover:text-primary font-medium py-1"
          @click="mobileMenuOpen = false"
        >
          Home
        </router-link>
        <router-link
          to="/borrows"
          class="text-text-dark hover:text-primary font-medium py-1"
          @click="mobileMenuOpen = false"
        >
          My Borrows
        </router-link>
        <router-link
          to="/profile"
          class="text-text-dark hover:text-primary font-medium py-1"
          @click="mobileMenuOpen = false"
        >
          Profile
        </router-link>
        <button
          class="text-text-dark hover:text-primary font-medium py-1 text-left"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const logout = () => {
  // Handle logout logic here
  console.log('Logging out...');
  // Clear authentication tokens if any
  localStorage.removeItem('token');
  // Navigate to login page
  router.push('/login');
  // Close mobile menu if open
  mobileMenuOpen.value = false;
};
</script>