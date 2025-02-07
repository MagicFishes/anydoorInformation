import axios from 'axios'

// 创建一个 axios 实例，配置基本的请求参数
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',  // 设置基础 URL
  timeout: 10000,  // 设置请求超时时间
})

// 请求拦截器：你可以在这里添加认证令牌等额外的请求头
axiosInstance.interceptors.request.use(
  (config) => {
    // 比如在请求头中添加 token
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error)
  }
)

// 响应拦截器：在这里可以处理响应数据或者错误信息
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data  // 直接返回响应的 data 部分
  },
  (error) => {
    // 统一处理错误
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default axiosInstance


// import axiosInstance from './api/axiosInstance'

// // 示例请求
// axiosInstance.get('/blogs')
//   .then(response => {
//     console.log('Blogs:', response)
//   })
//   .catch(error => {
//     console.error('Request failed:', error)
//   })