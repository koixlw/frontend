<template>
  <div class="inheritors">
    <!-- 页面标题 - 中国风设计 -->
    <div class="page-header">
      <div class="cloud cloud-left"></div>
      <div class="cloud cloud-right"></div>
      <div class="container">
        <div class="title-seal">
          <div class="seal-stamp"></div>
        </div>
        <h1 class="page-title">
          <span class="title-char">非</span>
          <span class="title-char">遗</span>
          <span class="title-char">传</span>
          <span class="title-char">承</span>
          <span class="title-char">人</span>
        </h1>
        <p class="page-subtitle">
          <span class="subtitle-line"></span>
          传承千年技艺，守护文化瑰宝
          <span class="subtitle-line"></span>
        </p>
      </div>
      <div class="ink-brush"></div>
    </div>

    <!-- 筛选区域 - 中国风卡片 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-card">
          <div class="filter-decoration-top"></div>
          <div class="filter-content">
            <div class="filter-group">
              <label class="filter-label">
                <img :src="levelIcon" alt="级别" class="label-icon-img">
                传承人级别
              </label>
              <div class="select-wrapper">
                <select v-model="selectedLevel" class="filter-select" @change="filterInheritors">
                  <option value="all">全部级别</option>
                  <option value="national">国家级</option>
                  <option value="provincial">省级</option>
                  <option value="municipal">市级</option>
                  <option value="county">县级</option>
                </select>
                <div class="select-arrow"></div>
              </div>
            </div>
            <div class="filter-group">
              <label class="filter-label">
                <img :src="regionIcon" alt="地区" class="label-icon-img">
                所属地区
              </label>
              <div class="select-wrapper">
                <select v-model="selectedRegion" class="filter-select" @change="filterInheritors">
                  <option value="all">全部地区</option>
                  <option value="beijing">北京</option>
                  <option value="shanghai">上海</option>
                  <option value="jiangsu">江苏</option>
                  <option value="zhejiang">浙江</option>
                  <option value="anhui">安徽</option>
                </select>
                <div class="select-arrow"></div>
              </div>
            </div>
            <div class="filter-group search-group">
              <label class="filter-label">
                <img :src="searchIcon" alt="搜索" class="label-icon-img">
                搜索传承人
              </label>
              <div class="modern-search-box">
                <input type="text" v-model="searchKeyword" placeholder="输入传承人姓名..." class="search-input"
                  @input="handleSearch" @focus="searchFocused = true" @blur="searchFocused = false">
                <button class="search-btn" @click="filterInheritors">
                  <img :src="searchIcon" alt="搜索" class="search-icon-img">
                </button>
                <div class="input-underline"></div>
              </div>
            </div>
          </div>
          <div class="filter-decoration-bottom"></div>
        </div>
      </div>
    </section>

    <!-- 传承人列表 -->
    <section class="inheritors-section">
      <div class="container">
        <!-- 加载状态 - 水墨风格 -->
        <div v-if="loading" class="loading-container">
          <div class="ink-loading">
            <div class="ink-drop ink-drop-1"></div>
            <div class="ink-drop ink-drop-2"></div>
            <div class="ink-drop ink-drop-3"></div>
          </div>
          <p class="loading-text">
            <span class="loading-char">正</span>
            <span class="loading-char">在</span>
            <span class="loading-char">加</span>
            <span class="loading-char">载</span>
            <span class="loading-char">...</span>
          </p>
        </div>

        <!-- 传承人网格 - 水墨卡片 -->
        <div v-else-if="paginatedInheritors.length > 0" class="inheritors-grid">
          <div class="inheritor-card" v-for="(inheritor, index) in paginatedInheritors" :key="inheritor.id"
            :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="card-ink-border"></div>
            <div class="card-header">
              <div class="img-frame">
                <div class="img-blur-bg" :style="{ backgroundImage: `url(${inheritor.imageUrl || defaultImage})` }">
                </div>
                <img :src="inheritor.imageUrl || defaultImage" :alt="inheritor.name" class="inheritor-img">
                <div class="img-overlay"></div>
              </div>
              <div class="level-badge" :class="inheritor.level">
                <img :src="badgeIcon" alt="徽章" class="badge-icon-img">
                {{ inheritor.levelDisplayName || getLevelText(inheritor.level) }}
              </div>
            </div>
            <div class="card-body">
              <h3 class="inheritor-name">
                <span class="name-decoration">「</span>
                {{ inheritor.name }}
                <span class="name-decoration">」</span>
              </h3>
              <p class="inheritor-title">{{ inheritor.title }}</p>
              <div class="inheritor-meta">
                <span class="meta-item">
                  <img :src="regionIcon" alt="地区" class="meta-icon-img">
                  {{ inheritor.regionDisplayName || getRegionText(inheritor.region) }}
                </span>
                <span class="meta-divider">•</span>
                <span class="meta-item">
                  <img :src="dateIcon" alt="日期" class="meta-icon-img">
                  {{ inheritor.year }}年
                </span>
              </div>
              <p class="inheritor-desc">{{ inheritor.description }}</p>
              <div class="card-footer">
                <router-link :to="`/inheritor/${inheritor.id}`" class="view-detail-btn">
                  <span class="btn-text">点击查看详情</span>
                  <span class="btn-arrow">→</span>
                  <div class="btn-ripple"></div>
                </router-link>
              </div>
            </div>
            <div class="card-corner card-corner-tl"></div>
            <div class="card-corner card-corner-tr"></div>
            <div class="card-corner card-corner-bl"></div>
            <div class="card-corner card-corner-br"></div>
          </div>
        </div>

        <!-- 无数据提示 -->
        <div v-else class="no-data">
          <p>暂无传承人数据</p>
        </div>

        <!-- 分页 - 古典风格 -->
        <div class="pagination" v-if="totalPages > 1">
          <div class="pagination-decoration"></div>
          <button class="page-btn page-btn-first" @click="currentPage = 1" :disabled="currentPage === 1">
            <img :src="firstPageIcon" alt="首页" class="btn-icon-img">
            <span class="btn-label">首页</span>
          </button>
          <button class="page-btn page-btn-prev" @click="currentPage--" :disabled="currentPage === 1">
            <img :src="prevPageIcon" alt="上一页" class="btn-icon-img">
            <span class="btn-label">上一页</span>
          </button>
          <div class="page-info">
            <span class="page-current">{{ currentPage }}</span>
            <span class="page-divider">/</span>
            <span class="page-total">{{ totalPages }}</span>
            <div class="page-progress" :style="{ width: `${(currentPage / totalPages) * 100}%` }"></div>
          </div>
          <button class="page-btn page-btn-next" @click="currentPage++" :disabled="currentPage === totalPages">
            <span class="btn-label">下一页</span>
            <img :src="nextPageIcon" alt="下一页" class="btn-icon-img">
          </button>
          <button class="page-btn page-btn-last" @click="currentPage = totalPages"
            :disabled="currentPage === totalPages">
            <span class="btn-label">末页</span>
            <img :src="lastPageIcon" alt="末页" class="btn-icon-img">
          </button>
          <div class="page-size">
            <label class="page-size-label">每页</label>
            <div class="select-wrapper-small">
              <select v-model="pageSize" class="page-size-select" @change="onPageSizeChange">
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
              </select>
              <div class="select-arrow-small"></div>
            </div>
            <label class="page-size-label">条</label>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getInheritorsByPage } from '../api/inheritor';

// 导入图片资源
import levelIcon from '@/image/等级.png'
import regionIcon from '@/image/我的页_地区.png'
import searchIcon from '@/image/搜索.png'
import badgeIcon from '@/image/徽章.png'
import dateIcon from '@/image/日期.png'
import firstPageIcon from '@/image/首页.png'
import prevPageIcon from '@/image/上一页.png'
import nextPageIcon from '@/image/下一页.png'
import lastPageIcon from '@/image/末页.png'
import defaultImage from '@/assets/images/image1.png'
import zhangImg from '@/assets/images/czhangmingshan.jpg'

// 筛选条件
const selectedLevel = ref('all');
const selectedRegion = ref('all');
const searchKeyword = ref('');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(6);

// 数据状态
const allInheritors = ref([]);
const totalPages = ref(0);
const totalRecords = ref(0);
const loading = ref(false);
const searchFocused = ref(false);

// 当前页显示的传承人
const paginatedInheritors = computed(() => {
  return allInheritors.value;
});

// 获取级别文本
const getLevelText = (level) => {
  const levelMap = {
    'national': '国家级',
    'provincial': '省级',
    'municipal': '市级',
    'county': '县级'
  };
  return levelMap[level] || '';
};

// 获取地区文本
const getRegionText = (region) => {
  const regionMap = {
    'beijing': '北京',
    'shanghai': '上海',
    'jiangsu': '江苏',
    'zhejiang': '浙江',
    'anhui': '安徽'
  };
  return regionMap[region] || '';
};

// 备用数据
const fallbackInheritors = [
  {
    id: 1,
    name: '张明山',
    title: '国家级非遗传承人',
    description: '从事泥彩人制作40余年，擅长传统人物题材，作品曾多次获得国家级奖项，为泥彩人技艺的传承和发展做出了突出贡献。',
    imageUrl: zhangImg,
    level: 'national',
    levelDisplayName: '国家级',
    region: 'jiangsu',
    regionDisplayName: '江苏',
    year: 2008
  },
  {
    id: 2,
    name: '李巧云',
    title: '省级非遗传承人',
    description: '专注泥彩人创作30余年，作品风格细腻生动，尤其擅长女性形象塑造，曾赴多个国家进行文化交流和展示。',
    imageUrl: '/assets/images/inheritor2.jpg',
    level: 'provincial',
    levelDisplayName: '省级',
    region: 'jiangsu',
    regionDisplayName: '江苏',
    year: 2012
  },
  {
    id: 3,
    name: '王建国',
    title: '市级非遗传承人',
    description: '专注创新泥彩人技艺，融合现代元素，开发了多种泥彩人文创产品，为传统工艺的创新发展做出了积极探索。',
    imageUrl: '/assets/images/inheritor3.jpg',
    level: 'municipal',
    levelDisplayName: '市级',
    region: 'shanghai',
    regionDisplayName: '上海',
    year: 2015
  },
  {
    id: 4,
    name: '陈秀英',
    title: '国家级非遗传承人',
    description: '泥彩人制作技艺的代表性传承人之一，技艺精湛，著有多部关于泥彩人制作技艺的专著，培养了众多年轻传承人。',
    imageUrl: '/assets/images/inheritor4.jpg',
    level: 'national',
    levelDisplayName: '国家级',
    region: 'anhui',
    regionDisplayName: '安徽',
    year: 2011
  },
  {
    id: 5,
    name: '刘志强',
    title: '省级非遗传承人',
    description: '擅长历史人物和神话传说题材的泥彩人创作，作品造型生动，色彩鲜艳，多次参加国内外展览并获奖。',
    imageUrl: '/assets/images/inheritor5.jpg',
    level: 'provincial',
    levelDisplayName: '省级',
    region: 'zhejiang',
    regionDisplayName: '浙江',
    year: 2014
  },
  {
    id: 6,
    name: '周红梅',
    title: '市级非遗传承人',
    description: '青年传承人代表，致力于泥彩人技艺的年轻化和现代化探索，通过新媒体平台推广泥彩人文化，吸引了众多年轻人的关注。',
    imageUrl: '/assets/images/inheritor6.jpg',
    level: 'municipal',
    levelDisplayName: '市级',
    region: 'beijing',
    regionDisplayName: '北京',
    year: 2018
  }
];

// 加载传承人数据
const loadInheritors = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      level: selectedLevel.value === 'all' ? null : selectedLevel.value,
      region: selectedRegion.value === 'all' ? null : selectedRegion.value,
      keyword: searchKeyword.value.trim() || null
    };

    const response = await getInheritorsByPage(params);
    allInheritors.value = response.records || [];
    totalPages.value = response.totalPages || 0;
    totalRecords.value = response.total || 0;
  } catch (error) {
    console.error('加载传承人数据失败，使用备用数据:', error);
    // 使用备用数据
    loadFallbackData();
  } finally {
    loading.value = false;
  }
};

// 加载备用数据
const loadFallbackData = () => {
  let filteredData = [...fallbackInheritors];

  // 按级别筛选
  if (selectedLevel.value !== 'all') {
    filteredData = filteredData.filter(inheritor => inheritor.level === selectedLevel.value);
  }

  // 按地区筛选
  if (selectedRegion.value !== 'all') {
    filteredData = filteredData.filter(inheritor => inheritor.region === selectedRegion.value);
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase();
    filteredData = filteredData.filter(inheritor =>
      inheritor.name.toLowerCase().includes(keyword) ||
      inheritor.title.toLowerCase().includes(keyword) ||
      inheritor.description.toLowerCase().includes(keyword)
    );
  }

  // 分页处理
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;

  allInheritors.value = filteredData.slice(startIndex, endIndex);
  totalPages.value = Math.ceil(filteredData.length / pageSize.value);
  totalRecords.value = filteredData.length;
};

// 筛选传承人
const filterInheritors = () => {
  currentPage.value = 1; // 重置到第一页
  loadInheritors();
};

// 处理搜索
const handleSearch = (event) => {
  // 可以在这里添加防抖逻辑
  currentPage.value = 1; // 重置到第一页
  loadInheritors();
};

// 页码大小改变
const onPageSizeChange = () => {
  currentPage.value = 1; // 重置到第一页
  loadInheritors();
};

// 监听页码变化
watch(currentPage, () => {
  loadInheritors();
});

// 组件挂载后初始化
onMounted(() => {
  loadInheritors();
});
</script>

<style scoped>
/* 全局变量 */
/* 全局变量 */
.inheritors {
  --primary-red: #c8102e;
  --gold: #d4af37;
  --ink-black: #1a1a1a;
  --paper-white: #faf9f6;
  --shadow-ink: rgba(0, 0, 0, 0.1);
}

/* 页面标题样式 - 中国风 */
.page-header {
  position: relative;
  background: linear-gradient(180deg, #faf9f6 0%, #f5f3ed 100%);
  padding: 100px 0 80px;
  text-align: center;
  overflow: hidden;
}

/* 祥云装饰 */
.cloud {
  position: absolute;
  width: 200px;
  height: 100px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><path d="M50,50 Q70,20 100,50 Q130,80 150,50" fill="none" stroke="%23e0d8c8" stroke-width="2" opacity="0.3"/></svg>');
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.cloud-left {
  top: 20px;
  left: 10%;
  animation-delay: 0s;
}

.cloud-right {
  top: 40px;
  right: 10%;
  animation-delay: -10s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) translateX(0);
  }

  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

/* 印章装饰 */
.title-seal {
  position: absolute;
  top: 30px;
  right: 15%;
  width: 60px;
  height: 60px;
}

.seal-stamp {
  width: 100%;
  height: 100%;
  background: var(--primary-red);
  border: 3px solid var(--primary-red);
  border-radius: 4px;
  opacity: 0.8;
  transform: rotate(5deg);
  animation: sealPulse 3s ease-in-out infinite;
  box-shadow: 0 4px 15px rgba(200, 16, 46, 0.3);
}

@keyframes sealPulse {

  0%,
  100% {
    opacity: 0.8;
    transform: rotate(5deg) scale(1);
  }

  50% {
    opacity: 1;
    transform: rotate(5deg) scale(1.05);
  }
}

/* 水墨笔刷效果 */
.ink-brush {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.05), transparent);
  opacity: 0.5;
}

/* 标题文字动画 */
.page-title {
  font-size: 56px;
  font-weight: 900;
  color: var(--ink-black);
  margin-bottom: 25px;
  letter-spacing: 8px;
  display: inline-flex;
  gap: 5px;
}

.title-char {
  display: inline-block;
  animation: titleFloat 3s ease-in-out infinite;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1);
}

.title-char:nth-child(1) {
  animation-delay: 0s;
}

.title-char:nth-child(2) {
  animation-delay: 0.1s;
}

.title-char:nth-child(3) {
  animation-delay: 0.2s;
}

.title-char:nth-child(4) {
  animation-delay: 0.3s;
}

.title-char:nth-child(5) {
  animation-delay: 0.4s;
}

@keyframes titleFloat {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

/* 副标题样式 */
.page-subtitle {
  font-size: 18px;
  color: #666;
  display: inline-flex;
  align-items: center;
  gap: 15px;
  letter-spacing: 2px;
}

.subtitle-line {
  display: inline-block;
  width: 40px;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--gold), transparent);
  animation: linePulse 2s ease-in-out infinite;
}

@keyframes linePulse {

  0%,
  100% {
    opacity: 0.5;
    transform: scaleX(1);
  }

  50% {
    opacity: 1;
    transform: scaleX(1.2);
  }
}

/* 通用区块样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
}

section {
  padding: 60px 0;
}

/* 筛选区域样式 - 中国风卡片 */
.filter-section {
  background: linear-gradient(180deg, #f5f3ed 0%, #faf9f6 100%);
  padding: 40px 0 60px;
  position: relative;
}

.filter-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(200, 16, 46, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(200, 16, 46, 0.2);
}

/* 装饰元素 */
.filter-decoration-top,
.filter-decoration-bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right,
      transparent,
      var(--gold),
      var(--primary-red),
      var(--gold),
      transparent);
}

.filter-decoration-top {
  top: 0;
}

.filter-decoration-bottom {
  bottom: 0;
}

.filter-content {
  display: flex;
  gap: 30px;
  align-items: flex-end;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.search-group {
  flex: 1.5;
}

.filter-label {
  font-size: 14px;
  color: var(--ink-black);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}

.label-icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

/* uiverse.io 风格的下拉框 */
.select-wrapper {
  position: relative;
}

.filter-select {
  width: 100%;
  padding: 14px 40px 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  appearance: none;
  color: var(--ink-black);
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-select:hover {
  border-color: var(--gold);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
  transform: translateY(-1px);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-red);
  box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.1);
}

.select-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--ink-black);
  pointer-events: none;
  transition: all 0.3s ease;
}

.filter-select:focus+.select-arrow {
  border-top-color: var(--primary-red);
  transform: translateY(-50%) rotate(180deg);
}

/* 现代化搜索框 - uiverse.io 风格 */
.modern-search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 14px 50px 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  background-color: white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--ink-black);
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-input::placeholder {
  color: #999;
  font-weight: 400;
}

.search-input:hover {
  border-color: var(--gold);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-red);
  box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.1);
  transform: translateY(-2px);
}

.search-btn {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--primary-red), #e63946);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
}

.search-btn:hover {
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 6px 20px rgba(200, 16, 46, 0.4);
}

.search-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.search-icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  animation: searchPulse 2s ease-in-out infinite;
}

@keyframes searchPulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(to right, var(--primary-red), var(--gold));
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus~.input-underline {
  width: 100%;
}

/* 水墨加载动画 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  min-height: 400px;
}

.ink-loading {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 30px;
}

.ink-drop {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--ink-black);
  animation: inkDrop 1.5s ease-in-out infinite;
}

.ink-drop-1 {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0s;
}

.ink-drop-2 {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  animation-delay: 0.3s;
}

.ink-drop-3 {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  animation-delay: 0.6s;
}

@keyframes inkDrop {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.loading-text {
  font-size: 18px;
  color: var(--ink-black);
  letter-spacing: 4px;
  display: flex;
  gap: 4px;
}

.loading-char {
  display: inline-block;
  animation: charWave 1.5s ease-in-out infinite;
}

.loading-char:nth-child(1) {
  animation-delay: 0s;
}

.loading-char:nth-child(2) {
  animation-delay: 0.1s;
}

.loading-char:nth-child(3) {
  animation-delay: 0.2s;
}

.loading-char:nth-child(4) {
  animation-delay: 0.3s;
}

.loading-char:nth-child(5) {
  animation-delay: 0.4s;
}

@keyframes charWave {

  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }

  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 传承人列表样式 - 水墨风格 */
.inheritors-section {
  background: linear-gradient(180deg, #faf9f6 0%, #f5f3ed 50%, #faf9f6 100%);
  padding: 60px 0 80px;
  position: relative;
}

.inheritors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 35px;
  margin-bottom: 50px;
}

/* 水墨风格卡片 - 古典与现代融合 */
.inheritor-card {
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  animation: cardFadeIn 0.6s ease-out forwards;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.inheritor-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(200, 16, 46, 0.1);
}

/* 水墨边框 */
.card-ink-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  border-radius: 20px;
  pointer-events: none;
  transition: all 0.5s ease;
}

.inheritor-card:hover .card-ink-border {
  border-color: var(--gold);
  box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.1);
}

/* 中国风四角装饰 */
.card-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid var(--gold);
  opacity: 0;
  transition: all 0.4s ease;
}

.card-corner-tl {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 4px;
}

.card-corner-tr {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 4px;
}

.card-corner-bl {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 4px;
}

.card-corner-br {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 4px;
}

.inheritor-card:hover .card-corner {
  opacity: 1;
}

.card-header {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.img-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.inheritor-img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.inheritor-card:hover .inheritor-img {
  transform: scale(1.1);
  filter: brightness(1.1);
}

.img-blur-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(20px);
  transform: scale(1.1);
  z-index: 0;
  pointer-events: none;
}

.img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom,
      transparent 0%,
      transparent 40%,
      rgba(0, 0, 0, 0.7) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
  pointer-events: none;
}

.inheritor-card:hover .img-overlay {
  opacity: 1;
}


/* 级别徽章 - 中国风 */
.level-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 18px;
  border-radius: 25px;
  font-size: 13px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  animation: badgeFloat 3s ease-in-out infinite;
  z-index: 3;
}

@keyframes badgeFloat {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.badge-icon-img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  animation: badgeRotate 4s linear infinite;
}

@keyframes badgeRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.level-badge.national {
  background: linear-gradient(135deg, #c8102e 0%, #e63946 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.level-badge.provincial {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.level-badge.municipal {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.level-badge.county {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.card-body {
  padding: 25px;
  background: linear-gradient(to bottom, white, #fafafa);
}

/* 传承人姓名 - 中国风书法 */
.inheritor-name {
  font-size: 24px;
  font-weight: 900;
  color: var(--ink-black);
  margin-bottom: 12px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.name-decoration {
  font-size: 28px;
  color: var(--primary-red);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.inheritor-card:hover .inheritor-name {
  color: var(--primary-red);
  transform: scale(1.05);
}

.inheritor-card:hover .name-decoration {
  opacity: 1;
  transform: scale(1.1);
}

.inheritor-title {
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
  text-align: center;
  letter-spacing: 1px;
  font-weight: 500;
}

/* 元数据样式 */
.inheritor-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 18px;
  padding: 12px;
  background: rgba(200, 16, 46, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(200, 16, 46, 0.1);
}

.meta-item {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.inheritor-card:hover .meta-item {
  color: var(--primary-red);
}

.meta-icon-img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }
}

.meta-divider {
  color: var(--gold);
  font-weight: bold;
}

/* 描述文字 */
.inheritor-desc {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 22px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: justify;
  letter-spacing: 0.3px;
}

.card-footer {
  text-align: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

/* uiverse.io 风格按钮 */
.view-detail-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--ink-black), #333);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.view-detail-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-red), var(--gold));
  transition: left 0.4s ease;
  z-index: 0;
}

.view-detail-btn:hover::before {
  left: 0;
}

.btn-text,
.btn-arrow {
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.btn-arrow {
  font-size: 18px;
  font-weight: bold;
  transform: translateX(0);
}

.view-detail-btn:hover .btn-arrow {
  transform: translateX(5px);
}

.view-detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(200, 16, 46, 0.4);
}

.view-detail-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 分页样式 - 古典风格 */
.pagination {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 50px;
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.pagination-decoration {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 3px;
  background: linear-gradient(to right, transparent, var(--gold), transparent);
}

/* uiverse.io 风格分页按钮 */
.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background-color: white;
  color: var(--ink-black);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.page-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(200, 16, 46, 0.1);
  transition: all 0.5s ease;
}

.page-btn:hover:not(:disabled)::before {
  width: 200px;
  height: 200px;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-red);
  color: var(--primary-red);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(200, 16, 46, 0.2);
}

.page-btn:active:not(:disabled) {
  transform: translateY(0);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #f0f0f0;
  color: #ccc;
}

.btn-icon-img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.page-btn-prev:hover:not(:disabled) .btn-icon-img {
  transform: translateX(-3px);
}

.page-btn-next:hover:not(:disabled) .btn-icon-img {
  transform: translateX(3px);
}

.btn-label {
  position: relative;
  z-index: 1;
}

/* 页码信息 */
.page-info {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--primary-red), #e63946);
  color: white;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(200, 16, 46, 0.3);
  overflow: hidden;
}

.page-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--gold);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px var(--gold);
}

.page-current {
  font-size: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.page-divider {
  opacity: 0.7;
  margin: 0 4px;
}

.page-total {
  opacity: 0.9;
}

/* 每页数量选择 */
.page-size {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(200, 16, 46, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(200, 16, 46, 0.1);
}

.page-size-label {
  font-size: 14px;
  color: var(--ink-black);
  font-weight: 600;
}

.select-wrapper-small {
  position: relative;
}

.page-size-select {
  padding: 6px 30px 6px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  appearance: none;
  font-weight: 600;
  color: var(--ink-black);
  transition: all 0.3s ease;
}

.page-size-select:hover {
  border-color: var(--gold);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
}

.page-size-select:focus {
  outline: none;
  border-color: var(--primary-red);
  box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.1);
}

.select-arrow-small {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--ink-black);
  pointer-events: none;
  transition: transform 0.3s ease;
}

.page-size-select:focus+.select-arrow-small {
  transform: translateY(-50%) rotate(180deg);
}

/* 无数据状态样式 */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  min-height: 400px;
  text-align: center;
}

.no-data p {
  font-size: 18px;
  color: #999;
  letter-spacing: 2px;
  position: relative;
  padding: 20px 40px;
  border: 2px dashed #ddd;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  animation: noDataFade 2s ease-in-out infinite;
}

@keyframes noDataFade {

  0%,
  100% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .page-title {
    font-size: 40px;
  }

  .inheritors-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
  }

  .pagination {
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 60px 0;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 18px;
  }

  .filter-content {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .filter-select {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  section {
    padding: 40px 0;
  }

  .pagination {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .inheritors-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    height: 200px;
  }
}
</style>
