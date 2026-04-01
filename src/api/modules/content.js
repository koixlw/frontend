import http from '@/utils/http';

/**
 * 内容相关 API
 * 包含传承人、新闻、作品展示
 */

// ==================== 传承人相关 ====================
export const inheritorApi = {
  // 获取所有传承人列表
  getAllInheritors: () => {
    return http.get('/inheritors');
  },

  // 分页查询传承人
  getInheritorsByPage: (params) => {
    return http.get('/inheritors/page', { params });
  },

  // 根据ID获取传承人基本信息
  getInheritorById: (id) => {
    return http.get(`/inheritors/${id}`);
  },

  // 根据ID获取传承人完整详细信息（新接口）
  getInheritorDetailById: (id) => {
    return http.get(`/inheritors/${id}/detail`);
  },

  // 根据级别获取传承人列表
  getInheritorsByLevel: (level) => {
    return http.get(`/inheritors/level/${level}`);
  },

  // 根据地区获取传承人列表
  getInheritorsByRegion: (region) => {
    return http.get(`/inheritors/region/${region}`);
  },

  // 根据关键词搜索传承人
  searchInheritors: (keyword) => {
    return http.get('/inheritors/search', { params: { keyword } });
  },

  // 综合查询传承人
  queryInheritors: (queryDTO) => {
    return http.post('/inheritors/query', queryDTO);
  },

  // 获取传承人的作品列表
  getInheritorWorks: (id, params = {}) => {
    return http.get(`/inheritors/${id}/works`, { params });
  },

  // 获取传承人作品的详细信息
  getWorkDetail: (inheritorId, workId) => {
    return http.get(`/inheritors/${inheritorId}/works/${workId}`);
  },

  // 获取传承人的视频列表
  getInheritorVideos: (id, params = {}) => {
    return http.get(`/inheritors/${id}/videos`, { params });
  },

  // 获取传承人的荣誉奖项列表
  getInheritorHonors: (id) => {
    return http.get(`/inheritors/${id}/honors`);
  },

  // 获取传承人的展览活动列表
  getInheritorExhibitions: (id, params = {}) => {
    return http.get(`/inheritors/${id}/exhibitions`, { params });
  },

  // 获取传承人的学生/徒弟列表
  getInheritorApprentices: (id, params = {}) => {
    return http.get(`/inheritors/${id}/apprentices`, { params });
  },

  // 收藏传承人
  favoriteInheritor: (id) => {
    return http.post(`/inheritors/${id}/favorite`);
  },

  // 取消收藏传承人
  unfavoriteInheritor: (id) => {
    return http.delete(`/inheritors/${id}/favorite`);
  },

  // 检查是否已收藏
  checkFavorite: (id) => {
    return http.get(`/inheritors/${id}/favorite/status`);
  },

  // 分享传承人信息
  shareInheritor: (id, platform) => {
    return http.post(`/inheritors/${id}/share`, { platform });
  },

  // 提交传承人评价
  submitInheritorReview: (id, reviewData) => {
    return http.post(`/inheritors/${id}/reviews`, reviewData);
  },

  // 获取传承人评价列表
  getInheritorReviews: (id, params = {}) => {
    return http.get(`/inheritors/${id}/reviews`, { params });
  }
};

// ==================== 新闻相关 ====================
export const newsApi = {
  // 获取所有新闻列表
  getAllNews: () => {
    return http.get('/news/all');
  },

  // 分页查询新闻
  getNewsByPage: (params) => {
    return http.get('/news', { params });
  },

  // 根据ID获取新闻基本信息
  getNewsById: (id) => {
    return http.get(`/news/${id}`);
  },

  // 根据ID获取新闻完整详细信息
  getNewsDetailById: (id) => {
    return http.get(`/news/${id}/detail`);
  },

  // 根据分类获取新闻列表
  getNewsByCategory: (category) => {
    return http.get(`/news/category/${category}`);
  },

  // 获取热门新闻
  getHotNews: (limit = 5) => {
    return http.get('/news/hot', { params: { limit } });
  },

  // 获取最新新闻
  getLatestNews: (limit = 5) => {
    return http.get('/news/latest', { params: { limit } });
  },

  // 点赞新闻
  likeNews: (id) => {
    return http.post(`/news/${id}/like`);
  }
};

// ==================== 作品展示相关 ====================
export const galleryApi = {
  // 获取作品列表（分页）
  getWorks: (params) => {
    return http.get('/gallery/works', { params });
  },

  // 获取作品详情
  getWorkDetail: (id) => {
    return http.get(`/gallery/works/${id}`);
  },

  // 获取所有分类
  getCategories: () => {
    return http.get('/gallery/categories');
  },

  // 获取所有风格
  getStyles: () => {
    return http.get('/gallery/styles');
  },

  // 切换点赞状态
  toggleLike: (id) => {
    return http.post(`/gallery/works/${id}/like`);
  },

  // 获取点赞状态
  getLikeStatus: (id) => {
    return http.get(`/gallery/works/${id}/like-status`);
  },

  // 获取精选作品
  getFeaturedWorks: (limit = 6) => {
    return http.get('/gallery/featured', { params: { limit } });
  },

  // 获取热门作品
  getPopularWorks: (limit = 6) => {
    return http.get('/gallery/popular', { params: { limit } });
  },

  // 获取最新作品
  getLatestWorks: (limit = 6) => {
    return http.get('/gallery/latest', { params: { limit } });
  },

  // 获取相关作品
  getRelatedWorks: (id, limit = 4) => {
    return http.get(`/gallery/works/${id}/related`, { params: { limit } });
  }
};

export default {
  inheritorApi,
  newsApi,
  galleryApi
};
