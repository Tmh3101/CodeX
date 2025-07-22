<template>
  <section class="bg-background-light py-12 md:py-20">
    <div class="container-custom text-center">
      <img 
        src="/assets/images/logo.png" 
        alt="CodeX Logo" 
        class="h-16 md:h-20 mx-auto mb-6"
        onerror="this.src='/assets/images/fallback-logo.png'; this.onerror=null;"
      >
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-text-dark">
        Welcome to CodeX – Smart Book Borrowing System
      </h1>
      <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        Explore a digital library full of knowledge — fast, convenient, and simple.
      </p>
      <button 
        class="btn btn-primary text-lg px-6 py-3" 
        @click="scrollToBooks"
      >
        Explore Now
      </button>
    </div>
  </section>
</template>

<script setup>
const scrollToBooks = () => {
  const booksSection = document.getElementById('books-section');
  if (booksSection) {
    booksSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>