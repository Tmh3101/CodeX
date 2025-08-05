<template>
  <StaffLayout>
    <div class="space-y-6">
      <!-- Welcome Card -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-2">
          Chào mừng, {{ staff.user?.firstName }} {{ staff.user?.lastName }}!
        </h3>
        <p class="text-gray-600">
          Chào mừng bạn đến với hệ thống quản lý thư viện CodeX. Hãy bắt đầu
          quản lý thư viện của bạn.
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Total Books -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <i class="pi pi-book text-blue-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng số sách</p>
              <p class="text-2xl font-bold text-gray-900">{{ booksCount }}</p>
            </div>
          </div>
        </div>

        <!-- Pending Requests -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100">
              <i class="pi pi-clock text-yellow-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ pendingBorrowsCount }}
              </p>
            </div>
          </div>
        </div>

        <!-- Active Borrows -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <i class="pi pi-check text-green-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Đang mượn</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ approvedBorrowsCount }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Overdue -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100">
              <i class="pi pi-exclamation-triangle text-orange-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Quá hạn</p>
              <p class="text-2xl font-bold text-gray-900">{{ overdueCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4">Thao tác nhanh</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link
            to="/staff/borrows"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="pi pi-book text-primary text-xl mr-3"></i>
            <div>
              <p class="font-medium">Xử lý mượn sách</p>
              <p class="text-sm text-gray-600">Duyệt yêu cầu mượn sách</p>
            </div>
          </router-link>

          <router-link
            to="/staff/books"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="pi pi-plus text-primary text-xl mr-3"></i>
            <div>
              <p class="font-medium">Thêm sách mới</p>
              <p class="text-sm text-gray-600">Bổ sung sách vào thư viện</p>
            </div>
          </router-link>

          <router-link
            to="/staff/users"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="pi pi-user-plus text-primary text-xl mr-3"></i>
            <div>
              <p class="font-medium">Quản lý người dùng</p>
              <p class="text-sm text-gray-600">Thêm, sửa thông tin user</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </StaffLayout>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import StaffLayout from "@/layouts/StaffLayout.vue";
import { bookService, borrowService, userService } from "@/services";

const authStore = useAuthStore();

const staff = computed(() => authStore.user);
const booksCount = ref(0);
const approvedBorrowsCount = ref(0);
const pendingBorrowsCount = ref(0);
const overdueCount = ref(0);

const fetchStats = async () => {
  try {
    const [books, borrows] = await Promise.all([
      bookService.getAll(),
      borrowService.getAll(),
    ]);
    booksCount.value = books.data.totalBooks;
    approvedBorrowsCount.value = borrows.data.approvedQuantity;
    pendingBorrowsCount.value = borrows.data.pendingQuantity;
    overdueCount.value = borrows.data.overdueQuantity;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};

onMounted(() => {
  fetchStats();
});
</script>
