# 传承人和新闻动态页面访问问题说明

## 🔍 问题描述

访问 `/inheritors`（传承人）和 `/news`（新闻动态）页面时无法正常显示数据。

## 📋 原因分析

### 1. **后端 API 未连接**
这两个页面都需要调用后端 API 获取数据：
- **传承人页面**: 调用 `/api/inheritors/page` 接口
- **新闻动态页面**: 调用 `/api/news` 接口

当前项目是纯前端项目，没有后端服务器支持这些 API。

### 2. **API 代理配置缺失**
之前的 `vite.config.js` 中没有配置 API 代理，导致请求无法转发到后端服务器。

## ✅ 解决方案

### 方案一：启动本地开发服务器（推荐用于开发）

#### 1. 确认后端服务
确保你有后端 API 服务运行在 `http://localhost:8080`

#### 2. 已完成的配置
项目已经配置好以下内容：

✅ **环境变量文件** (`.env.development`)
```bash
VITE_API_BASE_URL=http://localhost:8080
```

✅ **Vite 代理配置** (`vite.config.js`)
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

✅ **HTTP 客户端配置** (`src/utils/http.js`)
```javascript
baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
```

#### 3. 启动步骤
```bash
# 1. 确保后端服务已启动（端口 8080）
# 2. 安装依赖
npm install

# 3. 启动前端开发服务器
npm run dev

# 4. 访问页面
# - 首页：http://localhost:5173/
# - 传承人：http://localhost:5173/inheritors
# - 新闻：http://localhost:5173/news
```

---

### 方案二：使用 Mock 数据（无后端时的临时方案）

如果暂时没有后端服务，可以修改代码使用页面内置的 Mock 数据。

#### 传承人页面已有备用数据
`src/views/content/inheritors/Inheritors.vue` 文件中已经包含了 `fallbackInheritors` 数组，包含 6 条示例数据。

**当前行为**：当 API 请求失败时，会自动使用备用数据。

但由于 HTTP 拦截器会显示错误信息，建议：

#### 选项 A：暂时禁用 API 调用（直接使用 Mock 数据）

修改 `src/views/content/inheritors/Inheritors.vue`：

```javascript
// 找到 loadInheritors 函数，修改为：
const loadInheritors = async () => {
  try {
    loading.value = true;
    
    // 暂时注释掉 API 调用，直接使用备用数据
    // const params = {...}
    // const response = await inheritorApi.getInheritorsByPage(params);
    // allInheritors.value = response.records || [];
    
    loadFallbackData(); // 直接使用备用数据
    
  } catch (error) {
    console.error('加载传承人数据失败:', error);
    loadFallbackData();
  } finally {
    loading.value = false;
  }
};
```

同样修改新闻页面 `src/views/content/news/News.vue`，添加 Mock 数据。

---

### 方案三：部署时的配置

#### 生产环境配置

1. 修改 `.env.production` 文件：
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

2. 构建项目：
```bash
npm run build
```

3. Nginx 配置示例（`nginx.conf`）：
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /usr/share/nginx/html;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend-server:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 🔧 快速测试（无后端情况）

如果你想立即看到效果，可以：

### 1. 启动前端开发服务器
```bash
npm run dev
```

### 2. 访问页面
- 传承人列表：http://localhost:5173/inheritors
- 新闻动态：http://localhost:5173/news

### 3. 预期结果
由于没有后端服务，页面会显示 API 请求错误，但传承人页面会自动加载备用的 Mock 数据（6 条示例数据）。

---

## 📝 技术说明

### 数据流向

```
用户访问页面
    ↓
Vue 组件 onMounted 钩子触发
    ↓
调用 API (inheritorApi.getInheritorsByPage)
    ↓
axios 实例发送请求到 /api/inheritors/page
    ↓
Vite 代理转发到 http://localhost:8080/inheritors/page
    ↓
后端返回数据
    ↓
更新组件状态渲染页面
```

### 如果没有后端

```
API 请求失败（网络错误）
    ↓
catch 捕获错误
    ↓
调用 loadFallbackData()
    ↓
使用组件内定义的 fallbackInheritors 数组
    ↓
渲染备用数据
```

---

## ⚠️ 注意事项

1. **端口配置**：
   - 前端开发服务器：5173（Vite 默认）
   - 后端 API 服务器：8080（可配置）

2. **跨域问题**：
   - 开发环境通过 Vite 代理解决
   - 生产环境通过 Nginx 反向代理解决

3. **环境变量优先级**：
   - `.env.production` > `.env.development` > `.env`
   - 根据 `NODE_ENV` 自动选择

4. **Token 认证**：
   - 当前部分 API 可能需要登录 token
   - Token 存储在 localStorage 中

---

## 🎯 下一步行动

### 如果你有后端服务：
1. 确保后端运行在正确端口
2. 检查后端 CORS 配置
3. 启动前端开发服务器
4. 测试 API 连通性

### 如果你只需要前端展示：
1. 使用现有的 Mock 数据
2. 或者添加更多 Mock 数据到组件中
3. 专注于 UI/UX 优化

### 如果你需要完整功能：
1. 部署或开发后端 API 服务
2. 参考 `src/api/modules/content.js` 实现后端接口
3. 配置正确的 API 地址
4. 进行联调测试

---

## 📞 需要帮助？

如果还有问题，请检查：
- 浏览器控制台是否有错误信息
- Network 面板查看 API 请求状态
- 后端服务日志
- 环境变量是否正确加载