/**
 * 路由模块统一导出
 */

import homeRoutes from './home';
import shopRoutes from './shop';
import contentRoutes from './content';
import aiRoutes from './ai';
import userRoutes from './user';
import demoRoutes from './demo';
import legalRoutes from './legal';
import adminRoutes from './admin';

// 导出所有路由模块
export default [
  ...homeRoutes,
  ...shopRoutes,
  ...contentRoutes,
  ...aiRoutes,
  ...userRoutes,
  ...demoRoutes,
  ...legalRoutes,
  ...adminRoutes,
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
    meta: {
      title: '页面不存在 - 泥彩人非遗文化传承'
    }
  }
];
