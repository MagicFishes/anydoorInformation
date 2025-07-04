// // request.ts
// import axios, {
//   AxiosResponse,
//   RawAxiosRequestHeaders,
//   InternalAxiosRequestConfig,
// } from 'axios';

// // 定义 ResponseType 类型
// interface ResponseType<T = any> {
//   code: number;
//   message: string;
//   data: T;
// }

// // 创建 axios 实例
// const axiosInstance = axios.create({
//   baseURL: 'https://api.example.com',
//   timeout: 10000,
// });
// // 请求拦截器
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 响应拦截器
// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse<ResponseType>) => {
//     return response;
//   },
//   (error) => {
//     console.error('API Error:', error);
//     return Promise.reject(error);
//   }
// );

// /**
//  * @param {string} url
//  * @param {object} data
//  * @param {object} params
//  * @param headers
//  * @param responseType
//  */
// export function post<T = any>(
//   url: string,
//   data = {},
//   params = {},
//   headers = {},
//   responseType: any = undefined
// ) {
//   return axiosInstance<ResponseType<T>>({
//     method: 'post',
//     url,
//     data,
//     params,
//     headers,
//     responseType,
//   });
// }

// /**
//  * @param {string} url
//  * @param {object} params
//  * @param headers
//  * @param responseType
//  */
// export function get<T = any>(
//   url: string,
//   params = {},
//   headers: RawAxiosRequestHeaders = {},
//   responseType: InternalAxiosRequestConfig['responseType'] = undefined
// ) {
//   return axiosInstance<ResponseType<T>>({
//     method: 'get',
//     url,
//     params,
//     headers,
//     responseType,
//   });
// }

// /**
//  * @param {string} url
//  * @param {object} data
//  * @param {object} params
//  */
// export function put<T = any>(
//   url: string,
//   data = {},
//   params = {},
//   headers = {}
// ) {
//   return axiosInstance<ResponseType<T>>({
//     method: 'put',
//     url,
//     params,
//     data,
//     headers,
//   });
// }

// /**
//  * @param {string} url
//  * @param {object} params
//  */
// export function del<T = any>(
//   url: string,
//   params = {},
//   data = {},
//   headers = {}
// ) {
//   return axiosInstance<ResponseType<T>>({
//     method: 'delete',
//     url,
//     params,
//     data,
//     headers,
//   });
// }

// // interface ResponseType