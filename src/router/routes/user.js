/**
 * 用户功能相关路由
 */

const Reserve = () => import('@/views/user/Reserve.vue');
const Contact = () => import('@/views/user/Contact.vue');

export default [
  {
    path: '/reserve',
    name: 'Reserve',
    component: Reserve,
    meta: {
      title: '预约体验 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: '联系我们 - 泥彩人非遗文化传承'
    }
  }
];
