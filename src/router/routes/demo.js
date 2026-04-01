/**
 * 演示页面路由
 */

const Model3DDemo = () => import('@/views/demo/Model3DDemo.vue');
const Model3DPainter = () => import('@/views/demo/Model3DPainter.vue');

export default [
  {
    path: '/model3d',
    name: 'Model3D',
    component: Model3DDemo,
    meta: {
      title: '3D模型展示 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/painter',
    name: 'Model3DPainter',
    component: Model3DPainter,
    meta: {
      title: '3D模型上色工具 - 泥彩人非遗文化传承'
    }
  }
];
