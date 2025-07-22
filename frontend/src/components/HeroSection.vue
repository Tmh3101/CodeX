<template>
  <section class="hero-bg py-32 md:py-48">
    <div class="container-custom text-center">
      <img
        src="@/assets/images/logo.png"
        alt="CodeX Logo"
        class="h-24 md:h-24 mx-auto mb-6 rounded-full"
        onerror="this.src='/assets/images/fallback-logo.png'; this.onerror=null;"
      />
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
        Welcome to CodeX – Hệ thống mượn sách thông minh
      </h1>
      <p class="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
        Khám phá thư viện số đầy tri thức — nhanh chóng, tiện lợi và đơn giản.
      </p>
      <button class="btn btn-primary text-lg px-6 py-3" @click="scrollToBooks">
        Khám phá ngay
      </button>
    </div>
  </section>
</template>

<script setup>
const scrollToBooks = () => {
  const booksSection = document.getElementById("books-section");
  if (booksSection) {
    booksSection.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<style scoped>
.hero-bg {
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url("@/assets/images/hero-bg.jpg");
  background-size: cover;
  background-position: center;
}
</style>
