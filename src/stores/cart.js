import { defineStore } from 'pinia';

/**
 * 购物车状态管理
 */

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    totalQuantity: 0,
    totalPrice: 0
  }),

  getters: {
    // 获取购物车商品数量
    cartCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    // 获取购物车总价
    cartTotal: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // 检查商品是否在购物车中
    hasProduct: (state) => (productId) => {
      return state.items.some(item => item.id === productId);
    }
  },

  actions: {
    // 添加商品到购物车
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({
          ...product,
          quantity: 1
        });
      }

      this.saveCart();
    },

    // 从购物车移除商品
    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.id === productId);
      if (index > -1) {
        this.items.splice(index, 1);
        this.saveCart();
      }
    },

    // 更新商品数量
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          this.removeFromCart(productId);
        } else {
          this.saveCart();
        }
      }
    },

    // 清空购物车
    clearCart() {
      this.items = [];
      this.saveCart();
    },

    // 保存购物车到本地存储
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },

    // 从本地存储加载购物车
    loadCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    }
  }
});
