<template>
  <div class="app-wrapper">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <BackToTop />
    <BackgroundMusic />
    <ToastNotification />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import BackToTop from '@/components/ui/BackToTop.vue';
import BackgroundMusic from '@/components/layout/BackgroundMusic.vue';
import ToastNotification from '@/components/ui/ToastNotification.vue';
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>