<template>
  <StaffLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Quản lý mượn sách</h1>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tình trạng
            </label>
            <select
              v-model="filters.status"
              @change="fetchBorrows"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="borrowed">Đang mượn</option>
              <option value="returned">Đã trả</option>
              <option value="overdue">Quá hạn</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              v-model="filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="Tên sách, tên người mượn..."
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              v-model="filters.fromDate"
              @change="fetchBorrows"
              type="date"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              v-model="filters.toDate"
              @change="fetchBorrows"
              type="date"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <!-- Borrows Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
          <p class="mt-2 text-gray-600">Đang tải...</p>
        </div>

        <div v-else-if="borrows.length === 0" class="p-8 text-center">
          <i class="pi pi-inbox text-4xl text-gray-300"></i>
          <p class="mt-2 text-gray-600">Không có dữ liệu</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Người mượn
                </th>
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
                  Hạn trả
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tình trạng
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="borrow in borrows" :key="borrow._id">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <button
                        @click="viewDetails(borrow)"
                        class="text-indigo-600 hover:text-indigo-900"
                        title="Xem chi tiết"
                      >
                        <i class="pi pi-eye"></i>
                      </button>
                    </div>
                    <div class="ml-6">
                      <div class="font-medium text-gray-900 hover:text-primary">
                        {{ borrow.reader.user?.firstName }}
                        {{ borrow.reader.user?.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ borrow.reader.user?.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ borrow.book?.title }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ borrow.book?.author?.name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ borrow.quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(borrow.borrowDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(borrow.returnDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(borrow.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getStatusText(borrow.status) }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                >
                  <button
                    v-if="borrow.status === 'pending'"
                    @click="approveBorrow(borrow._id)"
                    class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    <i class="pi pi-check"></i>
                  </button>
                  <button
                    v-if="borrow.status === 'pending'"
                    @click="rejectBorrow(borrow._id)"
                    class="bg-white text-red-600 border border-red-600 px-3 py-1 rounded-md hover:bg-red-100"
                  >
                    <i class="pi pi-times"></i>
                  </button>
                  <button
                    v-if="borrow.status === 'borrowed'"
                    @click="markAsReturned(borrow._id)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Đã trả
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6"
        >
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Hiển thị {{ (currentPage - 1) * limit + 1 }} đến
              {{ Math.min(currentPage * limit, totalItems) }}
              trong {{ totalItems }} kết quả
            </div>
            <div class="flex space-x-2">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              <span class="px-3 py-1 bg-primary text-white rounded-md text-sm">
                {{ currentPage }}
              </span>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeDetailModal"
    >
      <div
        class="relative top-20 mx-auto border w-96 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="px-6 py-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900">
            Chi tiết mượn sách
          </h2>
        </div>
        <div class="mt-2 p-5">
          <div v-if="selectedBorrow" class="space-y-3">
            <div>
              <span class="font-bold">Người mượn:</span>
              {{ selectedBorrow.reader.user?.firstName }}
              {{ selectedBorrow.reader.user?.lastName }}
            </div>
            <div>
              <span class="font-bold">Email:</span>
              {{ selectedBorrow.reader.user?.email }}
            </div>
            <div>
              <span class="font-bold">Sách:</span>
              {{ selectedBorrow.book?.title }}
            </div>
            <div>
              <span class="font-bold">Tác giả:</span>
              {{
                selectedBorrow.book?.authors
                  ? selectedBorrow.book.authors.join(", ")
                  : "Không rõ"
              }}
            </div>
            <div>
              <span class="font-bold">Số lượng:</span>
              {{ selectedBorrow.quantity }}
            </div>
            <div>
              <span class="font-bold">Ngày mượn:</span>
              {{ formatDate(selectedBorrow.borrowDate) }}
            </div>
            <div>
              <span class="font-bold">Hạn trả:</span>
              {{ formatDate(selectedBorrow.returnDate) }}
            </div>
            <div v-if="selectedBorrow.note">
              <span class="font-bold">Ghi chú:</span>
              {{ selectedBorrow.note }}
            </div>
            <div>
              <span class="font-bold">Tình trạng:</span>
              <span
                :class="getStatusClass(selectedBorrow.status)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2"
              >
                {{ getStatusText(selectedBorrow.status) }}
              </span>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button
              @click="closeDetailModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </StaffLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { debounce } from "lodash";
import StaffLayout from "@/layouts/StaffLayout.vue";
import { borrowService } from "@/services/borrowService";

const loading = ref(false);
const borrows = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);

const showDetailModal = ref(false);
const selectedBorrow = ref(null);

const filters = reactive({
  status: "",
  search: "",
  fromDate: "",
  toDate: "",
});

const fetchBorrows = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: limit.value,
      ...filters,
    };

    // Remove empty filters
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    const response = await borrowService.getAll(params);
    borrows.value = response.data.borrows || [];
    totalPages.value = response.data.totalPages || 1;
    totalItems.value = response.data.totalItems || 0;
  } catch (error) {
    console.error("Error fetching borrows:", error);
    borrows.value = [];
  } finally {
    loading.value = false;
  }

  console.log("Borrows", borrows.value);
};

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  fetchBorrows();
}, 500);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchBorrows();
  }
};

const approveBorrow = async (borrowId) => {
  try {
    await borrowService.approve(borrowId);
    fetchBorrows();
  } catch (error) {
    console.error("Error approving borrow:", error);
  }
};

const rejectBorrow = async (borrowId) => {
  try {
    await borrowService.reject(borrowId);
    fetchBorrows();
  } catch (error) {
    console.error("Error rejecting borrow:", error);
  }
};

const markAsReturned = async (borrowId) => {
  try {
    await borrowService.markAsReturned(borrowId);
    fetchBorrows();
  } catch (error) {
    console.error("Error marking as returned:", error);
  }
};

const viewDetails = (borrow) => {
  selectedBorrow.value = borrow;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedBorrow.value = null;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const getStatusText = (status) => {
  const statusMap = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Đã từ chối",
    borrowed: "Đang mượn",
    returned: "Đã trả",
    overdue: "Quá hạn",
  };
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const classMap = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    borrowed: "bg-green-100 text-green-800",
    returned: "bg-gray-100 text-gray-800",
    overdue: "bg-red-100 text-red-800",
  };
  return classMap[status] || "bg-gray-100 text-gray-800";
};

onMounted(() => {
  fetchBorrows();
});
</script>
