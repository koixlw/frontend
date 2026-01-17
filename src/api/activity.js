import http from '@/utils/http'

/**
 * 活动相关API
 */
export const activityApi = {
  // 获取活动类型
  getActivityTypes() {
    return http.get('/activities/types')
  },

  // 获取热门活动
  getPopularActivities() {
    return http.get('/activities/popular')
  },

  // 根据代码获取活动类型
  getActivityTypeByCode(code) {
    return http.get(`/activities/types/${code}`)
  }
}
