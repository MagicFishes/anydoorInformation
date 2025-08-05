import { Input, Button } from 'antd'
import { UserOutlined, UnlockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { User } from '@/api/User'
export default function Login() {
  
  const [phone, setPhone] = useState('')
  const [password, setPassWord] = useState('')
  const [time, setTime] = useState<number>(0)
  const navigate = useNavigate()
  const downTime = () => {
    setTime(60)
  }
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0 && timer) {
      clearInterval(timer)
    }

    // 组件卸载时清理 interval
    return () => clearInterval(timer as NodeJS.Timeout)
  }, [time])
  const turnHome = () => {
    User.login({
      /*账号 */
      account: phone,
      /*验证码 */
      verifyCode: password,
    }).then(({data})=>{
      console.log("data",data)
    })
  }
  const handlePhoneChnage=(element:React.ChangeEvent<HTMLInputElement>)=>{
   setPhone(element.target.value)
  }
   const handlePassWordChnage=(element:React.ChangeEvent<HTMLInputElement>)=>{
   setPassWord(element.target.value)
  }
  return (
    <>
      <div className=" flex  h-[100%]  w-[100%] ">
        <div className=" w-[60%]">

        </div>
        <div className=" flex-col  flex-1  p-[5rem] h-[100%]  flex  justify-center">
          <div className=" w-[80%] flex flex-col justify-evenly items-center">
            <h1 className=" font-bold text-[25px]  tracking-[2px]   ">
              后台管理系统
            </h1>
          </div>
          <div className=" flex flex-col  w-[80%] mt-[20px]  ">
            <Input
              value={phone}
              prefix={<UserOutlined />}
              size="large"
              placeholder="请输入手机号码"
              onChange={handlePhoneChnage}
            />
            <div className="flex justify-between mt-[15px] items-center">
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
            </div>
          </div>
          <div className="flex justify-evenly items-center mt-[15px] w-[80%]">
            <div className="flex w-[100%] h-[40px] justify-evenly items-center ">
              <Button
                onClick={turnHome}
                style={{ width: '100%', height: '100%' }}
                type="primary"
              >
                登录
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
