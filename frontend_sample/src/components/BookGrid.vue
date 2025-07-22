<template>
  <section id="books-section" class="py-10 bg-white">
    <div class="container-custom">
      <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center">
        Available Books
      </h2>

      <div v-if="loading" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        />
      </div>

      <div v-else-if="books.length === 0" class="text-center py-10">
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p class="text-xl text-gray-600">
          No books found matching your criteria.
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="book in books"
          :key="book._id"
          class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div class="aspect-w-3 aspect-h-4 bg-gray-100">
            <img
              :src="
                book.coverUrl ||
                'https://via.placeholder.com/300x400?text=Cover'
              "
              :alt="book.title"
              class="object-cover w-full h-48 sm:h-64"
            />
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-1 truncate" :title="book.title">
              {{ book.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-2">
              {{ book.authors.length ? book.authors.join(", ") : "Unknown" }}
            </p>
            <div class="mb-2">
              <div class="flex justify-between mb-1">
                <span class="text-sm text-gray-600">
                  {{ book.publishYear || "Year N/A" }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">
                  <span
                    v-if="book.quantity > 0"
                    class="text-green-600 font-medium"
                    >{{ book.quantity }} Available</span
                  >
                  <span v-else class="text-red-600 font-medium"
                    >Out of Stock</span
                  >
                </span>
              </div>
            </div>
            <router-link
              :to="`/books/${book.bookId}`"
              class="btn btn-secondary w-full text-center block"
            >
              Details
            </router-link>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-8 flex justify-center">
        <div class="flex space-x-2">
          <button
            :disabled="currentPage === 1"
            class="btn px-3 py-1"
            :class="
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'btn-secondary'
            "
            @click="changePage(currentPage - 1)"
          >
            Previous
          </button>

          <button
            v-for="page in paginationRange"
            :key="page"
            class="btn px-3 py-1"
            :class="
              page === currentPage ? 'bg-primary text-white' : 'btn-secondary'
            "
            @click="changePage(page)"
          >
            {{ page }}
          </button>

          <button
            :disabled="currentPage === pagination.totalPages"
            class="btn px-3 py-1"
            :class="
              currentPage === pagination.totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'btn-secondary'
            "
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";

const props = defineProps({
  searchParams: {
    type: Object,
    default: () => ({
      search: "",
      categoryId: "",
      authorId: "",
      publisherId: "",
      page: 1,
      limit: 12,
    }),
  },
});

const books = ref([]);
const loading = ref(true);
const pagination = ref({
  page: 1,
  limit: 12,
  totalPages: 1,
  totalItems: 0,
});
const currentPage = ref(1);

// Compute visible pagination numbers
const paginationRange = computed(() => {
  const range = [];
  const totalPages = pagination.value.totalPages;
  const maxButtons = 5;

  if (totalPages <= maxButtons) {
    // If total pages are less than max buttons, show all pages
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
  } else {
    // Calculate range based on current page
    let start = Math.max(1, currentPage.value - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    // Adjust start if end is at max
    if (end === totalPages) {
      start = Math.max(1, totalPages - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
  }

  return range;
});

// Fetch books when mounted or search params change
const fetchBooks = async () => {
  loading.value = true;

  try {
    const params = {
      search: props.searchParams.search,
      categoryId: props.searchParams.categoryId,
      authorId: props.searchParams.authorId,
      publisherId: props.searchParams.publisherId,
      page: currentPage.value,
      limit: props.searchParams.limit,
    };

    // Filter out empty params
    Object.keys(params).forEach((key) => {
      if (!params[key]) {
        delete params[key];
      }
    });

    const response = await axios.get("/api/books", { params });
    books.value = response.data.data;
    pagination.value = response.data.pagination;
  } catch (error) {
    console.error("Error fetching books:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBooks);

watch(
  () => props.searchParams,
  () => {
    currentPage.value = 1;
    fetchBooks();
  },
  { deep: true }
);

// Change page function
const changePage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return;
  currentPage.value = page;
  fetchBooks();
};
</script>

<style scoped>
.aspect-w-3 {
  position: relative;
  padding-bottom: calc(4 / 3 * 100%);
}

.aspect-w-3 > img {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
