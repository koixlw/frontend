/**
 * 后台管理相关路由
 */

const AdminLogin = () => import('@/views/admin/AdminLogin.vue');
const AdminLayout = () => import('@/views/admin/AdminLayout.vue');
const Dashboard = () => import('@/views/admin/modules/Dashboard.vue');
const UsersManagement = () => import('@/views/admin/modules/UsersManagement.vue');
const ProductsManagement = () => import('@/views/admin/modules/ProductsManagement.vue');
const InheritorsManagement = () => import('@/views/admin/modules/InheritorsManagement.vue');
const NewsManagement = () => import('@/views/admin/modules/NewsManagement.vue');
const GalleryManagement = () => import('@/views/admin/modules/GalleryManagement.vue');
const ReservationsManagement = () => import('@/views/admin/modules/ReservationsManagement.vue');
const ActivitiesManagement = () => import('@/views/admin/modules/ActivitiesManagement.vue');

export default [
  // 管理后台登录
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: {
      title: '管理员登录 - 泥彩人管理后台'
    }
  },
  // 管理后台主页面
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: '控制台 - 泥彩人管理后台',
          requiresAuth: true
        }
      },
      {
        path: 'users',
        name: 'UsersManagement',
        component: UsersManagement,
        meta: {
          title: '用户管理 - 泥彩人管理后台',
          requiresAuth: true
        }
      },
      {
        path: 'reservations',
        name: 'ReservationsManagement',
        component: ReservationsManagement,
        meta: {
          title: '预约管理 - 泥彩人管理后台',
          requiresAuth: true
        }
      },
      {
        path: 'inheritors',
        name: 'InheritorsManagement',
        component: InheritorsManagement,
        meta: {
          title: '传承人管理 - 泥彩人管理后台',
          requiresAuth: true
        }
      },
      {
        path: 'news',
        name: 'NewsManagement',
        component: NewsManagement,
        meta: {
          title: '新闻管理 - 泥彩人管理后台',
          requiresAuth: true
        }
      },
      {
        path: 'products',
        name: 'ProductsManagement',
        component: ProductsManagement,
        meta: {
          title: '商品管理 - 泥彩人管理后台',
          requiresAuth: true
        }
      },
      {
        path: 'gallery',
        name: 'GalleryManagement',
        component: GalleryManagement,
        meta: {
          title: '作品管理 - 泥彩人管理后台',
          requiresAuth: true
        }
      },
      {
        path: 'activities',
        name: 'ActivitiesManagement',
        component: ActivitiesManagement,
        meta: {
          title: '活动管理 - 泥彩人管理后台',
          requiresAuth: true
        }
      }
    ]
  }
];
