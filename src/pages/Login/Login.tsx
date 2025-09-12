import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { User } from '@/api/User'

interface FormData {
  phone: string
  password: string
  rePassword?: string
}

export default function Login() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [time, setTime] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginOrRegisterType, setLoginOrRegisterType] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      phone: '',
      password: '',
      rePassword: '',
    },
  })

  // 时间计时器
  useEffect(() => {
    let timer: any = null
    if (time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0 && timer) {
      clearInterval(timer)
    }
    return () => clearInterval(timer)
  }, [time])

  // 发送验证码
  const sendVerificationCode = async () => {
    const isValid = await trigger('phone')
    if (!isValid) {
      messageApi.warning('请输入有效的手机号码')
      return
    }

    try {
      // 这里应该是发送验证码的API调用
      messageApi.success('验证码已发送')
      setTime(60)
    } catch (err) {
      messageApi.error('发送验证码失败')
    }
  }

  // 登录处理
  const handleLogin = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await User.login({
        phone: data.phone,
        password: data.password,
      })

      if (response.data.success) {
        messageApi.success('登录成功')
        // 登录成功后的操作，比如跳转
        // navigate('/dashboard');
        navigate('/homePage')
      } else {
        messageApi.error(response.data.message || '登录失败')
      }
    } catch (err) {
      messageApi.error('登录请求失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 注册处理
  const handleRegister = async (data: FormData) => {
    if (data.password !== data.rePassword) {
      messageApi.error('两次输入的密码不一致')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await User.register({
        phone: data.phone,
        password: data.password,
      })
      if (response.data.success) {
        messageApi.success('注册成功')
        // 注册成功后切换到登录状态
        setLoginOrRegisterType(false)
        reset()
      } else {
        messageApi.error(response.data.message || '注册失败')
      }
    } catch (err) {
      messageApi.error('注册请求失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 表单提交处理
  const onSubmit = (data: FormData) => {
    if (loginOrRegisterType) {
      handleRegister(data)
    } else {
      handleLogin(data)
    }
  }

  // 手机号码正则验证
  const validatePhone = (value: string) => {
    return /^1[3-9]\d{9}$/.test(value) || '请输入有效的手机号码'
  }

  // 密码强度验证
  const validatePassword = (value: string) => {
    if (value.length < 6) return '密码长度至少6位'
    if (!/[A-Z]/.test(value)) return '密码必须包含大写字母'
    if (!/[a-z]/.test(value)) return '密码必须包含小写字母'
    if (!/[0-9]/.test(value)) return '密码必须包含数字'
    return true
  }

  // 切换登录/注册状态
  const toggleFormType = (type: boolean) => {
    setLoginOrRegisterType(type)
    clearErrors()
  }

  return (
    <>
      {contextHolder}
      <div className="flex h-full w-full items-end flex-col">
        <div className="w-[40%] mr-[5%] flex flex-col justify-center h-full">
          <div className="px-[10%] flex justify-evenly items-center">
            <div
              onClick={() => toggleFormType(false)}
              className={`py-[1.125rem] cursor-pointer flex justify-evenly items-center rounded-[1.875rem] w-[48%] ${
                !loginOrRegisterType
                  ? 'bg-[#1677ff] text-[white]'
                  : 'bg-[#d4d4d4]'
              }`}
            >
              登录
            </div>

            <div
              onClick={() => toggleFormType(true)}
              className={`py-[1.125rem] cursor-pointer flex justify-evenly items-center rounded-[1.875rem] w-[48%] ${
                loginOrRegisterType
                  ? 'bg-[#1677ff] text-[white]'
                  : 'bg-[#d4d4d4]'
              }`}
            >
              注册
            </div>
          </div>

          {/* 登录表单 */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-col px-[5rem] flex justify-center"
          >
            <div className="w-[100%] flex flex-col justify-evenly items-center">
              <h1 className="font-bold text-[25px] tracking-[2px]"></h1>
            </div>

            <div className="flex flex-col w-[100%] mt-[20px]">
              {/* 手机号输入 */}
              <div className="mb-[30px] relative">
                <Input
                  size="large"
                  placeholder="请输入手机号码"
                  prefix={<UserOutlined />}
                  status={errors.phone ? 'error' : ''}
                  {...register('phone', {
                    required: '手机号码不能为空',
                    validate: validatePhone,
                  })}
                  onChange={(e) => {
                    setValue('phone', e.target.value)
                    trigger('phone')
                  }}
                />
                {errors.phone && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* 密码输入 */}
              <div className="relative">
                <Input.Password
                  size="large"
                  placeholder="请输入密码"
                  prefix={<LockOutlined />}
                  status={errors.password ? 'error' : ''}
                  {...register('password', {
                    required: '密码不能为空',
                    validate: validatePassword,
                  })}
                  onChange={(e) => {
                    setValue('password', e.target.value)
                    trigger('password')
                  }}
                />
                {errors.password && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* 注册时的确认密码 */}
              {loginOrRegisterType && (
                <div className="mt-[30px] relative">
                  <Input.Password
                    size="large"
                    placeholder="请确认密码"
                    prefix={<LockOutlined />}
                    status={errors.rePassword ? 'error' : ''}
                    {...register('rePassword', {
                      required: '请确认密码',
                      validate: (value) =>
                        value === watch('password') || '两次输入的密码不一致',
                    })}
                    onChange={(e) => {
                      setValue('rePassword', e.target.value)
                      trigger('rePassword')
                    }}
                  />
                  {errors.rePassword && (
                    <p className="absolute text-red-500 text-sm mt-1">
                      {errors.rePassword.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-evenly items-center mt-[30px] w-[100%]">
              <div className="flex w-[100%] h-[40px] justify-evenly items-center">
                <Button
                  htmlType="submit"
                  style={{ width: '100%', height: '100%' }}
                  type="primary"
                  loading={isSubmitting}
                >
                  {loginOrRegisterType ? '注册' : '登录'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

// import { Input, Button, message } from 'antd'
// import { UserOutlined, UnlockOutlined } from '@ant-design/icons'
// import { useNavigate } from 'react-router-dom'
// import { User } from '@/api/User'
// export default function Login() {
//   const [phone, setPhone] = useState('')
//   const [password, setPassWord] = useState('')
//   const [email, setEmail] = useState('')
//   const [time, setTime] = useState<number>(0)
//   const navigate = useNavigate()
//   const [messageApi, contextHolder] = message.useMessage()
//   const [rePassword,setRePassWord]=useState<string>('')
//   const downTime = () => {
//     setTime(60)
//   }
//   // 时间计时器
//   useEffect(() => {
//     let timer: any = null

//     if (time > 0) {
//       timer = setInterval(() => {
//         setTime((prevTime) => prevTime - 1)
//       }, 1000)
//     } else if (time === 0 && timer) {
//       clearInterval(timer)
//     }
//     // 组件卸载时清理 interval
//     return () => clearInterval(timer)
//   }, [time])
//   // 登录
//   const Login = () => {
//     User.login({
//       /*账号 */
//       phone: phone,
//       /*验证码 */
//       password: password,
//     })
//       .then(({ data }) => {
//         if (data.success) {
//         } else {
//           messageApi.info(data.message)
//         }
//       })
//       .catch((err) => {
//         messageApi.info(err.message)
//       })
//   }
//   // 注册
//   const register = () => {
//     User.register({
//       phone: phone,
//       password: password,
//     })
//       .then(({ data }) => {
//         console.log('data', data)
//         if (data.success) {
//           message.info(data.message)
//         } else {
//           message.error(data.message)
//         }
//       })
//       .catch((err) => {
//         message.error(err.message)
//       })
//   }

//   // 测试是否连接后台
//   useEffect(() => {
//     User.tryConnection()
//       .then(({ data }) => {
//         console.log('data', data)
//       })
//       .catch((err) => {
//         console.log('err', err)
//       })
//   }, [])
//   // 切换登录和注册
//   const [loginOrRegisterType, setLoginOrRegisterType] = useState<boolean>(false)
//   const handlePhoneChnage = (element: React.ChangeEvent<HTMLInputElement>) => {
//     setPhone(element.target.value)
//   }
//   const handleEmailChnage = (element: React.ChangeEvent<HTMLInputElement>) => {
//     setEmail(element.target.value)
//   }
//   const handlePassWordChnage = (
//     element: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     setPassWord(element.target.value)
//   }
//   return (
//     <>
//       <div className=" flex  h-[100%]  w-[100%]   items-end flex-col  ">
//         <div className="w-[40%] mr-[5%]  flex  flex-col  justify-center    h-full">
//           <div className=" px-[10%] flex justify-evenly items-center ">
//             <div
//               onClick={() => setLoginOrRegisterType(false)}
//               className={`py-[1.125rem] cursor-pointer flex justify-evenly  items-center rounded-[1.875rem]   w-[48%] ${!loginOrRegisterType ? 'bg-[#1677ff]  text-[white]' : ' bg-[#d4d4d4]'}`}
//             >
//               登录
//             </div>

//             <div
//               onClick={() => setLoginOrRegisterType(true)}
//               className={`py-[1.125rem] cursor-pointer flex justify-evenly  items-center rounded-[1.875rem]   w-[48%] ${loginOrRegisterType ? 'bg-[#1677ff]  text-[white]' : 'bg-[#d4d4d4]'}`}
//             >
//               注册
//             </div>
//           </div>
//           {/* 登录 */}
//           {!loginOrRegisterType && (
//             <div className=" flex-col  px-[5rem]   flex  justify-center">
//               <div className=" w-[100%] flex flex-col justify-evenly items-center">
//                 <h1 className=" font-bold text-[25px]  tracking-[2px]   "></h1>
//               </div>
//               <div className=" flex flex-col w-[100%] mt-[20px]  ">
//                 <div className="mb-[15px]">
//                   <Input
//                     value={phone}
//                     prefix={<UserOutlined />}
//                     size="large"
//                     placeholder="请输入手机号码"
//                     onChange={handlePhoneChnage}
//                   />
//                 </div>
//                 <div className="">
//                   <Input
//                     value={password}
//                     prefix={<UserOutlined />}
//                     size="large"
//                     placeholder="请输入密码"
//                     onChange={handlePassWordChnage}
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-evenly items-center mt-[15px] w-[100%]">
//                 <div className="flex w-[100%] h-[40px] justify-evenly items-center ">
//                   <Button
//                     onClick={Login}
//                     style={{ width: '100%', height: '100%' }}
//                     type="primary"
//                   >
//                     登录
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//           {/* 注册 */}
//           {loginOrRegisterType && (
//             <div className=" flex-col  px-[5rem]   flex  justify-center">
//               <div className=" w-[100%] flex flex-col justify-evenly items-center">
//                 <h1 className=" font-bold text-[25px]  tracking-[2px]   "></h1>
//               </div>
//               <div className=" flex flex-col w-[100%] mt-[20px]  ">
//                 <div className=" mb-[15px]">
//                   <Input
//                     value={phone}
//                     prefix={<UserOutlined />}
//                     size="large"
//                     placeholder="请输入手机号"
//                     onChange={(element) => setPhone(element.target.value)}
//                   />
//                 </div>
//                 <div className="">
//                   <Input
//                     value={password}
//                     prefix={<UserOutlined />}
//                     size="large"
//                     placeholder="请输入密码"
//                     onChange={(element) => setPassWord(element.target.value)}
//                   />
//                 </div>
//                 <div className="flex justify-between mt-[15px] items-center">
//                 </div>
//               </div>
//               <div className="flex justify-evenly items-center mt-[15px] w-[100%]">
//                 <div className="flex w-[100%] h-[40px] justify-evenly items-center ">
//                   <Button
//                     onClick={register}
//                     style={{ width: '100%', height: '100%' }}
//                     type="primary"
//                   >
//                     注册
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }
