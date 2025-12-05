// 移动端首页
import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import { Input, Select, Button, message, Spin, QRCode, Space } from 'antd'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HomeApi from '@/api/home'
import { QueryOrderInfoRes } from '@/api/types/home'
import { useAppStore } from '@/store/storeZustand'
import { PaymentSuccessCard } from '@/pages/HomeManager/home/components/PaymentSuccessCard'
import { CreditCardForm } from '@/pages/HomeManager/home/components/CreditCardForm'
import { AdvantageCard } from '@/pages/HomeManager/home/components/AdvantageCard'

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
      .regex(/^\d{3}$/, t('请输入3位安全码'))
  })
}

const payIconList = {
  Visa: '/image/home/payIcon/Visa.png',
  Mastercard: '/image/home/payIcon/Mastercard.png',
  Amex: '/image/home/payIcon/Amex.png',
  Unionpay: '/image/home/payIcon/UnionPay.png',
  Dinersclub: '/image/home/payIcon/DinersClub.png',
  JCB: '/image/home/payIcon/JCB.png',
}

// 格式化倒计时显示（秒数转换为 MM:SS）
const formatCountdown = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds || 0)
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

// 倒计时组件
interface CountdownTimerProps {
  createdTime: string
  duration?: number
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
  const calcRemaining = useCallback(() => {
    if (!createdTime) return 0
    const now = Date.now()
    const created = new Date(createdTime).getTime()
    const elapsed = Math.floor((now - created) / 1000)
    return Math.max(0, duration - elapsed)
  }, [createdTime, duration])

  const [remaining, setRemaining] = useState<number>(() => calcRemaining())

  useEffect(() => {
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
      className={`tracking-[1rem] flex justify-center items-center text-[14rem] w-full py-[10rem] px-[20rem] bg-[#ffe4e4] text-[#f65353] ${className}`}
    >
      {label} {remaining > 0 ? formatCountdown(remaining) : '00:00'}
    </div>
  )
}

const MobileHome = () => {
  // 使用翻译
  const { t } = useTranslation()

  // 获取全局语言状态和方法
  const { language: globalLanguage, setLanguage } = useAppStore()

  // 获取路径参数（格式：/:language/:encodeOrderNo）
  const params = useParams<{ language?: string; encodeOrderNo?: string }>()

  // 验证语言代码必须是 zh-CN 或 en-US
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

  // 用 ref 记录"本页当前实际使用的语言"和订单号
  const pageLanguageRef = useRef<string | null>(null)
  const pageOrderNoRef = useRef<string | null | undefined>(null)

  // 动态创建 Schema（支持翻译）
  const paymentFormSchema = useMemo(() => createPaymentFormSchema(t), [t])

  // 提取获取订单信息的公共函数
  const fetchOrderInfoData = useCallback(
    async (showLoading = true) => {
      const requestLanguageCode = globalLanguage

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
        const responseData = response.data as any
        console.log('✅ 订单信息响应:', responseData)

        if (responseData.code == '00000') {
          const orderData = responseData?.data || responseData?.data?.data
          if (orderData) {
            setOrderInfo(orderData as QueryOrderInfoRes['data'])
            return orderData as QueryOrderInfoRes['data']
          } else {
            if (showLoading) {
              message.error(t('获取订单信息失败，请检查链接是否正确'))
            }
            setHasValidParams(false)
            return null
          }
        } else {
          if (showLoading) {
            message.error(responseData.message)
          }
          setHasValidParams(false)
          return null
        }
      } catch (error) {
        console.error('❌ 获取订单信息失败:', error)
        if (showLoading) {
          setHasValidParams(false)
        }
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
  // 只在 URL 语言变化时同步，不会在手动切换语言时把全局语言"改回去"
  useEffect(() => {
    if (languageCode && languageCode !== globalLanguage) {
      setLanguage(languageCode)
    }
  }, [languageCode, setLanguage])

  // 获取订单信息
  useEffect(() => {
    const currentLanguage = globalLanguage

    if (pageLanguageRef.current === currentLanguage && pageOrderNoRef.current === encodeOrderNo) {
      return
    }

    pageLanguageRef.current = currentLanguage
    pageOrderNoRef.current = encodeOrderNo

    fetchOrderInfoData(true)
  }, [languageCode, globalLanguage, encodeOrderNo, fetchOrderInfoData])

  // 使用 React Hook Form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
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
      setPaymentData(values)

      console.log('表单提交:', values)

      if (!orderInfo?.orderNo) {
        message.error(t('订单信息不存在，请刷新页面重试'))
        return
      }

      const cardNumber = values.cardNumber.replace(/\s/g, '')
      const cardCode = values.cardType

      const response = await HomeApi.submitCreditCard({
        orderNo: orderInfo.orderNo,
        cardCode: cardCode,
        cardNumber: cardNumber,
        expireDate: values.expiryDate,
        cardSecurityCode: values.cvv || undefined,
        encodeLinkNo:encodeOrderNo as string
      })

      const responseData = response.data as any
      if (responseData.code === '00000') {
        const updatedOrderInfo = await fetchOrderInfoData(false)
        if (updatedOrderInfo) {
          if (updatedOrderInfo.isGuarantee) {
            message.success(t('支付信息提交成功！'))
          } else {
            message.warning(t('担保信息尚未生效，请稍后再试'))
          }
        } else {
          message.error(t('获取订单信息失败，请重试'))
        }
      } else {
        message.error(responseData.message || t('支付提交失败，请重试'))
      }
    } catch (error: any) {
      console.error('支付提交失败:', error)
      message.error(error?.message || t('支付提交失败，请重试'))
    } finally {
      setIsSubmitting(false)
    }
  })

  // 表单数据状态
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  // 二维码相关状态
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [qrCodeText, setQrCodeText] = useState<string>('')
  const [qrCodeLoading, setQrCodeLoading] = useState<boolean>(false)
  // 支付信息ID和轮询相关状态
  const [payInfoId, setPayInfoId] = useState<number | null>(null)
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(null)
  const [needRefreshQrCode, setNeedRefreshQrCode] = useState<boolean>(false)
  // 倒计时相关状态（仅保存创建时间，具体倒计时在子组件中处理）
  const [createdTime, setCreatedTime] = useState<string | null>(null)
  // 轮询开始时间，用于计算轮询是否超时
  const [pollingStartTime, setPollingStartTime] = useState<number | null>(null)

  // 提取获取二维码的公共函数
  const fetchQrCode = useCallback(async () => {
    if (!orderInfo?.orderNo) return
    if(orderInfo?.payState=='SUCCESS'){return}
    setQrCodeLoading(true)
    setQrCodeUrl('')
    setQrCodeText('')

    try {
      const payChannel = selectedPaymentOption === 'wechatPay' ? 'WX_PAY' : 'ALI_PAY'
      const response = await HomeApi.createPayInfo({
        orderNo: orderInfo.orderNo,
        payChannel: payChannel,
        encodeLinkNo:encodeOrderNo as string
      })

      const responseData = response.data as any
      if (responseData.code === '00000' && responseData.data?.payBody) {
        if (responseData.data.payInfoId) {
          setPayInfoId(responseData.data.payInfoId)
        }
        if (responseData.data.createdTime) {
          setCreatedTime(responseData.data.createdTime)
        }
        const payBody = responseData.data.payBody
        if (
          payBody.startsWith('data:image') ||
          payBody.startsWith('/9j/') ||
          payBody.startsWith('iVBORw0KGgo')
        ) {
          const qrUrl = payBody.startsWith('data:') ? payBody : `data:image/png;base64,${payBody}`
          setQrCodeUrl(qrUrl)
          setQrCodeText('')
        } else {
          setQrCodeText(payBody)
          setQrCodeUrl('')
        }
        // 重置需要刷新二维码的状态
        setNeedRefreshQrCode(false)
        // 重置超时状态
        setTimeExpired(false)
        timeExpiredRef.current = false
        return true
      } else {
        message.error(responseData.message || t('获取支付二维码失败'))
        return false
      }
    } catch (error: any) {
      console.error('获取支付二维码失败:', error)
      message.error(error?.message || t('获取支付二维码失败，请重试'))
      return false
    } finally {
      setQrCodeLoading(false)
    }
  }, [orderInfo?.orderNo, selectedPaymentOption, t])

  // 切换支付方式时调用支付接口获取二维码
  useEffect(() => {
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

  // 计算倒计时时长（秒）
  const countdownDuration = useMemo(() => {
    return import.meta.env.MODE === 'production' ? 1800 : 30
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
  }, [qrCodeUrl, qrCodeText, payInfoId, qrCodeLoading, pollingDuration])

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

  // 支付选项（由后端返回的 payType 控制显示）
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
      return allOptions.filter(item => item.type === 'creditCard')
    }

    if (payType === 'PAY') {
      return allOptions.filter(item => item.type === 'wechatPay' || item.type === 'alipay')
    }

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
    if (successType !== null) return

    if (orderInfo.payType === 'ALL' && (orderInfo.isGuarantee || orderInfo.payState == 'SUCCESS')) {
      setSuccessType(orderInfo.payState == 'SUCCESS')
    } else if (orderInfo.payType === 'CREDIT' && orderInfo.isGuarantee) {
      setSuccessType(false)
    } else if (orderInfo.payType === 'PAY' && orderInfo.payState == 'SUCCESS') {
      setSuccessType(true)
    }
  }, [orderInfo, successType])

  // 验证是否显示右侧内容，返回是否显示和成功类型
  const getSuccessInfo = (hotelInfo: QueryOrderInfoRes['data']) => {
    if (successType !== null) {
      return { show: true, isPaymentSuccess: successType }
    }

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

  const successInfo = orderInfo ? getSuccessInfo(orderInfo) : { show: false, isPaymentSuccess: false }

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }

  // 如果没有有效参数，显示其他内容
  if (!hasValidParams && !loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-[24rem] font-bold mb-[20rem]">{t('页面不存在')}</div>
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

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="w-full flex-1 flex flex-col bg-gray-50">
        {/* 移动端头部 */}
        <div className="w-full bg-[#dfffdf] py-[10rem] flex justify-center items-center mb-[20rem]">
          <img src="/image/home/Frame4.png" alt="" className="w-[20rem] h-[20rem] mr-[10rem]" />
          <div className="text-[16rem] font-bold text-center text-[#1aad19]">{t('安全担保支付')}</div>
        </div>

        <div className="flex-1 px-[20rem] pb-[20rem]">
          {/* 酒店信息卡片 */}
          {orderInfo && (
            <div className="w-full border-[1px] border-solid border-gray-300 mb-[20rem] bg-white">
              <div className="w-full min-h-[120rem]">
                <img
                  src={orderInfo?.hotelThumbnail || '/image/home/home1.png'}
                  alt={orderInfo?.hotelName || ''}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-[20rem]">
                {/* 酒店信息 */}
                <div className="text-[14rem] flex-col flex mb-[20rem] border-b-[1rem] border-solid border-gray-300 pb-[20rem]">
                  <div className="text-[18rem] mb-[5rem] tracking-[2rem] font-bold">
                    {orderInfo?.hotelName || t('酒店名称')}
                  </div>
                  <div className="text-[14rem] text-gray-400">{orderInfo?.hotelEnName || ''}</div>
                  {orderInfo?.hotelAddress && (
                    <div className="text-[14rem] text-gray-400">{orderInfo.hotelAddress}</div>
                  )}
                </div>
                {/* 入住信息 */}
                <div className="text-[14rem] flex-col flex">
                  <div className="text-[14rem] flex-col flex mb-[15rem]">
                    <div className="text-gray-400 mb-[5rem] tracking-[1rem]">{t('入住日期')}</div>
                    <div className="text-[18rem] font-bold tracking-[1rem]">
                      {orderInfo?.checkIn ? formatDate(orderInfo.checkIn) : '-'}
                    </div>
                  </div>
                  <div className="text-[14rem] flex-col flex mb-[15rem]">
                    <div className="text-gray-400 mb-[5rem] tracking-[1rem]">{t('离店日期')}</div>
                    <div className="text-[18rem] font-bold tracking-[1rem]">
                      {orderInfo?.checkOut ? formatDate(orderInfo.checkOut) : '-'}
                    </div>
                  </div>
                  {/* 入住人信息 */}
                  {orderInfo?.customerInfos?.map((item, index) => (
                    <div key={index} className="text-[14rem] flex-col flex mb-[15rem]">
                      <div className="text-gray-400 mb-[5rem] tracking-[1rem]">
                        {t('客人')} {index + 1}
                      </div>
                      <div className="text-[18rem] font-bold tracking-[1rem]">
                        {item.firstName} {item.lastName}
                      </div>
                    </div>
                  ))}
                  {/* 房型 */}
                  {orderInfo?.roomName && (
                    <div className="text-[14rem] flex flex-col mb-[15rem]">
                      <div className="text-gray-400 mb-[5rem] tracking-[1rem]">{t('房型')}</div>
                      <div className="text-[18rem] font-bold tracking-[1rem]">
                        {orderInfo.roomName} x{orderInfo.roomNum || 1}
                      </div>
                    </div>
                  )}
                  {/* 总价 */}
                  {orderInfo?.amount && (
                    <div className="text-[16rem] mb-[5rem] flex flex-col border-t-[1px] border-solid border-gray-300 pt-[20rem] mt-[20rem]">
                      <div className="flex justify-between mb-[5rem] font-bold tracking-[1rem]">
                        <div className="text-gray-400">{t('总价')}</div>
                        <div className="font-bold tracking-[1rem]">
                          {orderInfo.currency}
                          {orderInfo.amount}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 支付区域 */}
          {!successInfo.show && (
            <div className="w-full border-[1px] border-solid border-gray-300 bg-white p-[20rem] mt-[20rem]">
              {/* 文本 */}
              <div className="w-full flex-col flex py-[20rem]">
                <div className="text-[16rem] font-bold tracking-[2rem] text-center text-[#1677FF]">
                  {t('完成您的预订支付')}
                </div>
                <div className="text-[13rem] tracking-[1rem] text-center text-gray-400 mt-[10rem]">
                  {t('体验最可靠的酒店直连支付网关，官方认证，安全无忧')}
                </div>
              </div>

              {/* 支付选项 */}
              <div 
                className={`grid grid-cols-${paymentOptions.length} bg-[#f6f6f6] mb-[20rem]`}
              >
                {paymentOptions.map((item, index) => {
                  return (
                    <div
                      onClick={() => setSelectedPaymentOption(item.type)}
                      key={index}
                      className="w-full cursor-pointer flex flex-col justify-center items-center py-[15rem]"
                      style={{
                        backgroundColor:
                          item.type === selectedPaymentOption ? '#272727' : '#f6f6f6',
                        color: item.type === selectedPaymentOption ? '#fff' : '#bfbfbf',
                      }}
                    >
                      <img
                        src={item.type === selectedPaymentOption ? item.selectedImage : item.image}
                        alt=""
                        className="w-[20rem] h-[20rem] mb-[5rem] object-cover"
                      />
                      <span className="text-[12rem]">{item.title}</span>
                    </div>
                  )
                })}
              </div>

              {/* 支付主体区域 */}
              <div className="border-b-[1px] border-solid border-gray-300 pt-[20rem] pb-[20rem]">
                {/* 信用卡表单 */}
                {selectedPaymentOption === 'creditCard' && !orderInfo?.isGuarantee && (
                  <CreditCardForm
                    control={control}
                    register={register}
                    errors={errors}
                    t={t}
                    onSubmit={onSubmit}
                  />
                )}
                {selectedPaymentOption === 'creditCard' && orderInfo?.isGuarantee && (
                  <div className="w-full flex justify-center items-center flex-col">
                    <div className="text-[14rem] text-gray-400">
                      {t('您已提交担保信用卡，请等待酒店确认')}
                    </div>
                  </div>
                )}

                {/* 微信支付：显示二维码 */}
                {selectedPaymentOption === 'wechatPay' && orderInfo?.payState != 'SUCCESS' && (
                  <div className="w-full flex justify-center items-center flex-col">
                    <div className="w-[200rem] h-[200rem] border-[1px] border-solid border-gray-300 mb-[20rem] bg-white flex items-center justify-center relative">
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
                                    message.success(t('二维码已更新'))
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
                                    message.success(t('二维码已更新'))
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
                        <div className="text-[14rem] text-gray-400">{t('加载二维码中...')}</div>
                      )}
                    </div>
                    <div className="w-full h-[50rem] flex justify-center items-center mb-[10rem]">
                      <img
                        className="h-[30rem] mr-[10rem]"
                        src="/image/scanCode.png"
                        alt=""
                      />
                      <div className="text-[14rem]">
                        {t('打开')} <span className="text-[#1aad19] font-bold">{t('微信')}</span> {t('的')}{' '}
                        <span className="text-[#1aad19] font-bold">{t('扫一扫')}</span>
                      </div>
                    </div>
                    <div className="text-[14rem] tracking-[1rem] text-gray-400">
                      {t('扫描上方二维码进行支付')}
                    </div>
                  </div>
                )}

                {/* 支付宝支付：显示跳转按钮 */}
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
                          className="h-[50rem] text-[16rem] font-bold bg-[#0d99ff] border-[#0d99ff] hover:bg-[#0a7acc] hover:border-[#0a7acc]"
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
                                  message.success(t('支付链接已更新'))
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
                      <div className="text-[14rem] text-gray-400">{t('加载支付链接中...')}</div>
                    )}
                  </div>
                )}

                {/* 显示已支付的文案 */}
                {(selectedPaymentOption === 'wechatPay' || selectedPaymentOption === 'alipay') &&
                  orderInfo?.payState == 'SUCCESS' && (
                    <div className="text-[14rem] text-gray-400">{t('您已支付成功')}</div>
                  )}
              </div>

              {/* 担保说明||全额手续费说明 */}
              <div className="flex flex-col mt-[20rem]">
                <div className="text-[20rem] font-bold tracking-[1rem]">
                  {selectedPaymentOption === 'creditCard' ? t('担保说明') : t('全额手续费说明')}
                </div>
                <div className="text-[14rem] tracking-[1rem] text-gray-400 my-[10rem]">
                  {selectedPaymentOption === 'creditCard'
                    ? t('信用卡登记仅作担保之用，实际付款需到现场办理。为了验证您的信用卡，您的对账单上可能会有1美元的临时授权。这笔款项将立即被删除。你不会被收取任何费用。')
                    : t('鉴于全球电子支付系统的跨域支付，如果您使用微信（支付宝），将会收取（10%）的手续费，请知悉！')}
                </div>
              </div>

              {/* 支付说明+支付 */}
              <div className="flex flex-col mt-[20rem] gap-[15rem]">
                {/* 左侧说明 */}
                <div className="w-full flex flex-col">
                  <div className="flex justify-center text-[#1aad19] font-bold tracking-[1rem] text-[14rem] items-center mb-[10rem]">
                    <img
                      className="w-[20rem] h-[20rem]"
                      src="/image/home/icon/payIcon.png"
                      alt=""
                    />
                    <div className="ml-[10rem]">{t('您的支付信息收到加密保护')}</div>
                  </div>
                  <div className="mt-[10rem] flex flex-col">
                    <div className="text-[14rem] tracking-[1rem] text-gray-400">{t('支持的支付方式')}</div>
                    <div className="flex justify-start mt-[10rem] flex-wrap gap-[10rem]">
                      {Object.keys(payIconList).map((item: string, index: number) => {
                        return (
                          <div key={index} className="w-[30rem]">
                            <img
                              className="w-[30rem]"
                              src={payIconList[item as keyof typeof payIconList]}
                              alt=""
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* 右侧支付按钮 */}
                <div className="w-full flex flex-col gap-[10rem]">
                  {/* 倒计时 */}
                  {(selectedPaymentOption === 'wechatPay' || selectedPaymentOption === 'alipay') &&
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
                      className="flex text-[14rem] cursor-pointer text-white justify-center items-center px-[20rem] py-[10rem] tracking-[1rem] bg-[#272727] active:bg-[#1a1a1a]"
                      onClick={async () => {
                        // 先出发表单提交
                        await onSubmit()
                        
                        const updatedOrderInfo = await fetchOrderInfoData(false)
                        if (updatedOrderInfo) {
                          if (updatedOrderInfo.isGuarantee) {
                            message.success(t('担保已完成！'))
                          } else {
                            message.warning(t('担保尚未完成，请稍后再试'))
                          }
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
                        //   }
                        // } else {
                        //   message.error(t('获取订单信息失败，请重试'))
                        // }
                      }}
                    >
                      {t('确认担保')}
                    </div>
                  )}

                  {/* 微信 / 支付宝按钮（只负责扫码支付"我已完成"确认） */}
                  {selectedPaymentOption !== 'creditCard' && (
                    <div
                      className="flex text-[14rem] cursor-pointer text-white justify-center items-center px-[20rem] py-[10rem] tracking-[1rem] bg-[#272727] active:bg-[#1a1a1a]"
                      onClick={async () => {
                        // 直接请求验证支付状态（支付成功时此区域不会显示，所以不需要检查）
                        const updatedOrderInfo = await fetchOrderInfoData(false)
                        if (updatedOrderInfo) {
                          // 根据获取到的订单信息验证支付状态
                          if (updatedOrderInfo.payState === 'SUCCESS') {
                            message.success(t('支付完成！'))
                            // 订单状态会通过 useEffect 自动更新 successType
                          } else {
                            message.warning(t('支付尚未完成，请稍后再试'))
                          }
                        } else {
                          message.error(t('获取订单信息失败，请重试'))
                        }
                      }}
                    >
                      {t('我已完成')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 显示支付/提交成功 */}
          {successInfo.show && (
            <div className="w-full border-[1px] border-solid border-gray-300 bg-white p-[20rem] mt-[20rem]">
              <PaymentSuccessCard isPaymentSuccess={successInfo.isPaymentSuccess} />
            </div>
          )}

          {/* 3列展示 - 移动端改为单列 */}
          <div className="w-full flex flex-col gap-[20rem] mt-[30rem] mb-[50rem]">
            {showImageList.map((item, index) => (
              <AdvantageCard key={index} item={item as any} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MobileHome
