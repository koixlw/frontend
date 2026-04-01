/**
 * API 模块统一导出
 */

export { default as shopApi, productApi, orderApi } from './shop';
export { default as contentApi, inheritorApi, newsApi, galleryApi } from './content';
export { default as userApi, reserveApi, activityApi } from './user';
export { default as adminApi, adminUserApi, adminProductApi, adminInheritorApi, adminNewsApi, adminGalleryApi, adminReserveApi, adminActivityApi } from './admin';
export { default as aiApi, textToImageApi, imageToImageApi } from './ai';
export { default as authApi } from './auth';
