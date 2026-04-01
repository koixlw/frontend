<template>
  <div class="craft-card" :style="{ animationDelay: delay + 'ms' }" v-scroll-reveal>
    <div class="card-icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: { type: String, default: '🏺' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  delay: { type: Number, default: 0 }
});
</script>
