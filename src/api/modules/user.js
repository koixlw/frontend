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

  // 根据手机号查询预约
  getReservationsByPhone: (phone) => {
    return http.get(`/reservations/phone/${phone}`);
  },

  // 根据预约编号查询预约
  getReservationByNumber: (reservationNumber) => {
    return http.get(`/reservations/number/${reservationNumber}`);
  },

  // 获取可用时间段
  getAvailableTimeSlots: (date) => {
    return http.get(`/reservations/time-slots?date=${date}`);
  },

  // 验证预约时间
  validateReservationTime: (date, timeSlotId) => {
    return http.get(`/reservations/validate-time?date=${date}&timeSlotId=${timeSlotId}`);
  },

  // 取消预约
  cancelReservation: (id, reason) => {
    return http.put(`/reservations/${id}/cancel`, null, {
      params: { reason }
    });
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

export default {
  reserveApi,
  activityApi
};
