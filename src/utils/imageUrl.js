/**
 * 图片URL处理工具
 */

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * 获取完整的图片URL
 * @param {string} url - 图片URL（可以是相对路径或完整URL）
 * @returns {string} 完整的图片URL
 */
export function getImageUrl(url) {
  if (!url) {
    return '';
  }

  // 如果已经是完整的URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // 如果是相对路径，拼接完整URL
  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }

  // 如果路径不规范，尝试修正
  if (url.startsWith('uploads/')) {
    return `${API_BASE_URL}/${url}`;
  }

  // 默认返回拼接后的URL
  return `${API_BASE_URL}${url}`;
}

/**
 * 获取图片URL（支持默认图片）
 * @param {string} url - 图片URL
 * @param {string} defaultImage - 默认图片URL
 * @returns {string} 图片URL
 */
export function getImageUrlWithDefault(url, defaultImage = '/placeholder.jpg') {
  const imageUrl = getImageUrl(url);
  return imageUrl || defaultImage;
}

export default {
  getImageUrl,
  getImageUrlWithDefault
};

