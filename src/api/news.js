import http from '../utils/http'

/**
 * 新闻相关API
 */

// 获取所有新闻列表
export const getAllNews = () => {
  return http.get('/news/all')
}

// 分页查询新闻
export const getNewsByPage = (params) => {
  return http.get('/news', { params })
}

// 根据ID获取新闻基本信息
export const getNewsById = (id) => {
  return http.get(`/news/${id}`)
}

// 根据ID获取新闻完整详细信息
export const getNewsDetailById = (id) => {
  return http.get(`/news/${id}/detail`)
}

// 根据分类获取新闻列表
export const getNewsByCategory = (category) => {
  return http.get(`/news/category/${category}`)
}

// 获取热门新闻
export const getHotNews = (limit = 5) => {
  return http.get('/news/hot', { params: { limit } })
}

// 获取最新新闻
export const getLatestNews = (limit = 5) => {
  return http.get('/news/latest', { params: { limit } })
}

// 点赞新闻
export const likeNews = (id) => {
  return http.post(`/news/${id}/like`)
}

export default {
  getAllNews,
  getNewsByPage,
  getNewsById,
  getNewsDetailById,
  getNewsByCategory,
  getHotNews,
  getLatestNews,
  likeNews
}
