/**
 * API 统一导出
 * 推荐使用模块化导入：import { productApi } from '@/api/modules'
 */

// 导出所有模块化 API
export * from './modules';

// 向后兼容 - 保留旧的导出方式（将在后续版本移除）
// @deprecated 请使用 import { reserveApi } from '@/api/modules'
export { reserveApi } from './reserve';
// @deprecated 请使用 import { activityApi } from '@/api/modules'
export { activityApi } from './activity';