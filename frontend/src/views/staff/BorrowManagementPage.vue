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
              <option value="approved">Đang mượn</option>
              <option value="returned">Đã trả</option>
              <option value="rejected">Đã từ chối</option>
              <option value="cancelled">Đã hủy</option>
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
                  {{ formatDate(borrow.dueDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(getBorrowStatus(borrow))"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getStatusText(getBorrowStatus(borrow)) }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4"
                >
                  <button
                    v-if="borrow.status === 'pending'"
                    @click="approveBorrow(borrow._id)"
                    class="text-green-600 hover:text-green-900"
                  >
                    <i class="pi pi-check"></i>
                  </button>
                  <button
                    v-if="borrow.status === 'pending'"
                    @click="rejectBorrow(borrow._id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <i class="pi pi-times"></i>
                  </button>
                  <button
                    v-if="borrow.status === 'approved'"
                    @click="confirmReturn(borrow._id)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    <i class="pi pi-check-circle"></i>
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
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="closeDetailModal"
    >
      <div
        class="relative w-full max-w-2xl bg-white rounded-lg shadow-xl"
        @click.stop
      >
        <!-- Modal Header -->
        <div
          class="px-6 py-4 border-b border-gray-200 rounded-t-lg bg-gradient-to-r from-blue-50 to-indigo-50"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                >
                  <i class="pi pi-book text-blue-600"></i>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">
                    Chi tiết mượn sách
                  </h2>
                  <p class="text-sm text-gray-600">
                    Thông tin chi tiết về giao dịch mượn sách
                  </p>
                </div>
              </div>
              <!-- Status Badge -->
              <div class="ml-24 text-center">
                <span
                  :class="getStatusClass(selectedBorrow.status)"
                  class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2"
                >
                  <div
                    :class="getStatusDotClass(selectedBorrow.status)"
                    class="w-2 h-2 rounded-full mr-2"
                  ></div>
                  {{ getStatusText(selectedBorrow.status) }}
                </span>
              </div>
            </div>
            <button
              @click="closeDetailModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div v-if="selectedBorrow" class="px-2 py-2">
          <!-- Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column - Reader & Book Info -->
            <div class="space-y-6">
              <!-- Reader Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3
                  class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                >
                  <i class="pi pi-user text-blue-600 mr-2"></i>
                  Thông tin người mượn
                </h3>
                <div>
                  <div class="font-bold text-gray-900">
                    {{ selectedBorrow.reader.user?.firstName }}
                    {{ selectedBorrow.reader.user?.lastName }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ selectedBorrow.reader.user?.email }}
                  </div>
                  <div v-if="selectedBorrow.reader.user?.phone" class="text-sm">
                    <span class="font-medium text-gray-700"
                      >Số điện thoại:</span
                    >
                    <span class="text-gray-600 ml-2">{{
                      selectedBorrow.reader.user.phone
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Book Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3
                  class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                >
                  <i class="pi pi-book text-green-600 mr-2"></i>
                  Thông tin sách
                </h3>
                <div class="space-y-3">
                  <div class="flex">
                    <div
                      class="w-16 h-20 bg-gradient-to-b from-gray-200 to-gray-300 rounded-md flex items-center justify-center mr-4"
                    >
                      <img
                        v-if="selectedBorrow.book?.coverUrl"
                        :src="selectedBorrow.book.coverUrl"
                        alt="Book Cover"
                        class="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div class="flex-1">
                      <div class="font-medium text-gray-900 text-sm">
                        {{ selectedBorrow.book?.title }}
                      </div>
                      <div class="text-sm text-gray-600 mt-1">
                        <span class="font-medium">Tác giả:</span>
                        {{ formatAuthors(selectedBorrow.book?.authors) }}
                      </div>
                      <div class="text-sm text-gray-600 mt-1">
                        <span class="font-medium">Thể loại:</span>
                        {{ formatCategories(selectedBorrow.book?.categories) }}
                      </div>
                      <div
                        v-if="selectedBorrow.book?.publisher"
                        class="text-sm text-gray-600 mt-1"
                      >
                        <span class="font-medium">NXB:</span>
                        {{ selectedBorrow.book.publisher }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Transaction Details -->
            <div class="space-y-6">
              <!-- Borrow Details -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3
                  class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                >
                  <i class="pi pi-calendar text-orange-600 mr-2"></i>
                  Chi tiết mượn sách
                </h3>
                <div>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="bg-white rounded-lg">
                      <div class="text-xs font-medium text-gray-500 mb-1">
                        Số lượng
                      </div>
                      <div class="text-lg font-semibold text-gray-900">
                        {{ selectedBorrow.quantity }} cuốn
                      </div>
                    </div>

                    <div class="bg-white rounded-lg">
                      <div class="text-xs font-medium text-gray-500 mb-1">
                        Ngày mượn
                      </div>
                      <div class="text-lg font-semibold text-gray-900">
                        {{ formatDate(selectedBorrow.borrowDate) }}
                      </div>
                    </div>

                    <div class="bg-white rounded-lg">
                      <div class="text-xs font-medium text-gray-500 mb-1">
                        Hạn trả
                      </div>
                      <div class="text-lg font-semibold text-gray-900">
                        {{ formatDate(selectedBorrow.dueDate) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Staff Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3
                  class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                >
                  <i class="pi pi-users text-purple-600 mr-2"></i>
                  Thông tin nhân viên
                </h3>
                <div class="space-y-4">
                  <!-- Approved Staff -->
                  <div
                    v-if="selectedBorrow.approvedStaff"
                    class="bg-white rounded-lg"
                  >
                    <div class="text-xs font-medium text-gray-500 mb-2">
                      Nhân viên duyệt mượn
                    </div>
                    <div class="flex items-center">
                      <div>
                        <div class="font-medium text-gray-900 text-sm">
                          {{ selectedBorrow.approvedStaff.user.firstName }}
                          {{ selectedBorrow.approvedStaff.user.lastName }}
                        </div>
                        <div class="text-xs text-gray-600">
                          {{ selectedBorrow.approvedStaff.user.email }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Returned Staff -->
                  <div
                    v-if="selectedBorrow.returnedStaff"
                    class="bg-white rounded-lg"
                  >
                    <div class="text-xs font-medium text-gray-500 mb-2">
                      Nhân viên xác nhận trả
                    </div>
                    <div class="flex items-center">
                      <div>
                        <div class="font-medium text-gray-900 text-sm">
                          {{ selectedBorrow.returnedStaff.user.firstName }}
                          {{ selectedBorrow.returnedStaff.user.lastName }}
                        </div>
                        <div class="text-xs text-gray-600">
                          {{ selectedBorrow.returnedStaff.user.email }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- No staff info -->
                  <div
                    v-if="
                      !selectedBorrow.approvedStaff &&
                      !selectedBorrow.returnedStaff
                    "
                    class="bg-white p-3 rounded-lg text-center"
                  >
                    <div class="text-gray-500 text-sm">
                      <i class="pi pi-info-circle mr-2"></i>
                      Chưa có thông tin nhân viên xử lý
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Note Section -->
          <div
            v-if="selectedBorrow.note"
            class="bg-blue-50 rounded-lg px-4 py-2"
          >
            <h3
              class="text-lg font-semibold text-gray-900 mb-2 flex items-center"
            >
              <i class="pi pi-comment text-blue-600 mr-2"></i>
              Ghi chú
            </h3>
            <p class="text-gray-700 italic">{{ selectedBorrow.note }}</p>
          </div>

          <!-- Timeline -->
          <div class="mt-2 bg-gray-50 rounded-lg px-4 py-2">
            <h3
              class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
            >
              <i class="pi pi-clock text-indigo-600 mr-2"></i>
              Lịch sử giao dịch
            </h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <div class="text-sm">
                  <span class="font-medium">Yêu cầu mượn sách:</span>
                  <span class="text-gray-600 ml-2">{{
                    formatDateTime(selectedBorrow.createdAt)
                  }}</span>
                </div>
              </div>
              <div v-if="selectedBorrow.approvedAt" class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div class="text-sm">
                  <span class="font-medium">Được duyệt:</span>
                  <span class="text-gray-600 ml-2">{{
                    formatDateTime(selectedBorrow.approvedAt)
                  }}</span>
                </div>
              </div>
              <div
                v-if="selectedBorrow.actualReturnDate"
                class="flex items-center"
              >
                <div class="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <div class="text-sm">
                  <span class="font-medium">Đã trả sách:</span>
                  <span class="text-gray-600 ml-2">{{
                    formatDateTime(selectedBorrow.actualReturnDate)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 rounded-b-lg bg-gray-50">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">
              ID: {{ selectedBorrow._id }}
            </div>
            <div class="flex space-x-3">
              <button
                @click="closeDetailModal"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Đóng
              </button>
              <button
                v-if="selectedBorrow.status === 'pending'"
                @click="handleApproveFromModal"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <i class="pi pi-check mr-2"></i>
                Duyệt mượn
              </button>
              <button
                v-if="selectedBorrow.status === 'borrowed'"
                @click="handleReturnFromModal"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <i class="pi pi-check-circle mr-2"></i>
                Xác nhận trả
              </button>
            </div>
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

// Trạng thái mặc định là "pending"
const filters = reactive({
  status: "pending",
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

const confirmReturn = async (borrowId) => {
  const borrow = borrows.value.find((b) => b._id === borrowId);
  if (
    !confirm(
      `Xác nhận độc giả "${borrow.reader.user.firstName} ${borrow.reader.user.lastName}" đã trả ${borrow.quantity} sách "${borrow.book.title}"`
    )
  ) {
    return;
  }
  try {
    await borrowService.confirmReturn(borrowId);
    fetchBorrows();
  } catch (error) {
    console.error("Error confirming return:", error);
  }
};

const viewDetails = (borrow) => {
  selectedBorrow.value = borrow;
  console.log("Selected borrow for details:", borrow);
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

const getBorrowStatus = (borrow) => {
  if (borrow.isOverdue) return "overdue";
  return borrow.status;
};

const getStatusText = (status) => {
  const statusMap = {
    pending: "Chờ duyệt",
    approved: "Đang mượn",
    rejected: "Đã từ chối",
    returned: "Đã trả",
    cancelled: "Đã hủy",
    overdue: "Quá hạn",
  };
  return statusMap[status] || status;
};

const formatAuthors = (authors) => {
  if (!authors || !Array.isArray(authors)) return "Không rõ";
  return authors
    .map((author) => (typeof author === "string" ? author : author.name))
    .join(", ");
};

const formatCategories = (categories) => {
  if (!categories || !Array.isArray(categories)) return "Không rõ";
  return categories
    .map((category) =>
      typeof category === "string" ? category : category.name
    )
    .join(", ");
};

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("vi-VN");
};

const getDaysRemainingClass = () => {
  if (!selectedBorrow.value?.returnDate) return "text-gray-900";

  const returnDate = new Date(selectedBorrow.value.returnDate);
  const today = new Date();
  const diffTime = returnDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 3) {
    return "text-green-600";
  } else if (diffDays > 0) {
    return "text-yellow-600";
  } else {
    return "text-red-600";
  }
};

const getDaysRemainingIcon = () => {
  if (!selectedBorrow.value?.returnDate) return "";

  const returnDate = new Date(selectedBorrow.value.returnDate);
  const today = new Date();
  const diffTime = returnDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 3) {
    return "pi pi-check-circle text-green-600";
  } else if (diffDays > 0) {
    return "pi pi-exclamation-triangle text-yellow-600";
  } else {
    return "pi pi-times-circle text-red-600";
  }
};

const getStatusDotClass = (status) => {
  const classMap = {
    pending: "bg-yellow-400",
    approved: "bg-green-400",
    rejected: "bg-red-400",
    borrowed: "bg-green-400",
    returned: "bg-gray-400",
    overdue: "bg-red-400",
  };
  return classMap[status] || "bg-gray-400";
};

// Enhanced status class with borders
const getStatusClass = (status) => {
  const classMap = {
    pending: "bg-yellow-50 text-yellow-800 border-yellow-200",
    approved: "bg-green-50 text-green-800 border-green-200",
    rejected: "bg-red-50 text-red-800 border-red-200",
    returned: "bg-gray-50 text-gray-800 border-gray-200",
    borrowed: "bg-green-50 text-green-800 border-green-200",
    overdue: "bg-red-50 text-red-800 border-red-200",
  };
  return classMap[status] || "bg-gray-50 text-gray-800 border-gray-200";
};

// Handle actions from modal
const handleApproveFromModal = async () => {
  await approveBorrow(selectedBorrow.value._id);
  closeDetailModal();
};

const handleReturnFromModal = async () => {
  await confirmReturn(selectedBorrow.value._id);
  closeDetailModal();
};

onMounted(() => {
  fetchBorrows();
});
</script>
