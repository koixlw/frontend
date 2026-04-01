/**
 * 内容展示相关路由
 */

const Introduction = () => import('@/views/content/introduction/Introduction.vue');
const Inheritors = () => import('@/views/content/inheritors/Inheritors.vue');
const InheritorDetail = () => import('@/views/content/inheritors/InheritorDetail.vue');
const Gallery = () => import('@/views/content/gallery/Gallery.vue');
const News = () => import('@/views/content/news/News.vue');
const NewsDetail = () => import('@/views/content/news/NewsDetail.vue');

export default [
  {
    path: '/introduction',
    name: 'Introduction',
    component: Introduction,
    meta: {
      title: '关于泥彩人 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/inheritors',
    name: 'Inheritors',
    component: Inheritors,
    meta: {
      title: '传承人列表 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/inheritor/:id',
    name: 'InheritorDetail',
    component: InheritorDetail,
    meta: {
      title: '传承人详情 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery,
    meta: {
      title: '作品展示 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/news',
    name: 'News',
    component: News,
    meta: {
      title: '新闻动态 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: NewsDetail,
    meta: {
      title: '新闻详情 - 泥彩人非遗文化传承'
    }
  }
];
