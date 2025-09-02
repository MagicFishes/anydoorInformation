import { get, post } from '@/utils/request'
import { LoginParams, LoginRes,RegisterParams } from './types/User'
export class User {
  // static async  (params) {

  // }
  static async login(params: LoginParams) {
    return post<LoginRes>(`/auth/login`, params)
  }
  static async register(params: RegisterParams) {
    return post(`/auth/register`, params)
  }
  static async tryConnection() {
    return get(`/auth/tryConnection`)
  }
}
