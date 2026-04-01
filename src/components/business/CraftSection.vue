<template>
  <section class="section craft dark-bg">
    <div class="bg-pattern"></div>
    <div class="container">
      <div class="section-header text-center" v-scroll-reveal>
        <span class="section-tag light">技艺 · Craft</span>
        <h2 class="section-heading light">七分塑，三分彩</h2>
        <p class="section-desc light">每一次捏塑都是与泥土的对话，每一笔彩绘都是灵魂的注入。</p>
      </div>

      <div class="craft-grid">
        <CraftCard v-for="(c, idx) in items" :key="idx" :icon="c.icon" :title="c.title" :description="c.desc"
          :delay="c.delay" />
      </div>

      <div class="craft-spotlight" v-scroll-reveal>
        <img :src="spotlightSrc" alt="匠人手部特写" class="spotlight-img">
      </div>
    </div>
  </section>
</template>

<script setup>
import CraftCard from './CraftCard.vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  // 使用静态路径作为默认值
  spotlightSrc: { type: String, default: '/src/assets/images/shoubu.png' }
});
</script>
