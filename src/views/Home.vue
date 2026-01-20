<template>
  <div class="home">
    <!-- 轮播图 Banner -->
    <section class="banner" @mouseenter="pauseAutoPlay" @mouseleave="restartAutoPlay">
      <div class="banner-slider">
        <div class="banner-track" :style="bannerTrackStyle">
          <div class="banner-item">
            <img src="../assets/images/battle.png" alt="泥彩人非遗文化" class="banner-img">
            <div class="banner-content">
              <h2 class="banner-title">泥彩入心，传承非遗之美</h2>
              <p class="banner-subtitle">让古老的泥彩艺术，与当代生活温柔相遇</p>
              <div class="banner-ctas">
                <router-link to="/reserve" class="banner-btn" @click="triggerButtonAnimation">立即预约</router-link>
              </div>
            </div>
          </div>
          <div class="banner-item">
            <img src="../assets/images/image1.png" alt="泥彩人作品展示" class="banner-img">
            <div class="banner-content">
              <h2 class="banner-title">老手艺，新玩法</h2>
              <p class="banner-subtitle">AI正在让泥彩人“动起来、潮起来、火起来”</p>
              <a href="#ai-tools" class="banner-btn" @click="triggerButtonAnimation">看看AI怎么玩转非遗</a>
            </div>
          </div>
          <div class="banner-item">
            <img src="../assets/images/chuanchengren.jpg" alt="泥彩人体验活动" class="banner-img">
            <div class="banner-content">
              <h2 class="banner-title">别让老记忆，悄悄消失</h2>
              <p class="banner-subtitle">和2,000+人一起，用AI传承非遗</p>
              <router-link to="/contact" class="banner-btn" @click="triggerButtonAnimation">加入非遗传承者</router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- 轮播指示器 -->
      <div class="banner-indicators">
        <span class="indicator active" @click="setActiveSlide(0)"></span>
        <span class="indicator" @click="setActiveSlide(1)"></span>
        <span class="indicator" @click="setActiveSlide(2)"></span>
      </div>

      <button class="banner-arrow banner-arrow-left" @click="handlePrevSlide">&lt;</button>
      <button class="banner-arrow banner-arrow-right" @click="handleNextSlide">&gt;</button>

      <!-- 滚动提示 -->
      <div class="scroll-down" @click="scrollToContent">
        <span class="scroll-text">探索更多</span>
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- 关于泥彩人 -->
    <section class="about-section">
      <div class="container">
        <p class="section-subtitle" v-scroll-reveal>泥与彩的故事，从宋风走来</p>
        <h2 class="section-title" v-scroll-reveal>关于泥彩人</h2>
        <div class="about-content" v-scroll-reveal>
          <div class="about-text">
            <p class="about-paragraph">
              泥彩人是中国传统民间艺术的瑰宝，起源于宋代，至今已有千年历史。它以细腻的泥质、鲜艳的色彩、生动的形象著称，
              是中国非物质文化遗产的重要组成部分。泥彩人不仅是一种艺术形式，更是中华民族智慧和文化的传承。
            </p>
            <p class="about-paragraph">
              我们致力于泥彩人文化的保护、传承和创新，通过展示优秀作品、培养年轻传承人、开展体验活动等方式，
              让这一古老的民间艺术在现代社会焕发新的生机与活力。
            </p>
            <router-link to="/introduction" class="about-btn">了解更多</router-link>
          </div>
          <div class="about-image">
            <img src="@/assets/images/image1.png" alt="泥彩人历史" class="about-img">
          </div>
        </div>
      </div>
    </section>

    <!-- AI 工具入口：文生图 -->
    <section class="ai-tools-section" id="ai-tools">
      <div class="container">
        <p class="section-subtitle" v-scroll-reveal>从文字到图像，从想象到现实，你的创意，正在被AI点亮</p>
        <h2 class="section-title" v-scroll-reveal>指尖轻触，千年技艺在数字中重生</h2>
        <div class="ai-card" v-scroll-reveal>
          <div class="ai-card-text">
            <h3 class="ai-card-title">文生图：说出你心中的泥彩人</h3>
            <p class="ai-card-desc">使用泥彩人风格预设，将你的描述生成风格化图片，适合作品草图、海报素材与创意探索。</p>
            <router-link to="/ai/text2image" class="section-link">生成草图</router-link>
          </div>
          <div class="ai-card-image">
            <img src="../assets/images/wenshengtu.png" alt="文生图预览" class="ai-card-img">
          </div>
        </div>

        <!-- 新增：AI 共创新坊（风格融合）入口 -->
        <div class="ai-card" style="margin-top: 24px;" v-scroll-reveal>
          <div class="ai-card-text">
            <h3 class="ai-card-title">图生图：图片变泥娃娃</h3>
            <p class="ai-card-desc">上传一张自己的照片或喜欢的画作，让照片，穿越时光，化身成一个红彤彤、笑盈盈的泥彩娃娃</p>
            <router-link to="/ai/image2image" class="section-link">风格融合</router-link>
          </div>
          <div class="ai-card-image">
            <img src="../assets/images/nirenhuadan.jpg" alt="图生图预览" class="ai-card-img">
          </div>
        </div>
      </div>
    </section>

    <!-- 体验预约 -->
    <section class="reserve-section">
      <div class="container">
        <p class="section-subtitle" v-scroll-reveal>与泥彩相逢，在手心里传承</p>
        <div class="reserve-content" v-scroll-reveal>
          <div class="reserve-text">
            <h2 class="reserve-title animate-slide-in">体验传统工艺</h2>
            <p class="reserve-desc animate-fade-in">
              亲手制作一个属于自己的泥彩人，感受传统工艺的魅力。我们提供专业的指导和优质的材料，
              让您在轻松愉快的氛围中体验泥彩人的制作过程。
            </p>
            <ul class="reserve-features">
              <li class="feature-item animate-feature" style="animation-delay: 0.1s">✓ 专业老师指导</li>
              <li class="feature-item animate-feature" style="animation-delay: 0.2s">✓ 提供全套材料</li>
              <li class="feature-item animate-feature" style="animation-delay: 0.3s">✓ 适合各年龄段</li>
              <li class="feature-item animate-feature" style="animation-delay: 0.4s">✓ 可带走自己的作品</li>
            </ul>
            <router-link to="/reserve" class="reserve-btn">立即预约</router-link>
          </div>
          <div class="reserve-image">
            <img src="../assets/images/xuanchuan.png" alt="泥彩人体验活动" class="reserve-img parallax-img">
          </div>
        </div>
      </div>
    </section>

    <!-- 非遗传承人 -->
    <section class="inheritors-section">
      <div class="container">
        <p class="section-subtitle" v-scroll-reveal>匠心在世，名字背后是手艺与情感</p>
        <h2 class="section-title" v-scroll-reveal>非遗传承人</h2>
        <div class="inheritors-grid" v-scroll-reveal>
          <div class="inheritor-card" v-for="inheritor in featuredInheritors" :key="inheritor.id">
            <img :src="inheritor.image" :alt="inheritor.name" class="inheritor-img">
            <div class="inheritor-info">
              <h3 class="inheritor-name">{{ inheritor.name }}</h3>
              <p class="inheritor-title">{{ inheritor.title }}</p>
              <p class="inheritor-desc">{{ inheritor.description }}</p>
              <router-link :to="`/inheritor/${inheritor.id}`" class="inheritor-btn">了解传承人</router-link>
            </div>
          </div>
        </div>
        <div class="section-footer">
          <router-link to="/inheritors" class="section-link">查看全部传承人</router-link>
        </div>
      </div>
    </section>

    <!-- 精选作品 -->
    <section class="gallery-section">
      <div class="container">
        <p class="section-subtitle" v-scroll-reveal>作品是故事的延伸，每一道纹理皆有脉络</p>
        <h2 class="section-title" v-scroll-reveal>精选作品</h2>
        <div class="gallery-grid" v-scroll-reveal>
          <div class="gallery-item" v-for="work in featuredWorks" :key="work.id">
            <img :src="work.image" :alt="work.title" class="gallery-img">
            <div class="gallery-overlay">
              <h3 class="gallery-title">{{ work.title }}</h3>
              <p class="gallery-artist">传承人：{{ work.artist }}</p>
            </div>
          </div>
        </div>
        <div class="section-footer">
          <router-link to="/gallery" class="section-link">浏览全部作品</router-link>
        </div>
      </div>
    </section>

    <!-- 新闻动态 -->
    <section class="news-section">
      <div class="container">
        <p class="section-subtitle" v-scroll-reveal>文化在流动，故事在更新</p>
        <h2 class="section-title" v-scroll-reveal>新闻动态</h2>
        <div class="news-list" v-scroll-reveal>
          <div class="news-item" v-for="news in latestNews" :key="news.id">
            <div class="news-image">
              <img :src="news.image" :alt="news.title" class="news-img">
            </div>
            <div class="news-content">
              <span class="news-date">{{ news.date }}</span>
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-excerpt">{{ news.excerpt }}</p>
              <router-link :to="`/news/${news.id}`" class="news-link">阅读全文</router-link>
            </div>
          </div>
        </div>
        <div class="section-footer">
          <router-link to="/news" class="section-link">查看全部新闻</router-link>
        </div>
      </div>
    </section>

    <!-- 商城精选 -->
    <section class="shop-section">
      <div class="container">
        <p class="section-subtitle" v-scroll-reveal>把文化带回家，生活里的小心意</p>
        <h2 class="section-title" v-scroll-reveal>商城精选</h2>
        <div class="shop-grid" v-scroll-reveal>
          <div class="shop-item shop-card-animate" v-for="(product, index) in featuredProducts" :key="product.id"
            :style="{ animationDelay: `${index * 0.15}s` }">
            <div class="shop-card-inner">
              <img :src="product.image" :alt="product.name" class="shop-img">
              <h3 class="shop-name">{{ product.name }}</h3>
              <p class="shop-price">¥{{ product.price }}</p>
              <button class="shop-btn">加入购物车</button>
            </div>
          </div>
        </div>
        <div class="section-footer">
          <router-link to="/shop" class="section-link">进入商城</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import imgZhang from '@/assets/images/czhangmingshan.jpg';
import img1 from '@/assets/images/image1.png';
import img2 from '@/assets/images/image2.png';

// 轮播图相关
const activeSlide = ref(0);
const slideInterval = ref(null);
const totalSlides = ref(3);
const isAnimating = ref(false);

const bannerTrackStyle = computed(() => ({
  transform: `translateX(-${activeSlide.value * 100}%)`
}));

// 模拟数据 - 特色传承人
const featuredInheritors = ref([
  {
    id: 1,
    name: '张明山',
    title: '国家级非遗传承人',
    description: '从事泥彩人制作40余年,作品曾多次获得国家级奖项',
    image: imgZhang
  },
  {
    id: 2,
    name: '李巧云',
    title: '省级非遗传承人',
    description: '擅长传统人物题材，作品风格细腻生动',
    image: img1
  },
  {
    id: 3,
    name: '王建国',
    title: '市级非遗传承人',
    description: '专注创新泥彩人技艺，融合现代元素',
    image: img2
  }
]);

// 模拟数据 - 精选作品
const featuredWorks = ref([
  {
    id: 1,
    title: '吉祥如意',
    artist: '张明山',
    image: img2
  },
  {
    id: 2,
    title: '年年有余',
    artist: '李巧云',
    image: img1
  },
  {
    id: 3,
    title: '福娃迎春',
    artist: '王建国',
    image: img2
  },
  {
    id: 4,
    title: '松鹤延年',
    artist: '张明山',
    image: img1
  }
]);

// 模拟数据 - 最新新闻
const latestNews = ref([
  {
    id: 1,
    title: '泥彩人技艺入选国家级非物质文化遗产名录',
    excerpt: '近日，国务院公布了第五批国家级非物质文化遗产代表性项目名录，我市的泥彩人技艺成功入选...',
    date: '2023-10-15',
    image: img1
  },
  {
    id: 2,
    title: '2023年泥彩人文化艺术节盛大开幕',
    excerpt: '为期一周的泥彩人文化艺术节在惠山古镇拉开帷幕，吸引了来自全国各地的游客和艺术爱好者...',
    date: '2023-09-28',
    image: img2
  },
  {
    id: 3,
    title: '青年传承人马小明获"非遗新秀"称号',
    excerpt: '我市青年泥彩人传承人马小明在全国非遗技艺大赛中脱颖而出，获得"非遗新秀"荣誉称号...',
    date: '2023-09-10',
    image: img1
  }
]);

// 模拟数据 - 商城精选
const featuredProducts = ref([
  {
    id: 1,
    name: '传统泥彩人摆件 - 福禄寿',
    price: 298,
    image: img2
  },
  {
    id: 2,
    name: '泥彩人DIY套装',
    price: 198,
    image: img1
  },
  {
    id: 3,
    name: '泥彩人文创笔记本',
    price: 68,
    image: img2
  },
  {
    id: 4,
    name: '泥彩人主题T恤',
    price: 128,
    image: img1
  }
]);

// 设置轮播图
const setActiveSlide = (index) => {
  if (isAnimating.value) return;
  pauseAutoPlay();
  activeSlide.value = index % totalSlides.value;
  updateSlideClasses();
  updateSlideIndicators();
  setTimeout(() => {
    restartAutoPlay();
  }, 500);
};

// 更新轮播指示器
const updateSlideIndicators = () => {
  const indicators = document.querySelectorAll('.banner-indicators .indicator');
  indicators.forEach((indicator, index) => {
    if (index === activeSlide.value) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
};

// 更新轮播项的可见性（切换 .banner-item.active）
const updateSlideClasses = () => { };

// 下一张轮播图
const nextSlide = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  activeSlide.value = (activeSlide.value + 1) % totalSlides.value;
  updateSlideClasses();
  updateSlideIndicators();
  setTimeout(() => {
    isAnimating.value = false;
  }, 500);
};
const handleNextSlide = () => {
  pauseAutoPlay();
  nextSlide();
  setTimeout(() => {
    restartAutoPlay();
  }, 500);
};
//上一张
const prevSlide = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  activeSlide.value = (activeSlide.value + totalSlides.value - 1) % totalSlides.value;
  updateSlideClasses();
  updateSlideIndicators();
  setTimeout(() => {
    isAnimating.value = false;
  }, 500);
};

const handlePrevSlide = () => {
  pauseAutoPlay();
  prevSlide();
  setTimeout(() => {
    restartAutoPlay();
  }, 500);
};

// 组件挂载后启动轮播
onMounted(() => {
  // 启动自动轮播
  slideInterval.value = setInterval(nextSlide, 5000);

  // 更新初始状态
  updateSlideClasses();
  updateSlideIndicators();
  const slides = document.querySelectorAll('.banner-slider .banner-item');
  totalSlides.value = slides.length || totalSlides.value;
});

const scrollToContent = () => {
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const pauseAutoPlay = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value);
    slideInterval.value = null;
  }
};

const restartAutoPlay = () => {
  if (!slideInterval.value) {
    slideInterval.value = setInterval(nextSlide, 5000);
  }
};

// 按钮点击动画
const triggerButtonAnimation = (e) => {
  const btn = e.currentTarget;
  // 移除可能存在的动画类以便重新触发（如果用户快速点击）
  btn.classList.remove('btn-click-anim');
  // 强制重绘
  void btn.offsetWidth;
  btn.classList.add('btn-click-anim');

  // 动画结束后移除类 (虽然 keyframes 可以控制，但清理是个好习惯)
  setTimeout(() => {
    btn.classList.remove('btn-click-anim');
  }, 300);
};
</script>

<style scoped>
/* Banner 样式 */
.banner {
  position: relative;
  height: 600px;
  overflow: hidden;
}

/* 统一背景图色调为泥土红：为 Banner 增加低透明度暖红色滤镜 */
.banner::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0.20),
      rgba(0, 0, 0, 0.10));
}

.banner::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 30% 40%, rgba(0, 0, 0, 0.25), transparent 60%),
    radial-gradient(circle at 70% 60%, rgba(0, 0, 0, 0.20), transparent 60%);
}

.banner-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 20px;
  line-height: 44px;
  text-align: center;
  cursor: pointer;
  z-index: 5;
  transition: background 0.2s ease, transform 0.2s ease;
}

.banner-arrow:hover {
  background: rgba(0, 0, 0, 0.5);
  transform: translateY(-50%) scale(1.05);
}

.banner-arrow-right {
  right: 16px;
}

.banner-arrow-left {
  left: 16px;
}

.banner-slider {
  height: 100%;
  position: relative;
}

.banner-track {
  height: 100%;
  display: flex;
  transition: transform 0.5s ease;
}

.banner-item {
  flex: 0 0 100%;
  height: 100%;
  position: relative;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: var(--color-text);
  text-shadow: none;
}

.banner-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000;
  letter-spacing: 0.5px;
}

.banner-subtitle {
  font-size: 24px;
  margin-bottom: 30px;
  color: #0a0a0a;
  letter-spacing: 0.3px;
}

.banner-btn {
  display: inline-block;
  padding: 12px 30px;
  background-color: var(--color-primary);
  color: #f1f3e3;
  text-decoration: none;
  border-radius: var(--radius-1);
  border: 2px solid var(--color-primary);
  font-size: 16px;
  font-weight: 500;
  transition: all var(--motion-medium) var(--motion-ease);
  /* 确保 transformations 生效 */
  transform-origin: center;
}

.banner-btn:hover {
  /* 悬停时稍微提亮或做些微交互，保持实心 */
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(185, 44, 35, 0.3);
}

/* 点击动画类 */
.banner-btn.btn-click-anim {
  animation: btn-click-effect 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes btn-click-effect {
  0% {
    transform: scale(1);
  }

  40% {
    transform: scale(0.95);
    filter: brightness(1.1);
  }

  60% {
    transform: scale(0.97);
  }

  100% {
    transform: scale(1);
  }
}

.banner-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.scroll-down {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  animation: bounce 2s infinite;
}

.scroll-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-bottom: 8px;
  letter-spacing: 2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.scroll-arrow {
  width: 20px;
  height: 20px;
  border-right: 2px solid rgba(255, 255, 255, 0.8);
  border-bottom: 2px solid rgba(255, 255, 255, 0.8);
  transform: rotate(45deg);
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }

  40% {
    transform: translateX(-50%) translateY(-10px);
  }

  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  width: 30px;
  border-radius: 6px;
  background-color: var(--color-bg);
}

/* 通用区块样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  padding-bottom: 20px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background-color: #d93b30;
}

.section-footer {
  text-align: center;
  margin-top: 40px;
}

.section-link {
  display: inline-block;
  padding: 10px 24px;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  text-decoration: none;
  border-radius: var(--radius-1);
  font-size: 16px;
  font-weight: 500;
  transition: all var(--motion-medium) var(--motion-ease);
}

.section-link:hover {
  background-color: var(--color-primary);
  color: #fff;
}

/* AI 工具入口样式 */
.ai-tools-section {
  padding: 100px 0;
  background-color: var(--color-bg);
}

.ai-card {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 30px;
  background-color: var(--color-bg);
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 30px;
}

.ai-card-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.ai-card-desc {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.8;
}

.ai-card-image {
  height: 200px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(185, 44, 35, 0.12), rgba(185, 44, 35, 0.04));
  border: 1px solid #eee;
}

.ai-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

@media (max-width: 768px) {
  .ai-card {
    grid-template-columns: 1fr;
  }

  .ai-card-image {
    height: 140px;
  }
}

/* 关于我们区块 */
.about-section {
  padding: 100px 0;
  background-color: var(--color-bg);
}

.about-content {
  display: flex;
  gap: 50px;
  align-items: center;
}

.about-text {
  flex: 1;
}

.about-paragraph {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 20px;
}

.about-btn {
  display: inline-block;
  padding: 12px 30px;
  background-color: transparent;
  color: var(--color-primary);
  text-decoration: none;
  border-radius: var(--radius-1);
  border: 2px solid var(--color-primary);
  font-size: 16px;
  font-weight: 500;
  transition: all var(--motion-medium) var(--motion-ease);
  margin-top: 20px;
}

.about-btn:hover {
  background-color: var(--color-primary);
  color: #fff;
}

.about-image {
  flex: 1;
}

.about-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 传承人区块 */
.inheritors-section {
  padding: 100px 0;
}

.inheritors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

.inheritor-card {
  background-color: var(--color-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.inheritor-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.inheritor-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.inheritor-info {
  padding: 20px;
}

.inheritor-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.inheritor-title {
  font-size: 14px;
  color: #d93b30;
  margin-bottom: 15px;
}

.inheritor-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

.inheritor-btn {
  display: inline-block;
  padding: 8px 20px;
  background-color: transparent;
  color: var(--color-primary);
  text-decoration: none;
  border-radius: var(--radius-1);
  border: 2px solid var(--color-primary);
  font-size: 14px;
  transition: all var(--motion-medium) var(--motion-ease);
}

.inheritor-btn:hover {
  background-color: var(--color-primary);
  color: #fff;
}

/* 作品展示区块 */
.gallery-section {
  padding: 100px 0;
  background-color: var(--color-bg);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.gallery-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gallery-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-img {
  transform: scale(1.1);
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background: linear-gradient(to top, rgba(185, 44, 35, 0.18), transparent);
  color: white;
}

.gallery-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.gallery-artist {
  font-size: 14px;
}

/* 新闻区块 */
.news-section {
  padding: 100px 0;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.news-item {
  display: flex;
  gap: 30px;
  background-color: var(--color-bg);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.news-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.news-image {
  flex: 0 0 200px;
}

.news-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.news-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.news-excerpt {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
}

.news-link {
  font-size: 14px;
  color: #d93b30;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.news-link:hover {
  color: #b92c23;
}

/* 体验预约区块 */
.reserve-section {
  padding: 100px 0;
  position: relative;
  background-image: url('@/assets/images/image1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  /* 视差滚动效果 */
}

/* 添加半透明白色遮罩，确保文字清晰可读 */
.reserve-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  pointer-events: none;
  z-index: 0;
}

/* 确保内容在遮罩之上 */
.reserve-section .container {
  position: relative;
  z-index: 1;
}

.reserve-content {
  display: flex;
  gap: 50px;
  align-items: center;
}

.reserve-text {
  flex: 1;
}

.reserve-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.reserve-desc {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 30px;
}

.reserve-features {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.feature-item {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.reserve-btn {
  display: inline-block;
  padding: 12px 30px;
  background-color: transparent;
  color: var(--color-primary);
  text-decoration: none;
  border-radius: var(--radius-1);
  border: 2px solid var(--color-primary);
  font-size: 16px;
  font-weight: 500;
  transition: all var(--motion-medium) var(--motion-ease);
}

.reserve-btn:hover {
  background-color: var(--color-primary);
  color: #fff;
}

.reserve-image {
  flex: 1;
}

.reserve-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 商城区块 */
.shop-section {
  padding: 100px 0;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.shop-item {
  background-color: var(--color-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.shop-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.shop-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.shop-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding: 20px 20px 10px 20px;
}

.shop-price {
  font-size: 20px;
  color: #d93b30;
  font-weight: bold;
  padding: 0 20px 20px 20px;
}

.shop-btn {
  display: block;
  width: calc(100% - 40px);
  margin: 0 20px 20px 20px;
  padding: 10px;
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-1);
  font-size: 16px;
  cursor: pointer;
  transition: all var(--motion-medium) var(--motion-ease);
}

.shop-btn:hover {
  background-color: var(--color-primary);
  color: #fff;
}

/* 预约模块动画 */
.animate-slide-in {
  opacity: 0;
  animation: slideInFromLeft 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  animation-delay: 0.2s;
}

@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-feature {
  opacity: 0;
  animation: featureAppear 0.6s ease-out forwards;
}

@keyframes featureAppear {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 预约按钮脉冲动画 */
.pulse-btn {
  position: relative;
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(217, 59, 48, 0.4);
  }

  50% {
    box-shadow: 0 0 15px 5px rgba(217, 59, 48, 0.2);
  }
}

.pulse-btn::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: var(--radius-1);
  background: linear-gradient(45deg, transparent, rgba(217, 59, 48, 0.3), transparent);
  opacity: 0;
  animation: shimmer 3s infinite;
  pointer-events: none;
}

@keyframes shimmer {

  0%,
  100% {
    opacity: 0;
    transform: translateX(-100%);
  }

  50% {
    opacity: 1;
    transform: translateX(100%);
  }
}

/* 图片视差效果 */
.parallax-img {
  transition: transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.reserve-content:hover .parallax-img {
  transform: scale(1.05) translateY(-5px);
}

/* 商城卡片逐个显示动画 */
.shop-card-animate {
  opacity: 0;
  animation: cardSlideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes cardSlideUp {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 商城卡片3D翻转效果 */
.shop-item {
  perspective: 1000px;
}

.shop-card-inner {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
}

.shop-item:hover .shop-card-inner {
  transform: rotateY(5deg) rotateX(-5deg);
}

.shop-item:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 35px rgba(217, 59, 48, 0.2);
}

/* 商品图片缩放效果 */
.shop-img {
  transition: transform 0.5s ease;
}

.shop-item:hover .shop-img {
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .banner-title {
    font-size: 40px;
  }

  .banner-subtitle {
    font-size: 20px;
  }

  .about-content,
  .reserve-content {
    flex-direction: column;
    gap: 30px;
  }

  .news-item {
    flex-direction: column;
    gap: 20px;
  }

  .news-image {
    flex: 0 0 auto;
  }

  .news-img {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .banner {
    height: 400px;
  }

  .banner-title {
    font-size: 28px;
  }

  .banner-subtitle {
    font-size: 18px;
  }

  .banner-content {
    left: 5%;
  }

  .section-title {
    font-size: 28px;
  }

  .about-section,
  .inheritors-section,
  .gallery-section,
  .news-section,
  .reserve-section,
  .shop-section {
    padding: 60px 0;
  }

  .reserve-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .banner {
    height: 300px;
  }

  .banner-title {
    font-size: 24px;
  }

  .banner-subtitle {
    font-size: 16px;
  }

  .banner-btn {
    padding: 10px 20px;
    font-size: 14px;
  }

  .inheritors-grid,
  .gallery-grid,
  .shop-grid {
    grid-template-columns: 1fr;
  }
}
</style>
