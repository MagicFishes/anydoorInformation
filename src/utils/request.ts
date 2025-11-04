import axios, { AxiosResponse, InternalAxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import { message } from 'antd'

interface ResponseType<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    message.error('请求发送失败')
    return Promise.reject(error)
  },
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ResponseType>) => {
    const { code, message: msg, success } = response.data
    
    // 业务逻辑成功
    if (success && code === 200) {
      return response
    }
    
    // 业务逻辑失败
    message.error(msg || '请求失败')
    return Promise.reject(new Error(msg || '请求失败'))
  },
  (error) => {
    // 网络错误或 HTTP 状态码错误
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          message.error('未授权，请重新登录')
          // 可以在这里处理跳转到登录页
          // window.location.href = '/login'
          break
        case 403:
          message.error('没有权限访问')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器错误，请稍后重试')
          break
        default:
          message.error(error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络')
    } else {
      message.error(error.message || '请求失败')
    }
    
    return Promise.reject(error)
  }
)

 /**
  * @param {string} url
  * @param {object} params 
  * @param {string} data
  * @param headers
  * @param responseType 
  */
 export function post<T=any>(url:string,data={},params={},headers={},responseType:any=undefined){
    return  axiosInstance<ResponseType<T>>({
        method:'post',
        url,
        data,
        params,
        headers,
        responseType
    })
 }
 /**
 * @param {string} url
 * @param {object} params
 * @param headers
 * @param responseType
 */
export function get<T = any>(
  url: string,
  params = {},
  headers: RawAxiosRequestHeaders = {},
  responseType: InternalAxiosRequestConfig['responseType'] = undefined
) {
  return axiosInstance<ResponseType<T>>({
    method: 'get',
    url,
    params,
    headers,
    responseType,
  });
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function put<T = any>(
  url: string,
  data = {},
  params = {},
  headers = {}
) {
  return axiosInstance<ResponseType<T>>({
    method: 'put',
    url,
    params,
    data,
    headers,
  });
}

/**
 * @param {string} url
 * @param {object} params
 */
export function del<T = any>(
  url: string,
  params = {},
  data = {},
  headers = {}
) {
  return axiosInstance<ResponseType<T>>({
    method: 'delete',
    url,
    params,
    data,
    headers,
  });
}