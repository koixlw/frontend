import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

/**
 * 路由配置
 * 使用模块化路由配置，便于维护和扩展
 */

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫，用于设置页面标题和检查登录认证
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  
  // 检查是否需要登录认证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      // 未登录，跳转到登录页
      next('/admin/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
