<template>
  <StaffLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Quản lý sách</h1>
        <button
          @click="showAddModal = true"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <i class="pi pi-plus mr-2"></i>
          Thêm sách
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              v-model="filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="Tên sách, tác giả..."
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Thể loại
            </label>
            <select
              v-model="filters.categories"
              @change="fetchBooks"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Tất cả thể loại</option>
              <option
                v-for="category in categories"
                :key="category._id"
                :value="category._id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tác giả
            </label>
            <select
              v-model="filters.authors"
              @change="fetchBooks"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Tất cả tác giả</option>
              <option
                v-for="author in authors"
                :key="author._id"
                :value="author._id"
              >
                {{ author.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nhà xuất bản
            </label>
            <select
              v-model="filters.publishers"
              @change="fetchBooks"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Tất cả NXB</option>
              <option
                v-for="publisher in publishers"
                :key="publisher._id"
                :value="publisher._id"
              >
                {{ publisher.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Books Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
          <p class="mt-2 text-gray-600">Đang tải...</p>
        </div>

        <div v-else-if="books.length === 0" class="p-8 text-center">
          <i class="pi pi-inbox text-4xl text-gray-300"></i>
          <p class="mt-2 text-gray-600">Không có sách nào</p>
        </div>

        <div v-else class="overflow-x-auto">
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
                  Tác giả
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thể loại
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Năm XB
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số lượng
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Có sẵn
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="book in books" :key="book._id">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <img
                      :src="book.coverUrl || '/api/placeholder/60/80'"
                      :alt="book.title"
                      class="h-16 w-12 object-cover rounded mr-4"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ book.title }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Năm xuất bản: {{ book.publishedYear }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{
                    book.authors.length > 0
                      ? book.authors.length <= 2
                        ? book.authors.join(", ")
                        : `${book.authors.slice(0, 2).join(", ")}...`
                      : "N/A"
                  }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{
                    book.categories.length > 0
                      ? book.categories.join(", ")
                      : "N/A"
                  }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ book.publishedYear }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ book.quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    :class="
                      book.availableQuantity > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    "
                  >
                    {{ book.availableQuantity }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4"
                >
                  <button
                    @click="editBook(book)"
                    class="text-blue-600 hover:text-blue-900 transition-colors"
                    title="Chỉnh sửa sách"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    @click="deleteBook(book.bookId)"
                    class="text-red-600 hover:text-red-900 transition-colors"
                    title="Xóa sách"
                  >
                    <i class="pi pi-trash"></i>
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
              trong {{ totalItems }} cuốn sách
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

    <!-- Add/Edit Book Modal -->
    <div
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div
        class="relative w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Modal Header -->
        <div
          class="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-lg"
        >
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ showAddModal ? "Thêm sách mới" : "Chỉnh sửa sách" }}
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
          <form @submit.prevent="submitBook" class="space-y-6">
            <!-- Cover Image Upload -->
            <div
              class="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300"
            >
              <div class="text-center">
                <div class="mb-4">
                  <div v-if="imagePreview" class="flex justify-center mb-4">
                    <img
                      :src="imagePreview"
                      alt="Preview"
                      class="h-40 w-32 object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div v-else class="flex justify-center mb-4">
                    <div
                      class="h-40 w-32 bg-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <i class="pi pi-image text-4xl text-gray-400"></i>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <label
                    for="cover-image"
                    class="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <i class="pi pi-upload mr-2"></i>
                    {{ imagePreview ? "Đổi ảnh bìa" : "Tải lên ảnh bìa" }}
                  </label>
                  <input
                    id="cover-image"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="hidden"
                  />
                  <p class="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <!-- Book Information Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tên sách <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="bookForm.title"
                    type="text"
                    required
                    placeholder="Nhập tên sách"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
                <!-- Thay thế phần tác giả trong form -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tác giả <span class="text-red-500">*</span>
                  </label>

                  <!-- Searchable combobox cho tác giả -->
                  <div class="relative">
                    <input
                      v-model="authorSearch"
                      @focus="showAuthorDropdown = true"
                      @input="filterAuthors"
                      type="text"
                      placeholder="Tìm kiếm hoặc thêm tác giả..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />

                    <!-- Dropdown list -->
                    <div
                      v-if="showAuthorDropdown"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      <!-- Filtered authors -->
                      <div
                        v-for="author in filteredAuthors"
                        :key="author._id"
                        @click="selectAuthor(author._id)"
                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                      >
                        {{ author.name }}
                      </div>

                      <!-- Add new author option -->
                      <div
                        v-if="authorSearch && !isExactAuthorMatch"
                        @click="createAuthor"
                        class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-blue-600 font-medium border-t border-gray-200"
                      >
                        <i class="pi pi-plus mr-2"></i>
                        Thêm tác giả "{{ authorSearch }}"
                      </div>

                      <!-- No results -->
                      <div
                        v-if="filteredAuthors.length === 0 && !authorSearch"
                        class="px-3 py-2 text-gray-500 text-center"
                      >
                        Không có tác giả nào
                      </div>
                    </div>
                  </div>

                  <!-- Hiển thị các tác giả đã chọn dưới dạng chips -->
                  <div
                    v-if="bookForm.authors.length > 0"
                    class="mt-3 flex flex-wrap gap-2"
                  >
                    <div
                      v-for="authorId in bookForm.authors"
                      :key="authorId"
                      class="inline-flex items-center bg-primary text-white px-3 py-1 rounded-full text-sm"
                    >
                      <span>{{ getAuthorName(authorId) }}</span>
                      <button
                        type="button"
                        @click="removeAuthor(authorId)"
                        class="ml-2 text-white hover:text-gray-200 focus:outline-none"
                      >
                        <i class="pi pi-times text-xs"></i>
                      </button>
                    </div>
                  </div>

                  <p class="text-xs text-gray-500 mt-1">
                    Nhập để tìm kiếm hoặc thêm tác giả mới
                  </p>
                </div>

                <!-- Thay thế phần thể loại trong form -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Thể loại <span class="text-red-500">*</span>
                  </label>

                  <!-- Searchable combobox cho thể loại -->
                  <div class="relative">
                    <input
                      v-model="categorySearch"
                      @focus="showCategoryDropdown = true"
                      @input="filterCategories"
                      type="text"
                      placeholder="Tìm kiếm hoặc thêm thể loại..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />

                    <!-- Dropdown list -->
                    <div
                      v-if="showCategoryDropdown"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      <!-- Filtered categories -->
                      <div
                        v-for="category in filteredCategories"
                        :key="category._id"
                        @click="selectCategory(category._id)"
                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                      >
                        {{ category.name }}
                      </div>

                      <!-- Add new category option -->
                      <div
                        v-if="categorySearch && !isExactCategoryMatch"
                        @click="createCategory"
                        class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-blue-600 font-medium border-t border-gray-200"
                      >
                        <i class="pi pi-plus mr-2"></i>
                        + Thêm thể loại "{{ categorySearch }}"
                      </div>

                      <!-- No results -->
                      <div
                        v-if="
                          filteredCategories.length === 0 && !categorySearch
                        "
                        class="px-3 py-2 text-gray-500 text-center"
                      >
                        Không có thể loại nào
                      </div>
                    </div>
                  </div>

                  <!-- Hiển thị các thể loại đã chọn dưới dạng chips -->
                  <div
                    v-if="bookForm.categories.length > 0"
                    class="mt-3 flex flex-wrap gap-2"
                  >
                    <div
                      v-for="categoryId in bookForm.categories"
                      :key="categoryId"
                      class="inline-flex items-center bg-primary text-white px-3 py-1 rounded-full text-sm"
                    >
                      <span>{{ getCategoryName(categoryId) }}</span>
                      <button
                        type="button"
                        @click="removeCategory(categoryId)"
                        class="ml-2 text-white hover:text-gray-200 focus:outline-none"
                      >
                        <i class="pi pi-times text-xs"></i>
                      </button>
                    </div>
                  </div>

                  <p class="text-xs text-gray-500 mt-1">
                    Nhập để tìm kiếm hoặc thêm thể loại mới
                  </p>
                </div>

                <!-- Thay thế phần nhà xuất bản trong form -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nhà xuất bản
                  </label>

                  <!-- Searchable combobox cho nhà xuất bản -->
                  <div class="relative">
                    <input
                      v-model="publisherSearch"
                      @focus="showPublisherDropdown = true"
                      @input="filterPublishers"
                      type="text"
                      placeholder="Tìm kiếm hoặc thêm nhà xuất bản..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />

                    <!-- Dropdown list -->
                    <div
                      v-if="showPublisherDropdown"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      <!-- Clear selection option -->
                      <div
                        @click="selectPublisher('')"
                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-500 italic border-b border-gray-200"
                      >
                        Không chọn nhà xuất bản
                      </div>

                      <!-- Filtered publishers -->
                      <div
                        v-for="publisher in filteredPublishers"
                        :key="publisher._id"
                        @click="selectPublisher(publisher._id)"
                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                      >
                        {{ publisher.name }}
                      </div>

                      <!-- Add new publisher option -->
                      <div
                        v-if="publisherSearch && !isExactPublisherMatch"
                        @click="createPublisher"
                        class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-blue-600 font-medium border-t border-gray-200"
                      >
                        <i class="pi pi-plus mr-2"></i>
                        + Thêm nhà xuất bản "{{ publisherSearch }}"
                      </div>

                      <!-- No results -->
                      <div
                        v-if="
                          filteredPublishers.length === 0 && !publisherSearch
                        "
                        class="px-3 py-2 text-gray-500 text-center"
                      >
                        Không có nhà xuất bản nào
                      </div>
                    </div>
                  </div>

                  <!-- Hiển thị nhà xuất bản đã chọn -->
                  <div v-if="bookForm.publisher" class="mt-3">
                    <div
                      class="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm border border-green-200"
                    >
                      <span>{{ getPublisherName(bookForm.publisher) }}</span>
                      <button
                        type="button"
                        @click="selectPublisher('')"
                        class="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                      >
                        <i class="pi pi-times text-xs"></i>
                      </button>
                    </div>
                  </div>

                  <p class="text-xs text-gray-500 mt-1">
                    Nhập để tìm kiếm hoặc thêm nhà xuất bản mới
                  </p>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Năm xuất bản
                    </label>
                    <input
                      v-model="bookForm.publishedYear"
                      type="number"
                      min="1000"
                      max="2030"
                      placeholder="2024"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Số trang
                    </label>
                    <input
                      v-model="bookForm.pageCount"
                      type="number"
                      min="1"
                      placeholder="304"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="bookForm.quantity"
                      type="number"
                      min="0"
                      required
                      placeholder="30"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Giá (VNĐ)
                    </label>
                    <input
                      v-model="bookForm.price"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="65000"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    v-model="bookForm.description"
                    rows="6"
                    placeholder="Nhập mô tả về cuốn sách..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div
              class="flex justify-end space-x-3 pt-6 border-t border-gray-200"
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
                    ? "Thêm sách"
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
import { ref, reactive, onMounted, computed } from "vue";
import { debounce } from "lodash";
import StaffLayout from "@/layouts/StaffLayout.vue";
import {
  bookService,
  categoryService,
  authorService,
  publisherService,
} from "@/services";

const loading = ref(false);
const submitting = ref(false);
const books = ref([]);
const categories = ref([]);
const authors = ref([]);
const publishers = ref([]);

// Searchable combobox refs
const authorSearch = ref("");
const categorySearch = ref("");
const publisherSearch = ref("");

const showAuthorDropdown = ref(false);
const showCategoryDropdown = ref(false);
const showPublisherDropdown = ref(false);

const filteredAuthors = ref([]);
const filteredCategories = ref([]);
const filteredPublishers = ref([]);

// Existing refs
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);

const showAddModal = ref(false);
const showEditModal = ref(false);
const editingBook = ref(null);

const selectedImage = ref(null);
const imagePreview = ref(null);

const filters = reactive({
  search: "",
  categories: "",
  authors: "",
  publishers: "",
});

const bookForm = reactive({
  title: "",
  authors: [],
  categories: [],
  publisher: "",
  publishedYear: new Date().getFullYear(),
  pageCount: null,
  quantity: 1,
  price: null,
  description: "",
});

// Computed properties for exact matches
const isExactAuthorMatch = computed(() => {
  return authors.value.some(
    (author) => author.name.toLowerCase() === authorSearch.value.toLowerCase()
  );
});

const isExactCategoryMatch = computed(() => {
  return categories.value.some(
    (category) =>
      category.name.toLowerCase() === categorySearch.value.toLowerCase()
  );
});

const isExactPublisherMatch = computed(() => {
  return publishers.value.some(
    (publisher) =>
      publisher.name.toLowerCase() === publisherSearch.value.toLowerCase()
  );
});

// Filter methods
const filterAuthors = () => {
  if (!authorSearch.value) {
    filteredAuthors.value = authors.value.filter(
      (author) => !bookForm.authors.includes(author._id)
    );
  } else {
    filteredAuthors.value = authors.value.filter(
      (author) =>
        author.name.toLowerCase().includes(authorSearch.value.toLowerCase()) &&
        !bookForm.authors.includes(author._id)
    );
  }
};

const filterCategories = () => {
  if (!categorySearch.value) {
    filteredCategories.value = categories.value.filter(
      (category) => !bookForm.categories.includes(category._id)
    );
  } else {
    filteredCategories.value = categories.value.filter(
      (category) =>
        category.name
          .toLowerCase()
          .includes(categorySearch.value.toLowerCase()) &&
        !bookForm.categories.includes(category._id)
    );
  }
};

const filterPublishers = () => {
  if (!publisherSearch.value) {
    filteredPublishers.value = publishers.value;
  } else {
    filteredPublishers.value = publishers.value.filter((publisher) =>
      publisher.name.toLowerCase().includes(publisherSearch.value.toLowerCase())
    );
  }
};

// Selection methods
const selectAuthor = (authorId) => {
  if (!bookForm.authors.includes(authorId)) {
    bookForm.authors.push(authorId);
  }
  authorSearch.value = "";
  showAuthorDropdown.value = false;
  filterAuthors();
};

const selectCategory = (categoryId) => {
  if (!bookForm.categories.includes(categoryId)) {
    bookForm.categories.push(categoryId);
  }
  categorySearch.value = "";
  showCategoryDropdown.value = false;
  filterCategories();
};

const selectPublisher = (publisherId) => {
  bookForm.publisher = publisherId;
  publisherSearch.value = publisherId ? getPublisherName(publisherId) : "";
  showPublisherDropdown.value = false;
};

// Create new methods
const createAuthor = async () => {
  try {
    const response = await authorService.create({ name: authorSearch.value });
    const newAuthor = response.data;

    // Add to authors list
    authors.value.push(newAuthor);

    // Add to selected authors
    bookForm.authors.push(newAuthor._id);

    // Clear search and close dropdown
    authorSearch.value = "";
    showAuthorDropdown.value = false;
    filterAuthors();

    alert(`Tác giả "${newAuthor.name}" đã được tạo thành công!`);
  } catch (error) {
    console.error("Error creating author:", error);
    alert(
      "Có lỗi xảy ra khi tạo tác giả: " +
        (error.response?.data?.message || error.message)
    );
  }
};

const createCategory = async () => {
  try {
    const response = await categoryService.create({
      name: categorySearch.value,
    });
    const newCategory = response.data;

    // Add to categories list
    categories.value.push(newCategory);

    // Add to selected categories
    bookForm.categories.push(newCategory._id);

    // Clear search and close dropdown
    categorySearch.value = "";
    showCategoryDropdown.value = false;
    filterCategories();

    alert(`Thể loại "${newCategory.name}" đã được tạo thành công!`);
  } catch (error) {
    console.error("Error creating category:", error);
    alert(
      "Có lỗi xảy ra khi tạo thể loại: " +
        (error.response?.data?.message || error.message)
    );
  }
};

const createPublisher = async () => {
  try {
    const response = await publisherService.create({
      name: publisherSearch.value,
    });
    const newPublisher = response.data;

    // Add to publishers list
    publishers.value.push(newPublisher);

    // Select the new publisher
    bookForm.publisher = newPublisher._id;
    publisherSearch.value = newPublisher.name;
    showPublisherDropdown.value = false;

    alert(`Nhà xuất bản "${newPublisher.name}" đã được tạo thành công!`);
  } catch (error) {
    console.error("Error creating publisher:", error);
    alert(
      "Có lỗi xảy ra khi tạo nhà xuất bản: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Remove methods
const removeAuthor = (authorId) => {
  const index = bookForm.authors.indexOf(authorId);
  if (index > -1) {
    bookForm.authors.splice(index, 1);
    filterAuthors(); // Refresh available authors
  }
};

const removeCategory = (categoryId) => {
  const index = bookForm.categories.indexOf(categoryId);
  if (index > -1) {
    bookForm.categories.splice(index, 1);
    filterCategories(); // Refresh available categories
  }
};

// Helper methods
const getAuthorName = (authorId) => {
  const author = authors.value.find((a) => a._id === authorId);
  return author ? author.name : "Unknown Author";
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find((c) => c._id === categoryId);
  return category ? category.name : "Unknown Category";
};

const getPublisherName = (publisherId) => {
  const publisher = publishers.value.find((p) => p._id === publisherId);
  return publisher ? publisher.name : "Unknown Publisher";
};

// Find ID methods
const findAuthorIdByName = (name) => {
  const author = authors.value.find((a) => a.name === name);
  return author ? author._id : null;
};

const findCategoryIdByName = (name) => {
  const category = categories.value.find((c) => c.name === name);
  return category ? category._id : null;
};

const findPublisherIdByName = (name) => {
  const publisher = publishers.value.find((p) => p.name === name);
  return publisher ? publisher._id : null;
};

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showAuthorDropdown.value = false;
    showCategoryDropdown.value = false;
    showPublisherDropdown.value = false;
  }
};

// Image upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Existing methods
const fetchBooks = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: limit.value,
      ...filters,
    };

    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    const response = await bookService.getAll(params);
    books.value = response.data.books || [];
    totalPages.value = response.data.totalPages || 1;
    totalItems.value = response.data.totalBooks || 0;
  } catch (error) {
    console.error("Error fetching books:", error);
    books.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchDropdownData = async () => {
  try {
    const [categoriesRes, authorsRes, publishersRes] = await Promise.all([
      categoryService.getAll(),
      authorService.getAll(),
      publisherService.getAll(),
    ]);

    categories.value = categoriesRes.data || [];
    authors.value = authorsRes.data || [];
    publishers.value = publishersRes.data || [];

    // Initialize filtered lists
    filterAuthors();
    filterCategories();
    filterPublishers();
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
  }
};

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  fetchBooks();
}, 500);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchBooks();
  }
};

const resetForm = () => {
  Object.assign(bookForm, {
    title: "",
    authors: [],
    categories: [],
    publisher: "",
    publishedYear: new Date().getFullYear(),
    pageCount: null,
    quantity: 1,
    price: null,
    description: "",
  });

  selectedImage.value = null;
  imagePreview.value = null;

  // Reset search fields
  authorSearch.value = "";
  categorySearch.value = "";
  publisherSearch.value = "";

  // Close dropdowns
  showAuthorDropdown.value = false;
  showCategoryDropdown.value = false;
  showPublisherDropdown.value = false;

  // Reset filtered lists
  filterAuthors();
  filterCategories();
  filterPublishers();

  const fileInput = document.getElementById("cover-image");
  if (fileInput) fileInput.value = "";
};

const editBook = (book) => {
  editingBook.value = book;

  console.log("Editing book:", book);

  // Process authors
  let authorIds = [];
  if (book.authors && Array.isArray(book.authors)) {
    authorIds = book.authors
      .map((author) => {
        if (typeof author === "string") {
          return findAuthorIdByName(author);
        } else if (typeof author === "object" && author._id) {
          return author._id;
        }
        return null;
      })
      .filter((id) => id !== null);
  }

  // Process categories
  let categoryIds = [];
  if (book.categories && Array.isArray(book.categories)) {
    categoryIds = book.categories
      .map((category) => {
        if (typeof category === "string") {
          return findCategoryIdByName(category);
        } else if (typeof category === "object" && category._id) {
          return category._id;
        }
        return null;
      })
      .filter((id) => id !== null);
  }

  // Process publisher
  let publisherId = "";
  if (book.publisher) {
    if (typeof book.publisher === "string") {
      publisherId = findPublisherIdByName(book.publisher) || "";
    } else if (typeof book.publisher === "object" && book.publisher._id) {
      publisherId = book.publisher._id;
    }
  }

  Object.assign(bookForm, {
    title: book.title || "",
    authors: authorIds,
    categories: categoryIds,
    publisher: publisherId,
    publishedYear: book.publishedYear || new Date().getFullYear(),
    pageCount: book.pageCount || null,
    quantity: book.quantity || 1,
    price: book.price || null,
    description: book.description || "",
  });

  // Set publisher search value
  publisherSearch.value = publisherId ? getPublisherName(publisherId) : "";

  // Update filtered lists
  filterAuthors();
  filterCategories();
  filterPublishers();

  if (book.coverUrl) {
    imagePreview.value = book.coverUrl;
  }

  showEditModal.value = true;
};

const submitBook = async () => {
  try {
    submitting.value = true;

    const formData = new FormData();

    if (selectedImage.value) {
      formData.append("coverImage", selectedImage.value);
    }

    const bookData = {
      title: bookForm.title,
      authors: bookForm.authors,
      categories: bookForm.categories,
      description: bookForm.description,
      pageCount: bookForm.pageCount ? parseInt(bookForm.pageCount) : undefined,
      price: bookForm.price ? parseInt(bookForm.price) : undefined,
      quantity: parseInt(bookForm.quantity),
      publishedYear: bookForm.publishedYear
        ? parseInt(bookForm.publishedYear)
        : undefined,
      publisher: bookForm.publisher || undefined,
    };

    Object.keys(bookData).forEach((key) => {
      if (
        bookData[key] === undefined ||
        bookData[key] === "" ||
        (Array.isArray(bookData[key]) && bookData[key].length === 0)
      ) {
        delete bookData[key];
      }
    });

    formData.append("data", JSON.stringify(bookData));

    console.log("Submitting book data:", bookData);

    if (showEditModal.value) {
      await bookService.update(editingBook.value.bookId, formData);
    } else {
      await bookService.create(formData);
    }

    closeModal();
    fetchBooks();

    alert(
      showAddModal.value ? "Thêm sách thành công!" : "Cập nhật sách thành công!"
    );
  } catch (error) {
    console.error("Error saving book:", error);
    alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
  } finally {
    submitting.value = false;
  }
};

const deleteBook = async (bookId) => {
  if (confirm("Bạn có chắc chắn muốn xóa sách này?")) {
    try {
      await bookService.delete(bookId);
      fetchBooks();
      alert("Xóa sách thành công!");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Có lỗi xảy ra khi xóa sách");
    }
  }
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingBook.value = null;
  resetForm();
};

onMounted(async () => {
  await fetchDropdownData();
  await fetchBooks();

  // Add click outside listener
  document.addEventListener("click", handleClickOutside);
});
</script>
