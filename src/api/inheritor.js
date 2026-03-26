import http from '../utils/http'

/**
 * 传承人相关API
 */

// 获取所有传承人列表
export const getAllInheritors = () => {
  return http.get('/inheritors')
}

// 分页查询传承人
export const getInheritorsByPage = (params) => {
  return http.get('/inheritors/page', { params })
}

// 根据ID获取传承人基本信息
export const getInheritorById = (id) => {
  return http.get(`/inheritors/${id}`)
}

// 根据ID获取传承人完整详细信息（新接口）
export const getInheritorDetailById = (id) => {
  return http.get(`/inheritors/${id}/detail`)
}

// 根据级别获取传承人列表
export const getInheritorsByLevel = (level) => {
  return http.get(`/inheritors/level/${level}`)
}

// 根据地区获取传承人列表
export const getInheritorsByRegion = (region) => {
  return http.get(`/inheritors/region/${region}`)
}

// 根据关键词搜索传承人
export const searchInheritors = (keyword) => {
  return http.get('/inheritors/search', { params: { keyword } })
}

// 综合查询传承人
export const queryInheritors = (queryDTO) => {
  return http.post('/inheritors/query', queryDTO)
}

// 获取传承人的作品列表
export const getInheritorWorks = (id, params = {}) => {
  return http.get(`/inheritors/${id}/works`, { params })
}

// 获取传承人作品的详细信息
export const getWorkDetail = (inheritorId, workId) => {
  return http.get(`/inheritors/${inheritorId}/works/${workId}`)
}

// 获取传承人的视频列表
export const getInheritorVideos = (id, params = {}) => {
  return http.get(`/inheritors/${id}/videos`, { params })
}

// 获取传承人的荣誉奖项列表
export const getInheritorHonors = (id) => {
  return http.get(`/inheritors/${id}/honors`)
}

// 获取传承人的展览活动列表
export const getInheritorExhibitions = (id, params = {}) => {
  return http.get(`/inheritors/${id}/exhibitions`, { params })
}

// 获取传承人的学生/徒弟列表
export const getInheritorApprentices = (id, params = {}) => {
  return http.get(`/inheritors/${id}/apprentices`, { params })
}

// 收藏传承人
export const favoriteInheritor = (id) => {
  return http.post(`/inheritors/${id}/favorite`)
}

// 取消收藏传承人
export const unfavoriteInheritor = (id) => {
  return http.delete(`/inheritors/${id}/favorite`)
}

// 检查是否已收藏
export const checkFavorite = (id) => {
  return http.get(`/inheritors/${id}/favorite/status`)
}

// 分享传承人信息
export const shareInheritor = (id, platform) => {
  return http.post(`/inheritors/${id}/share`, { platform })
}

// 提交传承人评价
export const submitInheritorReview = (id, reviewData) => {
  return http.post(`/inheritors/${id}/reviews`, reviewData)
}

// 获取传承人评价列表
export const getInheritorReviews = (id, params = {}) => {
  return http.get(`/inheritors/${id}/reviews`, { params })
}
