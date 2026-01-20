<template>
  <section class="enhanced-banner" ref="bannerRef">
    <!-- 粒子背景层 -->
    <canvas ref="particlesCanvas" class="particles-canvas"></canvas>

    <!-- 视频背景 -->
    <div class="video-background">
      <video autoplay muted loop playsinline class="background-video">
        <source src="@/assets/video/lizihua.mp4" type="video/mp4">
      </video>
      <div class="video-overlay"></div>
    </div>

    <!-- 轮播内容 -->
    <div class="banner-slider">
      <div class="banner-track" :style="trackStyle">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="banner-item"
          :class="{ active: currentIndex === index }"
        >
          <img :src="slide.image" :alt="slide.title" class="banner-img">
          <div class="banner-content">
            <h2 class="banner-title">
              <span
                v-for="(char, i) in slide.title.split('')"
                :key="i"
                class="title-char"
                :style="{ animationDelay: `${i * 0.05}s` }"
              >{{ char }}</span>
            </h2>
            <p class="banner-subtitle">{{ slide.subtitle }}</p>
            <div class="banner-cta">
              <component
                :is="slide.isRouter ? 'router-link' : 'a'"
                :to="slide.link"
                :href="slide.link"
                class="cta-button magnetic-btn"
              >
                <span class="btn-text">{{ slide.ctaText }}</span>
                <span class="btn-icon">→</span>
              </component>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <button class="nav-button nav-prev" @click="prevSlide" aria-label="上一张">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <button class="nav-button nav-next" @click="nextSlide" aria-label="下一张">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>

    <!-- 指示器 -->
    <div class="indicators">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        :class="['indicator', { active: currentIndex === index }]"
        @click="goToSlide(index)"
        :aria-label="`前往第 ${index + 1} 张`"
      >
        <span class="indicator-progress" :style="{ width: getProgressWidth(index) }"></span>
      </button>
    </div>

    <!-- 滚动提示 -->
    <div class="scroll-indicator" @click="scrollToContent">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <span class="scroll-text">向下滚动</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { initParticles } from '@/utils/particles';

const props = defineProps({
  slides: {
    type: Array,
    default: () => [
      {
        image: '/src/assets/images/battle.png',
        title: '泥彩入心，传承非遗之美',
        subtitle: '让古老的泥彩艺术，与当代生活温柔相遇',
        ctaText: '立即预约',
        link: '/reserve',
        isRouter: true
      },
      {
        image: '/src/assets/images/image1.png',
        title: '老手艺，新玩法',
        subtitle: 'AI正在让泥彩人"动起来、潮起来、火起来"',
        ctaText: '探索AI工具',
        link: '#ai-tools',
        isRouter: false
      },
      {
        image: '/src/assets/images/chuanchengren.jpg',
        title: '别让老记忆，悄悄消失',
        subtitle: '和2,000+人一起，用AI传承非遗',
        ctaText: '加入我们',
        link: '/contact',
        isRouter: true
      }
    ]
  }
});

const emit = defineEmits(['scroll-to-content']);

const currentIndex = ref(0);
const bannerRef = ref(null);
const particlesCanvas = ref(null);
const isTransitioning = ref(false);
let autoplayTimer = null;
let particlesInstance = null;

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`
}));

// 获取进度条宽度
const getProgressWidth = (index) => {
  if (index < currentIndex.value) return '100%';
  if (index === currentIndex.value) return '0%';
  return '0%';
};

const nextSlide = () => {
  if (isTransitioning.value) return;
  currentIndex.value = (currentIndex.value + 1) % props.slides.length;
  resetAutoplay();
};

const prevSlide = () => {
  if (isTransitioning.value) return;
  currentIndex.value = (currentIndex.value - 1 + props.slides.length) % props.slides.length;
  resetAutoplay();
};

const goToSlide = (index) => {
  if (isTransitioning.value || index === currentIndex.value) return;
  currentIndex.value = index;
  resetAutoplay();
};

const startAutoplay = () => {
  autoplayTimer = setInterval(nextSlide, 6000);
};

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
};

const resetAutoplay = () => {
  stopAutoplay();
  startAutoplay();
};

const scrollToContent = () => {
  emit('scroll-to-content');
};

// 磁性按钮效果
const initMagneticButtons = () => {
  const buttons = bannerRef.value?.querySelectorAll('.magnetic-btn');
  buttons?.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
};

onMounted(() => {
  startAutoplay();
  initMagneticButtons();

  // 初始化粒子效果
  if (particlesCanvas.value) {
    particlesInstance = initParticles(particlesCanvas.value);
  }

  // 鼠标悬停时暂停自动播放
  const banner = bannerRef.value;
  banner?.addEventListener('mouseenter', stopAutoplay);
  banner?.addEventListener('mouseleave', startAutoplay);
});

onUnmounted(() => {
  stopAutoplay();
  if (particlesInstance) {
    particlesInstance.destroy();
  }
});
</script>

<style scoped>
.enhanced-banner {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* 粒子画布 */
.particles-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

/* 视频背景 */
.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(44, 30, 28, 0.7) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

/* 轮播内容 */
.banner-slider {
  position: relative;
  height: 100%;
  z-index: 3;
}

.banner-track {
  display: flex;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}

.banner-item {
  flex: 0 0 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.banner-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 10%;
  color: white;
}

/* 标题动画 */
.banner-title {
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 24px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.title-char {
  display: inline-block;
  opacity: 0;
  animation: charFadeIn 0.6s ease forwards;
}

@keyframes charFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) rotate(-5deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}

.banner-item.active .title-char {
  animation-play-state: running;
}

.banner-subtitle {
  font-size: clamp(18px, 2.5vw, 28px);
  font-weight: 300;
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeInUp 0.8s ease 0.5s forwards;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* CTA按钮 */
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 40px;
  background: linear-gradient(135deg, #d93b30 0%, #c45a3c 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(217, 59, 48, 0.4);
  opacity: 0;
  animation: fadeInUp 0.8s ease 0.8s forwards;
}

.cta-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.cta-button:hover::before {
  transform: translateX(100%);
}

.cta-button:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(217, 59, 48, 0.6);
}

.btn-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.cta-button:hover .btn-icon {
  transform: translateX(5px);
}

/* 导航按钮 */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
}

.nav-button svg {
  width: 24px;
  height: 24px;
}

.nav-button:hover {
  background: rgba(217, 59, 48, 0.8);
  border-color: #d93b30;
  transform: translateY(-50%) scale(1.1);
}

.nav-prev {
  left: 30px;
}

.nav-next {
  right: 30px;
}

/* 指示器 */
.indicators {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  z-index: 10;
}

.indicator {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
}

.indicator.active {
  background: rgba(255, 255, 255, 0.8);
}

.indicator-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #d93b30;
  transition: width 0.3s ease;
}

/* 滚动指示器 */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  z-index: 10;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

.mouse {
  width: 26px;
  height: 42px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 13px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.wheel {
  width: 4px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  animation: scroll 2s infinite;
}

@keyframes scroll {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(16px);
    opacity: 0;
  }
}

.scroll-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* 响应式 */
@media (max-width: 768px) {
  .nav-prev {
    left: 15px;
  }

  .nav-next {
    right: 15px;
  }

  .indicators {
    bottom: 120px;
    gap: 8px;
  }

  .indicator {
    width: 40px;
  }
}
</style>
