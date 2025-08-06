<template>
  <section class="py-10 bg-white">
    <div class="container-custom">
      <form class="space-y-4" @submit.prevent="handleSearch">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search Input -->
          <div class="flex-grow">
            <label
              for="searchInput"
              class="block text-xl font-bold text-gray-700 mb-1"
              >Tìm kiếm sách</label
            >
            <input
              id="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Nhập vào tên sách"
              class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Category Filter -->
          <div class="md:w-1/4">
            <label
              for="categoryFilter"
              class="block text-xl font-bold text-gray-700 mb-1"
              >Thể loại</label
            >
            <select
              id="categoryFilter"
              v-model="selectedCategory"
              class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option
                v-for="category in categories"
                :key="category._id"
                :value="category._id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="flex mt-8 mb-1 justify-center md:justify-end">
            <button type="submit" class="btn btn-primary px-6">Tìm kiếm</button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { categoryService } from "@/services";

const emit = defineEmits(["search"]);

const searchQuery = ref("");
const selectedCategory = ref("");
const selectedAuthor = ref("");
const selectedPublisher = ref("");

const categories = ref([]);

onMounted(async () => {
  try {
    // Fetch all categories
    const categoriesResponse = await categoryService.getAll();
    console.log(categoriesResponse);
    categories.value = categoriesResponse.data;
  } catch (error) {
    console.error("Error fetching filter data:", error);
  }
});

const handleSearch = () => {
  const searchParams = {
    search: searchQuery.value,
    categoryId: selectedCategory.value,
    authorId: selectedAuthor.value,
    publisherId: selectedPublisher.value,
    page: 1, // Reset to first page on new search
    limit: 12, // Default limit
  };

  emit("search", searchParams);
};
</script>
