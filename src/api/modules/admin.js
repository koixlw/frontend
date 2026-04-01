import http from '@/utils/http';

/**
 * 后台管理相关 API
 * 包含用户、商品、传承人、新闻、作品、预约、活动的管理
 */

// ==================== 用户管理 ====================
export const adminUserApi = {
  // 获取用户列表
  getUsersList: (params) => {
    return http.get('/admin/users', { params });
  },

  // 获取用户详情
  getUserDetail: (id) => {
    return http.get(`/admin/users/${id}`);
  },

  // 更新用户状态
  updateUserStatus: (id, status) => {
    return http.put(`/admin/users/${id}/status`, { status });
  },

  // 删除用户
  deleteUser: (id) => {
    return http.delete(`/admin/users/${id}`);
  }
};

// ==================== 商品管理 ====================
export const adminProductApi = {
  // 获取商品列表
  getProductsList: (params) => {
    return http.get('/admin/products', { params });
  },

  // 创建商品
  createProduct: (data) => {
    return http.post('/admin/products', data);
  },

  // 更新商品
  updateProduct: (id, data) => {
    return http.put(`/admin/products/${id}`, data);
  },

  // 删除商品
  deleteProduct: (id) => {
    return http.delete(`/admin/products/${id}`);
  },

  // 上架/下架商品
  toggleProductStatus: (id, status) => {
    return http.put(`/admin/products/${id}/status`, { status });
  }
};

// ==================== 传承人管理 ====================
export const adminInheritorApi = {
  // 获取传承人列表
  getInheritorsList: (params) => {
    return http.get('/admin/inheritors', { params });
  },

  // 创建传承人
  createInheritor: (data) => {
    return http.post('/admin/inheritors', data);
  },

  // 更新传承人
  updateInheritor: (id, data) => {
    return http.put(`/admin/inheritors/${id}`, data);
  },

  // 删除传承人
  deleteInheritor: (id) => {
    return http.delete(`/admin/inheritors/${id}`);
  }
};

// ==================== 新闻管理 ====================
export const adminNewsApi = {
  // 获取新闻列表
  getNewsList: (params) => {
    return http.get('/admin/news', { params });
  },

  // 创建新闻
  createNews: (data) => {
    return http.post('/admin/news', data);
  },

  // 更新新闻
  updateNews: (id, data) => {
    return http.put(`/admin/news/${id}`, data);
  },

  // 删除新闻
  deleteNews: (id) => {
    return http.delete(`/admin/news/${id}`);
  },

  // 发布/撤回新闻
  toggleNewsStatus: (id, status) => {
    return http.put(`/admin/news/${id}/status`, { status });
  }
};

// ==================== 作品管理 ====================
export const adminGalleryApi = {
  // 获取作品列表
  getWorksList: (params) => {
    return http.get('/admin/gallery', { params });
  },

  // 创建作品
  createWork: (data) => {
    return http.post('/admin/gallery', data);
  },

  // 更新作品
  updateWork: (id, data) => {
    return http.put(`/admin/gallery/${id}`, data);
  },

  // 删除作品
  deleteWork: (id) => {
    return http.delete(`/admin/gallery/${id}`);
  }
};

// ==================== 预约管理 ====================
export const adminReserveApi = {
  // 获取预约列表
  getReservationsList: (params) => {
    return http.get('/admin/reservations', { params });
  },

  // 获取预约详情
  getReservationDetail: (id) => {
    return http.get(`/admin/reservations/${id}`);
  },

  // 确认预约
  confirmReservation: (id) => {
    return http.put(`/admin/reservations/${id}/confirm`);
  },

  // 取消预约
  cancelReservation: (id, reason) => {
    return http.put(`/admin/reservations/${id}/cancel`, { reason });
  }
};

// ==================== 活动管理 ====================
export const adminActivityApi = {
  // 获取活动列表
  getActivitiesList: (params) => {
    return http.get('/admin/activities', { params });
  },

  // 创建活动
  createActivity: (data) => {
    return http.post('/admin/activities', data);
  },

  // 更新活动
  updateActivity: (id, data) => {
    return http.put(`/admin/activities/${id}`, data);
  },

  // 删除活动
  deleteActivity: (id) => {
    return http.delete(`/admin/activities/${id}`);
  }
};

// ==================== 统计数据 ====================
export const getStats = () => {
  return http.get('/admin/stats');
};

// ==================== 向后兼容的导出 ====================
// 导出旧的函数名以保持兼容性
export const adminApi = {
  getStats,
  // 用户管理
  getUsersList: adminUserApi.getUsersList,
  getUserDetail: adminUserApi.getUserDetail,
  updateUserStatus: adminUserApi.updateUserStatus,
  deleteUser: adminUserApi.deleteUser,
  // 商品管理
  getProductsList: adminProductApi.getProductsList,
  createProduct: adminProductApi.createProduct,
  updateProduct: adminProductApi.updateProduct,
  deleteProduct: adminProductApi.deleteProduct,
  // 传承人管理
  getInheritorsList: adminInheritorApi.getInheritorsList,
  createInheritor: adminInheritorApi.createInheritor,
  updateInheritor: adminInheritorApi.updateInheritor,
  deleteInheritor: adminInheritorApi.deleteInheritor,
  // 新闻管理
  getNewsList: adminNewsApi.getNewsList,
  createNews: adminNewsApi.createNews,
  updateNews: adminNewsApi.updateNews,
  deleteNews: adminNewsApi.deleteNews,
  // 作品管理
  getGalleryWorks: adminGalleryApi.getWorksList,
  createGalleryWork: adminGalleryApi.createWork,
  updateGalleryWork: adminGalleryApi.updateWork,
  deleteGalleryWork: adminGalleryApi.deleteWork,
  // 预约管理
  getReservationsList: adminReserveApi.getReservationsList,
  getReservationDetail: adminReserveApi.getReservationDetail,
  confirmReservation: adminReserveApi.confirmReservation,
  cancelReservation: adminReserveApi.cancelReservation,
  // 活动管理
  getActivitiesList: adminActivityApi.getActivitiesList,
  createActivity: adminActivityApi.createActivity,
  updateActivity: adminActivityApi.updateActivity,
  deleteActivity: adminActivityApi.deleteActivity,
  // 获取活动类型
  getActivityTypes: adminActivityApi.getActivityTypes,
  createActivityType: adminActivityApi.createActivityType,
  updateActivityType: adminActivityApi.updateActivityType,
  deleteActivityType: adminActivityApi.deleteActivityType
};

export default {
  adminUserApi,
  adminProductApi,
  adminInheritorApi,
  adminNewsApi,
  adminGalleryApi,
  adminReserveApi,
  adminActivityApi,
  getStats,
  adminApi
};
