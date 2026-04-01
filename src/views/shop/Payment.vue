<template>
  <div class="payment-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <img src="/src/assets/images/ui/徽章.png" alt="泥彩人" class="header-icon">
          <h1 class="page-title">订单支付</h1>
          <p class="page-subtitle">请使用微信或支付宝扫码支付</p>
        </div>
      </div>
    </div>

    <!-- 支付内容 -->
    <div class="payment-content">
      <div class="container">
        <div class="payment-wrapper">
          <!-- 订单信息 -->
          <div class="order-info">
            <div class="info-header">
              <span class="info-icon">📋</span>
              <h2 class="info-title">订单信息</h2>
            </div>
            <div class="info-items">
              <div class="info-item">
                <span class="item-label">订单编号</span>
                <span class="item-value">{{ orderNumber }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">订单金额</span>
                <span class="item-value price">¥{{ totalAmount.toFixed(2) }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">创建时间</span>
                <span class="item-value">{{ createTime }}</span>
              </div>
            </div>
          </div>

          <!-- 支付方式选择 -->
          <div class="payment-methods">
            <div class="method-header">
              <span class="info-icon">💳</span>
              <h2 class="method-title">选择支付方式</h2>
            </div>
            <div class="method-list">
              <div 
                class="method-item" 
                :class="{ active: selectedMethod === 'wechat' }"
                @click="selectMethod('wechat')"
              >
                <div class="method-icon-wrapper wechat">
                  <img src="/src/assets/images/payment/微信支付.png" alt="微信支付" class="method-img">
                </div>
                <div class="method-info">
                  <div class="method-name">微信支付</div>
                  <div class="method-desc">推荐使用微信扫码支付</div>
                </div>
                <div class="method-radio">
                  <span class="radio-dot"></span>
                </div>
              </div>
              <div 
                class="method-item" 
                :class="{ active: selectedMethod === 'alipay' }"
                @click="selectMethod('alipay')"
              >
                <div class="method-icon-wrapper alipay">
                  <img src="/src/assets/images/payment/支付宝支付.png" alt="支付宝支付" class="method-img">
                </div>
                <div class="method-info">
                  <div class="method-name">支付宝支付</div>
                  <div class="method-desc">使用支付宝扫码支付</div>
                </div>
                <div class="method-radio">
                  <span class="radio-dot"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- 支付二维码 -->
          <div class="qrcode-section" v-if="showQRCode">
            <div class="qrcode-wrapper">
              <div class="qrcode-header">
                <div class="payment-logo" :class="selectedMethod">
                  <img :src="selectedMethod === 'wechat' ? '/src/assets/images/payment/微信支付.png' : '/src/assets/images/payment/支付宝支付.png'" alt="支付" class="logo-img">
                  <span class="logo-text">{{ selectedMethod === 'wechat' ? '微信支付' : '支付宝' }}</span>
                </div>
                <div class="payment-amount">¥{{ totalAmount.toFixed(2) }}</div>
              </div>

              <div class="qrcode-container">
                <div class="qrcode-box" ref="qrcodeBox">
                  <!-- 二维码将在这里生成 -->
                </div>
                <div class="qrcode-tips">
                  <p class="tip-text">请使用{{ selectedMethod === 'wechat' ? '微信' : '支付宝' }}扫描二维码完成支付</p>
                  <div class="tip-icons">
                    <span>💡</span> alt="扫码" class="tip-icon">
                  </div>
                </div>
              </div>

              <!-- 支付状态 -->
              <div class="payment-status" v-if="paymentStatus">
                <div class="status-checking" v-if="paymentStatus === 'checking'">
                  <div class="loading-spinner"></div>
                  <p>正在确认支付...</p>
                </div>
                <div class="status-success" v-if="paymentStatus === 'success'">
                  <div class="success-icon">✓</div>
                  <p class="success-text">支付成功！</p>
                  <p class="success-desc">即将跳转到订单详情页...</p>
                </div>
                <div class="status-failed" v-if="paymentStatus === 'failed'">
                  <div class="failed-icon">✕</div>
                  <p class="failed-text">支付失败</p>
                  <p class="failed-desc">请重新扫码支付</p>
                </div>
              </div>

              <!-- 模拟扫码支付按钮（测试用） -->
              <div class="test-payment" v-if="!paymentStatus">
                <button class="simulate-scan-btn" @click="simulateScan">
                  <span>模拟扫码支付（测试）</span>
                </button>
              </div>

              <div class="qrcode-footer">
                <div class="footer-tips">
                  <div class="tip-item">
                    <span class="tip-icon-small">🔒</span>
                    <span>安全支付</span>
                  </div>
                  <div class="tip-item">
                    <span class="tip-icon-small">⏱</span>
                    <span>支付剩余时间：{{ formatTime(remainingTime) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="payment-actions">
              <button class="change-method-btn" @click="changeMethod">
                <span>更换支付方式</span>
              </button>
              <button class="cancel-order-btn" @click="cancelOrder">
                <span>取消订单</span>
              </button>
            </div>
          </div>

          <!-- 支付说明 -->
          <div class="payment-notice">
            <div class="notice-header">
              <span>💡</span> alt="支付说明" class="notice-icon">
              <h3 class="notice-title">支付说明</h3>
            </div>
            <ul class="notice-list">
              <li>1. 请在15分钟内完成支付，超时订单将自动取消</li>
              <li>2. 支付成功后，我们会在1-3个工作日内安排发货</li>
              <li>3. 如遇到支付问题，请联系客服：400-123-4567</li>
              <li>4. 支持7天无理由退货，请放心购买</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { orderApi } from '@/api/modules';

const router = useRouter();

// 订单信息
const orderNumber = ref('');
const totalAmount = ref(0);
const createTime = ref('');

// 支付方式
const selectedMethod = ref('wechat');
const showQRCode = ref(false);

// 支付状态
const paymentStatus = ref(''); // checking, success, failed

// 倒计时
const remainingTime = ref(900); // 15分钟 = 900秒
let timer = null;

// 二维码容器
const qrcodeBox = ref(null);

// 生成订单编号
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `NCP${timestamp}${random}`;
};

// 生成当前时间
const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 格式化时间
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// 选择支付方式
const selectMethod = (method) => {
  if (paymentStatus.value) return; // 如果已经在支付中，不允许切换
  selectedMethod.value = method;
  showQRCode.value = false;
  setTimeout(() => {
    showQRCode.value = true;
    generateQRCode();
  }, 300);
};

// 生成二维码
const generateQRCode = () => {
  if (!qrcodeBox.value) return;

  // 清空之前的二维码
  qrcodeBox.value.innerHTML = '';

  // 生成随机的支付链接
  const paymentUrl = `${selectedMethod.value}://pay/${orderNumber.value}/${Date.now()}`;

  // 创建简单的二维码样式（使用CSS绘制）
  const qrSize = 200;
  const qrcode = document.createElement('div');
  qrcode.className = 'qr-pattern';
  qrcode.style.width = `${qrSize}px`;
  qrcode.style.height = `${qrSize}px`;
  qrcode.style.background = '#fff';
  qrcode.style.padding = '15px';
  qrcode.style.borderRadius = '8px';
  qrcode.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';

  // 创建二维码图案（简化版）
  const pattern = document.createElement('div');
  pattern.style.width = '100%';
  pattern.style.height = '100%';
  pattern.style.background = `
    linear-gradient(90deg, #000 25%, transparent 25%, transparent 75%, #000 75%),
    linear-gradient(0deg, #000 25%, transparent 25%, transparent 75%, #000 75%),
    linear-gradient(90deg, transparent 10%, #000 10%, #000 20%, transparent 20%, transparent 80%, #000 80%, #000 90%, transparent 90%),
    linear-gradient(0deg, transparent 10%, #000 10%, #000 20%, transparent 20%, transparent 80%, #000 80%, #000 90%, transparent 90%)
  `;
  pattern.style.backgroundSize = '40px 40px, 40px 40px, 20px 20px, 20px 20px';
  pattern.style.backgroundPosition = '0 0, 0 0, 10px 10px, 10px 10px';

  // 中心logo
  const centerLogo = document.createElement('div');
  centerLogo.style.position = 'absolute';
  centerLogo.style.top = '50%';
  centerLogo.style.left = '50%';
  centerLogo.style.transform = 'translate(-50%, -50%)';
  centerLogo.style.width = '50px';
  centerLogo.style.height = '50px';
  centerLogo.style.background = selectedMethod.value === 'wechat' ? '#07c160' : '#1677ff';
  centerLogo.style.borderRadius = '8px';
  centerLogo.style.display = 'flex';
  centerLogo.style.alignItems = 'center';
  centerLogo.style.justifyContent = 'center';
  centerLogo.style.fontSize = '24px';
  centerLogo.style.color = '#fff';
  
  // 添加支付方式图标
  const logoImg = document.createElement('img');
  logoImg.src = selectedMethod.value === 'wechat' ? '/src/assets/images/payment/微信支付.png' : '/src/assets/images/payment/支付宝支付.png';
  logoImg.style.width = '35px';
  logoImg.style.height = '35px';
  logoImg.style.filter = 'brightness(0) invert(1)';
  centerLogo.appendChild(logoImg);

  qrcode.style.position = 'relative';
  qrcode.appendChild(pattern);
  qrcode.appendChild(centerLogo);
  qrcodeBox.value.appendChild(qrcode);

  console.log('生成支付二维码:', paymentUrl);
};

// 更换支付方式
const changeMethod = () => {
  if (paymentStatus.value) return;
  showQRCode.value = false;
  paymentStatus.value = '';
};

// 模拟扫码支付
const simulateScan = async () => {
  paymentStatus.value = 'checking';

  try {
    // 调用后端API支付订单
    const response = await orderApi.payOrder(orderNumber.value, selectedMethod.value);

    if (response && response.success) {
      paymentStatus.value = 'success';
      
      // 2秒后跳转
      setTimeout(() => {
        alert('支付成功！订单编号：' + orderNumber.value);
        // 清除购物车数据和订单数据
        localStorage.removeItem('checkoutItems');
        localStorage.removeItem('orderData');
        // 跳转到商城页面
        router.push('/shop');
      }, 2000);
    } else {
      paymentStatus.value = 'failed';
      alert(response.message || '支付失败');
    }
  } catch (error) {
    console.error('支付失败：', error);
    paymentStatus.value = 'failed';
    
    // 3秒后允许重新支付
    setTimeout(() => {
      paymentStatus.value = '';
    }, 3000);
  }
};

// 取消订单
const cancelOrder = () => {
  if (confirm('确定要取消订单吗？')) {
    clearInterval(timer);
    alert('订单已取消');
    router.push('/shop');
  }
};

// 倒计时
const startCountdown = () => {
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      clearInterval(timer);
      alert('支付超时，订单已自动取消');
      router.push('/shop');
    }
  }, 1000);
};

// 页面加载
onMounted(() => {
  // 从 localStorage 获取订单数据
  const orderData = localStorage.getItem('orderData');
  if (orderData) {
    const data = JSON.parse(orderData);
    orderNumber.value = data.orderNumber || generateOrderNumber();
    totalAmount.value = data.total || 0;
  } else {
    // 如果没有订单数据，跳转回商城
    alert('订单信息丢失，请重新下单');
    router.push('/shop');
    return;
  }

  createTime.value = getCurrentTime();

  // 显示默认支付方式的二维码
  setTimeout(() => {
    showQRCode.value = true;
    generateQRCode();
  }, 500);

  // 开始倒计时
  startCountdown();
});

// 页面卸载
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
/* 基础样式 */
.payment-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页面标题 */
.page-header {
  background: linear-gradient(135deg, #c8232c 0%, #8b1a1a 100%);
  padding: 50px 0;
  margin-bottom: 40px;
}

.header-content {
  text-align: center;
}

.header-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
  filter: drop-shadow(0 5px 15px rgba(255, 255, 255, 0.3));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.page-title {
  font-size: 38px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
  letter-spacing: 3px;
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
}

/* 支付内容 */
.payment-content {
  padding: 0 0 60px;
}

.payment-wrapper {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 订单信息 */
.order-info {
  background: #fff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.info-header,
.method-header,
.notice-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f5f5f5;
}

.info-icon,
.method-icon,
.notice-icon {
  width: 24px;
  height: 24px;
}

.info-title,
.method-title,
.notice-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.info-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-label {
  font-size: 14px;
  color: #999;
}

.item-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.item-value.price {
  font-size: 24px;
  color: #c8232c;
}

/* 支付方式 */
.payment-methods {
  background: #fff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.method-list {
  display: flex;
  gap: 20px;
}

.method-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.method-item:hover {
  border-color: #c8232c;
  background: rgba(200, 35, 44, 0.02);
}

.method-item.active {
  border-color: #c8232c;
  background: rgba(200, 35, 44, 0.05);
}

.method-icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.method-icon-wrapper.wechat {
  background: rgba(7, 193, 96, 0.1);
}

.method-icon-wrapper.alipay {
  background: rgba(22, 119, 255, 0.1);
}

.method-img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.method-info {
  flex: 1;
}

.method-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.method-desc {
  font-size: 13px;
  color: #999;
}

.method-radio {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.method-item.active .method-radio {
  border-color: #c8232c;
}

.radio-dot {
  width: 10px;
  height: 10px;
  background: #c8232c;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.method-item.active .radio-dot {
  opacity: 1;
  transform: scale(1);
}

/* 二维码区域 */
.qrcode-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.qrcode-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.qrcode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f5f5f5;
}

.payment-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 25px;
}

.payment-logo.wechat {
  background: rgba(7, 193, 96, 0.1);
  color: #07c160;
}

.payment-logo.alipay {
  background: rgba(22, 119, 255, 0.1);
  color: #1677ff;
}

.logo-img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
}

.payment-amount {
  font-size: 32px;
  font-weight: 700;
  color: #c8232c;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  padding: 30px;
  background: #fafafa;
  border-radius: 8px;
}

.qrcode-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 230px;
}

.qr-pattern {
  position: relative;
}

.qrcode-tips {
  text-align: center;
}

.tip-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
}

.tip-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.tip-icon {
  width: 40px;
  height: 40px;
  opacity: 0.6;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* 支付状态 */
.payment-status {
  margin-top: 25px;
  padding: 25px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
}

.status-checking {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c8232c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-success {
  animation: bounceIn 0.5s ease;
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  background: #07c160;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  font-weight: bold;
}

.success-text {
  font-size: 24px;
  font-weight: 700;
  color: #07c160;
  margin-bottom: 10px;
}

.success-desc {
  font-size: 14px;
  color: #999;
}

.failed-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  background: #ff4444;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  font-weight: bold;
}

.failed-text {
  font-size: 24px;
  font-weight: 700;
  color: #ff4444;
  margin-bottom: 10px;
}

.failed-desc {
  font-size: 14px;
  color: #999;
}

/* 测试支付按钮 */
.test-payment {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #ddd;
}

.simulate-scan-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #07c160, #05a850);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.simulate-scan-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(7, 193, 96, 0.3);
}

.qrcode-footer {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.footer-tips {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.tip-icon-small {
  font-size: 18px;
}

/* 支付操作 */
.payment-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.change-method-btn,
.cancel-order-btn {
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-method-btn {
  background: #fff;
  border: 2px solid #c8232c;
  color: #c8232c;
}

.change-method-btn:hover {
  background: rgba(200, 35, 44, 0.05);
}

.cancel-order-btn {
  background: #fff;
  border: 2px solid #ddd;
  color: #666;
}

.cancel-order-btn:hover {
  border-color: #999;
}

/* 支付说明 */
.payment-notice {
  background: #fff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  padding: 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  border-bottom: 1px dashed #f0f0f0;
}

.notice-list li:last-child {
  border-bottom: none;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;
  }

  .page-title {
    font-size: 28px;
  }

  .method-list {
    flex-direction: column;
  }

  .info-items {
    grid-template-columns: 1fr;
  }

  .qrcode-wrapper {
    padding: 20px;
  }

  .payment-actions {
    flex-direction: column;
  }

  .footer-tips {
    flex-direction: column;
    gap: 15px;
  }
}
</style>

