<template>
  <footer class="bg-background-light py-8 border-t border-gray-200">
    <div class="container-custom">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="mb-6 md:mb-0 flex items-center">
          <img
            src="@/assets/images/logo.png"
            alt="CodeX Logo"
            class="h-12 mr-2"
            onerror="this.src='/assets/images/fallback-logo.png'; this.onerror=null;"
          />
        </div>

        <div class="text-center md:text-left mb-4 md:mb-0">
          <p class="text-gray-600 text-sm">
            &copy; {{ currentYear }} CodeX Book Borrowing System. All rights
            reserved.
          </p>
        </div>

        <div class="flex flex-col items-center md:items-end">
          <p class="text-gray-600 text-sm mb-1">Contact Us</p>
          <a
            href="mailto:support@codex-library.com"
            class="text-primary text-sm hover:underline"
            >support@codex-library.com</a
          >
          <p class="text-gray-600 text-sm">Hotline: +1 (555) 123-4567</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";

const currentYear = ref(new Date().getFullYear());
</script>
