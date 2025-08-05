<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-lg fixed h-full">
      <!-- Logo/Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="align-items-center">
          <img src="@/assets/images/logo.png" alt="CodeX Logo" class="h-10" />
          <div class="ml-3">
            <p class="text-sm text-gray-500">Quản lý thư viện</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-6">
        <div class="px-4 space-y-2">
          <!-- Dashboard -->
          <router-link
            to="/staff/dashboard"
            class="nav-item"
            :class="{ 'nav-item-active': $route.path === '/staff/dashboard' }"
          >
            <i class="pi pi-home text-lg"></i>
            <span>Tổng quan</span>
          </router-link>

          <!-- Borrow Management -->
          <router-link
            to="/staff/borrows"
            class="nav-item"
            :class="{
              'nav-item-active': $route.path.startsWith('/staff/borrows'),
            }"
          >
            <i class="pi pi-book text-lg"></i>
            <span>Quản lý mượn sách</span>
          </router-link>

          <!-- User Management -->
          <router-link
            to="/staff/users"
            class="nav-item"
            :class="{
              'nav-item-active': $route.path.startsWith('/staff/users'),
            }"
          >
            <i class="pi pi-users text-lg"></i>
            <span>Quản lý người dùng</span>
          </router-link>

          <!-- Book Management -->
          <router-link
            to="/staff/books"
            class="nav-item"
            :class="{
              'nav-item-active': $route.path.startsWith('/staff/books'),
            }"
          >
            <i class="pi pi-folder text-lg"></i>
            <span>Quản lý sách</span>
          </router-link>

          <!-- Library Information -->
          <router-link
            to="/staff/library-info"
            class="nav-item"
            :class="{
              'nav-item-active': $route.path.startsWith('/staff/library-info'),
            }"
          >
            <i class="pi pi-database text-lg"></i>
            <span>Quản lý thông tin</span>
          </router-link>

          <!-- Statistics -->
          <router-link
            to="/staff/statistics"
            class="nav-item"
            :class="{
              'nav-item-active': $route.path.startsWith('/staff/statistics'),
            }"
          >
            <i class="pi pi-chart-bar text-lg"></i>
            <span>Thống kê</span>
          </router-link>
        </div>
      </nav>

      <!-- User Info & Logout -->
      <div
        class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div
              class="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
            >
              <i class="pi pi-user text-white text-sm"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-text-dark">
                {{ user?.user.firstName }} {{ user?.user.lastName }}
              </p>
              <p class="text-xs text-gray-500">{{ user?.user.email }}</p>
            </div>
          </div>
          <button
            @click="logout"
            class="text-gray-400 hover:text-red-500 transition-colors"
            title="Đăng xuất"
          >
            <i class="pi pi-sign-out text-lg"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 ml-64">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-text-dark">
              {{ pageTitle }}
            </h2>
            <p class="text-sm text-gray-600 mt-1">{{ pageDescription }}</p>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const pageTitle = computed(() => {
  const titles = {
    "/staff/dashboard": "Tổng quan",
    "/staff/borrows": "Quản lý mượn sách",
    "/staff/users": "Quản lý người dùng",
    "/staff/books": "Quản lý sách",
    "/staff/library-info": "Quản lý thông tin",
    "/staff/statistics": "Thống kê",
  };

  return titles[route.path] || "Quản lý";
});

const pageDescription = computed(() => {
  const descriptions = {
    "/staff/dashboard": "Thống kê tổng quan hệ thống thư viện",
    "/staff/borrows": "Xem và xử lý các yêu cầu mượn sách",
    "/staff/users": "Quản lý thông tin người dùng hệ thống",
    "/staff/books": "Quản lý danh mục sách trong thư viện",
    "/staff/library-info": "Quản lý thông tin thể loại, tác giả, nhà xuất bản",
    "/staff/statistics": "Thống kê và báo cáo hệ thống thư viện",
  };

  return descriptions[route.path] || "Hệ thống quản lý thư viện CodeX";
});

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #374151;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out;
}

.nav-item:hover {
  background-color: #f3f4f6;
}

.nav-item i {
  margin-right: 0.75rem;
}

.nav-item-active {
  background-color: #e60012;
  color: white;
}

.nav-item-active:hover {
  background-color: #cc000f;
}
</style>
