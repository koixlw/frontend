/**
 * API 模块统一导出
 */

// 模块导出
export { default as shopApi, productApi, orderApi } from './shop';
export { default as contentApi, inheritorApi, newsApi, galleryApi } from './content';
export { default as userApi, reserveApi, activityApi } from './user';
export { default as adminApi, adminUserApi, adminProductApi, adminInheritorApi, adminNewsApi, adminGalleryApi, adminReserveApi, adminActivityApi } from './admin';
export { default as aiApi, textToImageApi, imageToImageApi } from './ai';
export { default as authApi } from './auth';

// 导出所有单独的函数供管理页面使用
export * from './shop';
export * from './content';
export * from './user';
export { getStats, getUsers, createUser, updateUser, deleteUser } from './admin';
