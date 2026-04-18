<template>
  <div class="about-page">
    <!-- 头部 Hero 区域 -->
    <header class="hero-section">
      <video class="hero-video" autoplay muted loop playsinline poster="@/assets/images/content/xuanchuan.png">
        <source src="@/assets/video/lizihua.mp4" type="video/mp4">
      </video>
      <div class="hero-overlay"></div>

      <div class="container hero-content">
        <div class="hero-text-wrapper">
          <h1 class="main-title">
            <span class="title-line" :class="{ 's-visible': loaded }">守护非遗</span>
            <span class="title-line accent" :class="{ 's-visible': loaded }">重塑新生</span>
          </h1>
          <p class="subtitle" :class="{ 's-visible': loaded }">
            用数字科技温暖传统技艺 · 让千年泥彩人活在当下
          </p>
        </div>

        <div class="scroll-hint" @click="scrollToContent">
          <span class="mouse-icon"></span>
          <span class="arrow-down"></span>
        </div>
      </div>
    </header>

    <!-- 团队与使命 -->
    <section class="section mission-section" id="mission">
      <div class="container">
        <div class="mission-grid">
          <div class="mission-text" v-scroll-reveal>
            <span class="section-badge">ABOUT US</span>
            <h2 class="section-heading">一群追逐光的<br><span class="highlight-text">守艺人</span></h2>
            <div class="text-content">
              <p>
                我们是一群热爱传统文化的年轻人，来自设计、计算机、历史等不同专业背景。
                缘起于对<strong>泥彩人</strong>古老艺术的惊鸿一瞥，我们决定停下脚步，去倾听泥土的声音。
              </p>
              <p>
                面对非遗技艺面临的传承困境，我们一直在思考：
                如何让千年的泥彩人走出博物馆，走进年轻人的生活？
                我们试图用<strong>AI赋能</strong>、<strong>数字档案</strong>和<strong>创新文创</strong>，为这门千年手艺寻找通往未来的船票。
              </p>
            </div>

            <!-- 动态数据展示 -->
            <div class="stats-row" ref="statsRef">
              <div class="stat-item" v-for="(stat, index) in statistics" :key="index">
                <span class="stat-num">
                  {{ stat.isSymbol ? stat.value : Math.round(stat.current) }}{{ stat.suffix }}
                </span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>

          <div class="mission-image" v-scroll-reveal="{ delay: 200 }" @mousemove="handleImageParallax"
            @mouseleave="resetParallax">
            <div class="image-stack" :style="parallaxStyle">
              <div class="image-frame main-frame">
                <img src="@/assets/images/content/xuanchuan.png" alt="团队合影" class="team-img">
              </div>
              <div class="decorative-blob"></div>
              <div class="decorative-blob-2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心举措 -->
    <section class="section actions-section">
      <div class="bg-pattern"></div>
      <div class="container">
        <div class="section-header text-center" v-scroll-reveal>
          <span class="section-subtitle">我们的足迹 · OUR ACTIONS</span>
          <h2 class="section-heading-lg">科技与匠心的<span class="text-primary">交融</span></h2>
          <p class="section-desc">仅仅记录是不够的，我们致力于建立一个完整的数字化传承生态。</p>
        </div>

        <div class="actions-grid">
          <div class="action-card" v-scroll-reveal="{ delay: 100 }">
            <div class="card-icon-wrapper blue">
              <span class="icon">🎥</span>
            </div>
            <h3 class="card-title">数字化抢救</h3>
            <p class="card-text">
              走访多位非遗传承人，用4K高清影像记录制作全过程，建立高精度泥彩人数字纹样库，留存珍贵记忆。
            </p>
          </div>

          <div class="action-card" v-scroll-reveal="{ delay: 200 }">
            <div class="card-icon-wrapper purple">
              <span class="icon">🤖</span>
            </div>
            <h3 class="card-title">AI 赋能创作</h3>
            <p class="card-text">
              开发“文生图”与风格迁移工具，降低创作门槛。让每个人都能成为设计师，用AI致敬传统美学。
            </p>
          </div>

          <div class="action-card" v-scroll-reveal="{ delay: 300 }">
            <div class="card-icon-wrapper orange">
              <span class="icon">🎓</span>
            </div>
            <h3 class="card-title">校园薪火传承</h3>
            <p class="card-text">
              在四川大学锦江学院等高校开展工作坊。让指尖沾满泥土，让年轻的心感受匠人的温度。
            </p>
          </div>

          <div class="action-card" v-scroll-reveal="{ delay: 400 }">
            <div class="card-icon-wrapper red">
              <span class="icon">🎁</span>
            </div>
            <h3 class="card-title">国潮文创开发</h3>
            <p class="card-text">
              打破传统边界，设计符合现代审美的文创产品。让非遗不仅可观，更可玩、可用、可收藏。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 愿景与呼吁 -->
    <section class="section vision-section">
      <div class="vision-bg-overlay"></div>
      <div class="container vision-content" v-scroll-reveal>
        <h2 class="vision-title">传承不是守旧，而是创新</h2>
        <p class="vision-text">
          我们将继续探索“非遗+科技”的无界未来。<br>
          打造沉浸式虚拟展馆，开发寓教于乐的游戏...<br>
          让泥彩人成为连接过去与未来的文化纽带。<br>
          这一程，邀你同行。
        </p>
        <div class="cta-group">
          <router-link to="/contact" class="btn primary-btn pulse-anim">加入我们</router-link>
  
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted } from 'vue';

const loaded = ref(false);
const statsRef = ref(null);
const statistics = reactive([
  { label: '纹样采集', value: 500, current: 0, suffix: '+' },
  { label: '合作高校', value: 10, current: 0, suffix: '+' },
  { label: '创新可能', value: '∞', current: 0, suffix: '', isSymbol: true }
]);

// 视差效果状态
const parallaxStyle = ref({ transform: 'translate(0, 0)' });

onMounted(() => {
  // 1. 首屏动画
  setTimeout(() => {
    loaded.value = true;
  }, 100);

  // 2. 数字增长动画监听
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (statsRef.value) {
    observer.observe(statsRef.value);
  }
});

// 数字增长逻辑
const startCounting = () => {
  statistics.forEach(stat => {
    if (stat.isSymbol) return;

    // 简单的缓动增长
    const duration = 2000; // 2秒
    const start = 0;
    const end = stat.value;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuart 缓动函数
      const ease = 1 - Math.pow(1 - progress, 4);

      stat.current = start + (end - start) * ease;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  });
};

const scrollToContent = () => {
  const el = document.getElementById('mission');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

// 简单的鼠标视差逻辑
const handleImageParallax = (e) => {
  const { clientX, clientY } = e;
  // 计算相对于窗口中心的偏移
  const x = (clientX - window.innerWidth / 2) / 30; // 移动幅度因子
  const y = (clientY - window.innerHeight / 2) / 30;

  parallaxStyle.value = {
    transform: `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(10px)`
  };
};

const resetParallax = () => {
  parallaxStyle.value = {
    transform: 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)',
    transition: 'transform 0.5s ease'
  };
};
</script>

<style scoped>
.about-page {
  width: 100%;
  overflow-x: hidden;
  background-color: var(--color-bg);
}

/* --- Hero Section --- */
.hero-section {
  position: relative;
  height: 90vh;
  /* 优化首屏高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
}

.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(44, 30, 28, 0.4) 100%);
  z-index: 1;
  backdrop-filter: blur(1px);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: center;
}

.hero-text-wrapper {
  margin-bottom: 60px;
}

.main-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.title-line {
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  line-height: 1.2;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.title-line.accent {
  color: #ff6b62;
  /* 提亮色 */
  background: linear-gradient(to right, #ff6b62, #ff9f43);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition-delay: 0.2s;
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0;
  transform: translateY(20px);
  transition: all 1s ease-out;
  transition-delay: 0.5s;
}

.title-line.s-visible,
.subtitle.s-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Scroll Hint */
.scroll-hint {
  position: absolute;
  bottom: 40px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0.7;
  transition: opacity 0.3s;
  animation: float 2s infinite ease-in-out;
}

.scroll-hint:hover {
  opacity: 1;
}

.mouse-icon {
  width: 26px;
  height: 40px;
  border: 2px solid #fff;
  border-radius: 13px;
  position: relative;
}

.mouse-icon::after {
  content: '';
  position: absolute;
  top: 6px;
  left: 50%;
  margin-left: -2px;
  width: 4px;
  height: 6px;
  background-color: #fff;
  border-radius: 2px;
  animation: scrollWheel 1.5s infinite;
}

@keyframes scrollWheel {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(12px);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(10px);
  }
}

/* --- Section Styles --- */
.section {
  padding: 100px 0;
  position: relative;
}

.section-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-primary);
  background: rgba(217, 59, 48, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.section-heading {
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 30px;
  color: #2c3e50;
  font-weight: 800;
}

.highlight-text {
  color: var(--color-primary);
  position: relative;
  display: inline-block;
}

.highlight-text::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(248, 246, 246, 0.942);
  z-index: -1;
  border-radius: 4px;
}

/* --- Mission Section --- */
.mission-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.text-content p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
}

/* 统计数据样式优化 */
.stats-row {
  display: flex;
  gap: 50px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 2.5rem;
  /* 加大数字 */
  font-weight: 800;
  background: linear-gradient(135deg, #2c3e50 0%, #4a6fa5 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: var(--font-header, sans-serif);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #888;
  margin-top: 8px;
  letter-spacing: 1px;
}

/* 图片区域 - 有机形态优化 */
.image-stack {
  position: relative;
  padding: 20px;
  transform-style: preserve-3d;
  /* 开启3D视差 */
  transition: transform 0.1s ease-out;
  /* 丝滑跟随 */
}

.image-frame {
  position: relative;
  z-index: 2;
  border-radius: 24px 8px 24px 8px;
  /* 自定义圆角 */
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  transition: all 0.5s ease;
}

.image-frame.main-frame {
  border: 4px solid #fff;
  /* 白边框增加层次 */
}

.team-img {
  display: block;
  width: 100%;
  height: auto;
  transform: scale(1.02);
  /* 预放大防止露底 */
  transition: transform 0.5s;
}

.image-stack:hover .team-img {
  transform: scale(1.05);
}

/* 装饰性 Blob */
.decorative-blob {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, rgba(217, 59, 48, 0.1), rgba(255, 159, 67, 0.1));
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  /* 有机变形 */
  z-index: 1;
  animation: morph 8s ease-in-out infinite;
}

.decorative-blob-2 {
  position: absolute;
  bottom: -30px;
  left: -20px;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(44, 62, 80, 0.05));
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  z-index: 0;
  animation: morph 10s ease-in-out infinite reverse;
}

@keyframes morph {
  0% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }

  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }

  100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
}

/* --- Actions Section --- */
.actions-section {
  background-color: #fff;
  overflow: hidden;
}

.actions-section .bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(var(--color-primary) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.03;
  pointer-events: none;
}

.section-header {
  margin-bottom: 60px;
  position: relative;
  z-index: 2;
}

.section-heading-lg {
  font-size: 2.8rem;
  font-weight: 800;
  margin: 10px 0 20px;
}

.section-desc {
  font-size: 1.1rem;
  color: #777;
  max-width: 600px;
  margin: 0 auto;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 30px;
  position: relative;
  z-index: 2;
}

.action-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.4s ease;
  text-align: left;
}

.action-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(217, 59, 48, 0.1);
  border-color: rgba(217, 59, 48, 0.2);
}

.card-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 28px;
}

.blue {
  background: #e3f2fd;
  color: #1976d2;
}

.purple {
  background: #f3e5f5;
  color: #7b1fa2;
}

.orange {
  background: #fff3e0;
  color: #f57c00;
}

.red {
  background: #ffebee;
  color: #d32f2f;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #2c3e50;
}

.card-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #666;
}

/* --- Vision Section --- */
.vision-section {
  position: relative;
  background: #2c1e1c;
  color: #fff;
  text-align: center;
  padding: 120px 0;
}

.vision-bg-overlay {
  position: absolute;
  inset: 0;
  background-image: url('@/assets/images/content/shoubu.png');
  /* 使用手部图作为隐约背景 */
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  mix-blend-mode: overlay;
}

.vision-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.vision-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #fff 0%, #fdf6ec 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.vision-text {
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 50px;
}

.cta-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.primary-btn {
  background: #d93b30;
  color: #fff;
  padding: 14px 40px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(217, 59, 48, 0.3);
}

.outline-btn {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 14px 40px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s;
}

.primary-btn:hover {
  background: #ff4d42;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(217, 59, 48, 0.4);
}

.outline-btn:hover {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.pulse-anim {
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(217, 59, 48, 0.4);
  }

  70% {
    box-shadow: 0 0 0 20px rgba(217, 59, 48, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(217, 59, 48, 0);
  }
}

/* Responsiveness */
@media (max-width: 1024px) {
  .title-line {
    font-size: 3rem;
  }

  .mission-grid {
    gap: 40px;
  }

  .decorative-blob,
  .decorative-blob-2 {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .title-line {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
    padding: 0 20px;
  }

  .mission-grid {
    grid-template-columns: 1fr;
  }

  .stats-row {
    justify-content: space-around;
    gap: 20px;
  }

  .stat-num {
    font-size: 2rem;
  }

  .vision-title {
    font-size: 2rem;
  }

  .cta-group {
    flex-direction: column;
    align-items: stretch;
    max-width: 300px;
    margin: 0 auto;
  }

  .primary-btn,
  .outline-btn {
    text-align: center;
  }
}
</style>
