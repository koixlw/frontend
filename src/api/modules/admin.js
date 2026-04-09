import http from '@/utils/http';

/**
 * 后台管理相关 API
 * 包含用户、商品、传承人、新闻、作品、预约、活动的管理
 */

// ==================== 统计数据 ====================
export const getStats = () => {
  return http.get('/admin/stats');
};

// ==================== 用户管理 ====================
export const adminUserApi = {
  // 获取用户列表 (后端从0开始分页)
  getUsersList: (params = {}) => {
    const { page = 0, size = 10, ...rest } = params;
    return http.get('/admin/users', { params: { page, size, ...rest } });
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

// ==================== 预约管理 ====================
export const adminReserveApi = {
  // 获取预约列表 (后端从0开始分页)
  getReservationsList: (params = {}) => {
    const { page = 0, size = 10, ...rest } = params;
    return http.get('/admin/reservations', { params: { page, size, ...rest } });
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

// ==================== 传承人管理 ====================
export const adminInheritorApi = {
  // 获取传承人列表 (后端从0开始分页)
  getInheritorsList: (params = {}) => {
    const { page = 0, size = 10, ...rest } = params;
    return http.get('/admin/inheritors', { params: { page, size, ...rest } });
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
  // 获取新闻列表 (后端从0开始分页)
  getNewsList: (params = {}) => {
    const { page = 0, size = 10, ...rest } = params;
    return http.get('/admin/news', { params: { page, size, ...rest } });
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

// ==================== 商品管理 ====================
export const adminProductApi = {
  // 获取商品列表 (后端从0开始分页)
  getProductsList: (params = {}) => {
    const { page = 0, size = 10, ...rest } = params;
    return http.get('/admin/products', { params: { page, size, ...rest } });
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

// ==================== 作品管理 ====================
export const adminGalleryApi = {
  // 获取作品列表 (后端从0开始分页)
  getWorksList: (params = {}) => {
    const { page = 0, size = 10, ...rest } = params;
    return http.get('/admin/gallery-works', { params: { page, size, ...rest } });
  },

  // 创建作品
  createWork: (data) => {
    return http.post('/admin/gallery-works', data);
  },

  // 更新作品
  updateWork: (id, data) => {
    return http.put(`/admin/gallery-works/${id}`, data);
  },

  // 删除作品
  deleteWork: (id) => {
    return http.delete(`/admin/gallery-works/${id}`);
  }
};

// ==================== 活动类型管理 ====================
export const adminActivityTypeApi = {
  // 获取活动类型列表
  getActivityTypes: () => {
    return http.get('/admin/activity-types');
  },

  // 创建活动类型
  createActivityType: (data) => {
    return http.post('/admin/activity-types', data);
  },

  // 更新活动类型
  updateActivityType: (id, data) => {
    return http.put(`/admin/activity-types/${id}`, data);
  },

  // 删除活动类型
  deleteActivityType: (id) => {
    return http.delete(`/admin/activity-types/${id}`);
  }
};

// ==================== 向后兼容的导出 ====================
export const adminApi = {
  getStats,
  // 用户管理
  getUsersList: adminUserApi.getUsersList,
  getUserDetail: adminUserApi.getUserDetail,
  updateUserStatus: adminUserApi.updateUserStatus,
  deleteUser: adminUserApi.deleteUser,
  // 预约管理
  getReservationsList: adminReserveApi.getReservationsList,
  getReservationDetail: adminReserveApi.getReservationDetail,
  confirmReservation: adminReserveApi.confirmReservation,
  cancelReservation: adminReserveApi.cancelReservation,
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
  toggleNewsStatus: adminNewsApi.toggleNewsStatus,
  // 商品管理
  getProductsList: adminProductApi.getProductsList,
  createProduct: adminProductApi.createProduct,
  updateProduct: adminProductApi.updateProduct,
  deleteProduct: adminProductApi.deleteProduct,
  toggleProductStatus: adminProductApi.toggleProductStatus,
  // 作品管理
  getGalleryWorks: adminGalleryApi.getWorksList,
  createGalleryWork: adminGalleryApi.createWork,
  updateGalleryWork: adminGalleryApi.updateWork,
  deleteGalleryWork: adminGalleryApi.deleteWork,
  // 活动类型管理
  getActivityTypes: adminActivityTypeApi.getActivityTypes,
  createActivityType: adminActivityTypeApi.createActivityType,
  updateActivityType: adminActivityTypeApi.updateActivityType,
  deleteActivityType: adminActivityTypeApi.deleteActivityType
};

// 导出单独的函数供管理页面使用
export const getUsers = adminUserApi.getUsersList;
export const createUser = () => http.post('/admin/users');
export const updateUser = adminUserApi.updateUserStatus;
export const deleteUser = adminUserApi.deleteUser;

export const getReservations = adminReserveApi.getReservationsList;
export const updateReservation = adminReserveApi.confirmReservation;
export const deleteReservation = adminReserveApi.cancelReservation;

export default {
  adminUserApi,
  adminProductApi,
  adminInheritorApi,
  adminNewsApi,
  adminGalleryApi,
  adminReserveApi,
  adminActivityTypeApi,
  getStats,
  adminApi
};
