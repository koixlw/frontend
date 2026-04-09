import http from '@/utils/http';

/**
 * 用户相关 API
 * 包含预约和活动
 */

// ==================== 预约相关 ====================
export const reserveApi = {
  // 创建预约
  createReservation: (data) => {
    return http.post('/reservations', data);
  },

  // 获取预约详情
  getReservationById: (id) => {
    return http.get(`/reservations/${id}`);
  },

  // 查询用户的预约
  getUserReservations: (userId) => {
    return http.get(`/reservations/user/${userId}`);
  },

  // 获取可用时间段
  getAvailableTimeSlots: (activityTypeId, date) => {
    return http.get('/reservations/timeslots', {
      params: { activityTypeId, date }
    });
  },

  // 取消预约
  cancelReservation: (id) => {
    return http.put(`/reservations/${id}/cancel`);
  }
};

// ==================== 活动相关 ====================
export const activityApi = {
  // 获取活动类型
  getActivityTypes: () => {
    return http.get('/activities/types');
  },

  // 获取热门活动
  getPopularActivities: () => {
    return http.get('/activities/popular');
  },

  // 根据代码获取活动类型
  getActivityTypeByCode: (code) => {
    return http.get(`/activities/types/${code}`);
  }
};

// 导出单独的函数供管理页面使用
export const getActivityTypes = activityApi.getActivityTypes;

export default {
  reserveApi,
  activityApi
};
