import { defineStore } from 'pinia';

/**
 * 用户状态管理
 */

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: false
  }),

  getters: {
    // 获取用户显示名称
    displayName: (state) => {
      return state.userInfo?.nickname || state.userInfo?.username || '游客';
    },

    // 检查是否已登录
    isAuthenticated: (state) => {
      return !!state.token && state.isLoggedIn;
    }
  },

  actions: {
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },

    // 设置 token
    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
        this.isLoggedIn = true;
      } else {
        localStorage.removeItem('token');
        this.isLoggedIn = false;
      }
    },

    // 登录
    async login(credentials) {
      try {
        // 调用登录 API
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        const data = await response.json();

        if (data.success) {
          this.setToken(data.token);
          this.setUserInfo(data.userInfo);
          return true;
        }
        return false;
      } catch (error) {
        console.error('登录失败:', error);
        return false;
      }
    },

    // 登出
    logout() {
      this.setToken(null);
      this.setUserInfo(null);
      this.isLoggedIn = false;
    }
  }
});
