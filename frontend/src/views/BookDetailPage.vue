<template>
  <div>
    <AppHeader />

    <div class="container-custom py-10">
      <!-- Back Button -->
      <div class="mb-10">
        <router-link
          to="/"
          class="inline-flex items-center text-primary hover:text-primary-dark transition-colors duration-200 group"
        >
          <i
            class="pi pi-arrow-left text-lg mr-2 group-hover:-translate-x-1 transition-transform duration-200"
          ></i>
          <span class="font-medium">Quay về</span>
        </router-link>
      </div>

      <div v-if="loading" class="flex justify-center py-16">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        ></div>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <div class="text-red-500 text-lg mb-4">
          {{ error }}
        </div>
        <router-link to="/" class="btn btn-primary">
          Trở về trang chủ
        </router-link>
      </div>

      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <!-- Book Cover Image -->
          <div
            class="md:w-1/3 bg-gray-100 p-6 flex items-center justify-center"
          >
            <img
              :src="book.coverUrl"
              :alt="book.title"
              class="w-full max-w-xs object-contain"
            />
          </div>

          <!-- Book Details -->
          <div class="md:w-2/3 p-6 md:p-8">
            <div class="mb-4">
              <h1 class="text-2xl md:text-3xl font-bold mb-2 text-text-dark">
                {{ book.title }}
              </h1>
              <p class="text-gray-600 text-lg">
                <span class="font-semibold text-text-dark">Tác giả:</span>
                {{
                  book.authors.length
                    ? book.authors.length <= 2
                      ? book.authors.join(", ")
                      : `${book.authors.slice(0, 2).join(", ")}...`
                    : "Unknown"
                }}
              </p>
            </div>

            <div class="mb-4">
              <h2 class="text-lg font-semibold mb-2">Mô tả:</h2>
              <p class="text-gray-700 text-justify">
                {{ book.description }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mb-8">
              <div>
                <h3 class="font-semibold">Nhà xuất bản:</h3>
                <p class="text-gray-700">{{ book.publisher }}</p>
              </div>

              <div>
                <h3 class="font-semibold">Năm xuất bản:</h3>
                <p class="text-gray-700">{{ book.publishedYear || "N/A" }}</p>
              </div>

              <div>
                <h3 class="font-semibold">Thuộc thể loại:</h3>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span
                    v-for="(category, index) in book.categories"
                    :key="index"
                    class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                  >
                    {{ category }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="font-semibold text-lg mb-3">Trạng thái sách:</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Có sẵn -->
                <div
                  class="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                >
                  <div class="flex items-center justify-center mb-2">
                    <i
                      class="pi pi-check-circle text-green-600 text-xl mr-2"
                    ></i>
                    <span class="font-semibold text-green-800">Có sẵn</span>
                  </div>
                  <div class="text-2xl font-bold text-green-600">
                    {{ book.availableQuantity || 0 }}
                  </div>
                </div>

                <!-- Đang chờ duyệt -->
                <div
                  class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center"
                >
                  <div class="flex items-center justify-center mb-2">
                    <i class="pi pi-clock text-yellow-600 text-xl mr-2"></i>
                    <span class="font-semibold text-yellow-800">Chờ duyệt</span>
                  </div>
                  <div class="text-2xl font-bold text-yellow-600">
                    {{ book.pendingQuantity || 0 }}
                  </div>
                </div>

                <!-- Đã mượn -->
                <div
                  class="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
                >
                  <div class="flex items-center justify-center mb-2">
                    <i class="pi pi-bookmark text-red-600 text-xl mr-2"></i>
                    <span class="font-semibold text-red-800">Đang mượn</span>
                  </div>
                  <div class="text-2xl font-bold text-red-600">
                    {{ book.approvedQuantity || 0 }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button
                class="btn btn-primary flex-1 h-11"
                :disabled="book.availableQuantity <= 0"
                :class="{
                  'opacity-50 cursor-not-allowed': book.availableQuantity <= 0,
                }"
                @click="openBorrowModal"
              >
                <span v-if="book.availableQuantity > 0">Đăng ký mượn</span>
                <span v-else>Hết sách</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Borrow Modal -->
      <div
        v-if="showBorrowModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closeBorrowModal"
      >
        <div
          class="bg-white rounded-lg max-w-md w-full p-6 relative"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-text-dark">Đăng ký mượn sách</h3>
            <button
              @click="closeBorrowModal"
              class="text-gray-400 hover:text-gray-600 text-2xl"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>

          <!-- Book Info -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-start space-x-3">
              <img
                :src="book.coverUrl"
                :alt="book.title"
                class="w-16 h-20 object-cover rounded"
              />
              <div class="flex-1">
                <h4 class="font-semibold text-sm mb-1">{{ book.title }}</h4>
                <p class="text-xs text-gray-600 mb-2">
                  {{ book.authors?.join(", ") }}
                </p>
                <p class="text-xs text-green-600 font-medium">
                  Có sẵn: {{ book.availableQuantity }} cuốn
                </p>
              </div>
            </div>
          </div>

          <!-- Borrow Form -->
          <form @submit.prevent="submitBorrowRequest" class="space-y-4">
            <!-- Quantity -->
            <div>
              <label
                for="quantity"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Số lượng mượn <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center space-x-3">
                <button
                  type="button"
                  @click="decreaseQuantity"
                  :disabled="borrowForm.quantity <= 1"
                  class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="pi pi-minus text-xs"></i>
                </button>
                <input
                  id="quantity"
                  v-model.number="borrowForm.quantity"
                  type="number"
                  :min="1"
                  :max="book.availableQuantity"
                  required
                  class="w-20 text-center border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  @click="increaseQuantity"
                  :disabled="borrowForm.quantity >= book.availableQuantity"
                  class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="pi pi-plus text-xs"></i>
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Tối đa {{ book.availableQuantity }} cuốn
              </p>
            </div>

            <!-- Note -->
            <div>
              <label
                for="note"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Ghi chú (không bắt buộc)
              </label>
              <textarea
                id="note"
                v-model="borrowForm.note"
                rows="3"
                placeholder="Nhập ghi chú về yêu cầu mượn sách (tùy chọn)..."
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary resize-none"
              ></textarea>
            </div>

            <!-- Error Message -->
            <div
              v-if="borrowError"
              class="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm"
            >
              {{ borrowError }}
            </div>

            <!-- Form Actions -->
            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="closeBorrowModal"
                class="flex-1 btn btn-secondary"
                :disabled="isSubmitting"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="flex-1 btn btn-primary"
                :disabled="
                  isSubmitting || borrowForm.quantity > book.availableQuantity
                "
              >
                <span
                  v-if="isSubmitting"
                  class="flex items-center justify-center"
                >
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </span>
                <span v-else>Xác nhận mượn</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { bookService, borrowService } from "@/services";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const bookId = route.params.id;

const book = ref({});
const loading = ref(true);
const error = ref(null);

// Modal states
const showBorrowModal = ref(false);
const isSubmitting = ref(false);
const borrowError = ref(null);

// Borrow form data
const borrowForm = ref({
  quantity: 1,
  note: "",
});

const fetchBookDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await bookService.getById(bookId);
    book.value = response.data;
  } catch (err) {
    console.error("Error fetching book details:", err);
    error.value = "Failed to load book details. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Modal functions
const openBorrowModal = () => {
  if (!authStore.isAuthenticated) {
    alert("Bạn cần đăng nhập để mượn sách.");
    router.push("/login");
    return;
  }

  if (book.value.availableQuantity <= 0) return;

  // Reset form
  borrowForm.value = {
    quantity: 1,
    note: "",
  };
  borrowError.value = null;
  showBorrowModal.value = true;

  // Prevent body scroll
  document.body.style.overflow = "hidden";
};

const closeBorrowModal = () => {
  showBorrowModal.value = false;
  borrowError.value = null;

  // Restore body scroll
  document.body.style.overflow = "auto";
};

// Quantity controls
const increaseQuantity = () => {
  if (borrowForm.value.quantity < book.value.availableQuantity) {
    borrowForm.value.quantity++;
  }
};

const decreaseQuantity = () => {
  if (borrowForm.value.quantity > 1) {
    borrowForm.value.quantity--;
  }
};

// Submit borrow request
const submitBorrowRequest = async () => {
  if (isSubmitting.value) return;

  borrowError.value = null;
  isSubmitting.value = true;

  try {
    const borrowData = {
      bookId: book.value.bookId || book.value._id,
      quantity: borrowForm.value.quantity,
      note: borrowForm.value.note.trim() || undefined,
    };

    await borrowService.borrowBook(borrowData);

    // Close modal
    closeBorrowModal();

    // Show success message
    alert(
      `Đã gửi yêu cầu mượn sách "${book.value.title}" thành công! Bạn có thể theo dõi trạng thái trong "Sách mượn".`
    );

    // Redirect to my borrows page
    router.push("/my-borrows");
  } catch (err) {
    console.error("Error borrowing book:", err);

    // Extract error message from server response
    let errorMessage = "Có lỗi xảy ra khi mượn sách. Vui lòng thử lại.";

    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    borrowError.value = errorMessage;
  } finally {
    isSubmitting.value = false;
  }
};

// Legacy function for compatibility
const borrowBook = () => {
  openBorrowModal();
};

// Close modal on escape key
const handleEscapeKey = (event) => {
  if (event.key === "Escape" && showBorrowModal.value) {
    closeBorrowModal();
  }
};

onMounted(() => {
  fetchBookDetails();
  document.addEventListener("keydown", handleEscapeKey);
});

// Cleanup
import { onUnmounted } from "vue";
onUnmounted(() => {
  document.removeEventListener("keydown", handleEscapeKey);
  document.body.style.overflow = "auto";
});
</script>
