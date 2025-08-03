<template>
  <StaffLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">
          Quản lý {{ getTabName() }}
        </h1>
        <button
          @click="showAddModal = true"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <i class="pi pi-plus mr-2"></i>
          Thêm {{ getAddButtonText() }}
        </button>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              @click="activeTab = 'categories'"
              :class="[
                activeTab === 'categories'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              ]"
            >
              <i class="pi pi-tags mr-2"></i>
              Thể loại ({{ categories.length }})
            </button>
            <button
              @click="activeTab = 'authors'"
              :class="[
                activeTab === 'authors'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              ]"
            >
              <i class="pi pi-user mr-2"></i>
              Tác giả ({{ authors.length }})
            </button>
            <button
              @click="activeTab = 'publishers'"
              :class="[
                activeTab === 'publishers'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              ]"
            >
              <i class="pi pi-building mr-2"></i>
              Nhà xuất bản ({{ publishers.length }})
            </button>
          </nav>
        </div>

        <!-- Search Filter -->
        <div class="p-6 border-b border-gray-200">
          <div class="max-w-md">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              v-model="searchTerm"
              type="text"
              :placeholder="`Tìm kiếm ${getTabName()}...`"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <!-- Content Table -->
        <div v-if="loading" class="p-8 text-center">
          <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
          <p class="mt-2 text-gray-600">Đang tải...</p>
        </div>

        <div v-else-if="paginatedItems.length === 0" class="p-8 text-center">
          <i class="pi pi-inbox text-4xl text-gray-300"></i>
          <p class="mt-2 text-gray-600">
            Không có {{ getTabName().toLowerCase() }} nào
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  STT
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tên
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
                v-for="(item, index) in paginatedItems"
                :key="item._id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item._id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ item.name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-4">
                    <button
                      @click="editItem(item)"
                      class="text-yellow-600 hover:text-yellow-900 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button
                      @click="deleteItem(item._id)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Xóa"
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
              Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} đến
              {{ Math.min(currentPage * itemsPerPage, filteredItems.length) }}
              trong {{ filteredItems.length }} {{ getTabName().toLowerCase() }}
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

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div
        class="relative w-full max-w-md bg-white rounded-lg shadow-xl"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">
              {{
                showAddModal
                  ? `Thêm ${getTabName()}`
                  : `Chỉnh sửa ${getTabName()}`
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
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên {{ getTabName() }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                :placeholder="`Nhập tên ${getTabName().toLowerCase()}...`"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
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
                    ? "Thêm"
                    : "Cập nhật"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </StaffLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import StaffLayout from "@/layouts/StaffLayout.vue";
import { categoryService, authorService, publisherService } from "@/services";

const loading = ref(false);
const submitting = ref(false);
const activeTab = ref("categories");
const searchTerm = ref("");

// Data arrays
const categories = ref([]);
const authors = ref([]);
const publishers = ref([]);

// Modal states
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingItem = ref(null);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Form data
const formData = reactive({
  name: "",
});

// Computed properties
const currentItems = computed(() => {
  switch (activeTab.value) {
    case "categories":
      return categories.value;
    case "authors":
      return authors.value;
    case "publishers":
      return publishers.value;
    default:
      return [];
  }
});

const filteredItems = computed(() => {
  if (!searchTerm.value) {
    return currentItems.value;
  }
  return currentItems.value.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage.value);
});

// Helper methods
const getTabName = () => {
  const names = {
    categories: "Thể loại",
    authors: "Tác giả",
    publishers: "Nhà xuất bản",
  };
  return names[activeTab.value] || "";
};

const getAddButtonText = () => {
  const names = {
    categories: "thể loại",
    authors: "tác giả",
    publishers: "nhà xuất bản",
  };
  return names[activeTab.value] || "";
};

const getTabIcon = () => {
  const icons = {
    categories: "pi pi-tags",
    authors: "pi pi-user",
    publishers: "pi pi-building",
  };
  return icons[activeTab.value] || "pi pi-circle";
};

const getCurrentService = () => {
  switch (activeTab.value) {
    case "categories":
      return categoryService;
    case "authors":
      return authorService;
    case "publishers":
      return publisherService;
    default:
      return null;
  }
};

// Watch for tab changes
watch(activeTab, () => {
  currentPage.value = 1;
  searchTerm.value = "";
  closeModal();
});

watch(searchTerm, () => {
  currentPage.value = 1;
});

// Data fetching methods
const fetchCategories = async () => {
  try {
    const response = await categoryService.getAll();
    categories.value = response.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    categories.value = [];
  }
};

const fetchAuthors = async () => {
  try {
    const response = await authorService.getAll();
    authors.value = response.data || [];
  } catch (error) {
    console.error("Error fetching authors:", error);
    authors.value = [];
  }
};

const fetchPublishers = async () => {
  try {
    const response = await publisherService.getAll();
    publishers.value = response.data || [];
  } catch (error) {
    console.error("Error fetching publishers:", error);
    publishers.value = [];
  }
};

const fetchAllData = async () => {
  loading.value = true;
  try {
    await Promise.all([fetchCategories(), fetchAuthors(), fetchPublishers()]);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

// CRUD operations
const submitForm = async () => {
  try {
    submitting.value = true;
    const service = getCurrentService();

    if (showEditModal.value) {
      await service.update(editingItem.value._id, formData);
      alert(`Cập nhật ${getTabName().toLowerCase()} thành công!`);
    } else {
      await service.create(formData);
      alert(`Thêm ${getTabName().toLowerCase()} thành công!`);
    }

    closeModal();
    await fetchAllData();
  } catch (error) {
    console.error(`Error saving ${activeTab.value}:`, error);
    alert(`Có lỗi xảy ra: ${error.response?.data?.message || error.message}`);
  } finally {
    submitting.value = false;
  }
};

const editItem = (item) => {
  editingItem.value = item;
  formData.name = item.name;
  showEditModal.value = true;
};

const deleteItem = async (itemId) => {
  if (confirm(`Bạn có chắc chắn muốn xóa ${getTabName().toLowerCase()} này?`)) {
    try {
      const service = getCurrentService();
      await service.delete(itemId);
      alert(`Xóa ${getTabName().toLowerCase()} thành công!`);
      await fetchAllData();
    } catch (error) {
      console.error(`Error deleting ${activeTab.value}:`, error);
      alert(
        `Có lỗi xảy ra khi xóa: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
};

// Pagination
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Modal methods
const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingItem.value = null;
  formData.name = "";
};

onMounted(() => {
  fetchAllData();
});
</script>
