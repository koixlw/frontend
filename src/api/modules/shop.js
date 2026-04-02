import http from '@/utils/http';

/**
 * 商城相关 API
 * 包含商品和订单管理
 */

// ==================== 商品相关 ====================
export const productApi = {
  // 获取商品列表（分页）
  getProducts: (params) => {
    return http.get('/products', { params });
  },

  // 获取商品详情
  getProductById: (id) => {
    return http.get(`/products/${id}`);
  },

  // 获取所有商品分类
  getProductCategories: () => {
    return http.get('/products/categories');
  },

  // 获取所有商品标签
  getProductTags: () => {
    return http.get('/products/tags');
  },

  // 获取热销商品
  getHotProducts: (limit = 10) => {
    return http.get('/products/hot', { params: { limit } });
  },

  // 获取新品
  getNewProducts: (limit = 10) => {
    return http.get('/products/new', { params: { limit } });
  },

  // 获取精选商品
  getFeaturedProducts: (limit = 10) => {
    return http.get('/products/featured', { params: { limit } });
  }
};

// ==================== 订单相关 ====================
export const orderApi = {
  // 创建订单
  createOrder: (orderData) => {
    return http.post('/orders', orderData);
  },

  // 根据订单号查询订单
  getOrderByNumber: (orderNumber) => {
    return http.get(`/orders/${orderNumber}`);
  },

  // 支付订单
  payOrder: (orderNumber, paymentMethod) => {
    return http.post(`/orders/${orderNumber}/pay`, { paymentMethod });
  },

  // 取消订单
  cancelOrder: (orderNumber) => {
    return http.post(`/orders/${orderNumber}/cancel`);
  }
};

// 导出单独的函数供管理页面使用
export const getProducts = productApi.getProducts;
export const createProduct = (data) => http.post('/admin/products', data);
export const updateProduct = (id, data) => http.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => http.delete(`/admin/products/${id}`);

export default {
  shopApi,
  productApi,
  orderApi
};
