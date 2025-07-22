<template>
  <section class="py-10 bg-white">
    <div class="container-custom">
      <form
        class="space-y-4"
        @submit.prevent="handleSearch"
      >
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search Input -->
          <div class="flex-grow">
            <label
              for="searchInput"
              class="block text-sm font-medium text-gray-700 mb-1"
            >Search Books</label>
            <input
              id="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Enter book title..."
              class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>

          <!-- Category Filter -->
          <div class="md:w-1/4">
            <label
              for="categoryFilter"
              class="block text-sm font-medium text-gray-700 mb-1"
            >Category</label>
            <select
              id="categoryFilter"
              v-model="selectedCategory"
              class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">
                All Categories
              </option>
              <option
                v-for="category in categories"
                :key="category._id"
                :value="category._id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex justify-center md:justify-end">
          <button
            type="submit"
            class="btn btn-primary px-6"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import axios from 'axios';

const emit = defineEmits(['search']);

const searchQuery = ref('');
const selectedCategory = ref('');
const selectedAuthor = ref('');
const selectedPublisher = ref('');

const categories = ref([]);
const authors = ref([]);
const publishers = ref([]);

onMounted(async () => {
  try {
    // Fetch all categories
    const categoriesResponse = await axios.get('/api/categories');
    categories.value = categoriesResponse.data;

    // Fetch all authors
    const authorsResponse = await axios.get('/api/authors');
    authors.value = authorsResponse.data;

    // Fetch all publishers
    const publishersResponse = await axios.get('/api/publishers');
    publishers.value = publishersResponse.data;
  } catch (error) {
    console.error('Error fetching filter data:', error);
  }
});

const handleSearch = () => {
  const searchParams = {
    search: searchQuery.value,
    categoryId: selectedCategory.value,
    authorId: selectedAuthor.value,
    publisherId: selectedPublisher.value,
    page: 1,
    limit: 12
  };
  
  emit('search', searchParams);
};
</script>