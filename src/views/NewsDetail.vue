<template>
  <div class="news-detail">
    <!-- 页面标题 - 中国风 -->
    <div class="page-header">
      <div class="header-decoration top"></div>
      <div class="container">
        <div class="title-wrapper">
          <div class="title-decoration left"></div>
          <div class="title-content" v-if="newsDetail">
            <h1 class="page-title">{{ newsDetail.title }}</h1>
            <div class="title-divider"></div>
            <p class="page-subtitle">{{ getCategoryText(newsDetail.category) }}</p>
          </div>
          <div class="title-decoration right"></div>
        </div>
      </div>
      <div class="header-decoration bottom"></div>
    </div>

    <!-- 主要内容区域 -->
    <section class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- 左侧：新闻详情 -->
          <div class="content-main">
            <!-- 新闻头部信息 -->
            <div class="news-header" v-if="newsDetail">
              <div class="news-meta">
                <span class="meta-item category">
                  <img src="" alt="分类" class="meta-icon">
                  <span class="meta-text">{{ getCategoryText(newsDetail.category) }}</span>
                </span>
                <span class="meta-divider">|</span>
                <span class="meta-item date">
                  <img src="" alt="日期" class="meta-icon">
                  <span class="meta-text">{{ formatDate(newsDetail.date) }}</span>
                </span>
                <span class="meta-divider">|</span>
                <span class="meta-item author">
                  <img src="" alt="作者" class="meta-icon">
                  <span class="meta-text">{{ newsDetail.author || '非遗文化宣传中心' }}</span>
                </span>
                <span class="meta-divider">|</span>
                <span class="meta-item views">
                  <img src="" alt="浏览" class="meta-icon">
                  <span class="meta-text">{{ newsDetail.views || 0 }} 次浏览</span>
                </span>
              </div>
            </div>

            <!-- 新闻正文内容 -->
            <div class="news-content" v-if="newsDetail">
              <div class="news-image-wrapper">
                <div class="image-frame-outer"></div>
                <div class="image-frame-inner"></div>
                <img :src="newsDetail.image" :alt="newsDetail.title" class="main-image">
              </div>
              
              <div class="news-body" v-html="formatContent(newsDetail.content)"></div>
            </div>

            <!-- 加载状态 -->
            <div class="loading-state" v-else-if="loading">
              <div class="loading-spinner">
                <div class="spinner-inner"></div>
              </div>
              <p class="loading-text">正在加载中...</p>
            </div>

            <!-- 错误状态 -->
            <div class="error-state" v-else>
              <img src="" alt="错误" class="error-icon">
              <p class="error-text">新闻不存在或已被删除</p>
              <router-link to="/news" class="back-btn">
                <img src="" alt="返回" class="btn-icon">
                <span>返回新闻列表</span>
              </router-link>
            </div>

            <!-- 分享功能 -->
            <div class="share-section" v-if="newsDetail">
              <div class="section-title">
                <span class="title-decoration-left"></span>
                <span class="title-text">分享本文</span>
                <span class="title-decoration-right"></span>
              </div>
              <div class="share-buttons">
                <button class="share-btn" @click="showWeixinCode = !showWeixinCode">
                  <img src="" alt="微信" class="share-icon">
                  <span>微信</span>
                  <div class="weixin-qrcode" v-if="showWeixinCode">
                    <img src="" alt="微信分享二维码" class="qrcode-img">
                    <p>扫码分享到微信</p>
                  </div>
                </button>
                <button class="share-btn">
                  <img src="" alt="微博" class="share-icon">
                  <span>微博</span>
                </button>
                <button class="share-btn">
                  <img src="" alt="QQ" class="share-icon">
                  <span>QQ空间</span>
                </button>
                <button class="share-btn" @click="copyLink">
                  <img src="" alt="链接" class="share-icon">
                  <span>复制链接</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧：侧边栏 -->
          <div class="sidebar">
            <!-- 相关推荐 -->
            <div class="sidebar-section" v-if="relatedNews.length > 0">
              <div class="sidebar-title">
                <span class="title-decoration-left"></span>
                <span class="title-text">相关推荐</span>
                <span class="title-decoration-right"></span>
              </div>
              <ul class="related-list">
                <li v-for="item in relatedNews" :key="item.id" class="related-item">
                  <router-link :to="`/news/${item.id}`" class="related-link">
                    <div class="related-img-wrapper">
                      <img :src="item.image" :alt="item.title" class="related-img">
                      <div class="img-overlay"></div>
                    </div>
                    <div class="related-content">
                      <h4 class="related-title">{{ item.title }}</h4>
                      <div class="related-date">{{ formatDate(item.date) }}</div>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>

            <!-- 热门新闻 -->
            <div class="sidebar-section" v-if="hotNews.length > 0">
              <div class="sidebar-title">
                <span class="title-decoration-left"></span>
                <span class="title-text">热门新闻</span>
                <span class="title-decoration-right"></span>
              </div>
              <ul class="hot-list">
                <li v-for="(item, index) in hotNews" :key="item.id" class="hot-item">
                  <router-link :to="`/news/${item.id}`" class="hot-link">
                    <span class="hot-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                    <span class="hot-title">{{ item.title }}</span>
                  </router-link>
                </li>
              </ul>
            </div>

            <!-- 订阅提醒 -->
            <div class="sidebar-section subscribe-box">
              <div class="subscribe-icon-wrapper">
                <img src="" alt="订阅" class="subscribe-icon">
              </div>
              <h3 class="subscribe-title">订阅新闻动态</h3>
              <p class="subscribe-desc">第一时间获取泥彩人非遗文化的最新资讯</p>
              <form class="subscribe-form" @submit.prevent>
                <input type="email" placeholder="请输入您的邮箱" class="subscribe-input">
                <button type="button" class="subscribe-btn">
                  <span>立即订阅</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getNewsDetailById, getHotNews } from '@/api/news';

// 路由相关
const route = useRoute();
const router = useRouter();
const newsId = ref(Number(route.params.id) || 1);

// 状态管理
const loading = ref(false);
const newsDetail = ref(null);
const showWeixinCode = ref(false);

// 热门新闻数据
const hotNewsList = ref([]);

// 获取新闻详情
const getNewsDetail = async () => {
  loading.value = true;
  
  try {
    const response = await getNewsDetailById(newsId.value);
    
    // 处理返回的数据结构
    if (response && response.basicInfo) {
      newsDetail.value = {
        id: response.basicInfo.id,
        title: response.basicInfo.title,
        excerpt: response.basicInfo.excerpt,
        content: response.fullContent || response.basicInfo.content,
        image: response.basicInfo.imageUrl,
        category: response.basicInfo.category,
        author: response.basicInfo.author,
        date: response.basicInfo.publishDateStr,
        views: response.basicInfo.views,
        likes: response.basicInfo.likes
      };
    }
  } catch (error) {
    console.error('获取新闻详情失败:', error);
    newsDetail.value = null;
  } finally {
    loading.value = false;
  }
};

// 加载热门新闻
const loadHotNews = async () => {
  try {
    const response = await getHotNews(5);
    hotNewsList.value = (response || []).map(news => ({
      id: news.id,
      title: news.title,
      excerpt: news.excerpt,
      image: news.imageUrl,
      category: news.category,
      date: news.publishDateStr,
      views: news.views
    }));
  } catch (error) {
    console.error('获取热门新闻失败:', error);
    hotNewsList.value = [];
  }
};

// 获取分类文本
const getCategoryText = (category) => {
  const categoryMap = {
    'activity': '活动动态',
    'heritage': '传承保护',
    'exhibition': '展览信息',
    'education': '教育传承',
    'innovation': '创新发展'
  };
  return categoryMap[category] || '';
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
};

// 格式化内容（处理换行符）
const formatContent = (content) => {
  if (!content) return '';
  return content.split('\n\n').map(paragraph => {
    if (paragraph.trim()) {
      return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
    }
    return '';
  }).join('');
};

// 相关新闻计算
const relatedNews = computed(() => {
  if (!newsDetail.value) return [];
  const related = hotNewsList.value
    .filter(item => item.category === newsDetail.value.category && item.id !== newsId.value)
    .slice(0, 3);

  if (related.length < 3) {
    const additionalNews = hotNewsList.value
      .filter(item => item.id !== newsId.value && !related.some(r => r.id === item.id))
      .slice(0, 3 - related.length);
    related.push(...additionalNews);
  }

  return related;
});

// 热门新闻计算
const hotNews = computed(() => {
  return hotNewsList.value.slice(0, 5);
});

// 复制链接
const copyLink = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert('链接已复制到剪贴板');
  }).catch(() => {
    alert('复制失败，请手动复制');
  });
};

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  newsId.value = Number(newId) || 1;
  getNewsDetail();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 组件挂载时获取新闻详情
onMounted(() => {
  getNewsDetail();
  loadHotNews();
});
</script>

<style scoped>
/* 中国风配色 */
:root {
  --primary-red: #c8232c;
  --dark-red: #8b1a1a;
  --gold: #d4a574;
  --dark-gold: #b8935f;
  --ink-black: #2c2c2c;
  --paper-white: #f9f7f4;
  --gray: #666;
  --light-gray: #999;
  --border-color: #d4a574;
}

/* 页面标题 - 中国风 */
.page-header {
  position: relative;
  background: linear-gradient(135deg, #f9f7f4 0%, #ebe8e3 100%);
  padding: 80px 0;
  text-align: center;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    repeating-linear-gradient(90deg, rgba(212, 165, 116, 0.1) 0px, transparent 1px, transparent 40px),
    repeating-linear-gradient(0deg, rgba(212, 165, 116, 0.1) 0px, transparent 1px, transparent 40px);
  pointer-events: none;
}

.header-decoration {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.header-decoration.top {
  top: 20px;
}

.header-decoration.bottom {
  bottom: 20px;
}

.title-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 30px;
  animation: fadeInDown 0.8s ease-out;
}

.title-decoration {
  width: 60px;
  height: 60px;
  border: 2px solid var(--gold);
  transform: rotate(45deg);
  position: relative;
}

.title-decoration::before,
.title-decoration::after {
  content: '';
  position: absolute;
  background: var(--gold);
}

.title-decoration::before {
  width: 2px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.title-decoration::after {
  height: 2px;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.title-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--ink-black);
  margin-bottom: 15px;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
}

.title-divider {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary-red), transparent);
  margin: 15px auto;
}

.page-subtitle {
  font-size: 16px;
  color: var(--primary-red);
  letter-spacing: 2px;
  font-weight: 600;
}

/* 主要内容区域 */
.main-content {
  background: white;
  padding: 60px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-wrapper {
  display: flex;
  gap: 50px;
}

.content-main {
  flex: 1;
  min-width: 0;
  animation: fadeInLeft 0.8s ease-out;
}

.sidebar {
  flex: 0 0 350px;
  animation: fadeInRight 0.8s ease-out;
}

/* 新闻头部 */
.news-header {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid var(--border-color);
  position: relative;
}

.news-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100px;
  height: 2px;
  background: var(--primary-red);
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray);
  transition: color 0.3s ease;
}

.meta-item:hover {
  color: var(--primary-red);
}

.meta-item.category {
  color: var(--primary-red);
  font-weight: 600;
}

.meta-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.meta-divider {
  color: var(--border-color);
}

/* 新闻图片 */
.news-image-wrapper {
  position: relative;
  margin-bottom: 50px;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

.image-frame-outer,
.image-frame-inner {
  position: absolute;
  border: 2px solid var(--gold);
  pointer-events: none;
  transition: all 0.5s ease;
}

.image-frame-outer {
  inset: -15px;
  z-index: 1;
}

.image-frame-inner {
  inset: 10px;
  z-index: 3;
}

.news-image-wrapper:hover .image-frame-outer {
  inset: -20px;
  border-color: var(--primary-red);
}

.news-image-wrapper:hover .image-frame-inner {
  inset: 15px;
  border-color: var(--primary-red);
}

.main-image {
  width: 100%;
  height: auto;
  display: block;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease;
}

.news-image-wrapper:hover .main-image {
  transform: scale(1.02);
}

/* 新闻正文 */
.news-body {
  font-size: 18px;
  line-height: 2;
  color: var(--ink-black);
  letter-spacing: 1px;
  animation: fadeInUp 0.8s ease-out 0.5s both;
}

.news-body :deep(p) {
  margin-bottom: 30px;
  text-indent: 2em;
  text-align: justify;
}

.news-body :deep(p:first-child::first-letter) {
  float: left;
  font-size: 3em;
  line-height: 1;
  margin: 0.1em 0.1em 0 0;
  color: var(--primary-red);
  font-weight: 700;
}

/* 加载和错误状态 */
.loading-state,
.error-state {
  text-align: center;
  padding: 100px 20px;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  position: relative;
}

.loading-spinner::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 4px solid var(--border-color);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.spinner-inner {
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: var(--primary-red);
  border-right-color: var(--primary-red);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

.loading-text {
  font-size: 16px;
  color: var(--gray);
  letter-spacing: 2px;
}

.error-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
  opacity: 0.5;
}

.error-text {
  font-size: 18px;
  color: var(--gray);
  margin-bottom: 40px;
  letter-spacing: 2px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 30px;
  background: var(--primary-red);
  color: white;
  border: 2px solid var(--primary-red);
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: white;
  color: var(--primary-red);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200, 35, 44, 0.3);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* 分享功能 */
.share-section {
  margin-top: 60px;
  padding: 40px;
  background: var(--paper-white);
  border: 2px solid var(--border-color);
  position: relative;
  animation: fadeInUp 0.8s ease-out 0.7s both;
}

.share-section::before,
.share-section::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-red);
}

.share-section::before {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}

.share-section::after {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  font-size: 18px;
  font-weight: 600;
  color: var(--ink-black);
  letter-spacing: 2px;
}

.title-decoration-left,
.title-decoration-right {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--border-color));
}

.title-decoration-right {
  background: linear-gradient(90deg, var(--border-color), transparent);
}

.share-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.share-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: white;
  border: 2px solid var(--border-color);
  color: var(--gray);
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.share-btn:hover {
  border-color: var(--primary-red);
  color: var(--primary-red);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(200, 35, 44, 0.2);
}

.share-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.weixin-qrcode {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 15px;
  padding: 20px;
  background: white;
  border: 2px solid var(--primary-red);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  z-index: 10;
  animation: fadeInUp 0.3s ease-out;
}

.qrcode-img {
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
  display: block;
}

.weixin-qrcode p {
  font-size: 13px;
  color: var(--gray);
  text-align: center;
  margin: 0;
}

/* 侧边栏 */
.sidebar-section {
  margin-bottom: 40px;
  background: white;
  border: 2px solid var(--border-color);
  padding: 30px;
  position: relative;
  transition: all 0.3s ease;
}

.sidebar-section:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.sidebar-section::before,
.sidebar-section::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  border: 2px solid var(--gold);
  transition: all 0.3s ease;
}

.sidebar-section::before {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}

.sidebar-section::after {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

.sidebar-section:hover::before,
.sidebar-section:hover::after {
  width: 20px;
  height: 20px;
  border-color: var(--primary-red);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink-black);
  letter-spacing: 2px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border-color);
  position: relative;
}

.sidebar-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 2px;
  background: var(--primary-red);
}

/* 相关推荐 */
.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-item {
  margin-bottom: 20px;
}

.related-item:last-child {
  margin-bottom: 0;
}

.related-link {
  display: flex;
  gap: 15px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.related-link:hover {
  transform: translateX(5px);
}

.related-img-wrapper {
  position: relative;
  flex: 0 0 100px;
  height: 75px;
  overflow: hidden;
}

.related-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.related-link:hover .related-img {
  transform: scale(1.1);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgba(200, 35, 44, 0.7));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.related-link:hover .img-overlay {
  opacity: 1;
}

.related-content {
  flex: 1;
  min-width: 0;
}

.related-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-black);
  margin-bottom: 8px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.related-link:hover .related-title {
  color: var(--primary-red);
}

.related-date {
  font-size: 12px;
  color: var(--light-gray);
}

/* 热门新闻 */
.hot-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.hot-item {
  margin-bottom: 15px;
}

.hot-item:last-child {
  margin-bottom: 0;
}

.hot-link {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-decoration: none;
  padding: 12px;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.hot-link:hover {
  background: var(--paper-white);
  border-left-color: var(--primary-red);
  transform: translateX(3px);
}

.hot-rank {
  flex: 0 0 26px;
  height: 26px;
  background: var(--border-color);
  color: white;
  text-align: center;
  line-height: 26px;
  font-size: 14px;
  font-weight: 700;
  margin-top: 2px;
  transition: all 0.3s ease;
}

.hot-rank.rank-1 {
  background: linear-gradient(135deg, #f5576c, #c8232c);
  box-shadow: 0 3px 10px rgba(200, 35, 44, 0.3);
}

.hot-rank.rank-2 {
  background: linear-gradient(135deg, #ff9a56, #ff7f50);
}

.hot-rank.rank-3 {
  background: linear-gradient(135deg, #ffd56b, #f7ba2a);
}

.hot-title {
  flex: 1;
  font-size: 14px;
  color: var(--ink-black);
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.hot-link:hover .hot-title {
  color: var(--primary-red);
}

/* 订阅框 */
.subscribe-box {
  background: linear-gradient(135deg, var(--paper-white) 0%, #ebe8e3 100%);
  text-align: center;
}

.subscribe-icon-wrapper {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  padding: 15px;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 50%;
}

.subscribe-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.subscribe-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink-black);
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.subscribe-desc {
  font-size: 13px;
  color: var(--gray);
  margin-bottom: 25px;
  line-height: 1.6;
}

.subscribe-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.subscribe-input {
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  background: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.subscribe-input:focus {
  outline: none;
  border-color: var(--primary-red);
}

.subscribe-btn {
  padding: 12px;
  background: var(--primary-red);
  color: white;
  border: 2px solid var(--primary-red);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.subscribe-btn:hover {
  background: white;
  color: var(--primary-red);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200, 35, 44, 0.3);
}

/* 动画 */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
    gap: 40px;
  }
  
  .sidebar {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
    letter-spacing: 2px;
  }
  
  .title-decoration {
    width: 40px;
    height: 40px;
  }
  
  .news-body {
    font-size: 16px;
  }
  
  .share-buttons {
    flex-direction: column;
  }
  
  .share-btn {
    justify-content: center;
  }
}
</style>
