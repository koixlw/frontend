<template>
  <div class="news">
    <!-- 页面标题 - 中国风 -->
    <div class="page-header">
      <div class="header-decoration top"></div>
      <div class="container">
        <div class="title-wrapper">
          <div class="title-decoration left"></div>
          <div class="title-content">
            <h1 class="page-title">新闻动态</h1>
            <div class="title-divider"></div>
            <p class="page-subtitle">关注泥彩人非遗文化的最新资讯</p>
          </div>
          <div class="title-decoration right"></div>
        </div>
      </div>
      <div class="header-decoration bottom"></div>
    </div>

    <!-- 筛选与搜索区域 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-wrapper">
          <div class="filter-content">
            <div class="category-tabs">
              <button class="category-tab" v-for="category in newsCategories" :key="category.value"
                :class="{ active: selectedCategory === category.value }" @click="selectCategory(category.value)">
                <span class="tab-text">{{ category.label }}</span>
                <span class="tab-decoration"></span>
              </button>
            </div>
            <div class="search-box">
              <input type="text" v-model="searchKeyword" placeholder="搜索新闻标题或内容" class="search-input"
                @keyup.enter="filterNews">
              <button class="search-btn" @click="filterNews">
                <span class="search-icon">🔍</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 新闻列表区域 -->
    <section class="news-section">
      <div class="container">
        <!-- 加载状态 -->
        <div class="loading-state" v-if="loading">
          <div class="loading-spinner">
            <div class="spinner-inner"></div>
          </div>
          <p class="loading-text">正在加载中...</p>
        </div>

        <!-- 新闻内容 -->
        <template v-else>
          <!-- 新闻数量统计 -->
          <div class="news-count" v-if="totalElements > 0">
            <span class="count-decoration">◆</span>
            共找到 <strong class="count-number">{{ totalElements }}</strong> 条新闻
            <span class="count-decoration">◆</span>
          </div>

          <!-- 新闻列表 -->
          <div class="news-list" v-if="newsList.length > 0">
            <div class="news-item" v-for="(item, index) in newsList" :key="item.id"
              :style="{ animationDelay: `${index * 0.1}s` }">
              <div class="news-card" @click="goToNewsDetail(item.id)" role="button" tabindex="0"
                @keydown.enter="goToNewsDetail(item.id)" aria-label="查看新闻详情">
                <div class="card-decoration corner-tl"></div>
                <div class="card-decoration corner-tr"></div>
                <div class="card-decoration corner-bl"></div>
                <div class="card-decoration corner-br"></div>

                <div class="news-img-container">
                  <div class="img-frame"></div>
                  <img :src="item.imageUrl" :alt="item.title" class="news-img">
                  <div class="img-overlay"></div>
                </div>

                <div class="news-content">
                  <div class="news-meta">
                    <span class="news-category">
                      <span class="category-icon">●</span>
                      {{ item.categoryName }}
                    </span>
                    <span class="meta-divider">|</span>
                    <span class="news-date">
                      <span class="date-icon">◇</span>
                      {{ formatDate(item.publishDateStr) }}
                    </span>
                  </div>

                  <h3 class="news-title">
                    <router-link :to="`/news/${item.id}`" class="title-link" @click.stop>{{ item.title }}</router-link>
                  </h3>

                  <p class="news-excerpt">{{ item.excerpt }}</p>

                  <div class="news-footer">
                    <router-link :to="`/news/${item.id}`" class="read-more-link" @click.stop>
                      <span class="btn-text">阅读全文</span>
                      <span class="btn-arrow">→</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div class="empty-state" v-if="totalElements === 0">
            <div class="empty-icon">📰</div>
            <p class="empty-text">暂无相关新闻</p>
            <button class="reset-btn" @click="resetFilters">
              <span>重置筛选</span>
            </button>
          </div>

          <!-- 分页 -->
          <div class="pagination" v-if="totalPages > 1">
            <button class="page-btn page-first" @click="goToPage(1)" :disabled="currentPage === 1">
              <span>首页</span>
            </button>
            <button class="page-btn page-prev" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
              <span>上一页</span>
            </button>

            <div class="page-info">
              <span class="current-page">{{ currentPage }}</span>
              <span class="page-divider">/</span>
              <span class="total-page">{{ totalPages }}</span>
            </div>

            <button class="page-btn page-next" @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages">
              <span>下一页</span>
            </button>
            <button class="page-btn page-last" @click="goToPage(totalPages)" :disabled="currentPage === totalPages">
              <span>末页</span>
            </button>

            <div class="page-size">
              <label>每页</label>
              <select v-model="pageSize" class="page-size-select" @change="onPageSizeChange">
                <option :value="6">6</option>
                <option :value="12">12</option>
                <option :value="24">24</option>
              </select>
              <label>条</label>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getNewsByPage } from '@/api/news';

// 筛选条件
const selectedCategory = ref('all');
const searchKeyword = ref('');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(6);
const totalPages = ref(0);
const totalElements = ref(0);

// 加载状态
const loading = ref(false);

// 新闻列表数据
const newsList = ref([]);

// 新闻分类
const newsCategories = ref([
  { value: 'all', label: '全部' },
  { value: 'activity', label: '活动动态' },
  { value: 'heritage', label: '传承保护' },
  { value: 'exhibition', label: '展览信息' },
  { value: 'education', label: '教育传承' },
  { value: 'innovation', label: '创新发展' }
]);

// 从API加载新闻数据
const loadNews = async () => {
  loading.value = true;

  try {
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
      category: selectedCategory.value === 'all' ? null : selectedCategory.value,
      keyword: searchKeyword.value.trim() || null
    };

    const response = await getNewsByPage(params);

    console.log('API响应:', response);
    console.log('新闻列表:', response.content);
    console.log('总数量:', response.totalElements);

    newsList.value = response.content || [];
    totalElements.value = response.totalElements || 0;
    totalPages.value = response.totalPages || 0;

  } catch (error) {
    console.error('加载新闻失败:', error);
    newsList.value = [];
    totalElements.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
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

// 选择分类
const selectCategory = (category) => {
  selectedCategory.value = category;
  currentPage.value = 1;
  loadNews();
};

// 筛选新闻
const filterNews = () => {
  currentPage.value = 1;
  loadNews();
};

// 跳转页码
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadNews();
    // 平滑滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// 页码大小改变
const onPageSizeChange = () => {
  currentPage.value = 1;
  loadNews();
};

// 重置筛选条件
const resetFilters = () => {
  selectedCategory.value = 'all';
  searchKeyword.value = '';
  currentPage.value = 1;
  loadNews();
};

// 组件挂载后初始化
onMounted(() => {
  loadNews();
});

// 跳转到新闻详情
const router = useRouter();
const goToNewsDetail = (id) => {
  if (id == null) return;
  router.push(`/news/${id}`);
};
</script>

<style scoped>
/* 中国风配色 */
/* 中国风配色 - 定义在 .news 作用域下以生效 */
.news {
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  color: var(--ink-black);
  margin-bottom: 15px;
  letter-spacing: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: fadeInDown 0.8s ease-out;
}

.title-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary-red), transparent);
  margin: 15px auto;
}

.page-subtitle {
  font-size: 18px;
  color: var(--gray);
  letter-spacing: 2px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

/* 筛选区域 - 中国风 */
.filter-section {
  background: white;
  border-bottom: 2px solid var(--border-color);
  padding: 40px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-wrapper {
  position: relative;
}

.filter-wrapper::before,
.filter-wrapper::after {
  content: '❖';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gold);
  font-size: 20px;
  opacity: 0.3;
}

.filter-wrapper::before {
  left: -30px;
}

.filter-wrapper::after {
  right: -30px;
}

.filter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
}

.category-tabs {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.category-tab {
  position: relative;
  padding: 10px 4px;
  background: transparent;
  color: var(--gray);
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
}

/* 移除旧的背景动画 */
.category-tab::before {
  display: none;
}

/* 统一的下划线效果 */
/* 统一的下划线效果 */
.category-tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #d93b30;
  /* 强制使用全局导航红 */
  transition: width 0.3s ease;
}

.category-tab:hover {
  color: #d93b30;
  background: transparent;
  box-shadow: none;
  transform: none;
  border-color: transparent;
}

.category-tab:hover::after {
  width: 100%;
}

.category-tab.active {
  color: #d93b30;
  background: transparent;
  box-shadow: none;
  border-color: transparent;
  transform: none;
  font-weight: 600;
}

.category-tab.active::after {
  width: 100%;
}

.tab-text {
  position: relative;
  z-index: 1;
  transition: none;
}

.category-tab.active .tab-text {
  transform: none;
  font-weight: 600;
}

/* 隐藏之前的装饰元素 */
.tab-decoration {
  display: none;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-box::before,
.search-box::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid var(--gold);
  transition: all 0.3s ease;
}

.search-box::before {
  top: -4px;
  left: -4px;
  border-right: none;
  border-bottom: none;
}

.search-box::after {
  bottom: -4px;
  right: -4px;
  border-left: none;
  border-top: none;
}

.search-box:focus-within::before,
.search-box:focus-within::after {
  width: 12px;
  height: 12px;
}

.search-input {
  flex: 1;
  padding: 14px 20px;
  border: 2px solid var(--border-color);
  border-right: none;
  background: var(--paper-white);
  font-size: 15px;
  color: var(--ink-black);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-red);
  background: white;
}

.search-input::placeholder {
  color: var(--light-gray);
}

.search-btn {
  padding: 14px 24px;
  background: var(--primary-red);
  color: white;
  border: 2px solid var(--primary-red);
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: var(--dark-red);
  border-color: var(--dark-red);
  transform: scale(1.05);
}

.search-btn:active {
  transform: scale(0.95);
}

.search-icon {
  font-size: 18px;
  display: inline-block;
  transition: transform 0.3s ease;
}

.search-btn:hover .search-icon {
  transform: rotate(90deg);
}

/* 加载状态 */
.loading-state {
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
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.loading-text {
  font-size: 16px;
  color: var(--gray);
  letter-spacing: 2px;
}

/* 新闻数量统计 */
.news-count {
  font-size: 15px;
  color: var(--gray);
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: 1px;
}

.count-decoration {
  color: var(--gold);
  margin: 0 15px;
  font-size: 12px;
}

.count-number {
  color: var(--primary-red);
  font-size: 20px;
  margin: 0 5px;
}

/* 新闻列表 */
.news-section {
  background: var(--paper-white);
  padding: 60px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.news-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.news-item {
  animation: fadeInUp 0.6s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
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

.news-card {
  position: relative;
  background: white;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.news-card:hover {
  transform: translateY(-8px);
}

.news-card:active {
  transform: translateY(-2px) scale(0.995);
}

.news-card:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: -2px;
}

/* 卡片四角装饰 */
.card-decoration {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--gold);
  z-index: 2;
  transition: all 0.4s ease;
}

.news-card:hover .card-decoration {
  width: 30px;
  height: 30px;
}

.corner-tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.news-img-container {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: var(--paper-white);
}

.img-frame {
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  z-index: 1;
  pointer-events: none;
  transition: all 0.4s ease;
}

.news-card:hover .img-frame {
  inset: 15px;
}

.news-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-card:hover .news-img {
  transform: scale(1.1);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.3) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.news-card:hover .img-overlay {
  opacity: 1;
}

.news-content {
  padding: 30px;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 13px;
}

.news-category {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-red);
  font-weight: 600;
  letter-spacing: 1px;
}

.category-icon {
  font-size: 10px;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

.meta-divider {
  color: var(--border-color);
}

.news-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--gray);
}

.date-icon {
  color: var(--gold);
  font-size: 10px;
}

.news-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink-black);
  margin-bottom: 15px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.title-link {
  position: relative;
  color: var(--ink-black);
  text-decoration: none;
  transition: color 0.3s ease;
}

.title-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-red);
  transition: width 0.3s ease;
}

.title-link:hover {
  color: var(--primary-red);
}

.title-link:hover::after {
  width: 100%;
}

.news-excerpt {
  font-size: 15px;
  line-height: 1.8;
  color: var(--gray);
  margin-bottom: 25px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid rgba(212, 165, 116, 0.2);
}

.read-more-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.3s ease;
}

.read-more-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-red);
  transition: width 0.3s ease;
}

.read-more-link:hover {
  color: var(--primary-red);
}

.read-more-link:hover::after {
  width: 100%;
}

.read-more-link:active {
  transform: scale(0.98);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.empty-text {
  font-size: 18px;
  color: var(--gray);
  margin-bottom: 30px;
  letter-spacing: 2px;
}

.reset-btn {
  padding: 12px 40px;
  background: var(--primary-red);
  color: white;
  border: 2px solid var(--primary-red);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 2px;
}

.reset-btn:hover {
  background: white;
  color: var(--primary-red);
  transform: translateY(-2px);
}

.reset-btn:active {
  transform: translateY(0);
}

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 60px;
  padding-top: 40px;
  border-top: 2px solid var(--border-color);
}

.page-btn {
  min-width: 80px;
  padding: 10px 20px;
  border: 2px solid var(--border-color);
  background: white;
  color: var(--gray);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.page-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: var(--primary-red);
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
  z-index: 0;
}

.page-btn:hover:not(:disabled)::before {
  width: 100%;
  height: 100%;
}

.page-btn span {
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-red);
  color: white;
  transform: translateY(-2px);
}

.page-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: var(--paper-white);
}

.page-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--primary-red);
  color: white;
  font-weight: 600;
  letter-spacing: 2px;
  box-shadow: 0 4px 12px rgba(200, 35, 44, 0.3);
}

.current-page {
  font-size: 20px;
}

.page-divider {
  color: rgba(255, 255, 255, 0.6);
}

.page-size {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border: 2px solid var(--border-color);
  background: white;
  font-size: 14px;
  color: var(--gray);
  letter-spacing: 1px;
}

.page-size-select {
  padding: 5px 10px;
  border: 2px solid var(--border-color);
  background: var(--paper-white);
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-black);
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-size-select:focus {
  outline: none;
  border-color: var(--primary-red);
}

.page-size-select:hover {
  border-color: var(--primary-red);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 36px;
    letter-spacing: 4px;
  }

  .title-decoration {
    width: 40px;
    height: 40px;
  }

  .filter-content {
    flex-direction: column;
  }

  .search-box {
    max-width: 100%;
  }

  .news-list {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .pagination {
    gap: 10px;
  }

  .page-btn {
    min-width: 60px;
    padding: 8px 15px;
    font-size: 13px;
  }
}
</style>
