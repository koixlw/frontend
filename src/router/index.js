import { createRouter, createWebHistory } from 'vue-router';

// 动态导入组件，实现懒加载
const Home = () => import('../views/Home.vue');
const About = () => import('../views/About.vue');
const Inheritors = () => import('../views/Inheritors.vue');
const InheritorDetail = () => import('../views/InheritorDetail.vue');
const Gallery = () => import('../views/Gallery.vue');
const News = () => import('../views/News.vue');
const NewsDetail = () => import('../views/NewsDetail.vue');
const Contact = () => import('../views/Contact.vue');
const Reserve = () => import('../views/Reserve.vue');
const Shop = () => import('../views/shop.vue');
const TextToImage = () => import('../views/TextToImage.vue');
const Introduction = () => import('../views/introduction/Introduction.vue');
const StyleFusion = () => import('../views/StyleFusion.vue');
const PrivacyPolicy = () => import('../views/PrivacyPolicy.vue');
const TermsOfUse = () => import('../views/TermsOfUse.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于我们 - 泥彩人非遗文化传承'
    }
  },
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
  },
  {
    path: '/reserve',
    name: 'Reserve',
    component: Reserve,
    meta: {
      title: '预约体验 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop,
    meta: {
      title: '售卖商城 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/ai/text2image',
    name: 'TextToImage',
    component: TextToImage,
    meta: {
      title: 'AI 文生图 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/ai/style-fusion',
    name: 'StyleFusion',
    component: StyleFusion,
    meta: {
      title: 'AI 共创新坊 - 风格融合'
    }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: {
      title: '隐私政策 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/terms-of-use',
    name: 'TermsOfUse',
    component: TermsOfUse,
    meta: {
      title: '使用条款 - 泥彩人非遗文化传承'
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
    meta: {
      title: '页面不存在 - 泥彩人非遗文化传承'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫，用于设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
