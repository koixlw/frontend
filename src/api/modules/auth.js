import http from '@/utils/http';

/**
 * 认证相关 API
 * 包含管理员登录、认证等
 */

export const authApi = {
  // 管理员登录
  adminLogin: (credentials) => {
    return http.post('/admin/login', credentials);
  },

  // 管理员登出
  adminLogout: () => {
    return http.post('/admin/logout');
  },

  // 刷新token
  refreshToken: (token) => {
    return http.post('/auth/refresh', { token });
  },

  // 验证token
  verifyToken: (token) => {
    return http.post('/auth/verify', { token });
  }
};

export default {
  authApi
};
