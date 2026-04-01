/**
 * 首页相关路由
 */

const Home = () => import('@/views/home/Home.vue');
const About = () => import('@/views/home/About.vue');

export default [
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
  }
];
