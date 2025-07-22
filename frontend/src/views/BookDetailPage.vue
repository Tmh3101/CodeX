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
                    {{ book.totalPending || 0 }}
                  </div>
                </div>

                <!-- Đã mượn -->
                <div
                  class="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
                >
                  <div class="flex items-center justify-center mb-2">
                    <i class="pi pi-bookmark text-red-600 text-xl mr-2"></i>
                    <span class="font-semibold text-red-800">Đã mượn</span>
                  </div>
                  <div class="text-2xl font-bold text-red-600">
                    {{ book.totalApproved || 0 }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button
                class="btn btn-primary flex-1 h-11"
                :disabled="book.quantity <= 0"
                :class="{ 'opacity-50 cursor-not-allowed': book.quantity <= 0 }"
                @click="borrowBook"
              >
                Đăng ký mượn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { bookService } from "@/services";

const route = useRoute();
const bookId = route.params.id;

const book = ref({});
const loading = ref(true);
const error = ref(null);

const fetchBookDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await bookService.getBookById(bookId);
    book.value = response.data;
  } catch (err) {
    console.error("Error fetching book details:", err);
    error.value = "Failed to load book details. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const borrowBook = async () => {
  if (book.value.quantity <= 0) return;

  try {
    // This would be your API call to borrow the book
    // await axios.post('/api/borrows', { bookId: book.value._id });

    // For demo purposes, we'll just show an alert
    alert(
      `You have borrowed "${book.value.title}". You can find it in "My Borrows".`
    );
  } catch (error) {
    console.error("Error borrowing book:", error);
    alert("Failed to borrow the book. Please try again.");
  }
};

onMounted(fetchBookDetails);
</script>
