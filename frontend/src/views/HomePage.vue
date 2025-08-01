<template>
  <div>
    <AppHeader />
    <HeroSection />
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <SearchFilters @search="handleSearch" />
      <BookGrid :searchParams="searchParams" />
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from "vue";
import AppHeader from "../components/AppHeader.vue";
import HeroSection from "../components/HeroSection.vue";
import SearchFilters from "../components/SearchFilters.vue";
import BookGrid from "../components/BookGrid.vue";
import AppFooter from "../components/AppFooter.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

if (auth.isStaff) {
  router.push(auth.getRedirectPath());
}

const searchParams = ref({
  search: "",
  categoryId: "",
  authorId: "",
  publisherId: "",
  page: 1,
  limit: 12,
});

const handleSearch = (params) => {
  searchParams.value = { ...params };
};
</script>
