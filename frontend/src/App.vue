<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

onMounted(() => {
  auth.initialize();
  console.log("Auth info:", auth.user);
});
</script>

<style>
/* Global styles are imported in main.js */
</style>
