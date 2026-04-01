<template>
  <section class="timeline-heritage" ref="timelineRef">
    <div class="timeline-background">
      <canvas ref="particlesCanvas" class="timeline-particles"></canvas>
    </div>

    <div class="container-museum">
      <!-- 标题区 -->
      <div class="timeline-header" v-scroll-reveal>
        <span class="section-tag">非遗溯源</span>
        <h2 class="text-display-md">时间的重量</h2>
        <div class="divider-gold"></div>
        <p class="text-body-lg" style="color: var(--color-gray-light);">
          从宋代至今,泥彩人穿越千年时光<br>
          每个朝代都在这件艺术品上留下了独特的印记
        </p>
      </div>

      <!-- 时间轴主体 -->
      <div class="timeline-body">
        <!-- 中央时间线 -->
        <div class="timeline-line">
          <div class="line-progress" :style="{ height: progress + '%' }"></div>
        </div>

        <!-- 时间节点 -->
        <div
          v-for="(era, index) in eras"
          :key="index"
          :class="['timeline-era', { 'era-left': index % 2 === 0, 'era-right': index % 2 !== 0 }]"
          v-scroll-reveal="{ delay: index * 200 }"
        >
          <!-- 年份标记 -->
          <div class="era-year">
            <span class="year-text">{{ era.year }}</span>
            <div class="year-dot"></div>
          </div>

          <!-- 内容卡片 -->
          <div class="era-content">
            <div class="content-inner">
              <!-- 朝代印章 -->
              <div class="era-seal">{{ era.dynasty }}</div>

              <!-- 标题 -->
              <h3 class="era-title">{{ era.title }}</h3>

              <!-- 描述 -->
              <p class="era-description">{{ era.description }}</p>

              <!-- 特色 -->
              <ul class="era-features">
                <li v-for="(feature, i) in era.features" :key="i">
                  <span class="feature-icon">✦</span>
                  <span>{{ feature }}</span>
                </li>
              </ul>

              <!-- 泥彩人展示 -->
              <div class="era-artwork" v-if="era.artwork">
                <div class="artwork-frame">
                  <img :src="era.artwork" :alt="era.title">
                  <div class="artwork-shine"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { timelineParticles } from '@/utils/dustParticles';

const timelineRef = ref(null);
const particlesCanvas = ref(null);
const progress = ref(0);

let particlesInstance = null;

// 历史朝代数据
const eras = ref([
  {
    year: '宋代 (960-1279)',
    dynasty: '宋',
    title: '起源 · 民间初现',
    description: '泥彩人艺术在民间开始萌芽,主要用于节庆和祭祀活动。此时工艺相对简单,但已具备了基本的艺术特征。',
    features: [
      '民间节庆用品',
      '祭祀礼仪功能',
      '造型朴素生动',
      '色彩以红黑为主'
    ],
    artwork: '/src/assets/images/image1.png'
  },
  {
    year: '明代 (1368-1644)',
    dynasty: '明',
    title: '发展 · 工艺成熟',
    description: '泥彩人制作技艺日趋成熟,出现了专业的作坊和艺人。题材更加丰富,技艺更加精湛。',
    features: [
      '专业作坊兴起',
      '题材范围扩大',
      '彩绘技法精进',
      '形成地域特色'
    ],
    artwork: '/src/assets/images/image2.png'
  },
  {
    year: '清代 (1644-1912)',
    dynasty: '清',
    title: '鼎盛 · 宫廷青睐',
    description: '泥彩人艺术达到鼎盛时期,不仅流行于民间,更受到皇室的喜爱。成为贡品进入宫廷。',
    features: [
      '宫廷贡品地位',
      '技艺炉火纯青',
      '题材更加丰富',
      '艺术价值极高'
    ],
    artwork: '/src/assets/images/image1.png'
  },
  {
    year: '民国 (1912-1949)',
    dynasty: '民国',
    title: '传承 · 风俗融合',
    description: '在社会变革中,泥彩人艺术继续传承发展,并与新时代的民俗文化相融合。',
    features: [
      '传统与创新并存',
      '反映时代风貌',
      '民俗文化载体',
      '技艺得以保存'
    ],
    artwork: '/src/assets/images/image2.png'
  },
  {
    year: '当代 (1949-至今)',
    dynasty: '今',
    title: '新生 · 非遗保护',
    description: '泥彩人技艺入选国家级非物质文化遗产,得到系统性的保护与传承。在新时代焕发出新的生机。',
    features: [
      '国家级非遗项目',
      '建立传承机制',
      '与现代设计结合',
      '走向国际舞台'
    ],
    artwork: '/src/assets/images/image1.png'
  }
]);

// 计算滚动进度
const handleScroll = () => {
  if (!timelineRef.value) return;

  const rect = timelineRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const scrolled = windowHeight - rect.top;
  const totalHeight = rect.height;

  const newProgress = Math.min(Math.max((scrolled / totalHeight) * 100, 0), 100);
  progress.value = newProgress;
};

onMounted(() => {
  // 初始化粒子效果
  if (particlesCanvas.value && timelineRef.value) {
    particlesInstance = timelineParticles(timelineRef.value);
  }

  // 监听滚动
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);

  if (particlesInstance) {
    particlesInstance.destroy();
  }
});
</script>

<style scoped>
.timeline-heritage {
  position: relative;
  padding: 120px 0;
  background: linear-gradient(180deg, var(--color-dark) 0%, var(--color-dark-light) 100%);
  overflow: hidden;
}

/* === 背景粒子层 === */
.timeline-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.timeline-particles {
  width: 100%;
  height: 100%;
}

/* === 标题区 === */
.timeline-header {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 100px;
}

.section-tag {
  display: inline-block;
  padding: 10px 25px;
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  font-size: 14px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 20px;
  border-radius: 2px;
}

/* === 时间轴主体 === */
.timeline-body {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 中央时间线 */
.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: rgba(212, 175, 55, 0.2);
  transform: translateX(-50%);
}

.line-progress {
  width: 100%;
  background: var(--gradient-gold);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
  transition: height 0.1s linear;
}

/* === 时间节点 === */
.timeline-era {
  position: relative;
  margin-bottom: 120px;
  display: flex;
  align-items: center;
}

.timeline-era:last-child {
  margin-bottom: 0;
}

.era-left {
  flex-direction: row;
}

.era-right {
  flex-direction: row-reverse;
}

/* 年份标记 */
.era-year {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  text-align: center;
}

.year-text {
  display: inline-block;
  padding: 15px 25px;
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid var(--color-gold);
  color: var(--color-gold);
  font-family: 'Stele', serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.1em;
  backdrop-filter: blur(10px);
}

.year-dot {
  width: 16px;
  height: 16px;
  background: var(--color-gold);
  border-radius: 50%;
  margin: 10px auto 0;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
  position: relative;
}

.year-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid var(--color-gold);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.5;
  }
}

/* === 内容卡片 === */
.era-content {
  flex: 1;
  padding: 0 60px;
}

.era-left .era-content {
  text-align: right;
}

.era-right .era-content {
  text-align: left;
}

.content-inner {
  position: relative;
  background: rgba(44, 44, 44, 0.8);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  padding: 40px;
  backdrop-filter: blur(20px);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.content-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(212, 175, 55, 0.1) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.6s ease;
}

.content-inner:hover::before {
  opacity: 1;
}

.content-inner:hover {
  border-color: var(--color-gold);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
              inset 0 0 60px rgba(212, 175, 55, 0.1);
}

/* === 朝代印章 === */
.era-seal {
  display: inline-block;
  padding: 8px 20px;
  background: var(--color-accent);
  color: white;
  font-family: 'Stele', serif;
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 4px 15px rgba(196, 30, 58, 0.4);
}

/* === 标题 === */
.era-title {
  font-family: 'Stele', serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-bg);
  margin-bottom: 20px;
  letter-spacing: 0.1em;
}

.era-left .era-title {
  text-align: right;
}

/* === 描述 === */
.era-description {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(250, 246, 240, 0.8);
  margin-bottom: 30px;
}

.era-left .era-description {
  text-align: right;
}

/* === 特色列表 === */
.era-features {
  list-style: none;
  padding: 0;
  margin: 0 0 30px;
  display: inline-block;
}

.era-features li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--color-gold);
}

.era-left .era-features li {
  flex-direction: row-reverse;
}

.feature-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* === 艺术作品展示 === */
.era-artwork {
  margin-top: 30px;
}

.artwork-frame {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(212, 175, 55, 0.3);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.artwork-frame:hover {
  border-color: var(--color-gold);
  transform: scale(1.02);
  box-shadow: 0 15px 50px rgba(212, 175, 55, 0.3);
}

.artwork-frame img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.6s ease;
}

.artwork-frame:hover img {
  transform: scale(1.1);
}

.artwork-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 60%
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  animation: artworkShine 6s ease-in-out infinite;
}

@keyframes artworkShine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* === 响应式 === */
@media (max-width: 1024px) {
  .timeline-line {
    left: 30px;
  }

  .era-year {
    left: 30px;
    transform: none;
  }

  .era-left,
  .era-right {
    flex-direction: column;
    padding-left: 80px;
  }

  .era-content {
    padding: 0;
    text-align: left !important;
  }

  .era-title,
  .era-description {
    text-align: left !important;
  }

  .era-features li {
    flex-direction: row !important;
  }
}

@media (max-width: 768px) {
  .timeline-heritage {
    padding: 80px 0;
  }

  .era-title {
    font-size: 24px;
  }

  .content-inner {
    padding: 25px;
  }

  .year-text {
    font-size: 16px;
    padding: 10px 15px;
  }
}
</style>
