/**
 * API 联调测试脚本
 * 
 * 使用方法:
 * 1. 确保后端服务已启动 (http://localhost:8080)
 * 2. 在浏览器控制台粘贴此代码执行
 * 3. 查看测试结果
 */

const API_BASE = 'http://localhost:8080/api';

// 测试工具函数
async function testAPI(name, url, options = {}) {
  console.group(`🧪 测试: ${name}`);
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ 成功');
      console.log('响应数据:', data);
    } else {
      console.error('❌ 失败', response.status, data);
    }
  } catch (error) {
    console.error('❌ 网络错误:', error.message);
  }
  console.groupEnd();
}

// 开始测试
console.log('🚀 开始API联调测试...\n');

// 1. 健康检查
testAPI('健康检查', `${API_BASE}/test/health`);

// 2. 管理员登录
setTimeout(async () => {
  console.log('\n📝 测试管理员登录...');
  try {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    const data = await response.json();
    
    if (data.token) {
      console.log('✅ 登录成功, Token:', data.token.substring(0, 20) + '...');
      localStorage.setItem('token', data.token);
      
      // 3. 获取统计数据(需要Token)
      setTimeout(() => {
        testAPI('获取统计数据', `${API_BASE}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
      }, 500);
    } else {
      console.error('❌ 登录失败:', data);
    }
  } catch (error) {
    console.error('❌ 登录错误:', error.message);
  }
}, 1000);

// 4. 获取传承人列表
setTimeout(() => {
  testAPI('获取传承人列表', `${API_BASE}/inheritors`);
}, 2000);

// 5. 获取新闻列表
setTimeout(() => {
  testAPI('获取新闻列表', `${API_BASE}/news?page=0&size=6`);
}, 3000);

// 6. 获取作品列表
setTimeout(() => {
  testAPI('获取作品列表', `${API_BASE}/gallery/works?page=1&pageSize=9`);
}, 4000);

// 7. 获取商品列表
setTimeout(() => {
  testAPI('获取商品列表', `${API_BASE}/products?page=1&pageSize=12`);
}, 5000);

// 8. 获取活动类型
setTimeout(() => {
  testAPI('获取活动类型', `${API_BASE}/activities/types`);
}, 6000);

console.log('\n⏳ 测试将在6秒内陆续执行,请查看控制台输出...\n');
