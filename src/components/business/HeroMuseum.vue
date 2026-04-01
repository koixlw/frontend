<template>
  <section class="hero-museum" ref="heroRef">
    <!-- 背景视频层 -->
    <div class="hero-background">
      <video
        ref="videoRef"
        autoplay
        muted
        loop
        playsinline
        class="hero-video"
      >
        <source src="@/assets/video/lizihua.mp4" type="video/mp4">
      </video>

      <!-- 墨色渐变遮罩 -->
      <div class="hero-overlay overlay-ink"></div>

      <!-- 粒子灰尘层 -->
      <canvas ref="particlesCanvas" class="particles-layer"></canvas>
    </div>

    <!-- 主内容区 -->
    <div class="hero-content">
      <!-- 碑刻风格标题 -->
      <div class="hero-titles">
        <h1 class="hero-title">
          <span
            v-for="(line, index) in titleLines"
            :key="index"
            class="title-line"
            :style="{ animationDelay: `${index * 0.3}s` }"
          >
            <span
              v-for="(char, i) in line.split('')"
              :key="i"
              class="title-char"
              :style="{ animationDelay: `${(index * 0.3) + (i * 0.05)}s` }"
            >
              {{ char }}
            </span>
          </span>
        </h1>

        <p class="hero-subtitle text-body-lg">
          <span class="subtitle-text">{{ subtitleText }}</span>
          <span class="subtitle-cursor">|</span>
        </p>
      </div>

      <!-- 唯一CTA按钮 - 震撼设计 -->
      <button class="hero-cta" @click="enterMuseum">
        <span class="cta-bg"></span>
        <span class="cta-text">进入非遗世界</span>
        <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
      </button>

      <!-- 滚动提示 -->
      <div class="scroll-hint" @click="scrollToContent">
        <div class="hint-text">向下滚动</div>
        <div class="hint-line"></div>
        <div class="hint-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 泥土纹理叠加 -->
    <div class="hero-texture texture-earth noise-overlay vignette"></div>

    <!-- 底部装饰线 -->
    <div class="hero-bottom-line">
      <div class="line-progress" :style="{ width: scrollProgress + '%' }"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { initDustParticles } from '@/utils/dustParticles';

const emit = defineEmits(['enter-museum', 'scroll-to-content']);

const heroRef = ref(null);
const videoRef = ref(null);
const particlesCanvas = ref(null);

// 标题文案 - 碑刻风格
const titleLines = ref(['一抔泥土', '千年匠心']);
const subtitleText = ref('国家级非物质文化遗产 · 泥彩人');
const scrollProgress = ref(0);

let particlesInstance = null;

// 进入博物馆
const enterMuseum = () => {
  // 添加转场动画
  heroRef.value?.classList.add('hero-exit');

  setTimeout(() => {
    emit('enter-museum');
  }, 800);
};

// 滚动到内容区
const scrollToContent = () => {
  emit('scroll-to-content');
};

// 监听滚动进度
const handleScroll = () => {
  const scrollTop = window.pageYOffset;
  const windowHeight = window.innerHeight;
  const progress = Math.min((scrollTop / windowHeight) * 100, 100);
  scrollProgress.value = progress;
};

onMounted(() => {
  // 初始化粒子效果
  if (particlesCanvas.value) {
    particlesInstance = initDustParticles(particlesCanvas.value);
  }

  // 视频播放优化
  if (videoRef.value) {
    videoRef.value.playbackRate = 0.8; // 慢动作效果
  }

  // 监听滚动
  window.addEventListener('scroll', handleScroll);

  // 视频加载失败时显示备用背景
  if (videoRef.value) {
    videoRef.value.addEventListener('error', () => {
      heroRef.value?.classList.add('video-fallback');
    });
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);

  if (particlesInstance) {
    particlesInstance.destroy();
  }
});
</script>

<style scoped>
/* === 英雄区容器 === */
.hero-museum {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: var(--color-dark);
}

/* === 背景视频层 === */
.hero-background {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
  filter: contrast(1.1) saturate(0.9);
}

/* 视频加载失败时的备用背景 */
.video-fallback .hero-background {
  background:
    linear-gradient(135deg, rgba(139, 69, 19, 0.9) 0%, rgba(44, 30, 28, 0.95) 100%),
    url('@/assets/images/image1.png');
  background-size: cover;
  background-position: center;
}

/* === 遮罩层 === */
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    to bottom,
    rgba(26, 26, 26, 0.4) 0%,
    rgba(26, 26, 26, 0.6) 50%,
    rgba(26, 26, 26, 0.85) 100%
  );
}

/* === 粒子层 === */
.particles-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

/* === 纹理层 === */
.hero-texture {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

/* === 主内容区 === */
.hero-content {
  position: relative;
  z-index: 5;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

/* === 碑刻标题 === */
.hero-titles {
  text-align: center;
  margin-bottom: 60px;
}

.hero-title {
  font-family: 'Stele', serif;
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 900;
  line-height: 1.3;
  color: var(--color-bg);
  text-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 8px 40px rgba(0, 0, 0, 0.3);
  margin-bottom: 40px;
  letter-spacing: 0.1em;
}

.title-line {
  display: block;
  margin: 20px 0;
}

.title-char {
  display: inline-block;
  opacity: 0;
  animation: steleRise 0.8s ease forwards;
  filter: blur(10px);
}

@keyframes steleRise {
  0% {
    opacity: 0;
    transform: translateY(40px) rotateX(-15deg);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0);
    filter: blur(0);
  }
}

/* === 副标题 === */
.hero-subtitle {
  color: rgba(250, 246, 240, 0.9);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: clamp(14px, 2vw, 18px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.subtitle-text {
  opacity: 0;
  animation: fadeInUp 1s ease 1.5s forwards;
}

.subtitle-cursor {
  animation: blink 1s infinite;
  opacity: 0;
  animation: blink 1s infinite 2s;
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

@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* === CTA按钮 === */
.hero-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 24px 60px;
  background: transparent;
  border: 2px solid var(--color-gold);
  color: var(--color-gold);
  font-family: 'Stele', serif;
  font-size: clamp(18px, 3vw, 24px);
  font-weight: 700;
  letter-spacing: 0.2em;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  opacity: 0;
  animation: fadeInUp 1s ease 2s forwards;
}

.cta-bg {
  position: absolute;
  inset: 0;
  background: var(--gradient-gold);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: -1;
}

.hero-cta:hover {
  border-color: var(--color-gold);
  color: var(--color-dark);
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(212, 175, 55, 0.4);
}

.hero-cta:hover .cta-bg {
  transform: scaleX(1);
}

.cta-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.4s ease;
}

.hero-cta:hover .cta-icon {
  transform: rotate(180deg) scale(1.2);
}

/* === 滚动提示 === */
.scroll-hint {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  opacity: 0;
  animation: fadeInUp 1s ease 2.5s forwards;
  transition: all 0.3s ease;
}

.scroll-hint:hover {
  transform: translateX(-50%) translateY(-5px);
}

.hint-text {
  color: rgba(250, 246, 240, 0.7);
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
}

.hint-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(
    to bottom,
    rgba(212, 175, 55, 0) 0%,
    rgba(212, 175, 55, 0.8) 50%,
    rgba(212, 175, 55, 0) 100%
  );
  animation: scrollLine 2s ease-in-out infinite;
}

@keyframes scrollLine {
  0%, 100% {
    transform: scaleY(0);
    transform-origin: top;
  }
  50% {
    transform: scaleY(1);
    transform-origin: top;
  }
  51% {
    transform: scaleY(1);
    transform-origin: bottom;
  }
  100% {
    transform: scaleY(0);
    transform-origin: bottom;
  }
}

.hint-arrow {
  width: 24px;
  height: 24px;
  color: var(--color-gold);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* === 底部进度线 === */
.hero-bottom-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(212, 175, 55, 0.2);
  z-index: 10;
}

.line-progress {
  height: 100%;
  background: var(--gradient-gold);
  transition: width 0.1s linear;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
}

/* === 退出动画 === */
.hero-museum.hero-exit {
  animation: heroFadeOut 1s ease forwards;
}

@keyframes heroFadeOut {
  to {
    opacity: 0;
    transform: scale(1.1);
    filter: blur(20px);
  }
}

/* === 响应式 === */
@media (max-width: 768px) {
  .hero-title {
    font-size: 48px;
  }

  .hero-cta {
    padding: 18px 40px;
    font-size: 16px;
  }

  .scroll-hint {
    bottom: 40px;
  }
}

/* === 可访问性 === */
@media (prefers-reduced-motion: reduce) {
  .title-char,
  .subtitle-text,
  .hero-cta,
  .scroll-hint,
  .hint-line,
  .hint-arrow {
    animation: none;
    opacity: 1;
  }

  .hero-video {
    filter: none;
  }
}
</style>
