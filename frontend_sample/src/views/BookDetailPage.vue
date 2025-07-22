<template>
  <div>
    <AppHeader />

    <div class="container-custom py-10">
      <div v-if="loading" class="flex justify-center py-16">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        />
      </div>

      <div v-else-if="error" class="text-center py-16">
        <div class="text-red-500 text-lg mb-4">
          {{ error }}
        </div>
        <router-link to="/" class="btn btn-primary"> Back to Home </router-link>
      </div>

      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <!-- Book Cover Image -->
          <div
            class="md:w-1/3 bg-gray-100 p-6 flex items-center justify-center"
          >
            <img
              :src="
                book.coverUrl ||
                'https://via.placeholder.com/300x400?text=Cover'
              "
              :alt="book.title"
              class="w-full max-w-xs object-contain"
            />
          </div>

          <!-- Book Details -->
          <div class="md:w-2/3 p-6 md:p-8">
            <div class="mb-6">
              <h1 class="text-2xl md:text-3xl font-bold mb-2 text-text-dark">
                {{ book.title }}
              </h1>
              <p class="text-gray-600 text-lg">
                by
                {{ book.authors.length ? book.authors.join(", ") : "Unknown" }}
              </p>
            </div>

            <div class="mb-6">
              <h2 class="text-lg font-semibold mb-2">Description</h2>
              <p class="text-gray-700">
                {{ book.description }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              <div>
                <h3 class="font-medium text-gray-600">Publisher</h3>
                <p>{{ book.publisher }}</p>
              </div>

              <div>
                <h3 class="font-medium text-gray-600">Publish Year</h3>
                <p>{{ book.publishYear || "N/A" }}</p>
              </div>

              <div>
                <h3 class="font-medium text-gray-600">Categories</h3>
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

              <div>
                <h3 class="font-medium text-gray-600">Availability</h3>
                <p
                  class="font-semibold"
                  :class="book.quantity > 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{
                    book.quantity > 0
                      ? `${book.quantity} Available`
                      : "Out of Stock"
                  }}
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button
                class="btn btn-primary flex-1"
                :disabled="book.quantity <= 0"
                :class="{ 'opacity-50 cursor-not-allowed': book.quantity <= 0 }"
                @click="borrowBook"
              >
                Borrow
              </button>
              <router-link to="/" class="btn btn-secondary flex-1 text-center">
                Back to Books
              </router-link>
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
import axios from "axios";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";

const route = useRoute();
const bookId = route.params.id;

const book = ref({});
const loading = ref(true);
const error = ref(null);

const fetchBookDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`/api/books/${bookId}`);
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
