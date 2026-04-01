<template>
  <div class="checkout-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">订单结算</h1>
        <p class="page-subtitle">请确认订单信息并完成支付</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <section class="checkout-content">
      <div class="container">
        <div class="checkout-wrapper">
          <!-- 左侧表单 -->
          <div class="checkout-form-section">
            <!-- 收货地址列表 -->
            <div class="address-section">
              <h2 class="section-title">
                <i class="icon-truck"></i>
                收货地址
              </h2>
              
              <div class="address-list">
                <!-- 地址项 -->
                <div 
                  v-for="address in addressList" 
                  :key="address.id"
                  class="address-item"
                  :class="{ active: selectedAddressId === address.id }"
                  @click="selectAddress(address.id)"
                >
                  <div class="address-radio">
                    <input 
                      type="radio" 
                      :checked="selectedAddressId === address.id"
                      class="radio-input"
                    >
                  </div>
                  <div class="address-content">
                    <div class="address-header">
                      <span class="address-name">{{ address.name }}</span>
                      <span class="address-phone">{{ address.phone }}</span>
                      <span v-if="address.isDefault" class="default-tag">默认</span>
                    </div>
                    <div class="address-detail">{{ address.fullAddress }}</div>
                  </div>
                  <div class="address-actions">
                    <button class="action-btn" @click.stop="editAddress(address)">编辑</button>
                    <button class="action-btn" @click.stop="deleteAddress(address.id)">删除</button>
                  </div>
                </div>

                <!-- 添加新地址 -->
                <div class="add-address-btn" @click="showAddAddressModal = true">
                  <i class="icon-plus"></i>
                  添加新地址
                </div>
              </div>
            </div>

            <!-- 配送方式 -->
            <div class="delivery-section">
              <h2 class="section-title">
                <i class="icon-delivery"></i>
                配送方式
              </h2>
              
              <div class="delivery-options">
                <label class="delivery-option" :class="{ active: formData.deliveryMethod === 'standard' }">
                  <input 
                    type="radio" 
                    value="standard" 
                    v-model="formData.deliveryMethod"
                    class="radio-input"
                  >
                  <div class="delivery-info">
                    <div class="delivery-title">标准快递</div>
                    <div class="delivery-desc">预计 3-5 天送达</div>
                  </div>
                  <div class="delivery-price">包邮</div>
                </label>
                
                <label class="delivery-option" :class="{ active: formData.deliveryMethod === 'express' }">
                  <input 
                    type="radio" 
                    value="express" 
                    v-model="formData.deliveryMethod"
                    class="radio-input"
                  >
                  <div class="delivery-info">
                    <div class="delivery-title">顺丰速运</div>
                    <div class="delivery-desc">预计 1-2 天送达</div>
                  </div>
                  <div class="delivery-price">¥15.00</div>
                </label>
              </div>
            </div>

            <!-- 支付方式 -->
            <div class="payment-section">
              <h2 class="section-title">
                <i class="icon-payment"></i>
                支付方式
              </h2>
              
              <div class="payment-methods">
                <label class="payment-option" v-for="method in paymentMethods" :key="method.value">
                  <input 
                    type="radio" 
                    :value="method.value" 
                    v-model="formData.paymentMethod"
                    class="radio-input"
                  >
                  <div class="payment-info">
                    <i :class="method.icon"></i>
                    <span>{{ method.name }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- 买家留言 -->
            <div class="message-section">
              <label class="form-label">买家留言</label>
              <textarea 
                v-model="formData.message" 
                class="form-textarea" 
                placeholder="选填：对本订单的说明（如配送时间要求等）"
                rows="3"
              ></textarea>
            </div>

            <!-- 提交按钮 -->
            <button type="submit" class="submit-btn" @click="submitOrder" :disabled="submitting">
              <span v-if="submitting">提交中...</span>
              <span v-else>提交订单 <i class="icon-arrow-right"></i></span>
            </button>
          </div>

          <!-- 右侧订单摘要 -->
          <div class="order-summary-section">
            <h2 class="section-title">
              <i class="icon-list"></i>
              订单摘要
            </h2>
            
            <!-- 商品列表 -->
            <div class="order-items">
              <div class="order-item" v-for="item in cartItems" :key="item.id">
                <img :src="item.image" :alt="item.title" class="order-item-img">
                <div class="order-item-info">
                  <h4 class="order-item-title">{{ item.title }}</h4>
                  <div class="order-item-meta">
                    <span>{{ item.subtitle }}</span>
                  </div>
                </div>
                <div class="order-item-quantity">× {{ item.quantity }}</div>
                <div class="order-item-price">
                  ¥{{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>

            <!-- 价格计算 -->
            <div class="price-calculation">
              <div class="price-row">
                <span>商品件数</span>
                <span class="price-value">{{ totalQuantity }} 件</span>
              </div>
              <div class="price-row">
                <span>商品总价</span>
                <span class="price-value">¥{{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="price-row" v-if="formData.deliveryMethod === 'express'">
                <span>运费</span>
                <span class="price-value">¥{{ shippingFee.toFixed(2) }}</span>
              </div>
              <div class="price-total-row">
                <span>应付总额</span>
                <span class="total-price">¥{{ totalAmount.toFixed(2) }}</span>
              </div>
            </div>

            <!-- 优惠券 -->
            <div class="coupon-section">
              <div class="coupon-input-group">
                <input 
                  type="text" 
                  v-model="couponCode" 
                  class="coupon-input" 
                  placeholder="输入优惠券代码"
                >
                <button class="coupon-btn" @click="applyCoupon">使用</button>
              </div>
            </div>

            <!-- 提交订单按钮 -->
            <button class="submit-order-btn" @click="submitOrder" :disabled="submitting">
              <span v-if="submitting">提交中...</span>
              <span v-else>提交订单 <i class="icon-arrow-right"></i></span>
            </button>

            <!-- 保障说明 -->
            <div class="guarantee-section">
              <div class="guarantee-item">
                <i class="icon-shield"></i>
                <span>安全支付保障</span>
              </div>
              <div class="guarantee-item">
                <i class="icon-undo"></i>
                <span>支持 7 天无理由退货</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 添加/编辑地址弹窗 -->
    <div v-if="showAddAddressModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑地址' : '添加新地址' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <form @submit.prevent="saveAddress">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">收货人姓名 <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="addressForm.name" 
                class="form-input" 
                placeholder="请输入收货人姓名"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">联系电话 <span class="required">*</span></label>
              <input 
                type="tel" 
                v-model="addressForm.phone" 
                class="form-input" 
                placeholder="请输入联系电话"
                pattern="[0-9]{11}"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">所在地区 <span class="required">*</span></label>
              <div class="address-row">
                <select v-model="addressForm.province" class="form-select" required>
                  <option value="">请选择省份</option>
                  <option v-for="province in provinces" :key="province" :value="province">
                    {{ province }}
                  </option>
                </select>
                <select v-model="addressForm.city" class="form-select" required>
                  <option value="">请选择城市</option>
                  <option v-for="city in cities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">详细地址 <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="addressForm.detailAddress" 
                class="form-input" 
                placeholder="街道、小区、门牌号等"
                required
              >
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="addressForm.isDefault"
                >
                <span>设为默认地址</span>
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="cancel-btn" @click="closeModal">取消</button>
            <button type="submit" class="save-btn" :disabled="savingAddress">
              {{ savingAddress ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
// 导入省市区数据
import { regionData } from 'element-china-area-data';

const router = useRouter();

// 省份数据（从包中获取，使用中文名称）
const provinces = ref(regionData.map(province => province.label));

// 城市数据（响应式）
const cities = ref([]);

// 省份到城市的映射（懒加载缓存）
const citiesCache = ref({});

// 获取省份对应的城市列表（返回中文名称）
const getCitiesByProvince = (provinceName) => {
  if (!citiesCache.value[provinceName]) {
    const province = regionData.find(p => p.label === provinceName);
    if (province && province.children) {
      citiesCache.value[provinceName] = province.children.map(city => city.label);
    } else {
      citiesCache.value[provinceName] = [];
    }
  }
  return citiesCache.value[provinceName];
};

// 支付方式
const paymentMethods = ref([
  { value: 'wechat', name: '微信支付', icon: 'icon-wechat' },
  { value: 'alipay', name: '支付宝', icon: 'icon-alipay' },
  { value: 'bank', name: '银行卡', icon: 'icon-credit-card' }
]);

// 地址列表
const addressList = ref([
  {
    id: 1,
    name: '浆果',
    phone: '13800138000',
    province: '四川省',
    city: '眉山市',
    detailAddress: '东坡区 苏祠路 88 号',
    fullAddress: '四川省 眉山市 东坡区 苏祠路 88 号',
    isDefault: true
  },
  {
    id: 2,
    name: 'Tina',
    phone: '13900139000',
    province: '四川省',
    city: '成都市',
    detailAddress: '武侯区 天府大道中段 88 号',
    fullAddress: '四川省 成都市 武侯区 天府大道中段 88 号',
    isDefault: false
  }
]);

// 选中的地址 ID
const selectedAddressId = ref(1);

// 表单数据
const formData = ref({
  deliveryMethod: 'standard',
  paymentMethod: 'wechat',
  message: ''
});

// 优惠券码
const couponCode = ref('');

// 折扣金额
const discount = ref(0);

// 提交状态
const submitting = ref(false);

// 购物车商品
const cartItems = ref([
  {
    id: 1,
    title: '传统人物 - 三国英雄系列',
    subtitle: '传统人物 王建国',
    price: 218.00,
    quantity: 1,
    image: '/assets/images/product1.jpg'
  }
]);

// 弹窗控制
const showAddAddressModal = ref(false);
const isEditing = ref(false);
const savingAddress = ref(false);

// 地址表单
const addressForm = ref({
  id: null,
  name: '',
  phone: '',
  province: '',
  city: '',
  detailAddress: '',
  isDefault: false
});

// 监听省份变化，更新城市列表
watch(() => addressForm.value.province, (newProvince) => {
  if (newProvince) {
    cities.value = getCitiesByProvince(newProvince);
    // 如果当前城市不在新的城市列表中，清空城市选择
    if (!cities.value.includes(addressForm.value.city)) {
      addressForm.value.city = '';
    }
  } else {
    cities.value = [];
  }
});

// 商品总件数
const totalQuantity = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

// 商品总额
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// 运费
const shippingFee = computed(() => {
  return formData.value.deliveryMethod === 'express' ? 15 : 0;
});

// 总金额
const totalAmount = computed(() => {
  return subtotal.value + shippingFee.value - discount.value;
});

// 选择地址
const selectAddress = (addressId) => {
  selectedAddressId.value = addressId;
};

// 编辑地址
const editAddress = (address) => {
  isEditing.value = true;
  // 直接使用文本值
  addressForm.value = {
    id: address.id,
    name: address.name,
    phone: address.phone,
    province: address.province,
    city: '', // 先清空城市，避免 watch 判断错误
    detailAddress: address.detailAddress,
    isDefault: address.isDefault
  };
  // 等待下一帧再设置城市，确保城市列表已经更新
  setTimeout(() => {
    addressForm.value.city = address.city;
  }, 0);
  showAddAddressModal.value = true;
};

// 删除地址
const deleteAddress = (addressId) => {
  if (confirm('确定要删除这个地址吗？')) {
    addressList.value = addressList.value.filter(addr => addr.id !== addressId);
    if (selectedAddressId.value === addressId) {
      selectedAddressId.value = addressList.value[0]?.id || null;
    }
  }
};

// 保存地址
const saveAddress = async () => {
  savingAddress.value = true;
  
  try {
    // 直接使用文本值构建完整地址
    const fullAddress = `${addressForm.value.province} ${addressForm.value.city} ${addressForm.value.detailAddress}`;
    
    if (isEditing.value) {
      // 更新现有地址
      const index = addressList.value.findIndex(addr => addr.id === addressForm.value.id);
      if (index !== -1) {
        if (addressForm.value.isDefault) {
          addressList.value.forEach(addr => addr.isDefault = false);
        }
        addressList.value[index] = {
          ...addressForm.value,
          fullAddress
        };
      }
    } else {
      // 添加新地址
      const newAddress = {
        id: Date.now(),
        ...addressForm.value,
        fullAddress
      };
      if (addressForm.value.isDefault) {
        addressList.value.forEach(addr => addr.isDefault = false);
      }
      addressList.value.push(newAddress);
    }
    
    closeModal();
  } catch (error) {
    console.error('保存地址失败:', error);
    alert('保存失败，请重试');
  } finally {
    savingAddress.value = false;
  }
};

// 关闭弹窗
const closeModal = () => {
  showAddAddressModal.value = false;
  isEditing.value = false;
  addressForm.value = {
    id: null,
    name: '',
    phone: '',
    province: '',
    city: '',
    detailAddress: '',
    isDefault: false
  };
};

// 应用优惠券
const applyCoupon = () => {
  if (!couponCode.value) {
    alert('请输入优惠券码');
    return;
  }
  
  // TODO: 验证优惠券码
  if (couponCode.value === 'TEST10') {
    discount.value = 10;
    alert('优惠券使用成功！');
  } else {
    alert('优惠券码无效');
  }
};

// 提交订单
const submitOrder = async () => {
  if (!selectedAddressId.value) {
    alert('请选择收货地址');
    return;
  }

  if (cartItems.value.length === 0) {
    alert('购物车为空！');
    return;
  }

  submitting.value = true;

  try {
    const selectedAddress = addressList.value.find(addr => addr.id === selectedAddressId.value);
    
    // TODO: 调用后端 API 创建订单
    console.log('订单数据:', {
      address: selectedAddress,
      deliveryMethod: formData.value.deliveryMethod,
      paymentMethod: formData.value.paymentMethod,
      message: formData.value.message,
      items: cartItems.value,
      totalAmount: totalAmount.value
    });

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1500));

    alert('订单提交成功！即将跳转到支付页面...');
    
    // 清空购物车
    cartItems.value = [];
    
    // 跳转到支付结果页或首页
    router.push('/shop');
  } catch (error) {
    console.error('提交订单失败:', error);
    alert('提交失败，请重试');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // TODO: 从 localStorage 加载购物车数据
  // const savedCart = localStorage.getItem('cart');
  // if (savedCart) {
  //   cartItems.value = JSON.parse(savedCart);
  // }
  
  // TODO: 从 localStorage 或后端加载用户地址
  // const savedAddresses = localStorage.getItem('addresses');
  // if (savedAddresses) {
  //   addressList.value = JSON.parse(savedAddresses);
  // }
});
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #f9f9f9;
}

.page-header {
  background: linear-gradient(135deg, #f5f3ed 0%, #ebe8e3 100%);
  padding: 60px 0;
  text-align: center;
  border-bottom: 2px solid rgba(212, 175, 55, 0.2);
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.checkout-content {
  padding: 60px 0;
}

.checkout-wrapper {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  font-size: 24px;
  color: #b92c23;
}

/* 左侧表单区域 */
.checkout-form-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 地址列表样式 */
.address-section,
.delivery-section,
.payment-section,
.message-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.address-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.address-item:hover {
  border-color: #d93b30;
  background: #fff5f5;
}

.address-item.active {
  border-color: #b92c23;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  box-shadow: 0 2px 12px rgba(185, 44, 35, 0.15);
}

.address-radio {
  flex-shrink: 0;
}

.radio-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #b92c23;
}

.address-content {
  flex: 1;
  min-width: 0;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.address-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.address-phone {
  font-size: 14px;
  color: #666;
}

.default-tag {
  display: inline-block;
  padding: 2px 8px;
  background: linear-gradient(135deg, #b92c23, #d93b30);
  color: white;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 500;
}

.address-detail {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.address-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 6px 16px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #b92c23;
  color: #b92c23;
  background: #fff5f5;
}

.add-address-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  border: 2px dashed #d93b30;
  border-radius: 8px;
  background: #fff5f5;
  color: #b92c23;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-address-btn:hover {
  background: #ffebeb;
  border-color: #b92c23;
}

.add-address-btn i {
  font-size: 18px;
}

/* 配送方式 */
.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.delivery-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delivery-option:hover {
  border-color: #d93b30;
  background: #fff5f5;
}

.delivery-option.active {
  border-color: #b92c23;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  box-shadow: 0 2px 12px rgba(185, 44, 35, 0.15);
}

.delivery-info {
  flex: 1;
}

.delivery-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.delivery-desc {
  font-size: 13px;
  color: #999;
}

.delivery-price {
  font-size: 16px;
  font-weight: bold;
  color: #b92c23;
}

/* 支付方式 */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-option:hover {
  border-color: #d93b30;
  background: #fff5f5;
}

.payment-option input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #b92c23;
}

.payment-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #333;
}

.payment-info i {
  font-size: 20px;
}

/* 买家留言 */
.form-label {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #b92c23;
  box-shadow: 0 0 0 3px rgba(185, 44, 35, 0.1);
}

/* 提交按钮 */
.submit-btn,
.submit-order-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #b92c23, #d93b30);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover:not(:disabled),
.submit-order-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(185, 44, 35, 0.3);
}

.submit-btn:disabled,
.submit-order-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 订单摘要 */
.order-summary-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
}

.order-items {
  margin-bottom: 25px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.order-item-info {
  flex: 1;
  min-width: 0;
}

.order-item-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
}

.order-item-meta {
  font-size: 13px;
  color: #999;
}

.order-item-quantity {
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
  padding: 0 15px;
}

.order-item-price {
  font-size: 16px;
  font-weight: bold;
  color: #b92c23;
  flex-shrink: 0;
}

/* 价格计算 */
.price-calculation {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
  color: #666;
}

.price-value {
  font-weight: 500;
  color: #333;
}

.price-total-row {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 2px solid #e0e0e0;
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
}

.total-price {
  color: #b92c23;
  font-size: 24px;
}

/* 优惠券 */
.coupon-section {
  margin-bottom: 25px;
}

.coupon-input-group {
  display: flex;
  gap: 10px;
}

.coupon-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.coupon-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #b92c23, #d93b30);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.coupon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(185, 44, 35, 0.3);
}

/* 保障说明 */
.guarantee-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 13px;
  color: #999;
}

.guarantee-item i {
  font-size: 16px;
  color: #b92c23;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #b92c23;
  box-shadow: 0 0 0 3px rgba(185, 44, 35, 0.1);
}

.address-row {
  display: flex;
  gap: 15px;
}

.address-row .form-select {
  flex: 1;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #b92c23;
}

.required {
  color: #b92c23;
}

.modal-footer {
  display: flex;
  gap: 15px;
  padding: 20px 30px;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
  border-radius: 0 0 12px 12px;
}

.cancel-btn,
.save-btn {
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: white;
  border: 1px solid #ddd;
  color: #666;
}

.cancel-btn:hover {
  border-color: #999;
  color: #333;
}

.save-btn {
  background: linear-gradient(135deg, #b92c23, #d93b30);
  border: none;
  color: white;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(185, 44, 35, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .checkout-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }

  .address-section,
  .delivery-section,
  .payment-section,
  .message-section,
  .order-summary-section {
    padding: 20px;
  }

  .address-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .address-actions {
    width: 100%;
    margin-top: 10px;
  }

  .address-row {
    flex-direction: column;
  }

  .modal-content {
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>
