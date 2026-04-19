// 传承人图片工具函数

// 本地传承人图片数组
const LOCAL_INHERITOR_IMAGES = [
  '/assets/images/inheritor/泥人张.avif',
  '/assets/images/inheritor/乔.png',
  '/assets/images/inheritor/王南仙.webp',
  '/assets/images/inheritor/li.webp',
  '/assets/images/inheritor/wan.jpg'
];

// 缓存每个传承人的分配图片，避免同一传承人在不同地方显示不同图片
const inheritorImageCache = new Map();

/**
 * 获取传承人头像URL
 * @param {string|number} inheritorId - 传承人ID
 * @param {string} [imageUrl] - 后端返回的图片URL
 * @returns {string} 最终使用的图片URL
 */
export function getInheritorImageUrl(inheritorId, imageUrl = null) {
  // 如果后端提供了有效的图片URL，直接使用
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  
  // 如果已经为该传承人分配过本地图片，返回缓存的图片
  if (inheritorImageCache.has(inheritorId)) {
    return inheritorImageCache.get(inheritorId);
  }
  
  // 随机选择一个本地图片并缓存
  const randomIndex = Math.floor(Math.random() * LOCAL_INHERITOR_IMAGES.length);
  const selectedImage = LOCAL_INHERITOR_IMAGES[randomIndex];
  inheritorImageCache.set(inheritorId, selectedImage);
  
  return selectedImage;
}

/**
 * 获取随机传承人图片（不带缓存）
 * @returns {string} 随机本地传承人图片URL
 */
export function getRandomInheritorImage() {
  const randomIndex = Math.floor(Math.random() * LOCAL_INHERITOR_IMAGES.length);
  return LOCAL_INHERITOR_IMAGES[randomIndex];
}

/**
 * 重置图片缓存（用于开发调试）
 */
export function resetInheritorImageCache() {
  inheritorImageCache.clear();
}