<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <h1 v-if="!sidebarCollapsed">管理后台</h1>
        <h1 v-else>M</h1>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'active': isActive(item.path) }"
        >
          <img :src="item.icon" :alt="item.label" class="nav-icon" />
          <span class="nav-text" v-if="!sidebarCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <header class="top-header">
        <button class="toggle-sidebar" @click="toggleSidebar">
          ☰
        </button>
        <div class="header-right">
          <span class="username">{{ username }}</span>
          <button class="logout-btn" @click="handleLogout">退出登录</button>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'AdminLayout',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const sidebarCollapsed = ref(false);
    const username = computed(() => localStorage.getItem('admin_username') || '管理员');

    const menuItems = [
      { path: '/admin/dashboard', label: '控制台', icon: new URL('../../image/控制中心.png', import.meta.url).href },
      { path: '/admin/users', label: '用户管理', icon: new URL('../../image/用户.png', import.meta.url).href },
      { path: '/admin/reservations', label: '预约管理', icon: new URL('../../image/我的预约.png', import.meta.url).href },
      { path: '/admin/inheritors', label: '传承人管理', icon: new URL('../../image/传承.png', import.meta.url).href },
      { path: '/admin/news', label: '新闻管理', icon: new URL('../../image/通知.png', import.meta.url).href },
      { path: '/admin/products', label: '商品管理', icon: new URL('../../image/商品.png', import.meta.url).href },
      { path: '/admin/gallery', label: '作品管理', icon: new URL('../../image/作品.png', import.meta.url).href },
      { path: '/admin/activities', label: '活动管理', icon: new URL('../../image/活动.png', import.meta.url).href },
    ];

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    const isActive = (path) => {
      return route.path.startsWith(path);
    };

    const handleLogout = () => {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_username');
      router.push('/admin/login');
    };

    return {
      sidebarCollapsed,
      menuItems,
      username,
      toggleSidebar,
      isActive,
      handleLogout
    };
  }
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  transition: width 0.3s;
  overflow-x: hidden;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.sidebar-nav {
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left: 4px solid #3498db;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  min-width: 20px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

.nav-item:hover .nav-icon,
.nav-item.active .nav-icon {
  opacity: 1;
}

.nav-text {
  white-space: nowrap;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-header {
  background: white;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-sidebar {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.3s;
}

.toggle-sidebar:hover {
  background: #f0f0f0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  font-size: 14px;
  color: #666;
}

.logout-btn {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
</style>

