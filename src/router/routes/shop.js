/**
 * 商城相关路由
 */

const ShopList = () => import('@/views/shop/ShopList.vue');
const ProductDetail = () => import('@/views/shop/ProductDetail.vue');
const Checkout = () => import('@/views/shop/Checkout.vue');
const Payment = () => import('@/views/shop/Payment.vue');

export default [
  {
    path: '/shop',
    name: 'Shop',
    component: ShopList,
    meta: {
      title: '售卖商城 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/shop/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: {
      title: '商品详情 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/shop/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: {
      title: '订单结算 - 泥彩人非遗文化传承'
    }
  },
  {
    path: '/shop/payment',
    name: 'Payment',
    component: Payment,
    meta: {
      title: '订单支付 - 泥彩人非遗文化传承'
    }
  }
];
