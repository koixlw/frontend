import axios from 'axios'

// 创建axios实例
const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    console.log('发送请求:', config)
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    console.log('收到响应:', response)
    return response.data
  },
  error => {
    console.error('响应错误:', error)
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('错误状态:', error.response.status)
      console.error('错误信息:', error.response.data)
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误:', error.request)
    } else {
      // 其他错误
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  }
)

export default http
