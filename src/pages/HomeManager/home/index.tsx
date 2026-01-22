import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import { Input, Select, Button, message, Spin, QRCode, Space } from 'antd'
import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import HomeApi from '@/api/home'
import { QueryOrderInfoRes, CreatePayInfoRes } from '@/api/types/home'
import { useAppStore } from '@/store/storeZustand'
import { updateLanguage } from '@/i18n'
import { HotelInfoCard } from './components/HotelInfoCard'
import { AdvantageCard } from './components/AdvantageCard'
import { CreditCardForm } from './components/CreditCardForm'
import { PaymentSuccessCard } from './components/PaymentSuccessCard'
import { CountdownExpiredCard } from './components/CountdownExpiredCard'

// 创建表单验证规则的函数（支持翻译）
const createPaymentFormSchema = (t: (key: string) => string) => {
  return z.object({
    cardNumber: z
      .string()
      .min(1, t('请输入卡号'))
      .refine(
        value => {
          const digits = value.replace(/\s/g, '').replace(/\D/g, '')
          return digits.length >= 13 && digits.length <= 19
        },
        { message: t('请输入13-19位数字的卡号') }
      )
      .refine(
        value => {
          const digits = value.replace(/\s/g, '').replace(/\D/g, '')
          if (!digits) return false
          return ['3', '4', '5'].includes(digits[0])
        },
        {
          message: t(
            '输入的卡号有误，只支持American Express（3开头）、VISA（4开头）、Mastercard（5开头）的国际支付信用卡，请重新输入。'
          ),
        }
      )
      .refine(
        value => {
          const digits = value.replace(/\s/g, '').replace(/\D/g, '')
          // Luhn算法验证卡号
          let sum = 0
          let isEven = false
          for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i])
            if (isEven) {
              digit *= 2
              if (digit > 9) digit -= 9
            }
            sum += digit
            isEven = !isEven
          }
          return sum % 10 === 0
        },
        { message: t('卡号格式不正确') }
      ),
    cardType: z.string().min(1, t('请选择卡种')),
    expiryDate: z
      .string()
      .min(1, t('请输入有效期'))
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, t('格式：MM/YY（如：12/25）'))
      .refine(
        value => {
          const [month, year] = value.split('/')
          const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
          const now = new Date()
          return expiry >= now
        },
        { message: t('有效期不能是过去的日期') }
      ),
    cvv: z
      .string()
      .trim()
      .regex(/^\d{3,4}$/, t('请输入3-4位安全码')),
  })
}
// 支付方式图标
const payIconList = {
  Visa: '/image/home/payIcon/Visa.png',
  Mastercard: '/image/home/payIcon/Mastercard.png',
  Amex: '/image/home/payIcon/Amex.png',
  // Unionpay: '/image/home/payIcon/UnionPay.png',
  // Dinersclub: '/image/home/payIcon/DinersClub.png',
  // JCB: '/image/home/payIcon/JCB.png',
}

// 格式化倒计时显示（秒数转换为 MM:SS）
const formatCountdown = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds || 0)
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

// 支付倒计时提示组件（用于显示在安全担保支付区域）
interface PaymentCountdownProps {
  createdTime: string | null
  duration?: number
  t: (key: string) => string
  onExpire?: () => void
}

const PaymentCountdown = ({
  createdTime,
  duration = import.meta.env.MODE === 'production' ? 1800 : 300,
  t,
  onExpire,
}: PaymentCountdownProps) => {
  // 计算当前剩余时间
  const calcRemaining = useCallback(() => {
    if (!createdTime || createdTime.trim() === '') {
      return 0
    }
    try {
      const now = Date.now()
      const created = new Date(createdTime).getTime()
      // 检查时间是否有效
      if (isNaN(created)) {
        console.warn('无效的创建时间:', createdTime)
        return 0
      }
      const elapsed = Math.floor((now - created) / 1000)
      const remaining = Math.max(0, duration - elapsed)
      // console.log('倒计时计算:', {
      //   createdTime,
      //   now: new Date(now).toLocaleString(),
      //   created: new Date(created).toLocaleString(),
      //   elapsed,
      //   duration,
      //   remaining,
      // })
      return remaining
    } catch (error) {
      console.error('计算倒计时失败:', error, createdTime)
      return 0
    }
  }, [createdTime, duration])

  const [remaining, setRemaining] = useState<number>(() => calcRemaining())

  useEffect(() => {
    // 如果 createdTime 为空或无效，不启动倒计时
    if (!createdTime || createdTime.trim() === '') {
      console.log('PaymentCountdown: createdTime 为空，显示默认值')
      setRemaining(0)
      return
    }

    // 初始化一次
    const initial = calcRemaining()
    setRemaining(initial)

    if (initial <= 0) {
      onExpire && onExpire()
      return
    }

    const interval = setInterval(() => {
      const next = calcRemaining()
      setRemaining(next)
      if (next <= 0) {
        clearInterval(interval)
        onExpire && onExpire()
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [calcRemaining, createdTime, onExpire])

  // 如果没有创建时间或创建时间为空，显示默认文本（30:00）
  if (!createdTime || createdTime.trim() === '') {
    return <>{t('请在 {time} 内完成支付，否则订单将被自动取消').replace('{time}', '30:00')}</>
  }

  const timeText = remaining > 0 ? formatCountdown(remaining) : '00:00'
  return <>{t('请在 {time} 内完成支付，否则订单将被自动取消').replace('{time}', timeText)}</>
}

// 只负责右下角倒计时显示的小组件，内部自己每秒更新，不影响父组件
interface CountdownTimerProps {
  createdTime: string
  duration?: number // 默认 600 秒
  onExpire?: () => void
  label: string
  className?: string
}

const CountdownTimer = ({
  createdTime,
  duration = import.meta.env.MODE === 'production' ? 18000 : 30,
  onExpire,
  label,
  className = '',
}: CountdownTimerProps) => {
  // 计算当前剩余时间
  const calcRemaining = useCallback(() => {
    if (!createdTime) return 0
    const now = Date.now()
    const created = new Date(createdTime).getTime()
    const elapsed = Math.floor((now - created) / 1000)
    return Math.max(0, duration - elapsed)
  }, [createdTime, duration])

  const [remaining, setRemaining] = useState<number>(() => calcRemaining())

  useEffect(() => {
    // 初始化一次
    const initial = calcRemaining()
    setRemaining(initial)

    if (initial <= 0) {
      onExpire && onExpire()
      return
    }

    const interval = setInterval(() => {
      const next = calcRemaining()
      setRemaining(next)
      if (next <= 0) {
        clearInterval(interval)
        onExpire && onExpire()
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [calcRemaining, onExpire])

  return (
    <div
      className={`text-center tracking-[1rem] flex justify-center items-center text-[14rem] w-[100%] py-[10rem] px-[20rem] bg-[#ffe4e4] text-[#f65353] ${className}`}
    >
      {label} {remaining > 0 ? formatCountdown(remaining) : '00:00'}
    </div>
  )
}

export default function Home() {
  // 使用翻译
  const { t } = useTranslation()
  const navigate = useNavigate()
  // 使用 antd message hook（兼容 React 19）
  const [messageApi, messageContextHolder] = message.useMessage()

  // 获取全局语言状态和方法
  const { language: globalLanguage, setLanguage } = useAppStore()

  // 获取路径参数（格式：/:language/:encodeOrderNo）
  const params = useParams<{ language?: string; encodeOrderNo?: string }>()

  // 验证语言代码必须是 zh-CN 或 en-US，使用 useMemo 避免重复计算
  const languageCode = useMemo(() => {
    return params.language === 'zh-CN' || params.language === 'en-US' ? params.language : 'en-US'
  }, [params.language])

  const encodeOrderNo = useMemo(() => {
    return params.encodeOrderNo
  }, [params.encodeOrderNo])

  // 订单信息状态
  const [orderInfo, setOrderInfo] = useState<QueryOrderInfoRes['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasValidParams, setHasValidParams] = useState(false)

  // 用 ref 记录"本页当前实际使用的语言"和订单号，避免一次 URL 变化造成两次请求
  const pageLanguageRef = useRef<string | null>(null)
  const pageOrderNoRef = useRef<string | null | undefined>(null)

  // 动态创建 Schema（支持翻译）
  const paymentFormSchema = useMemo(() => createPaymentFormSchema(t), [t])

  // 提取获取订单信息的公共函数，支持手动刷新（不显示 loading）
  const fetchOrderInfoData = useCallback(
    async (showLoading = true) => {
      const requestLanguageCode = globalLanguage

      // 检查是否有必要的参数
      if (!requestLanguageCode || !encodeOrderNo) {
        setHasValidParams(false)
        if (showLoading) {
          setLoading(false)
        }
        return null
      }

      setHasValidParams(true)
      if (showLoading) {
        setLoading(true)
      }

      try {
        console.log('🔄 请求订单信息:', { requestLanguageCode, encodeOrderNo })
        const response = await HomeApi.queryOrderInfo(requestLanguageCode, encodeOrderNo)
        console.log("response",response)
        const responseData = response.data as any
        console.log('✅ 订单信息响应:', responseData)
        
        if (responseData?.code == '00000') {
          const orderData = responseData?.data || responseData?.data?.data
          if (orderData) {
            setOrderInfo(orderData as QueryOrderInfoRes['data'])
            return orderData as QueryOrderInfoRes['data']
          } else {
            if (showLoading) {
              // 使用静态的 message.error，不受 React 19 并发模式限制
              message.error(t('获取订单信息失败，请检查链接是否正确'))
            }
            setHasValidParams(false)
            // 数据为空时设置为过期状态
            setTimeExpired(true)
            timeExpiredRef.current = true
            return null
          }
        } else {
          // if (showLoading) {
          const errorMsg = responseData?.message || '获取订单信息失败'
          // 使用静态的 message.error，不受 React 19 并发模式限制
          message.error(errorMsg)
          // }
          setHasValidParams(false)
          // 接口报错时设置为过期状态
          setTimeExpired(true)
          timeExpiredRef.current = true
          return null
        }
      } catch (error) {
        console.error('❌ 获取订单信息失败:', error)
        // 响应拦截器 reject 的是 response 对象，所以 error 是 response
        // 如果是 response 对象，从 data 中获取错误信息
        const errorMessage = (error as any)?.data?.message || (error as any)?.message || '获取订单信息失败'
        // 使用静态的 message.error，不受 React 19 并发模式限制
        message.error(errorMessage)
        if (showLoading) {
          setHasValidParams(false)
        }
        // 接口异常时设置为过期状态
        setTimeExpired(true)
        timeExpiredRef.current = true
        return null
      } finally {
        if (showLoading) {
          setLoading(false)
        }
      }
    },
    [globalLanguage, encodeOrderNo, t]
  )

  // 从 Schema 推断类型
  type PaymentFormData = z.infer<typeof paymentFormSchema>

  // 时间已过期
  const [timeExpired, setTimeExpired] = useState(false)
  // 使用 ref 保存倒计时到期状态，以便在轮询闭包中访问
  const timeExpiredRef = useRef(false)
  // 支付/提交成功状态：true-支付成功，false-提交成功，null-未成功
  const [successType, setSuccessType] = useState<boolean | null>(null)

  // 根据 URL 中的语言参数同步全局语言
  // 只在 URL 语言变化时同步，不会在手动切换语言时把全局语言“改回去”
  useEffect(() => {
    if (languageCode && languageCode !== globalLanguage) {
      setLanguage(languageCode)
    }
  }, [languageCode, setLanguage])

  // 获取订单信息：使用全局语言的快照（存到 ref 里），避免一次参数变化导致多次请求
  useEffect(() => {
    // 1. 先拿到当前的全局语言，作为这一轮渲染下"本页语言"的候选值
    const currentLanguage = globalLanguage

    // 2. 如果"本页语言 + 订单号"没有变化，就不要重复请求接口
    if (pageLanguageRef.current === currentLanguage && pageOrderNoRef.current === encodeOrderNo) {
      return
    }

    // 3. 记录这一次要使用的"本页语言"和订单号
    pageLanguageRef.current = currentLanguage
    pageOrderNoRef.current = encodeOrderNo

    // 使用公共函数获取订单信息（显示 loading）
    fetchOrderInfoData(true)
    // 依赖：URL 语言、全局语言（支持手动切换）、订单号
    // 一次 URL 变化会触发两轮渲染（先改 languageCode 再同步 globalLanguage），
    // 但我们通过 ref 比较，保证只会真正请求一次接口。
  }, [languageCode, globalLanguage, encodeOrderNo, fetchOrderInfoData])
  // 使用 React Hook Form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: '',
      cardType: '',
      expiryDate: '',
      cvv: '',
    },
  })

  // 表单提交处理函数
  const onSubmit = handleSubmit(async values => {
    try {
      setIsSubmitting(true)
      // 保存表单数据到状态
      setPaymentData(values)

      console.log('表单提交:', values)

      // 检查是否有订单信息
      if (!orderInfo?.orderNo) {
        messageApi.error(t('订单信息不存在，请刷新页面重试'))
        return
      }

      // 映射表单字段到接口参数
      const cardNumber = values.cardNumber.replace(/\s/g, '') // 去除空格
      const cardCode = values.cardType // 直接使用表单值（已经是大写格式）

      // 调用提交担保信用卡接口
      const response = await HomeApi.submitCreditCard({
        orderNo: orderInfo.orderNo,
        cardCode: cardCode,
        cardNumber: cardNumber,
        expireDate: values.expiryDate, // 格式已经是 MM/YY
        cardSecurityCode: values.cvv || undefined,
        encodeLinkNo: encodeOrderNo as string,
      })

      const responseData = response.data as any
      if (responseData.code === '00000') {
        // 提交成功后，重新获取订单信息来验证担保状态
        const updatedOrderInfo = await fetchOrderInfoData(false)
        if (updatedOrderInfo) {
          // 根据获取到的订单信息验证担保状态
          if (updatedOrderInfo.isGuarantee) {
            messageApi.success(t('支付信息提交成功！'))
            // 订单状态会通过 useEffect 自动更新 successType
          } else {
            messageApi.warning(t('担保信息尚未生效，请稍后再试'))
          }
        } else {
          messageApi.error(t('获取订单信息失败，请重试'))
        }
      } else {
        messageApi.error(responseData.message || t('支付提交失败，请重试'))
      }
    } catch (error: any) {
      console.error('支付提交失败:', error)
      messageApi.error(error?.message || t('支付提交失败，请重试'))
    } finally {
      setIsSubmitting(false)
    }
  })

  // 表单数据状态
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 担保按钮的 loading 状态
  const [isGuaranteeLoading, setIsGuaranteeLoading] = useState(false)

  const showImageList = useMemo(
    () => [
      {
        image: '/image/home/Frame1.png',
        title: t('银行级风控'),
        description: t('我们的基础设施使用银行级别的加密技术，随时保护您的财务数据。'),
        bgColor: '#dfffdf',
      },
      {
        image: '/image/home/Frame2.png',
        title: t('PCI认证合规'),
        description: t('完全符合支付卡行业数据安全标准（Pcl DsS） 1级。'),
        bgColor: '#E2EEFF',
      },
      {
        image: '/image/home/Frame3.png',
        title: t('验证商户'),
        description: t('通过国际卡计划和当地当局的官方认证，以确保安全旅行。'),
        bgColor: '#F3E8FF',
      },
    ],
    [t]
  )
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>('creditCard')
  // 协议勾选状态
  const [isAgreementChecked, setIsAgreementChecked] = useState<boolean>(false)
  // 是否显示协议未勾选的错误提示
  const [showAgreementError, setShowAgreementError] = useState<boolean>(false)
  // 二维码相关状态
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('') // 用于 base64 图片
  const [qrCodeText, setQrCodeText] = useState<string>('') // 用于链接（如 weixin://）
  const [qrCodeLoading, setQrCodeLoading] = useState<boolean>(false)
  // 支付信息ID和轮询相关状态
  const [payInfoId, setPayInfoId] = useState<number | null>(null)
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(
    null
  )
  const [needRefreshQrCode, setNeedRefreshQrCode] = useState<boolean>(false)
  // 倒计时相关状态（仅保存创建时间，具体倒计时在子组件中处理）
  const [createdTime, setCreatedTime] = useState<string | null>(null)
  // 订单创建时间（从订单接口获取）
  const [orderCreatedTime, setOrderCreatedTime] = useState<string | null>(null)
  // 轮询开始时间，用于计算轮询是否超时
  const [pollingStartTime, setPollingStartTime] = useState<number | null>(null)

  // 当订单信息更新时，使用订单的 createdTime 设置倒计时
  useEffect(() => {
    if (orderInfo?.createdTime) {
      setOrderCreatedTime(orderInfo.createdTime)
      // 如果还没有设置 createdTime，或者订单的 createdTime 更新了，就使用订单的 createdTime
      if (!createdTime || orderInfo.createdTime !== createdTime) {
        setCreatedTime(orderInfo.createdTime)
      }
    }
  }, [orderInfo?.createdTime])

  // 提取获取二维码的公共函数
  const fetchQrCode = useCallback(async () => {
    if (!orderInfo?.orderNo) return
    if (orderInfo?.payState == 'SUCCESS') {
      return
    }
    setQrCodeLoading(true)
    setQrCodeUrl('') // 清空之前的二维码
    setQrCodeText('') // 清空之前的链接

    try {
      const payChannel = selectedPaymentOption === 'wechatPay' ? 'WX_PAY' : 'ALI_PAY'
      const response = await HomeApi.createPayInfo({
        orderNo: orderInfo.orderNo,
        payChannel: payChannel,
        encodeLinkNo: encodeOrderNo as string,
      })

      const responseData = response.data as any
      if (responseData.code === '00000' && responseData.data?.payBody) {
        // 保存 payInfoId
        if (responseData.data.payInfoId) {
          setPayInfoId(responseData.data.payInfoId)
        }
        // 保存 createdTime
        if (responseData.data.createdTime) {
          setCreatedTime(responseData.data.createdTime)
        }
        // payBody 可能是 URL 或 base64 字符串
        const payBody = responseData.data.payBody
        // 判断是否是 base64 格式
        if (
          payBody.startsWith('data:image') ||
          payBody.startsWith('/9j/') ||
          payBody.startsWith('iVBORw0KGgo')
        ) {
          // 如果是 base64，检查是否有前缀
          const qrUrl = payBody.startsWith('data:') ? payBody : `data:image/png;base64,${payBody}`
          setQrCodeUrl(qrUrl)
          setQrCodeText('') // 清空链接
        } else {
          // 如果是链接（如 weixin://、http:// 等），使用 QRCode 组件
          setQrCodeText(payBody)
          setQrCodeUrl('') // 清空图片
        }
        // 重置需要刷新二维码的状态
        setNeedRefreshQrCode(false)
        // 重置超时状态
        setTimeExpired(false)
        timeExpiredRef.current = false
        return true
      } else {
        messageApi.error(responseData.message || t('获取支付二维码失败'))
        return false
      }
    } catch (error: any) {
      console.error('获取支付二维码失败:', error)
      messageApi.error(error?.message || t('获取支付二维码失败，请重试'))
      return false
    } finally {
      setQrCodeLoading(false)
    }
  }, [orderInfo?.orderNo, selectedPaymentOption, t])

  // 切换支付方式时调用支付接口获取二维码
  useEffect(() => {
    // 只有在选择微信支付或支付宝时才调用接口
    if (
      (selectedPaymentOption === 'wechatPay' || selectedPaymentOption === 'alipay') &&
      orderInfo?.orderNo
    ) {
      fetchQrCode()
    } else {
      // 切换到信用卡支付时清空二维码和轮询、倒计时
      setQrCodeUrl('')
      setQrCodeText('')
      setPayInfoId(null)
      setNeedRefreshQrCode(false)
      setCreatedTime(null)
      setPollingStartTime(null)
      setTimeExpired(false)
      timeExpiredRef.current = false
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
    }
    // 注意：不将 fetchQrCode 放入依赖项，避免循环依赖导致重复请求
    // fetchQrCode 内部已经依赖了 selectedPaymentOption 和 orderInfo?.orderNo
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // orderInfo?.orderNo, pollingInterval
  }, [selectedPaymentOption])

  // 计算倒计时时长（秒）- 生产环境30分钟，开发环境300秒
  const countdownDuration = useMemo(() => {
    return import.meta.env.MODE === 'production' ? 1800 : 300
  }, [])

  // 计算轮询时长（秒）：线下环境比倒计时长10秒，线上环境长5分钟
  const pollingDuration = useMemo(() => {
    const extraTime = import.meta.env.MODE === 'production' ? 300 : 10 // 生产环境5分钟(300秒)，开发环境10秒
    return countdownDuration + extraTime
  }, [countdownDuration])

  // 轮询支付状态
  useEffect(() => {
    // 只有在二维码显示成功（有链接或图片）且有 payInfoId 时才开始轮询
    if ((!qrCodeUrl && !qrCodeText) || !payInfoId || qrCodeLoading) {
      return
    }

    // 如果已经有轮询在进行，先清除
    if (pollingInterval) {
      clearInterval(pollingInterval)
    }

    // 记录轮询开始时间
    const startTime = Date.now()
    setPollingStartTime(startTime)

    // 开始轮询，每隔3秒查询一次
    const interval = setInterval(async () => {
      try {
        // 检查轮询是否超过时长
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        if (elapsed >= pollingDuration) {
          // 轮询时长已到，停止轮询
          clearInterval(interval)
          setPollingInterval(null)
          setPollingStartTime(null)
          return
        }

        const response = await HomeApi.queryPayInfo(payInfoId)
        const responseData = response.data as any

        if (responseData.code === '00000' && responseData.data) {
          const status = responseData.data

          if (status === 'SUCCESS') {
            // 支付成功，停止轮询并设置状态，不跳转
            clearInterval(interval)
            setPollingInterval(null)
            setPollingStartTime(null)
            setSuccessType(true)
          } else if (status === 'PROGRESS') {
            // 支付进行中，只有在倒计时未到期时才取消重新获取二维码的状态
            // 如果倒计时已到期，保持需要重新获取二维码的状态
            if (!timeExpiredRef.current) {
              setNeedRefreshQrCode(false)
            }
          } else {
            setNeedRefreshQrCode(true)
            clearInterval(interval)
            setPollingInterval(null)
            setPollingStartTime(null)
          }
        }
      } catch (error) {
        console.error('查询支付状态失败:', error)
        // 终止轮询
        clearInterval(interval)
        setPollingInterval(null)
        setPollingStartTime(null)
      }
    }, 3000) // 每3秒轮询一次

    setPollingInterval(interval)

    // 清理函数：组件卸载或依赖变化时清除定时器
    return () => {
      if (interval) {
        clearInterval(interval)
      }
      setPollingStartTime(null)
    }
  }, [qrCodeUrl, qrCodeText, payInfoId, qrCodeLoading, navigate, pollingDuration])

  // 清理轮询：当切换支付方式或组件卸载时
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [selectedPaymentOption])

  // 同步 timeExpired 状态到 ref
  useEffect(() => {
    timeExpiredRef.current = timeExpired
  }, [timeExpired])

  // 倒计时到期后的处理：只标记超时、展示重新获取二维码，不停止轮询
  const handleCountdownExpire = useCallback(() => {
    setTimeExpired(true)
    timeExpiredRef.current = true
    setNeedRefreshQrCode(true)
    // 不再停止轮询，让轮询继续运行直到轮询时长到期
  }, [])

  // 支付选项（由后端返回的 payType 控制显示：ALL-三种都有，CREDIT-只有信用卡，PAY-只有微信/支付宝）
  const paymentOptions = useMemo(() => {
    const allOptions = [
      {
        image: '/image/home/icon/card.png',
        title: t('信用卡'),
        type: 'creditCard',
        selectedImage: '/image/home/icon/cardActive.png',
      },
      {
        image: '/image/home/icon/wechat.png',
        title: t('微信支付'),
        type: 'wechatPay',
        selectedImage: '/image/home/icon/wechatActive.png',
      },
      {
        image: '/image/home/icon/alipay.png',
        title: t('支付宝'),
        type: 'alipay',
        selectedImage: '/image/home/icon/alipayActive.png',
      },
    ] as const

    const payType = orderInfo?.payType

    if (payType === 'CREDIT') {
      // 只有信用卡
      return allOptions.filter(item => item.type === 'creditCard')
    }

    if (payType === 'PAY') {
      // 只有微信 + 支付宝
      return allOptions.filter(item => item.type === 'wechatPay' || item.type === 'alipay')
    }

    // 默认 ALL 或未知值时，展示全部
    return allOptions
  }, [t, orderInfo?.payType])

  // 当后端限制支付方式后，如果当前选中的方式不在可选列表里，就自动切到第一个可选项
  useEffect(() => {
    if (!paymentOptions.length) return
    const exist = paymentOptions.some(item => item.type === selectedPaymentOption)
    if (!exist) {
      setSelectedPaymentOption(paymentOptions[0].type)
    }
  }, [paymentOptions, selectedPaymentOption])

  // 当订单信息更新时，如果订单状态已经满足成功条件，同步更新 successType
  useEffect(() => {
    if (!orderInfo) return
    // 如果已经手动设置过成功状态，不再自动更新
    if (successType !== null) return

    // 根据订单状态自动设置成功类型
    if (orderInfo.payType === 'ALL' && (orderInfo.isGuarantee || orderInfo.payState == 'SUCCESS')) {
      setSuccessType(orderInfo.payState == 'SUCCESS')
    } else if (orderInfo.payType === 'CREDIT' && orderInfo.isGuarantee) {
      setSuccessType(false)
    } else if (orderInfo.payType === 'PAY' && orderInfo.payState == 'SUCCESS') {
      setSuccessType(true)
    }
  }, [orderInfo, successType])
  // 如果没有有效参数，显示其他内容
  if (!hasValidParams && !loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-[24rem] font-bold mb-[20rem]">{t('支付链接不存在或已过期')}</div>
          <div className="text-[16rem] text-gray-400">{t('请检查链接是否正确')}</div>
        </div>
        <Footer />
      </div>
    )
  }

  // 加载中状态
  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Spin size="large" />
            <div className="mt-[20rem] text-[14rem] text-gray-400">{t('加载中...')}</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }
  // 验证是否显示右侧内容，返回是否显示和成功类型
  const getSuccessInfo = (hotelInfo: QueryOrderInfoRes['data']) => {
    // 如果手动设置了成功状态，优先使用
    if (successType !== null) {
      return { show: true, isPaymentSuccess: successType }
    }

    // 否则根据订单状态判断
    if (hotelInfo.payType === 'ALL' && (hotelInfo.isGuarantee || hotelInfo.payState == 'SUCCESS')) {
      return { show: true, isPaymentSuccess: hotelInfo.payState == 'SUCCESS' }
    }
    if (hotelInfo.payType === 'CREDIT' && hotelInfo.isGuarantee) {
      return { show: true, isPaymentSuccess: false }
    }
    if (hotelInfo.payType === 'PAY' && hotelInfo.payState == 'SUCCESS') {
      return { show: true, isPaymentSuccess: true }
    }
    return { show: false, isPaymentSuccess: false }
  }

  const successInfo = orderInfo
    ? getSuccessInfo(orderInfo)
    : { show: false, isPaymentSuccess: false }
  return (
    <div className=" w-full min-h-screen flex flex-col ">
      {messageContextHolder}
      <Header />
      <div className="w-full flex-1 flex flex-col">
        <div className=" w-full flex gap-[1%]  justify-between">
          {/* 抽离后的酒店信息卡片 - 只在有订单信息且未过期时显示 */}
          {orderInfo && !timeExpired && (
            <HotelInfoCard 
              selectType={selectedPaymentOption}
              orderInfo={orderInfo}
              formatDate={formatDate}
            />
          )}
          <div className="flex-1 flex-col flex border-[1px] pb-[18rem] border-solid rounded-[12rem] overflow-hidden border-gray-300   ">
            {!successInfo.show && !timeExpired && (
              <>
                {/* 安全担保支付 */}
                <div className="w-full  bg-[#dfffdf]  py-[10rem]   flex justify-center items-center mb-[20rem">
                <div className='flex flex-col'>
                  <div className='flex items-center justify-center'>  <img
                    src="/image/home/Frame4.png"
                    alt=""
                    className="w-[20rem] h-[20rem] mr-[10rem]"
                  />
                  <div className="text-[16rem] font-bold tracking-[1rem] text-center text-[#1aad19]">
                    {t('安全担保支付')}
                  </div>
                  </div>
                  {/* 只有在订单未支付且未担保时才显示倒计时 */}
                  {orderInfo?.payState !== 'SUCCESS' && !orderInfo?.isGuarantee && (
                    <div className='text-[14rem] text-red-400 font-bold'>
                      <PaymentCountdown
                        createdTime={orderInfo?.createdTime || null}
                        duration={countdownDuration}
                        t={t}
                        onExpire={handleCountdownExpire}
                      />
                    </div>
                  )}
                </div>
                </div>
                <div className="px-[25rem]">
                  {/* 文本 */}
                  <div className="w-full  flex-col flex py-[20rem]">
                    <div className="text-[16rem] font-bold tracking-[2rem] text-center text-[#1677FF]">
                      {t('完成您的预订支付')}
                    </div>
                    <div className="text-[13rem] tracking-[1rem] text-center ">
                      {t('体验最可靠的酒店直连支付网关，官方认证，安全无忧')}
                    </div>
                  </div>
                  {/* 支付选项 */}
                  <div
                    className={`grid grid-cols-${paymentOptions.length} gap-[20rem]  mb-[10rem] border-b-[1rem] pb-[40rem] `}
                  >
                    {paymentOptions.map((item, index) => {
                      return (
                        <div
                          onClick={() => setSelectedPaymentOption(item.type)}
                          key={index}
                          className={`w-full cursor-pointer flex flex-col justify-center items-center py-[8rem]  rounded-[8px] transition-all transform ${
                            item.type === selectedPaymentOption
                              ? 'bg-[white]  border-[1px] border-gray-900 scale-[1.03] shadow-lg'
                              : 'bg-[white] border-[1px] border-gray-300 scale-[0.98] hover:scale-[1.01] hover:shadow-md'
                          }`}
                        >
                          <img
                            src={
                              // selectedImage
                              item.type === selectedPaymentOption ? item.image : item.image
                            }
                            alt=""
                            className={`w-[32rem] h-[32rem] object-cover mb-[8rem] transition-opacity ${
                              item.type === selectedPaymentOption
                                ? 'opacity-100'
                                : 'opacity-60 group-hover:opacity-80'
                            }`}
                          />
                          <span
                            className={`text-[14rem]  transition-colors ${
                              item.type === selectedPaymentOption
                                ? 'text-gray-500 text-[16rem]  font-bold'
                                : 'text-gray-500'
                            }`}
                          >
                            {item.title}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  {/* 支付主体区域（不再因为超时而整体隐藏） */}
                  <div className="border-b-[1px] border-solid border-gray-300 pt-[20rem] pb-[20rem]">
                    {/* 信用卡表单（带动效） */}
                    <div
                      className={`transition-all duration-1000 ease-out transform ${
                        selectedPaymentOption === 'creditCard' && !orderInfo?.isGuarantee
                          ? 'opacity-100 translate-y-0 max-h-[1200rem]'
                          : 'opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none'
                      }`}
                    >
                      <div>
                        {selectedPaymentOption === 'creditCard' && !orderInfo?.isGuarantee && (
                        <div>
                           <CreditCardForm
                            control={control}
                            register={register}
                            errors={errors}
                            t={t}
                            onSubmit={onSubmit}
                          />
                          <div className='text-[14rem] text-gray-400 mt-[20rem]'>
                            {/* 勾选 */}
                            <div className='flex flex-col gap-[8rem]'>
                              <div className='flex items-start'>
                                <input 
                                  type="checkbox" 
                                  className='w-[20rem] h-[20rem] cursor-pointer mt-[3rem]' 
                                  checked={isAgreementChecked}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    setIsAgreementChecked(checked)
                                    if (checked) {
                                      setShowAgreementError(false)
                                    }
                                  }}
                                />
                                <div className='text-[14rem] text-gray-400 ml-[10rem]'>
                                  {t('我证明所有信息完整准确。我特此授权酒店收取本表格所示的所有费用。我同意按上述指示进行一次性或定期收费。我同意我对本账单的责任不予免除，并同意在所示个人或公司未能支付部分或全部费用时承担个人责任。')}
                                </div>
                              </div>
                              {showAgreementError && !isAgreementChecked && (
                                <div className='text-[12rem] text-[#f65353] ml-[22rem]'>
                                  {t('请先勾选同意以上声明')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                         
                        )}
                      </div>
                    </div>

                    {/* 信用卡已担保提示（带动效） */}
                    <div
                      className={`transition-all duration-1000 ease-out transform ${
                        selectedPaymentOption === 'creditCard' && orderInfo?.isGuarantee
                          ? 'opacity-100 translate-y-0 max-h-[200rem]'
                          : 'opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none'
                      }`}
                    >
                      <div>
                        {selectedPaymentOption === 'creditCard' && orderInfo?.isGuarantee && (
                          <div className="w-full flex justify-center items-center flex-col">
                            <div className="text-[14rem] text-gray-400">
                              {t('您已提交担保信用卡，请等待酒店确认')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 微信支付：显示二维码 */}
                    <div
                      className={`transition-all duration-1000 ease-out transform ${
                        selectedPaymentOption === 'wechatPay' && orderInfo?.payState != 'SUCCESS'
                          ? 'opacity-100 translate-y-0 max-h-[1200rem]'
                          : 'opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none'
                      }`}
                    >
                      {selectedPaymentOption === 'wechatPay' &&
                        orderInfo?.payState != 'SUCCESS' && (
                          <div className="w-full flex justify-center items-center flex-col">
                            <div className=" w-[200rem] h-[200rem]  border-[1px] border-solid border-gray-300 flex justify-center items-center relative">
                              {qrCodeLoading ? (
                                <Spin size="large" />
                              ) : qrCodeText ? (
                                <>
                                  <Space
                                    direction="vertical"
                                    align="center"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <QRCode value={qrCodeText || '-'} size={200} />
                                  </Space>
                                  {needRefreshQrCode && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
                                      <div className="text-white text-[14rem] mb-[10rem] text-center px-[20rem]">
                                        {t('二维码已过期，请重新获取')}
                                      </div>
                                      <Button
                                        type="primary"
                                        size="small"
                                        onClick={async () => {
                                          const success = await fetchQrCode()
                                          if (success) {
                                            messageApi.success(t('二维码已更新'))
                                          }
                                        }}
                                        className="h-[30rem] text-[12rem]"
                                      >
                                        {t('重新获取二维码')}
                                      </Button>
                                    </div>
                                  )}
                                </>
                              ) : qrCodeUrl ? (
                                <>
                                  <img
                                    src={qrCodeUrl}
                                    alt={t('支付二维码')}
                                    className="w-full h-full object-contain"
                                  />
                                  {needRefreshQrCode && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
                                      <div className="text-white text-[14rem] mb-[10rem] text-center px-[20rem]">
                                        {t('二维码已过期，请重新获取')}
                                      </div>
                                      <Button
                                        type="primary"
                                        size="small"
                                        onClick={async () => {
                                          const success = await fetchQrCode()
                                          if (success) {
                                            messageApi.success(t('二维码已更新'))
                                          }
                                        }}
                                        className="h-[30rem] text-[12rem]"
                                      >
                                        {t('重新获取二维码')}
                                      </Button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="text-[14rem] text-gray-400">
                                  {t('加载二维码中...')}
                                </div>
                              )}
                            </div>
                            <div className="w-[100%] h-[50rem] flex justify-center items-center">
                              <img
                                className="h-[30rem] mr-[10rem]"
                                src="/image/scanCode.png"
                                alt=""
                              />
                              <div>
                                {t('打开')}{' '}
                                <span className="text-[#1aad19] font-bold">{t('微信')}</span>{' '}
                                {t('的')}{' '}
                                <span className="text-[#1aad19] font-bold">{t('扫一扫')}</span>
                              </div>
                            </div>
                            <div className="text-[14rem] tracking-[1rem] text-gray-400">
                              {t('扫描上方二维码进行支付')}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* 支付宝支付：显示跳转按钮 */}
                    <div
                      className={`transition-all duration-1000 ease-out transform ${
                        selectedPaymentOption === 'alipay' && orderInfo?.payState != 'SUCCESS'
                          ? 'opacity-100 translate-y-0 max-h-[800rem]'
                          : 'opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none'
                      }`}
                    >
                      {selectedPaymentOption === 'alipay' && orderInfo?.payState != 'SUCCESS' && (
                        <div className="w-full flex justify-center items-center flex-col">
                          {qrCodeLoading ? (
                            <div className="text-[14rem] text-gray-400">
                              <Spin size="small" className="mr-[10rem]" />
                              {t('加载支付链接中...')}
                            </div>
                          ) : qrCodeText ? (
                            <div className="w-full flex flex-col items-center relative">
                              <Button
                                type="primary"
                                size="large"
                                onClick={() => {
                                  if (!needRefreshQrCode) {
                                    window.open(qrCodeText, '_blank')
                                  }
                                }}
                                className="h-[50rem] text-[16rem] font-bold bg-[#0d99ff] border-[#0d99ff] hover:bg-[#0a7acc] hover:border-[#0a99ff]"
                                style={{
                                  minWidth: '200rem',
                                  opacity: needRefreshQrCode ? 0.6 : 1,
                                  cursor: needRefreshQrCode ? 'not-allowed' : 'pointer',
                                }}
                              >
                                {t('跳转到支付宝支付')}
                              </Button>
                              {needRefreshQrCode && (
                                <div className="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-90 rounded-[4rem]">
                                  <div className="text-[14rem] mb-[10rem] text-center px-[20rem] text-gray-600">
                                    {t('支付链接已过期，请重新获取')}
                                  </div>
                                  <Button
                                    type="primary"
                                    size="small"
                                    onClick={async () => {
                                      const success = await fetchQrCode()
                                      if (success) {
                                        messageApi.success(t('支付链接已更新'))
                                      }
                                    }}
                                    className="h-[30rem] text-[12rem] bg-[#0d99ff] border-[#0d99ff]"
                                  >
                                    {t('重新获取支付链接')}
                                  </Button>
                                </div>
                              )}
                              <div className="text-[14rem] tracking-[1rem] text-gray-400 mt-[20rem]">
                                {t('点击上方按钮跳转到支付宝完成支付')}
                              </div>
                            </div>
                          ) : (
                            <div className="text-[14rem] text-gray-400">
                              {t('加载支付链接中...')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 显示已支付的文案 */}
                    <div
                      className={`transition-all duration-300 ease-out transform ${
                        (selectedPaymentOption === 'wechatPay' ||
                          selectedPaymentOption === 'alipay') &&
                        orderInfo?.payState == 'SUCCESS'
                          ? 'opacity-100 translate-y-0 max-h-[200rem]'
                          : 'opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none'
                      }`}
                    >
                      {(selectedPaymentOption === 'wechatPay' ||
                        selectedPaymentOption === 'alipay') &&
                        orderInfo?.payState == 'SUCCESS' && (
                          <div className="text-[14rem] text-gray-400">{t('您已支付成功')}</div>
                        )}
                    </div>
                  </div>
                  {/* 时间已过期文案（暂时隐藏，仅保留代码方便以后开启） */}
                  {false && timeExpired && (
                    <div className="  flex flex-col mt-[20rem] ">
                      <div className="text-[16rem] font-bold tracking-[1rem]  ">
                        {t('直付链接已过期')}
                      </div>
                      <div className="text-[14rem] mt-[10rem] tracking-[1rem] text-gray-400">
                        {t(
                          '出于安全原因，直付链接已过期。您可以在下面请求新链接。您将收到一封包含新直付链接的电子邮件。'
                        )}
                      </div>
                    </div>
                  )}
                  {/* 担保说明||全额手续费说明 */}
                  <div className=" flex flex-col mt-[20rem]">
                    <div className="text-[20rem] font-bold tracking-[1rem] ">
                      {selectedPaymentOption === 'creditCard' ? t('担保说明') : t('全额手续费说明')}
                    </div>
                    <div className="text-[14rem] tracking-[1rem] text-gray-400 my-[10rem]">
                      {selectedPaymentOption === 'creditCard'
                        ? t(
                            '信用卡登记仅作担保之用，实际付款需到现场办理。为了验证您的信用卡，您的对账单上可能会有1美元的临时授权。这笔款项授权作为验证信用卡真实性将立即被退回。请放心，您不会被收取任何费用。'
                          )
                        : t(
                            '鉴于全球电子支付系统的跨域支付，如果您使用微信（支付宝），将会收取（10%）的手续费，请知悉！'
                          )}
                    </div>
                  </div>
                  {/* 支付说明+支付 */}
                  <div className=" flex  justify-between mt-[20rem] ">
                    {/* 左侧说明 */}
                    <div className=" flex-1 flex flex-col">
                      <div className="flex justify-start text-[#1aad19] font-bold tracking-[1rem] text-[14rem]  items-center">
                        <img
                          className="w-[20rem] h-[20rem]"
                          src="/image/home/icon/payIcon.png"
                          alt=""
                        />
                        <div className="ml-[10rem]">{t('您的支付信息收到加密保护')}</div>
                      </div>
                      <div className=" mt-[10rem] flex flex-col">
                        <div className="text-[14rem] tracking-[1rem] text-gray-400">
                          {t('支持的支付方式')}
                        </div>
                        <div className="flex  justify-start mt-[10rem]  flex-wrap">
                          {Object.keys(payIconList).map((item: string, index: number) => {
                            return (
                              <div key={index} className="w-[30rem]  mr-[10rem] mb-[10rem]">
                                <img
                                  className="w-[30rem] "
                                  src={payIconList[item as keyof typeof payIconList]}
                                  alt=""
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    {/* 右侧支付 */}
                    <div className=" w-[250rem] flex flex-col">
                      {/* 信用卡不显示倒计时，只显示按钮；微信/支付宝支付显示倒计时 + 按钮 */}
                      {(selectedPaymentOption === 'wechatPay' ||
                        selectedPaymentOption === 'alipay') &&
                        orderInfo?.payState != 'SUCCESS' &&
                        createdTime && (
                          <CountdownTimer
                            createdTime={createdTime}
                            duration={countdownDuration}
                            label={t('支付剩余时间')}
                            onExpire={handleCountdownExpire}
                          />
                        )}
                      {/* 信用卡按钮（只负责担保提交） */}
                      {selectedPaymentOption === 'creditCard' && (
                        <div
                          className={`text-[14rem] flex cursor-pointer text-[white] justify-center items-center px-[20rem] py-[10rem] tracking-[1rem] bg-[#272727] hover:bg-[#3a3a3a] transition-colors ${
                            isGuaranteeLoading ? 'cursor-not-allowed opacity-75' : ''
                          }`}
                          onClick={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()

                            // 如果正在加载中，不允许重复点击
                            if (isGuaranteeLoading) {
                              return
                            }

                            // 检查是否已勾选协议
                            if (!isAgreementChecked) {
                              setShowAgreementError(true)
                              return
                            }
                           
                            // 设置 loading 状态
                            setIsGuaranteeLoading(true)

                            try {
                              // 延迟3秒
                              await new Promise(resolve => setTimeout(resolve, 3000))

                              // 先出发表单提交
                              await onSubmit()

                              const updatedOrderInfo = await fetchOrderInfoData(false)
                              if (updatedOrderInfo) {
                                if (updatedOrderInfo.isGuarantee) {
                                  // messageApi.success(t('担保已完成！'))
                                } else {
                                  // messageApi.warning(t('担保尚未完成，请稍后再试'))
                                }
                              }
                            } catch (error) {
                              console.error('担保提交失败:', error)
                            } finally {
                              // 取消 loading 状态
                              setIsGuaranteeLoading(false)
                            }
                            // 先通过接口验证当前担保状态（担保成功时此区域不会显示，所以不需要检查）
                            // const updatedOrderInfo = await fetchOrderInfoData(false)
                            // if (updatedOrderInfo) {
                            //   // 如果已经担保成功，显示提示信息，状态会通过 useEffect 自动更新
                            //   if (updatedOrderInfo.isGuarantee) {
                            //     message.success(t('担保已完成！'))
                            //     // 订单状态会通过 useEffect 自动更新 successType
                            //   } else {
                            //     // 如果还没担保成功，触发表单提交
                            //     onSubmit()
                            // }
                            // } else {
                            //   message.error(t('获取订单信息失败，请重试'))
                            // }
                          }}
                        >
                          {isGuaranteeLoading ? (
                            <div className="flex items-center gap-[10rem]">
                              <Spin size="small" />
                              {/* <span>{t('处理中...')}</span> */}
                            </div>
                          ) : (
                            t('确认担保')
                          )}
                        </div>
                      )}

                      {/* 微信 / 支付宝按钮（只负责扫码支付"我已完成"确认） */}
                      {selectedPaymentOption !== 'creditCard' && (
                        <div
                          className=" text-[14rem] flex cursor-pointer  text-[white]  justify-center items-center px-[20rem] py-[10rem] tracking-[1rem] bg-[#272727]  "
                          onClick={async () => {
                            // 直接请求验证支付状态（支付成功时此区域不会显示，所以不需要检查）
                            const updatedOrderInfo = await fetchOrderInfoData(false)
                            if (updatedOrderInfo) {
                              // 根据获取到的订单信息验证支付状态
                              if (updatedOrderInfo.payState === 'SUCCESS') {
                                messageApi.success(t('支付完成！'))
                                // 订单状态会通过 useEffect 自动更新 successType
                              } else {
                                messageApi.warning(t('支付尚未完成，请稍后再试'))
                              }
                            } else {
                              messageApi.error(t('获取订单信息失败，请重试'))
                            }
                          }}
                        >
                          {t('我已完成')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* 显示支付/提交成功 */}
            {successInfo.show && (
              <PaymentSuccessCard isPaymentSuccess={successInfo.isPaymentSuccess} />
            )}
            {/* 显示倒计时到期 - 只有在订单未支付且未担保时才显示 */}
            {timeExpired && !successInfo.show && orderInfo?.payState !== 'SUCCESS' && !orderInfo?.isGuarantee && (
              <CountdownExpiredCard />
            )}
          </div>
        </div>
        {/* 3列 */}
        <div className="w-full min-h-[220rem]  grid grid-cols-3 gap-[1%] mt-[30rem] mb-[50rem] ">
          {showImageList.map((item, index) => (
            <AdvantageCard key={index} item={item as any} />
          ))}
        </div>
      </div>
      {/* footer */}
      <Footer />
    </div>
  )
}
