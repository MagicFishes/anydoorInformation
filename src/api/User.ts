 import { post} from '@/utils/request'
 import {LoginParams,LoginRes} from './types/user'
 export class User{
    // static async  (params) {
        
    // }
    static  async  login(params: LoginParams) {
  return post<LoginRes>(`/auth/login`, params);
}
 }