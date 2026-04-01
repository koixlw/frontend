/**
 * AI 功能相关路由
 */

const TextToImage = () => import('@/views/ai/TextToImage.vue');
const ImageToImage = () => import('@/views/ai/ImageToImage.vue');

export default [
  {
    path: '/ai/text2image',
    name: 'TextToImage',
    component: TextToImage,
    meta: {
      title: 'AI 文生图 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/ai/image2image',
    name: 'ImageToImage',
    component: ImageToImage,
    meta: {
      title: 'AI 图生图 - 风格融合'
    }
  }
];
