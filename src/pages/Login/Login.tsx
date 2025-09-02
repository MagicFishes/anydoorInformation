import { Input, Button, message } from 'antd'
import { UserOutlined, UnlockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { User } from '@/api/User'
export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassWord] = useState('')
  const [email, setEmail] = useState('')
  const [time, setTime] = useState<number>(0)
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [rePassword,setRePassWord]=useState<string>('')
  const downTime = () => {
    setTime(60)
  }
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
    // 组件卸载时清理 interval
    return () => clearInterval(timer)
  }, [time])
  // 登录
  const Login = () => {
    User.login({
      /*账号 */
      phone: phone,
      /*验证码 */
      password: password,
    })
      .then(({ data }) => {
        if (data.success) {
        } else {
          messageApi.info(data.message)
        }
      })
      .catch((err) => {
        messageApi.info(err.message)
      })
  }
  // 注册
  const register = () => {
    User.register({
      phone: phone,
      password: password,
    })
      .then(({ data }) => {
        console.log('data', data)
        if (data.success) {
          message.info(data.message)
        } else {
          message.error(data.message)
        }
      })
      .catch((err) => {
        message.error(err.message)
      })
  }

  // 测试是否连接后台
  useEffect(() => {
    User.tryConnection()
      .then(({ data }) => {
        console.log('data', data)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }, [])
  // 切换登录和注册
  const [loginOrRegisterType, setLoginOrRegisterType] = useState<boolean>(false)
  const handlePhoneChnage = (element: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(element.target.value)
  }
  const handleEmailChnage = (element: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(element.target.value)
  }
  const handlePassWordChnage = (
    element: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassWord(element.target.value)
  }
  return (
    <>
      <div className=" flex  h-[100%]  w-[100%]   items-end flex-col  ">
        <div className="w-[40%] mr-[5%]  flex  flex-col  justify-center    h-full">
          <div className=" px-[10%] flex justify-evenly items-center ">
            <div
              onClick={() => setLoginOrRegisterType(false)}
              className={`py-[1.125rem] cursor-pointer flex justify-evenly  items-center rounded-[1.875rem]   w-[48%] ${!loginOrRegisterType ? 'bg-[#1677ff]  text-[white]' : ' bg-[#d4d4d4]'}`}
            >
              登录
            </div>

            <div
              onClick={() => setLoginOrRegisterType(true)}
              className={`py-[1.125rem] cursor-pointer flex justify-evenly  items-center rounded-[1.875rem]   w-[48%] ${loginOrRegisterType ? 'bg-[#1677ff]  text-[white]' : 'bg-[#d4d4d4]'}`}
            >
              注册
            </div>
          </div>
          {/* 登录 */}
          {!loginOrRegisterType && (
            <div className=" flex-col  px-[5rem]   flex  justify-center">
              <div className=" w-[100%] flex flex-col justify-evenly items-center">
                <h1 className=" font-bold text-[25px]  tracking-[2px]   "></h1>
              </div>
              <div className=" flex flex-col w-[100%] mt-[20px]  ">
                <div className="mb-[15px]">
                  <Input
                    value={phone}
                    prefix={<UserOutlined />}
                    size="large"
                    placeholder="请输入手机号码"
                    onChange={handlePhoneChnage}
                  />
                </div>
                <div className="">
                  <Input
                    value={password}
                    prefix={<UserOutlined />}
                    size="large"
                    placeholder="请输入密码"
                    onChange={handlePassWordChnage}
                  />
                </div>

                {/* <div className=''>
                   <Input
                  value={email}
                  prefix={<UserOutlined />}
                  size="large"
                  placeholder="请输入邮箱"
                  // onChange={handleEmailChnage}
                  onChange={(element)=>setEmail(element.target.value)}
                />
                </div> */}
                {/* <div className="flex justify-between mt-[15px] items-center">
                  <Input.Password
                    value={password}
                    prefix={<UnlockOutlined />}
                    size="large"
                    placeholder="请输入验证码"
                    className="mr-[10px]"
                    onChange={handlePassWordChnage}
                  />
                  {time == 0 ? (
                    <div className=" w-[200px] flex justify-evenly items-center">
                      <Button
                        style={{ width: '100%' }}
                        onClick={downTime}
                        size="large"
                        type="primary"
                      >
                        发送验证码
                      </Button>
                    </div>
                  ) : (
                    <div className=" w-[200px] flex justify-evenly items-center">
                      <Button style={{ width: '100%' }} size="large" disabled>
                        {time} 秒后可重试
                      </Button>
                    </div>
                  )}
                </div> */}
              </div>
              <div className="flex justify-evenly items-center mt-[15px] w-[100%]">
                <div className="flex w-[100%] h-[40px] justify-evenly items-center ">
                  <Button
                    onClick={Login}
                    style={{ width: '100%', height: '100%' }}
                    type="primary"
                  >
                    登录
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* 注册 */}
          {loginOrRegisterType && (
            <div className=" flex-col  px-[5rem]   flex  justify-center">
              <div className=" w-[100%] flex flex-col justify-evenly items-center">
                <h1 className=" font-bold text-[25px]  tracking-[2px]   "></h1>
              </div>
              <div className=" flex flex-col w-[100%] mt-[20px]  ">
                <div className=" mb-[15px]">
                  <Input
                    value={phone}
                    prefix={<UserOutlined />}
                    size="large"
                    placeholder="请输入手机号"
                    onChange={(element) => setPhone(element.target.value)}
                  />
                </div>
                <div className="">
                  <Input
                    value={password}
                    prefix={<UserOutlined />}
                    size="large"
                    placeholder="请输入密码"
                    onChange={(element) => setPassWord(element.target.value)}
                  />
                </div>
                {/* <div className="">
                  <Input
                    value={rePassword}
                    prefix={<UserOutlined />}
                    size="large"
                    placeholder="请确认密码"
                    onChange={(element) => setRePassWord(element.target.value)}
                  />
                </div> */}
                {/* <Input
                  value={phone}
                  prefix={<UserOutlined />}
                  size="large"
                  placeholder="请输入手机号码"
                  onChange={handlePhoneChnage}
                /> */}

                <div className="flex justify-between mt-[15px] items-center">
                  {/* <Input.Password
                    value={password}
                    prefix={<UnlockOutlined />}
                    size="large"
                    placeholder="请输入验证码"
                    className="mr-[10px]"
                    onChange={handlePassWordChnage}
                  /> */}
                  {/* {time == 0 ? (
                    <div className=" w-[200px] flex justify-evenly items-center">
                      <Button
                        style={{ width: '100%' }}
                        onClick={downTime}
                        size="large"
                        type="primary"
                      >
                        发送验证码
                      </Button>
                    </div>
                  ) : (
                    <div className=" w-[200px] flex justify-evenly items-center">
                      <Button style={{ width: '100%' }} size="large" disabled>
                        {time} 秒后可重试
                      </Button>
                    </div>
                  )} */}
                </div>
              </div>
              <div className="flex justify-evenly items-center mt-[15px] w-[100%]">
                <div className="flex w-[100%] h-[40px] justify-evenly items-center ">
                  <Button
                    onClick={register}
                    style={{ width: '100%', height: '100%' }}
                    type="primary"
                  >
                    注册
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
