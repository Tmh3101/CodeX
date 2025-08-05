<template>
  <StaffLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <button
          @click="showAddModal = true"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <i class="pi pi-plus mr-2"></i>
          Thêm người dùng
        </button>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              @click="activeTab = 'reader'"
              :class="[
                activeTab === 'reader'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              ]"
            >
              <i class="pi pi-users mr-2"></i>
              Độc giả ({{ readerCount }})
            </button>
            <button
              @click="activeTab = 'staff'"
              :class="[
                activeTab === 'staff'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              ]"
            >
              <i class="pi pi-shield mr-2"></i>
              Nhân viên ({{ staffCount }})
            </button>
          </nav>
        </div>

        <!-- Filters -->
        <div class="p-6 border-b border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                v-model="filters.search"
                @input="debouncedSearch"
                type="text"
                placeholder="Tên, email, số điện thoại..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            <div v-if="activeTab === 'reader'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                v-model="filters.gender"
                @change="fetchUsers"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Tất cả</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                v-model="filters.isActive"
                @change="fetchUsers"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Tất cả</option>
                <option value="true">Hoạt động</option>
                <option value="false">Bị khóa</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div v-if="loading" class="p-8 text-center">
          <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
          <p class="mt-2 text-gray-600">Đang tải...</p>
        </div>

        <div v-else-if="currentUsers.length === 0" class="p-8 text-center">
          <i class="pi pi-inbox text-4xl text-gray-300"></i>
          <p class="mt-2 text-gray-600">
            Không có {{ activeTab === "readers" ? "độc giả" : "nhân viên" }} nào
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Người dùng
                </th>
                <th
                  v-if="activeTab === 'reader'"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Giới tính
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số điện thoại
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày tham gia
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="user in currentUsers"
                :key="user._id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div>
                      <img
                        v-if="user.avatarUrl"
                        :src="user.avatarUrl"
                        alt="User Avatar"
                        class="h-10 w-10 rounded-full object-cover"
                      />
                      <div
                        v-else
                        class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                      >
                        <span class="text-sm font-medium text-gray-500">
                          {{ getUserInitials(user) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  v-if="activeTab === 'reader'"
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {{ getGenderText(user.gender) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.phone || "-" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="
                      user.isActive
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    "
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  >
                    <div
                      :class="user.isActive ? 'bg-green-400' : 'bg-red-400'"
                      class="w-2 h-2 rounded-full mr-2"
                    ></div>
                    {{ user.isActive ? "Hoạt động" : "Bị khóa" }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <button
                      @click="viewDetails(user)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Xem chi tiết"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button
                      @click="editUser(user)"
                      class="text-yellow-600 hover:text-yellow-900 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button
                      @click="deleteUser(user._id)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Xóa người dùng"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
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
              trong {{ totalItems }}
              {{ activeTab === "readers" ? "độc giả" : "nhân viên" }}
            </div>
            <div class="flex space-x-2">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Trước
              </button>
              <span class="px-3 py-1 bg-primary text-white rounded-md text-sm">
                {{ currentPage }}
              </span>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div
        class="relative w-full max-w-2xl bg-white rounded-lg shadow-xl"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">
              {{
                showAddModal ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"
              }}
            </h2>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-6">
          <form @submit.prevent="submitUser" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Họ <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="userForm.firstName"
                  type="text"
                  required
                  placeholder="Nhập họ"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tên <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="userForm.lastName"
                  type="text"
                  required
                  placeholder="Nhập tên"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="userForm.email"
                  type="email"
                  required
                  placeholder="example@email.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  v-model="userForm.phone"
                  type="tel"
                  placeholder="0123456789"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="userForm.role"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                >
                  <option value="">Chọn vai trò</option>
                  <option value="reader">Độc giả</option>
                  <option value="staff">Nhân viên</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  v-model="userForm.gender"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  v-model="userForm.dateOfBirth"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>

              <div v-if="showAddModal">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="userForm.password"
                  type="password"
                  required
                  placeholder="Nhập mật khẩu"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <textarea
                v-model="userForm.address"
                rows="2"
                placeholder="Nhập địa chỉ"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary resize-none"
              ></textarea>
            </div>

            <!-- Form Actions -->
            <div
              class="flex justify-end space-x-3 pt-4 border-t border-gray-200"
            >
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-2 bg-primary text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <i v-if="submitting" class="pi pi-spin pi-spinner mr-2"></i>
                {{
                  submitting
                    ? "Đang lưu..."
                    : showAddModal
                    ? "Thêm người dùng"
                    : "Cập nhật"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Enhanced Detail Modal -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="closeDetailModal"
    >
      <div
        class="relative w-full max-w-lg bg-white rounded-lg shadow-xl"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">
              Chi tiết người dùng
            </h2>
            <button
              @click="closeDetailModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div v-if="selectedUser" class="px-6 py-6">
          <!-- User Avatar and Basic Info -->
          <div class="text-center mb-6">
            <div v-if="selectedUser.avatarUrl" class="mb-4">
              <img
                :src="selectedUser.avatarUrl"
                alt="User Avatar"
                class="mx-auto h-20 w-20 rounded-full object-cover"
              />
            </div>
            <div
              v-else
              class="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mb-4"
            >
              <span class="text-2xl font-bold text-white">
                {{ getUserInitials(selectedUser) }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ selectedUser.firstName }} {{ selectedUser.lastName }}
            </h3>
            <p class="text-sm text-gray-600">{{ selectedUser.email }}</p>
            <div class="mt-2">
              <span
                :class="getRoleClass(selectedUser.role)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ getRoleText(selectedUser.role) }}
              </span>
            </div>
          </div>

          <!-- User Details -->
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-3 rounded-lg">
                <div
                  class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
                >
                  Giới tính
                </div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ getGenderText(selectedUser.gender) }}
                </div>
              </div>

              <div class="bg-gray-50 p-3 rounded-lg">
                <div
                  class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
                >
                  Trạng thái
                </div>
                <div class="flex items-center">
                  <div
                    :class="
                      selectedUser.isActive ? 'bg-green-400' : 'bg-red-400'
                    "
                    class="w-2 h-2 rounded-full mr-2"
                  ></div>
                  <span
                    :class="
                      selectedUser.isActive ? 'text-green-800' : 'text-red-800'
                    "
                    class="text-sm font-semibold"
                  >
                    {{ selectedUser.isActive ? "Hoạt động" : "Bị khóa" }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="selectedUser.phone" class="bg-gray-50 p-3 rounded-lg">
              <div
                class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
              >
                Số điện thoại
              </div>
              <div class="text-sm font-semibold text-gray-900">
                {{ selectedUser.phone }}
              </div>
            </div>

            <div
              v-if="selectedUser.dateOfBirth"
              class="bg-gray-50 p-3 rounded-lg"
            >
              <div
                class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
              >
                Ngày sinh
              </div>
              <div class="text-sm font-semibold text-gray-900">
                {{ formatDate(selectedUser.dateOfBirth) }}
              </div>
            </div>

            <div v-if="selectedUser.address" class="bg-gray-50 p-3 rounded-lg">
              <div
                class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
              >
                Địa chỉ
              </div>
              <div class="text-sm font-semibold text-gray-900">
                {{ selectedUser.address }}
              </div>
            </div>

            <div class="bg-gray-50 p-3 rounded-lg">
              <div
                class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
              >
                Ngày tham gia
              </div>
              <div class="text-sm font-semibold text-gray-900">
                {{ formatDate(selectedUser.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 rounded-b-lg">
          <div class="flex justify-end space-x-3">
            <button
              @click="closeDetailModal"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
            <button
              @click="editUserFromDetail"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <i class="pi pi-pencil mr-2"></i>
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  </StaffLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { debounce } from "lodash";
import StaffLayout from "@/layouts/StaffLayout.vue";
import { userService } from "@/services";

const loading = ref(false);
const submitting = ref(false);
const users = ref([]);
const activeTab = ref("reader"); // 'reader' or 'staff'

const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const editingUser = ref(null);
const selectedUser = ref(null);

const filters = reactive({
  search: "",
  gender: "",
  isActive: "",
});

const userForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  password: "",
});

// Computed properties for filtered users
const currentUsers = computed(() => {
  return users.value.filter((user) => user.role === activeTab.value); // 'readers' -> 'reader', 'staff' -> 'staff'
});

const readerCount = computed(() => {
  return users.value.filter((user) => user.role === "reader").length;
});

const staffCount = computed(() => {
  return users.value.filter((user) => user.role === "staff").length;
});

// Watch activeTab to refetch data
watch(activeTab, () => {
  currentPage.value = 1;
  fetchUsers();
});

const fetchUsers = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: limit.value,
      role: activeTab.value === "reader" ? "reader" : "staff",
      ...filters,
    };

    // Remove empty filters
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    const response = await userService.getAll(params);
    users.value = response.data.users || [];
    totalPages.value = response.data.totalPages || 1;
    totalItems.value = response.data.totalItems || 0;
  } catch (error) {
    console.error("Error fetching users:", error);
    users.value = [];
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  fetchUsers();
}, 500);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchUsers();
  }
};

const resetForm = () => {
  Object.assign(userForm, {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    password: "",
  });
};

const editUser = (user) => {
  editingUser.value = user;
  Object.assign(userForm, {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    gender: user.gender || "",
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
    address: user.address || "",
    password: "",
  });
  showEditModal.value = true;
};

const editUserFromDetail = () => {
  if (selectedUser.value) {
    closeDetailModal();
    editUser(selectedUser.value);
  }
};

const submitUser = async () => {
  try {
    submitting.value = true;
    const userData = { ...userForm };

    console.log("Submitting user data:", userData);

    // Remove password if editing and not provided
    if (showEditModal.value && !userData.password) {
      delete userData.password;
    }

    if (showEditModal.value) {
      await userService.update(editingUser.value._id, userData);
      alert("Cập nhật người dùng thành công!");
    } else {
      await userService.create(userData);
      alert("Thêm người dùng thành công!");
    }

    closeModal();
    fetchUsers();
  } catch (error) {
    console.error("Error saving user:", error);
    alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
  } finally {
    submitting.value = false;
  }
};

const deleteUser = async (userId) => {
  if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

  try {
    await userService.delete(userId);
    alert("Xóa người dùng thành công!");
    fetchUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
  }
};

const viewDetails = (user) => {
  selectedUser.value = user;
  showDetailModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingUser.value = null;
  resetForm();
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedUser.value = null;
};

const getUserInitials = (user) => {
  return `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const getRoleText = (role) => {
  const roleMap = {
    reader: "Độc giả",
    staff: "Nhân viên",
  };
  return roleMap[role] || role;
};

const getRoleClass = (role) => {
  const classMap = {
    reader: "bg-blue-100 text-blue-800 border-blue-200",
    staff: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return classMap[role] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getGenderText = (gender) => {
  const genderMap = {
    male: "Nam",
    female: "Nữ",
  };
  return genderMap[gender] || "-";
};

onMounted(() => {
  fetchUsers();
});
</script>
