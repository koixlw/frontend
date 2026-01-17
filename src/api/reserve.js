import http from '@/utils/http'

/**
 * 预约相关API
 */
export const reserveApi = {
  // 创建预约
  createReservation(data) {
    return http.post('/reservations', data)
  },

  // 根据手机号查询预约
  getReservationsByPhone(phone) {
    return http.get(`/reservations/phone/${phone}`)
  },

  // 根据预约编号查询预约
  getReservationByNumber(reservationNumber) {
    return http.get(`/reservations/number/${reservationNumber}`)
  },

  // 获取可用时间段
  getAvailableTimeSlots(date) {
    return http.get(`/reservations/time-slots?date=${date}`)
  },

  // 验证预约时间
  validateReservationTime(date, timeSlotId) {
    return http.get(`/reservations/validate-time?date=${date}&timeSlotId=${timeSlotId}`)
  },

  // 取消预约
  cancelReservation(id, reason) {
    return http.put(`/reservations/${id}/cancel`, null, {
      params: { reason }
    })
  }
}
