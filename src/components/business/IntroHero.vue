<template>
  <header class="hero" @mousemove="handleMouseMove">
    <video class="hero-bg-video" autoplay muted loop playsinline>
      <source :src="videoSrc" type="video/mp4">
    </video>
    <div class="hero-overlay"></div>

    <div class="hero-content container">
      <h1 class="hero-title">
        <span class="char-block" v-for="(char, index) in titleChars" :key="index"
          :style="{ animationDelay: index * 0.15 + 's' }">
          {{ char }}
        </span>
      </h1>
      <p class="hero-subtitle fade-in-up">{{ subtitle }}</p>
      <div class="scroll-indicator" @click="scrollToStart">
        <span class="line"></span>
        <span class="text">探索旅程</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useAttrs } from 'vue';

const props = defineProps({
  title: { type: String, default: '泥韵千秋' },
  subtitle: { type: String, default: '从指尖的温度，到数字的永恒' },
  // 使用静态路径，避免在运行时依赖 require
  videoSrc: { type: String, default: '/src/assets/video/lizihua.mp4' }
});

const titleChars = computed(() => props.title.split(''));

const scrollToStart = () => {
  const el = document.getElementById('start');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const handleMouseMove = (e) => {
  // 保留 hook，按需实现视差效果
};
</script>
