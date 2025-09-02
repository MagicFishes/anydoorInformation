import axios, { AxiosResponse, InternalAxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'

interface ResponseType<T = any> {
  code: number
  message: string
  data: T,
  success:Boolean
}
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 100000,
  headers:{
    'Content-Type': 'application/json',
  }
})
// 前置
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// 响应
axiosInstance.interceptors.response.use(
    (response:AxiosResponse<ResponseType>)=>{
        return response
    },
    (error)=>{
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