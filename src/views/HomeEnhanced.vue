<template>
  <div class="home-enhanced">
    <!-- 增强版Banner - 使用EnhancedBanner组件 -->
    <EnhancedBanner
      :slides="bannerSlides"
      @scroll-to-content="scrollToContent"
    />

    <!-- 关于泥彩人 - 添加视差效果 -->
    <section class="about-section enhanced-section">
      <div class="container">
        <div class="section-header">
          <p class="section-subtitle" v-scroll-reveal="{ delay: 100 }">泥与彩的故事，从宋风走来</p>
          <h2 class="section-title" v-scroll-reveal="{ delay: 200 }">关于泥彩人</h2>
        </div>
        <div class="about-content" v-scroll-reveal="{ delay: 300 }">
          <div class="about-text">
            <p class="about-paragraph">
              泥彩人是中国传统民间艺术的瑰宝，起源于宋代，至今已有千年历史。它以细腻的泥质、鲜艳的色彩、生动的形象著称，
              是中国非物质文化遗产的重要组成部分。泥彩人不仅是一种艺术形式，更是中华民族智慧和文化的传承。
            </p>
            <p class="about-paragraph">
              我们致力于泥彩人文化的保护、传承和创新，通过展示优秀作品、培养年轻传承人、开展体验活动等方式，
              让这一古老的民间艺术在现代社会焕发新的生机与活力。
            </p>
            <router-link to="/introduction" class="about-btn enhanced-btn">
              <span class="btn-text">了解更多</span>
              <span class="btn-icon">→</span>
            </router-link>
          </div>
          <div class="about-image-wrapper">
            <div class="image-frame">
              <img src="@/assets/images/image1.png" alt="泥彩人历史" class="about-img">
              <div class="image-decoration"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI 工具入口 - 增强卡片效果 -->
    <section class="ai-tools-section enhanced-section" id="ai-tools">
      <div class="container">
        <div class="section-header">
          <p class="section-subtitle" v-scroll-reveal="{ delay: 100 }">从文字到图像，从想象到现实</p>
          <h2 class="section-title" v-scroll-reveal="{ delay: 200 }">指尖轻触，千年技艺在数字中重生</h2>
        </div>

        <div class="ai-card enhanced-card" v-scroll-reveal="{ delay: 300 }">
          <div class="ai-card-text">
            <div class="card-icon">✨</div>
            <h3 class="ai-card-title">文生图：说出你心中的泥彩人</h3>
            <p class="ai-card-desc">使用泥彩人风格预设，将你的描述生成风格化图片，适合作品草图、海报素材与创意探索。</p>
            <router-link to="/ai/text2image" class="enhanced-link">
              <span>生成草图</span>
              <span class="link-arrow">→</span>
            </router-link>
          </div>
          <div class="ai-card-image">
            <img src="../assets/images/wenshengtu.png" alt="文生图预览" class="ai-card-img">
            <div class="image-overlay">
              <div class="overlay-content">
                <span>点击体验</span>
              </div>
            </div>
          </div>
        </div>

        <div class="ai-card enhanced-card" v-scroll-reveal="{ delay: 400 }">
          <div class="ai-card-text">
            <div class="card-icon">🎨</div>
            <h3 class="ai-card-title">图生图：图片变泥娃娃</h3>
            <p class="ai-card-desc">上传一张自己的照片或喜欢的画作，让照片，穿越时光，化身成一个红彤彤、笑盈盈的泥彩娃娃</p>
            <router-link to="/ai/image2image" class="enhanced-link">
              <span>风格融合</span>
              <span class="link-arrow">→</span>
            </router-link>
          </div>
          <div class="ai-card-image">
            <img src="../assets/images/nirenhuadan.jpg" alt="图生图预览" class="ai-card-img">
            <div class="image-overlay">
              <div class="overlay-content">
                <span>点击体验</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 体验预约 - 视差背景 -->
    <section class="reserve-section parallax-section">
      <div class="parallax-bg"></div>
      <div class="section-overlay"></div>
      <div class="container">
        <div class="reserve-content">
          <div class="reserve-text" v-scroll-reveal="{ delay: 200 }">
            <div class="section-tag">与泥彩相逢，在手心里传承</div>
            <h2 class="reserve-title">体验传统工艺</h2>
            <p class="reserve-desc">
              亲手制作一个属于自己的泥彩人，感受传统工艺的魅力。我们提供专业的指导和优质的材料，
              让您在轻松愉快的氛围中体验泥彩人的制作过程。
            </p>
            <ul class="reserve-features">
              <li class="feature-item" v-for="(feature, index) in features" :key="index" :style="{ animationDelay: `${0.1 * index}s` }">
                <span class="feature-icon">✓</span>
                <span class="feature-text">{{ feature }}</span>
              </li>
            </ul>
            <router-link to="/reserve" class="reserve-btn pulse-btn">
              <span class="btn-text">立即预约</span>
              <span class="btn-icon">🎯</span>
            </router-link>
          </div>
          <div class="reserve-image" v-scroll-reveal="{ delay: 400 }">
            <div class="floating-image">
              <img src="../assets/images/xuanchuan.png" alt="泥彩人体验活动" class="reserve-img">
              <div class="image-shine"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 非遗传承人 - 卡片增强 -->
    <section class="inheritors-section enhanced-section">
      <div class="container">
        <div class="section-header">
          <p class="section-subtitle" v-scroll-reveal="{ delay: 100 }">匠心在世，名字背后是手艺与情感</p>
          <h2 class="section-title" v-scroll-reveal="{ delay: 200 }">非遗传承人</h2>
        </div>
        <div class="inheritors-grid">
          <div
            v-for="(inheritor, index) in featuredInheritors"
            :key="inheritor.id"
            class="inheritor-card enhanced-card"
            v-scroll-reveal="{ delay: 300 + index * 100 }"
          >
            <div class="card-image-wrapper">
              <img :src="inheritor.image" :alt="inheritor.name" class="inheritor-img">
              <div class="card-overlay">
                <router-link :to="`/inheritor/${inheritor.id}`" class="overlay-btn">
                  了解更多
                </router-link>
              </div>
            </div>
            <div class="inheritor-info">
              <h3 class="inheritor-name">{{ inheritor.name }}</h3>
              <p class="inheritor-title">{{ inheritor.title }}</p>
              <p class="inheritor-desc">{{ inheritor.description }}</p>
            </div>
          </div>
        </div>
        <div class="section-footer" v-scroll-reveal="{ delay: 600 }">
          <router-link to="/inheritors" class="enhanced-link">
            <span>查看全部传承人</span>
            <span class="link-arrow">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 精选作品 - 瀑布流效果 -->
    <section class="gallery-section enhanced-section">
      <div class="container">
        <div class="section-header">
          <p class="section-subtitle" v-scroll-reveal="{ delay: 100 }">作品是故事的延伸，每一道纹理皆有脉络</p>
          <h2 class="section-title" v-scroll-reveal="{ delay: 200 }">精选作品</h2>
        </div>
        <div class="gallery-grid">
          <div
            v-for="(work, index) in featuredWorks"
            :key="work.id"
            class="gallery-item enhanced-item"
            v-scroll-reveal="{ delay: 300 + index * 100 }"
          >
            <div class="item-image-wrapper">
              <img :src="work.image" :alt="work.title" class="gallery-img">
              <div class="item-overlay">
                <div class="overlay-content">
                  <h3 class="gallery-title">{{ work.title }}</h3>
                  <p class="gallery-artist">传承人：{{ work.artist }}</p>
                  <router-link to="/gallery" class="view-btn">查看详情</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section-footer" v-scroll-reveal="{ delay: 700 }">
          <router-link to="/gallery" class="enhanced-link">
            <span>浏览全部作品</span>
            <span class="link-arrow">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 新闻动态 - 时间轴样式 -->
    <section class="news-section enhanced-section">
      <div class="container">
        <div class="section-header">
          <p class="section-subtitle" v-scroll-reveal="{ delay: 100 }">文化在流动，故事在更新</p>
          <h2 class="section-title" v-scroll-reveal="{ delay: 200 }">新闻动态</h2>
        </div>
        <div class="news-list">
          <div
            v-for="(news, index) in latestNews"
            :key="news.id"
            class="news-item enhanced-item"
            v-scroll-reveal="{ delay: 300 + index * 150 }"
          >
            <div class="news-image">
              <img :src="news.image" :alt="news.title" class="news-img">
              <div class="date-badge">
                <span class="date-day">{{ formatDate(news.date).day }}</span>
                <span class="date-month">{{ formatDate(news.date).month }}</span>
              </div>
            </div>
            <div class="news-content">
              <span class="news-date">{{ news.date }}</span>
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-excerpt">{{ news.excerpt }}</p>
              <router-link :to="`/news/${news.id}`" class="news-link">
                <span>阅读全文</span>
                <span class="link-arrow">→</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="section-footer" v-scroll-reveal="{ delay: 750 }">
          <router-link to="/news" class="enhanced-link">
            <span>查看全部新闻</span>
            <span class="link-arrow">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 商城精选 - 3D卡片效果 -->
    <section class="shop-section enhanced-section">
      <div class="container">
        <div class="section-header">
          <p class="section-subtitle" v-scroll-reveal="{ delay: 100 }">把文化带回家，生活里的小心意</p>
          <h2 class="section-title" v-scroll-reveal="{ delay: 200 }">商城精选</h2>
        </div>
        <div class="shop-grid">
          <div
            v-for="(product, index) in featuredProducts"
            :key="product.id"
            class="shop-item enhanced-item"
            v-scroll-reveal="{ delay: 300 + index * 100 }"
          >
            <div class="shop-card-3d">
              <div class="card-inner">
                <div class="card-front">
                  <img :src="product.image" :alt="product.name" class="shop-img">
                  <div class="card-badge">热销</div>
                </div>
                <div class="card-info">
                  <h3 class="shop-name">{{ product.name }}</h3>
                  <p class="shop-price">¥{{ product.price }}</p>
                  <button class="shop-btn">
                    <span class="btn-text">加入购物车</span>
                    <span class="btn-icon">🛒</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section-footer" v-scroll-reveal="{ delay: 700 }">
          <router-link to="/shop" class="enhanced-link">
            <span>进入商城</span>
            <span class="link-arrow">→</span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EnhancedBanner from '@/components/EnhancedBanner.vue';
import imgZhang from '@/assets/images/czhangmingshan.jpg';
import img1 from '@/assets/images/image1.png';
import img2 from '@/assets/images/image2.png';

// Banner幻灯片数据
const bannerSlides = ref([
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
]);

// 特色传承人
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

// 精选作品
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

// 最新新闻
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

// 商城精选
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

// 预约特色
const features = ref([
  '专业老师指导',
  '提供全套材料',
  '适合各年龄段',
  '可带走自己的作品'
]);

// 工具函数
const scrollToContent = () => {
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return {
    day: date.getDate(),
    month: date.toLocaleString('zh-CN', { month: 'short' })
  };
};
</script>

<style scoped>
/* 全局样式 */
.home-enhanced {
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-subtitle {
  font-size: 16px;
  color: #d93b30;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 15px;
  font-weight: 600;
}

.section-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 900;
  color: #2c1e1c;
  position: relative;
  padding-bottom: 20px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #d93b30, #f4d03f);
  border-radius: 2px;
}

.section-footer {
  text-align: center;
  margin-top: 50px;
}

/* 关于区块 */
.about-section {
  padding: 120px 0;
  background: linear-gradient(135deg, #faf9f6 0%, #f5f3ed 100%);
  position: relative;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.about-paragraph {
  font-size: 16px;
  line-height: 2;
  color: #666;
  margin-bottom: 25px;
  text-align: justify;
}

.about-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 35px;
  background: linear-gradient(135deg, #d93b30, #c45a3c);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(217, 59, 48, 0.3);
}

.about-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(217, 59, 48, 0.4);
}

.image-frame {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.about-img {
  width: 100%;
  display: block;
  transition: transform 0.5s ease;
}

.image-frame:hover .about-img {
  transform: scale(1.05);
}

.image-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #d93b30, #f4d03f);
  border-radius: 50%;
  opacity: 0.2;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* AI工具区块 */
.ai-tools-section {
  padding: 120px 0;
  background: white;
}

.ai-card {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 50px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  border: 1px solid rgba(217, 59, 48, 0.1);
}

.ai-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(217, 59, 48, 0.15);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.ai-card-title {
  font-size: 24px;
  font-weight: 700;
  color: #2c1e1c;
  margin-bottom: 15px;
}

.ai-card-desc {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 25px;
}

.enhanced-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #d93b30;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.enhanced-link:hover {
  gap: 15px;
}

.link-arrow {
  transition: transform 0.3s ease;
}

.enhanced-link:hover .link-arrow {
  transform: translateX(5px);
}

.ai-card-image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.ai-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.ai-card:hover .ai-card-img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(217, 59, 48, 0.9), transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
}

.ai-card:hover .image-overlay {
  opacity: 1;
}

.overlay-content span {
  color: white;
  font-weight: 600;
  padding: 10px 25px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 预约区块 - 视差效果 */
.reserve-section {
  padding: 120px 0;
  position: relative;
  overflow: hidden;
}

.parallax-bg {
  position: absolute;
  inset: -50px;
  background-image: url('@/assets/images/image1.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  filter: brightness(0.7);
}

.section-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
}

.reserve-content {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.section-tag {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(217, 59, 48, 0.1);
  color: #d93b30;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
}

.reserve-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 900;
  color: #2c1e1c;
  margin-bottom: 25px;
  line-height: 1.2;
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
  display: grid;
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #333;
  opacity: 0;
  animation: slideInLeft 0.6s ease forwards;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.feature-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #d93b30, #f4d03f);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.reserve-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 18px 40px;
  background: linear-gradient(135deg, #d93b30, #c45a3c);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(217, 59, 48, 0.4);
}

.reserve-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(217, 59, 48, 0.5);
}

.floating-image {
  position: relative;
  animation: float 4s ease-in-out infinite;
}

.reserve-img {
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.image-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  50%, 100% { left: 150%; }
}

/* 传承人区块 */
.inheritors-section {
  padding: 120px 0;
  background: linear-gradient(180deg, #faf9f6 0%, white 100%);
}

.inheritors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.inheritor-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.inheritor-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(217, 59, 48, 0.15);
}

.card-image-wrapper {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.inheritor-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.inheritor-card:hover .inheritor-img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(217, 59, 48, 0.9), transparent 60%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 30px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.inheritor-card:hover .card-overlay {
  opacity: 1;
}

.overlay-btn {
  padding: 12px 30px;
  background: white;
  color: #d93b30;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.overlay-btn:hover {
  background: #d93b30;
  color: white;
  transform: scale(1.05);
}

.inheritor-info {
  padding: 25px;
}

.inheritor-name {
  font-size: 22px;
  font-weight: 700;
  color: #2c1e1c;
  margin-bottom: 8px;
}

.inheritor-title {
  font-size: 14px;
  color: #d93b30;
  margin-bottom: 15px;
  font-weight: 600;
}

.inheritor-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

/* 作品展示 */
.gallery-section {
  padding: 120px 0;
  background: white;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.gallery-item:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 50px rgba(217, 59, 48, 0.2);
}

.item-image-wrapper {
  position: relative;
  height: 350px;
  overflow: hidden;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover .gallery-img {
  transform: scale(1.15);
}

.item-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(44, 30, 28, 0.95), transparent 50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.gallery-item:hover .item-overlay {
  opacity: 1;
}

.gallery-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.gallery-artist {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
}

.view-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #d93b30, #c45a3c);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
  transition: all 0.3s ease;
}

.view-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(217, 59, 48, 0.4);
}

/* 新闻区块 */
.news-section {
  padding: 120px 0;
  background: linear-gradient(180deg, #faf9f6 0%, white 100%);
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 900px;
  margin: 0 auto 50px;
}

.news-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 30px;
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(217, 59, 48, 0.15);
}

.news-image {
  position: relative;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
}

.news-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-item:hover .news-img {
  transform: scale(1.1);
}

.date-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #d93b30, #c45a3c);
  color: white;
  padding: 8px 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(217, 59, 48, 0.4);
}

.date-day {
  display: block;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 12px;
  text-transform: uppercase;
}

.news-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-date {
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
}

.news-title {
  font-size: 20px;
  font-weight: 700;
  color: #2c1e1c;
  margin-bottom: 12px;
  line-height: 1.4;
}

.news-excerpt {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #d93b30;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.news-link:hover {
  gap: 12px;
}

/* 商城区块 */
.shop-section {
  padding: 120px 0;
  background: white;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.shop-item {
  perspective: 1000px;
}

.shop-card-3d {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  transform-style: preserve-3d;
}

.shop-item:hover .shop-card-3d {
  transform: rotateY(5deg) rotateX(5deg) translateY(-10px);
  box-shadow: 0 20px 50px rgba(217, 59, 48, 0.2);
}

.card-front {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.shop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.shop-item:hover .shop-img {
  transform: scale(1.1);
}

.card-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 6px 15px;
  background: linear-gradient(135deg, #d93b30, #f4d03f);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(217, 59, 48, 0.4);
}

.card-info {
  padding: 25px;
}

.shop-name {
  font-size: 18px;
  font-weight: 700;
  color: #2c1e1c;
  margin-bottom: 10px;
}

.shop-price {
  font-size: 24px;
  font-weight: 700;
  color: #d93b30;
  margin-bottom: 20px;
}

.shop-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #d93b30, #c45a3c);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.shop-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(217, 59, 48, 0.4);
}

/* 响应式 */
@media (max-width: 1024px) {
  .about-content,
  .reserve-content {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .news-item {
    grid-template-columns: 1fr;
  }

  .news-image {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 28px;
  }

  .ai-card {
    grid-template-columns: 1fr;
    padding: 30px;
  }

  .inheritors-grid,
  .gallery-grid,
  .shop-grid {
    grid-template-columns: 1fr;
  }
}
</style>
