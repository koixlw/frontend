import http from '@/utils/http';

/**
 * AI 功能相关 API
 * 包含文生图、图生图等功能
 */

// ==================== 文生图相关 ====================
export const textToImageApi = {
  // 生成图片
  generateImage: (data) => {
    return http.post('/ai/text2image', data);
  },

  // 获取生成历史
  getHistory: (params) => {
    return http.get('/ai/text2image/history', { params });
  },

  // 获取生成结果
  getResult: (taskId) => {
    return http.get(`/ai/text2image/result/${taskId}`);
  }
};

// ==================== 图生图相关 ====================
export const imageToImageApi = {
  // 风格融合
  styleTransfer: (data) => {
    return http.post('/ai/image2image', data);
  },

  // 获取生成历史
  getHistory: (params) => {
    return http.get('/ai/image2image/history', { params });
  },

  // 获取生成结果
  getResult: (taskId) => {
    return http.get(`/ai/image2image/result/${taskId}`);
  }
};

export default {
  textToImageApi,
  imageToImageApi
};
