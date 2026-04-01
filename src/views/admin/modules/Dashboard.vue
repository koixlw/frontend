<template>
  <div class="dashboard">
    <h1 class="page-title">控制台</h1>
    
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat, key) in stats" :key="key">
        <div class="stat-icon">
          <span class="stat-emoji">{{ stat.icon }}</span>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <h2>快速操作</h2>
      <div class="actions-grid">
        <router-link
          v-for="action in quickActions"
          :key="action.path"
          :to="action.path"
          class="action-card"
        >
          <span class="action-icon">{{ action.icon }}</span>
          <span class="action-label">{{ action.label }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getStats } from '@/api/modules';

export default {
  name: 'Dashboard',
  setup() {
    const statsData = ref({});
    const stats = ref({
      userCount: { icon: '👥', label: '用户总数', value: 0 },
      reservationCount: { icon: '📅', label: '预约总数', value: 0 },
      inheritorCount: { icon: '🎨', label: '传承人数', value: 0 },
      newsCount: { icon: '📰', label: '新闻总数', value: 0 },
      productCount: { icon: '🛒', label: '商品总数', value: 0 },
      galleryWorkCount: { icon: '🖼️', label: '作品总数', value: 0 },
    });

    const quickActions = [
      { path: '/admin/users', icon: '👥', label: '管理用户' },
      { path: '/admin/reservations', icon: '📅', label: '查看预约' },
      { path: '/admin/inheritors', icon: '🎨', label: '管理传承人' },
      { path: '/admin/news', icon: '📰', label: '发布新闻' },
      { path: '/admin/products', icon: '🛒', label: '添加商品' },
      { path: '/admin/gallery', icon: '🖼️', label: '上传作品' },
    ];

    const loadStats = async () => {
      try {
        const data = await getStats();
        statsData.value = data;
        
        // 更新统计数据
        stats.value.userCount.value = data.userCount || 0;
        stats.value.reservationCount.value = data.reservationCount || 0;
        stats.value.inheritorCount.value = data.inheritorCount || 0;
        stats.value.newsCount.value = data.newsCount || 0;
        stats.value.productCount.value = data.productCount || 0;
        stats.value.galleryWorkCount.value = data.galleryWorkCount || 0;
      } catch (error) {
        console.error('加载统计数据失败:', error);
      }
    };

    onMounted(() => {
      loadStats();
    });

    return {
      stats,
      quickActions
    };
  }
};
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 0 0 30px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 15px;
}

.stat-emoji {
  font-size: 32px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.quick-actions {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.quick-actions h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.action-card:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.action-icon {
  font-size: 28px;
}

.action-label {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.action-card:hover .action-label {
  color: white;
}
</style>

