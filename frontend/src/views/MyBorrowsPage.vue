<template>
  <div>
    <AppHeader />

    <div class="container-custom py-12 min-h-[550px]">
      <h1 class="text-3xl font-bold mb-6 text-center">Sách mượn của tôi</h1>
      <div class="container mx-auto px-4 py-8 max-w-7xl">
        <div v-if="loading" class="flex justify-center py-10">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
          ></div>
        </div>

        <!-- Tabs -->
        <div v-else class="mb-6">
          <div class="flex border-b">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="py-2 px-4 font-medium text-sm focus:outline-none"
              :class="
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              "
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
              <span
                v-if="getFilteredBorrows(tab.id).length"
                class="ml-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
              >
                {{ getFilteredBorrows(tab.id).length }}
              </span>
            </button>
          </div>
        </div>

        <div
          v-if="getFilteredBorrows(activeTab).length === 0"
          class="text-center py-16 bg-white rounded-lg shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h2 class="text-xl font-semibold mb-2">
            Không có sách trong danh mục này
          </h2>
          <p class="text-gray-600 mb-6">
            {{ getEmptyMessage(activeTab) }}
          </p>
          <router-link to="/" class="btn btn-primary">
            Trở về trang chủ
          </router-link>
        </div>

        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sách
                </th>

                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số lượng
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày mượn
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày trả
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  v-if="activeTab === 'pending'"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="borrow in getFilteredBorrows(activeTab)"
                :key="borrow._id"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        class="h-10 w-10 rounded"
                        :src="
                          borrow.book.coverUrl ||
                          'https://via.placeholder.com/40x40?text=Book'
                        "
                        :alt="borrow.book.title"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="font-medium text-gray-900 hover:text-primary">
                        <router-link :to="`/books/${borrow.book.bookId}`">
                          {{ borrow.book.title }}
                        </router-link>
                      </div>
                      <div class="text-sm text-gray-500">
                        {{
                          borrow.book.authors.length
                            ? borrow.book.authors.join(", ")
                            : "Unknown"
                        }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ borrow.quantity }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ borrow.borrowDate ? formatDate(borrow.borrowDate) : "-" }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ borrow.dueDate ? formatDate(borrow.dueDate) : "-" }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(getBorrowStatus(borrow))"
                  >
                    {{ getStatusName(getBorrowStatus(borrow)) }}
                  </span>
                </td>
                <td v-if="activeTab === 'pending'" class="px-6 py-4 text-sm">
                  <button
                    class="text-white bg-primary hover:bg-red-700 font-medium px-3 py-1 rounded"
                    @click="cancelBorrow(borrow._id)"
                  >
                    Hủy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { borrowService } from "../services/borrowService.js";

const borrows = ref([]);
const loading = ref(true);
const activeTab = ref("pending");

const tabs = [
  { id: "pending", name: "Đang chờ duyệt" },
  { id: "approved", name: "Đang mượn" },
  { id: "returned", name: "Đã trả" },
];

onMounted(async () => {
  try {
    // In a real app, fetch borrows from API
    const myBorrows = await borrowService.getUserBorrows();
    borrows.value = myBorrows.data || [];

    console.log("Fetched borrows:", borrows.value);
  } catch (error) {
    console.error("Error fetching borrows:", error);
  } finally {
    loading.value = false;
  }
});

const getFilteredBorrows = (tabId) => {
  switch (tabId) {
    case "pending":
      return borrows.value.filter((b) => b.status === "pending");
    case "approved":
      return borrows.value.filter((b) => b.status === "approved");
    case "returned":
      return borrows.value.filter((b) => b.status === "returned");
    default:
      return [];
  }
};

const getEmptyMessage = (tabId) => {
  switch (tabId) {
    case "pending":
      return "Bạn không có sách nào đang chờ duyệt.";
    case "approved":
      return "Bạn không có sách nào đã được duyệt.";
    case "returned":
      return "Bạn chưa trả sách nào.";
    default:
      return "Không tìm thấy sách nào trong danh mục này.";
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusName = (status) => {
  const statusMap = {
    pending: "Đang chờ duyệt",
    approved: "Đang mượn",
    returned: "Đã trả",
    overdue: "Quá hạn",
  };
  return statusMap[status] || "Không xác định";
};

const getBorrowStatus = (borrow) => {
  if (borrow.isOverdue) {
    return "overdue";
  }
  return borrow.status;
};

const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "returned":
      return "bg-gray-100 text-gray-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

const cancelBorrow = async (borrowId) => {
  try {
    await borrowService.cancelBorrow(borrowId);
    borrows.value = borrows.value.filter((b) => b._id !== borrowId);
    console.log("Borrow cancelled successfully");
  } catch (error) {
    console.error("Error cancelling borrow:", error);
  }
};
</script>
