<template>
  <div class="product-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">{{ product.title }}</h1>
        <p class="page-subtitle">{{ product.description }}</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <section class="product-content">
      <div class="container">
        <div class="product-detail-wrapper">
          <!-- 左侧图片 -->
          <div class="product-gallery">
            <div class="main-image">
              <img :src="product.image" :alt="product.title" class="product-main-img">
            </div>
          </div>

          <!-- 右侧信息 -->
          <div class="product-info-panel">
            <div class="product-meta">
              <span class="category-tag">{{ getCategoryName(product.categoryId) }}</span>
              <span class="inheritor-tag">传承人：{{ getInheritorName(product.inheritorId) }}</span>
            </div>

            <h2 class="product-title">{{ product.title }}</h2>

            <div class="product-rating-large">
              <div class="rating-stars">
                <i class="icon-star" v-for="i in 5" :key="i" :class="{ 'active': i <= product.rating }"></i>
              </div>
              <span class="rating-text">{{ product.rating }}分</span>
              <span class="review-count">({{ product.reviewCount }}条评价)</span>
            </div>

            <div class="product-price-large">
              <span class="current-price">¥{{ product.price.toFixed(2) }}</span>
              <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice.toFixed(2) }}</span>
            </div>

            <div class="product-description">
              <h4>商品介绍</h4>
              <p>{{ product.description }}</p>
            </div>

            <div class="product-tags">
              <span class="tag-item" v-for="tag in product.tags" :key="tag">{{ tag }}</span>
            </div>

            <div class="product-actions">
              <button class="add-to-cart-btn" @click="addToCart">
                <i class="icon-shopping-cart"></i> 加入购物车
              </button>
              <button class="buy-now-btn" @click="buyNow">
                <i class="icon-credit-card"></i> 立即购买
              </button>
            </div>

            <div class="product-services">
              <div class="service-item">
                <i class="icon-check-circle"></i>
                <span>正品保证</span>
              </div>
              <div class="service-item">
                <i class="icon-truck"></i>
                <span>包邮配送</span>
              </div>
              <div class="service-item">
                <i class="icon-undo"></i>
                <span>7 天无理由退换</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="product-detail-sections">
          <!-- 商品详情 -->
          <div class="detail-section">
            <h3 class="section-title">商品详情</h3>
            <div class="detail-content">
              <p>{{ product.detailDescription || product.description }}</p>
            </div>
          </div>

          <!-- 相关推荐 -->
          <div class="detail-section" v-if="relatedProducts.length > 0">
            <h3 class="section-title">相关推荐</h3>
            <div class="related-products">
              <router-link 
                v-for="item in relatedProducts" 
                :key="item.id"
                :to="`/shop/product/${item.id}`"
                class="related-item"
              >
                <img :src="item.image" :alt="item.title" class="related-img">
                <h4 class="related-title">{{ item.title }}</h4>
                <div class="related-price">¥{{ item.price.toFixed(2) }}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 返回顶部 -->
    <button class="back-to-top" @click="backToTop" v-show="showBackToTop">
      <i class="icon-arrow-up"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 商品 ID
const productId = ref(Number(route.params.id));

// 分类数据
const categories = ref([
  { id: 1, name: '传统人物' },
  { id: 2, name: '民俗风情' },
  { id: 3, name: '神话传说' },
  { id: 4, name: '现代艺术' },
  { id: 5, name: '礼品套装' },
  { id: 6, name: '儿童玩具' }
]);

// 传承人数据
const inheritors = ref([
  { id: 1, name: '张明山' },
  { id: 2, name: '李巧云' },
  { id: 3, name: '王建国' },
  { id: 4, name: '赵秀兰' },
  { id: 5, name: '陈志强' }
]);

// 当前商品
const product = ref({
  id: productId.value,
  title: '传统京剧脸谱泥彩人',
  categoryId: 1,
  inheritorId: 1,
  price: 198.00,
  originalPrice: 238.00,
  image: '/assets/images/product1.jpg',
  tags: ['传统工艺', '非遗传承'],
  rating: 4.8,
  reviewCount: 126,
  isNew: false,
  isHot: true,
  description: '精心制作的京剧脸谱泥彩人，展现传统戏曲文化魅力，是收藏和送礼的绝佳选择。',
  detailDescription: '这款京剧脸谱泥彩人采用传统工艺制作，色彩鲜艳，造型生动。每一个细节都经过精心雕琢，展现了中国传统戏曲文化的独特魅力。适合作为收藏品或送礼佳品。'
});

// 相关商品
const relatedProducts = computed(() => {
  return [
    {
      id: 2,
      title: '民俗风情系列 - 连年有余',
      price: 168.00,
      image: '/assets/images/product2.jpg'
    },
    {
      id: 3,
      title: '神话传说 - 哪吒闹海',
      price: 268.00,
      image: '/assets/images/product3.jpg'
    },
    {
      id: 4,
      title: '现代艺术 - 城市印象',
      price: 298.00,
      image: '/assets/images/product4.jpg'
    }
  ];
});

// 显示返回顶部
const showBackToTop = ref(false);

// 根据分类 ID 获取分类名称
const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : '';
};

// 根据传承人 ID 获取传承人名称
const getInheritorName = (inheritorId) => {
  const inheritor = inheritors.value.find(i => i.id === inheritorId);
  return inheritor ? inheritor.name : '';
};

// 添加到购物车
const addToCart = () => {
  // TODO: 实现购物车逻辑
  alert('已添加到购物车！');
};

// 立即购买
const buyNow = () => {
  // TODO: 跳转到结算页面
  alert('即将跳转到结算页面！');
};

// 返回顶部
const backToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 监听滚动
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: #f9f9f9;
}

.page-header {
  background: linear-gradient(135deg, #f5f3ed 0%, #ebe8e3 100%);
  padding: 60px 0;
  text-align: center;
  border-bottom: 2px solid rgba(212, 175, 55, 0.2);
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.product-content {
  padding: 60px 0;
}

.product-detail-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.product-gallery {
  position: relative;
}

.main-image {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.product-main-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.main-image:hover .product-main-img {
  transform: scale(1.05);
}

.product-info-panel {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.product-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.category-tag,
.inheritor-tag {
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(200, 16, 46, 0.1), rgba(212, 175, 55, 0.1));
  border: 1px solid rgba(200, 16, 46, 0.2);
  border-radius: 20px;
  font-size: 14px;
  color: #666;
}

.product-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
}

.product-rating-large {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-stars {
  display: flex;
  gap: 4px;
}

.icon-star {
  color: #ddd;
  font-size: 20px;
}

.icon-star.active {
  color: #ffb300;
}

.rating-text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.review-count {
  font-size: 14px;
  color: #999;
}

.product-price-large {
  display: flex;
  align-items: baseline;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 2px solid #f0f0f0;
}

.current-price {
  font-size: 36px;
  font-weight: bold;
  color: #d93b30;
}

.original-price {
  font-size: 20px;
  color: #999;
  text-decoration: line-through;
}

.product-description h4 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.product-description p {
  font-size: 15px;
  line-height: 1.8;
  color: #666;
}

.product-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag-item {
  padding: 6px 14px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.product-actions {
  display: flex;
  gap: 20px;
  padding: 30px 0;
  border-top: 2px solid #f0f0f0;
}

.add-to-cart-btn,
.buy-now-btn {
  flex: 1;
  padding: 16px 30px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.add-to-cart-btn:hover {
  border-color: #d93b30;
  color: #d93b30;
  transform: translateY(-2px);
}

.buy-now-btn {
  background: linear-gradient(135deg, #d93b30, #b92c23);
  color: white;
  border: none;
}

.buy-now-btn:hover {
  background: linear-gradient(135deg, #b92c23, #a0261d);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(217, 59, 48, 0.3);
}

.product-services {
  display: flex;
  gap: 30px;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.service-item i {
  color: #10b981;
  font-size: 18px;
}

/* 详情区域 */
.product-detail-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.detail-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.detail-content {
  font-size: 16px;
  line-height: 2;
  color: #666;
}

/* 相关推荐 */
.related-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
}

.related-item {
  display: block;
  text-decoration: none;
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.related-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.related-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.related-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  padding: 15px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-price {
  font-size: 18px;
  font-weight: bold;
  color: #d93b30;
  padding: 0 15px 15px;
}

.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #d93b30, #b92c23);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 99;
  box-shadow: 0 4px 12px rgba(217, 59, 48, 0.3);
}

.back-to-top:hover {
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .product-detail-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 20px;
  }

  .page-title {
    font-size: 24px;
  }

  .product-title {
    font-size: 24px;
  }

  .product-actions {
    flex-direction: column;
  }

  .related-products {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}
</style>
