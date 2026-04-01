/**
 * 法律相关页面路由
 */

const PrivacyPolicy = () => import('@/views/legal/PrivacyPolicy.vue');
const TermsOfUse = () => import('@/views/legal/TermsOfUse.vue');

export default [
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
  }
];
