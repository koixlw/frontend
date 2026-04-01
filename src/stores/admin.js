import { defineStore } from 'pinia';

/**
 * 管理员状态管理
 */

export const useAdminStore = defineStore('admin', {
  state: () => ({
    adminInfo: null,
    token: localStorage.getItem('admin_token') || null,
    isLoggedIn: false,
    permissions: []
  }),

  getters: {
    // 检查是否已登录
    isAuthenticated: (state) => {
      return !!state.token && state.isLoggedIn;
    },

    // 检查是否有特定权限
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission);
    }
  },

  actions: {
    // 设置管理员信息
    setAdminInfo(adminInfo) {
      this.adminInfo = adminInfo;
    },

    // 设置 token
    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem('admin_token', token);
        this.isLoggedIn = true;
      } else {
        localStorage.removeItem('admin_token');
        this.isLoggedIn = false;
      }
    },

    // 设置权限
    setPermissions(permissions) {
      this.permissions = permissions;
    },

    // 管理员登录
    async login(credentials) {
      try {
        // 调用登录 API
        const { authApi } = await import('@/api/modules');
        const response = await authApi.authApi.adminLogin(credentials);

        if (response.data.success) {
          this.setToken(response.data.token);
          this.setAdminInfo(response.data.adminInfo);
          this.setPermissions(response.data.permissions || []);
          return { success: true };
        }
        return { success: false, message: response.data.message || '登录失败' };
      } catch (error) {
        console.error('管理员登录失败:', error);
        return { success: false, message: '登录失败，请稍后重试' };
      }
    },

    // 管理员登出
    logout() {
      this.setToken(null);
      this.setAdminInfo(null);
      this.setPermissions([]);
      this.isLoggedIn = false;
    }
  }
});
