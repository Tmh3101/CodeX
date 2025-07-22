<template>
  <div>
    <AppHeader />
    <HeroSection />
    <SearchFilters @search="handleSearch" />
    <BookGrid :search-params="searchParams" />
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import HeroSection from '../components/HeroSection.vue';
import SearchFilters from '../components/SearchFilters.vue';
import BookGrid from '../components/BookGrid.vue';
import AppFooter from '../components/AppFooter.vue';

const searchParams = ref({
  search: '',
  categoryId: '',
  authorId: '',
  publisherId: '',
  page: 1,
  limit: 12
});

const handleSearch = (params) => {
  searchParams.value = { ...params };
};
</script>