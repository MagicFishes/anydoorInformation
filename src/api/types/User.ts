// 参数接口
export interface LoginParams {
  /*账号 */
  phone: string;

  /*验证码 */
  verifyCode?: string;
  password:string
}

// 响应接口
export interface LoginRes {
  /* */
  code: string;

  /* */
  message: string;

  /* */
  success: boolean;

  /* */
  data: {
    /*头像 */
    avatar: string;

    /*用户名 */
    username: string;

    /*昵称 */
    nickname: string;

    /*角色列表 */
    roles: Record<string, unknown>[];

    /*权限列表 */
    permissions: Record<string, unknown>[];

    /*token */
    accessToken: string;

    /*过期时间 */
    expires: string;
  };
}
// 参数接口
export interface RegisterParams {
  // 手机号
  phone:string,
  password:string
}
