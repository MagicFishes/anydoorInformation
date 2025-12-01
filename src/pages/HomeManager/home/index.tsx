import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import { Input, Select, Button, message, Spin } from 'antd'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useNavigate } from 'react-router-dom'
import HomeApi from '@/api/home'
import { QueryOrderInfoRes, CreatePayInfoRes } from '@/api/types/home'
import { useAppStore } from '@/store/storeZustand'
import { updateLanguage } from '@/i18n'
import { HotelInfoCard } from './components/HotelInfoCard'
import { AdvantageCard } from './components/AdvantageCard'
import { CreditCardForm } from './components/CreditCardForm'

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
      .min(1, t('请输入安全码'))
      .regex(/^\d{3,4}$/, t('请输入3-4位数字')),
  })
}
// 支付方式图标
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
  duration = 600,
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

  // 获取全局语言状态和方法
  const { language: globalLanguage, setLanguage } = useAppStore()

  // 获取 URL 查询参数
  const [searchParams] = useSearchParams()
  // URL 格式: ?zh=en-US&encodeOrderNo=xxx 或 ?zh=zh-CN&encodeOrderNo=xxx
  const languageCodeParam = searchParams.get('zh')
  // 验证语言代码必须是 zh-CN 或 en-US
  const languageCode =
    languageCodeParam === 'zh-CN' || languageCodeParam === 'en-US' ? languageCodeParam : 'en-US'
  const encodeOrderNo = searchParams.get('encodeOrderNo')

  // 订单信息状态
  const [orderInfo, setOrderInfo] = useState<QueryOrderInfoRes['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasValidParams, setHasValidParams] = useState(false)

  // 根据 URL 参数更新全局语言（只在 URL 参数存在时更新，且只在首次加载或 URL 参数变化时更新）
  useEffect(() => {
    // 只有当 URL 参数存在且与当前全局语言不同时才更新
    // 这样可以避免用户手动切换语言后被 URL 参数覆盖
    if (languageCode && languageCode !== globalLanguage) {
      // 更新 Zustand store 中的语言（会自动同步更新 i18n）
      setLanguage(languageCode)
    }
  }, [languageCode])

  // 动态创建 Schema（支持翻译）
  const paymentFormSchema = useMemo(() => createPaymentFormSchema(t), [t])

  // 从 Schema 推断类型
  type PaymentFormData = z.infer<typeof paymentFormSchema>

  // 时间已过期
  const [timeExpired, setTimeExpired] = useState(false)

  // 获取订单信息
  useEffect(() => {
    const fetchOrderInfo = async () => {
      // 优先使用全局语言（用户切换后的语言），如果没有则使用 URL 参数中的语言
      const requestLanguageCode = globalLanguage || languageCode

      // 检查是否有必要的参数
      if (!requestLanguageCode || !encodeOrderNo) {
        setHasValidParams(false)
        setLoading(false)
        return
      }

      setHasValidParams(true)
      setLoading(true)

      try {
        const response = await HomeApi.queryOrderInfo(requestLanguageCode, encodeOrderNo)
        // response.data 可能是 ResponseType<QueryOrderInfoRes> 或直接是 QueryOrderInfoRes
        const responseData = response.data as any
        console.log('responseData', responseData)
        // 检查是否有返回数据
        if (responseData.code == '00000') {
          const orderData = responseData?.data || responseData?.data?.data
          if (orderData) {
            setOrderInfo(orderData as QueryOrderInfoRes['data'])
          } else {
            // 如果没有数据，也认为是失败
            message.error(t('获取订单信息失败，请检查链接是否正确'))
            setHasValidParams(false)
          }
        } else {
          message.error(responseData.message)
          setHasValidParams(false)
        }
      } catch (error) {
        setHasValidParams(false)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderInfo()
    // }, [languageCode, encodeOrderNo, t]) // 添加 globalLanguage 依赖，确保切换语言时重新请求
  }, [globalLanguage]) // 添加 globalLanguage 依赖，确保切换语言时重新请求
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

      // 这里可以调用支付接口
      // const response = await paymentApi.submitPayment(values)

      message.success(t('支付信息提交成功！'))
    } catch (error) {
      console.error('支付提交失败:', error)
      message.error(t('支付提交失败，请重试'))
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
  const [qrCodeLoading, setQrCodeLoading] = useState<boolean>(false)
  // 支付信息ID和轮询相关状态
  const [payInfoId, setPayInfoId] = useState<number | null>(null)
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(
    null
  )
  const [needRefreshQrCode, setNeedRefreshQrCode] = useState<boolean>(false)
  // 倒计时相关状态（仅保存创建时间，具体倒计时在子组件中处理）
  const [createdTime, setCreatedTime] = useState<string | null>(null)

  // 切换支付方式时调用支付接口获取二维码
  useEffect(() => {
    const fetchQrCode = async () => {
      // 只有在选择微信支付或支付宝时才调用接口
      if (
        (selectedPaymentOption === 'wechatPay' || selectedPaymentOption === 'alipay') &&
        orderInfo?.orderNo
      ) {
        setQrCodeLoading(true)
        setQrCodeUrl('') // 清空之前的二维码

        try {
          const payChannel = selectedPaymentOption === 'wechatPay' ? 'WX_PAY' : 'ALI_PAY'
          const response = await HomeApi.createPayInfo({
            orderNo: orderInfo.orderNo,
            payChannel: payChannel,
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
              const qrUrl = payBody.startsWith('data:')
                ? payBody
                : `data:image/png;base64,${payBody}`
              setQrCodeUrl(qrUrl)
            } else {
              // 如果是 URL，直接使用
              setQrCodeUrl(payBody)
            }
            // 重置需要刷新二维码的状态
            setNeedRefreshQrCode(false)
            // 重置超时状态
            setTimeExpired(false)
          } else {
            message.error(responseData.message || t('获取支付二维码失败'))
          }
        } catch (error: any) {
          console.error('获取支付二维码失败:', error)
          message.error(error?.message || t('获取支付二维码失败，请重试'))
        } finally {
          setQrCodeLoading(false)
        }
      } else {
        // 切换到信用卡支付时清空二维码和轮询、倒计时
        setQrCodeUrl('')
        setPayInfoId(null)
        setNeedRefreshQrCode(false)
        setCreatedTime(null)
        if (pollingInterval) {
          clearInterval(pollingInterval)
          setPollingInterval(null)
        }
      }
    }

    fetchQrCode()
  }, [selectedPaymentOption, orderInfo?.orderNo, t])

  // 轮询支付状态 - 暂时禁用自动轮询
  useEffect(() => {
    // 只有在二维码显示成功且有 payInfoId 时才开始轮询
    if (!qrCodeUrl || !payInfoId || qrCodeLoading) {
      return
    }

    // 如果已经有轮询在进行，先清除
    if (pollingInterval) {
      clearInterval(pollingInterval)
    }

    // 开始轮询，每隔3秒查询一次
    const interval = setInterval(async () => {
      try {
        const response = await HomeApi.queryPayInfo(payInfoId)
        const responseData = response.data as any

        if (responseData.code === '00000' && responseData.data) {
          const status = responseData.data

          if (status === 'SUCCESS') {
            // 支付成功，停止轮询并跳转
            clearInterval(interval)
            setPollingInterval(null)
            navigate('/CommonPage/payment-success')
          } else if (status === 'PROGRESS') {
            // 支付进行中，显示重新获取二维码的样式
            setNeedRefreshQrCode(false)
          } else {
            setNeedRefreshQrCode(true)
            clearInterval(interval)
          }
        }
      } catch (error) {
        console.error('查询支付状态失败:', error)
        // 终止轮询
        clearInterval(interval)
      }
    }, 3000) // 每3秒轮询一次

    setPollingInterval(interval)

    // 清理函数：组件卸载或依赖变化时清除定时器
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [qrCodeUrl, payInfoId, qrCodeLoading, navigate])

  // 清理轮询：当切换支付方式或组件卸载时
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [selectedPaymentOption])

  // 倒计时到期后的处理：标记超时、展示重新获取二维码、停止轮询
  const handleCountdownExpire = useCallback(() => {
    setTimeExpired(true)
    setNeedRefreshQrCode(true)
    if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }, [pollingInterval])

  // 支付选项
  const paymentOptions = useMemo(
    () => [
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
    ],
    [t]
  )
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

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }
  return (
    <div className=" w-full min-h-screen flex flex-col ">
      <Header />
      <div className="w-full flex-1 flex flex-col">
        <div className=" w-full flex gap-[1%]  justify-between">
          {/* 抽离后的酒店信息卡片 */}
          <HotelInfoCard orderInfo={orderInfo} formatDate={formatDate} />
          <div className="flex-1 flex-col flex border-[1px] pb-[18rem] border-solid border-gray-300  ">
            {/* 安全担保支付 */}
            <div className="w-full  bg-[#dfffdf]  py-[10rem]  flex justify-center items-center mb-[20rem">
              <img src="/image/home/Frame4.png" alt="" className="w-[20rem] h-[20rem] mr-[10rem]" />
              <div className="text-[16rem] font-bold tracking-[1rem] text-center text-[#1aad19]">
                {t('安全担保支付')}
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
              <div className="grid grid-cols-3 bg-[#f6f6f6] mb-[10rem] ">
                {paymentOptions.map((item, index) => {
                  return (
                    <div
                      onClick={() => setSelectedPaymentOption(item.type)}
                      key={index}
                      className="w-full cursor-pointer flex justify-center items-center h-[45rem]"
                      style={{
                        backgroundColor:
                          item.type === selectedPaymentOption ? '#272727' : '#f6f6f6',
                        color: item.type === selectedPaymentOption ? '#fff' : '#bfbfbf',
                      }}
                    >
                      <img
                        src={item.type === selectedPaymentOption ? item.selectedImage : item.image}
                        alt=""
                        className=" w-[20rem] object-cover"
                      />
                      {item.title}
                    </div>
                  )
                })}
              </div>
              {/* 支付主体区域（不再因为超时而整体隐藏） */}
              <div className="border-b-[1px] border-solid border-gray-300 pt-[20rem] pb-[20rem]">
                {/* 根据支付选项显示不同内容 */}
                {selectedPaymentOption === 'creditCard' && (
                  <CreditCardForm
                    control={control}
                    register={register}
                    errors={errors}
                    t={t}
                    onSubmit={onSubmit}
                  />
                )}
                {(selectedPaymentOption === 'wechatPay' || selectedPaymentOption === 'alipay') && (
                  <div className="w-full flex justify-center items-center flex-col">
                    <div className=" w-[200rem] h-[200rem]  border-[1px] border-solid border-gray-300 flex justify-center items-center relative">
                      {qrCodeLoading ? (
                        <Spin size="large" />
                      ) : qrCodeUrl ? (
                        <>
                          <img
                            src={qrCodeUrl}
                            // alt={t('支付二维码')}
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
                                  if (!orderInfo?.orderNo) return
                                  setQrCodeLoading(true)
                                  setNeedRefreshQrCode(false)
                                  try {
                                    const payChannel =
                                      selectedPaymentOption === 'wechatPay' ? 'WX_PAY' : 'ALI_PAY'
                                    const response = await HomeApi.createPayInfo({
                                      orderNo: orderInfo.orderNo,
                                      payChannel: payChannel,
                                    })
                                    const responseData = response.data as any
                                    if (
                                      responseData.code === '00000' &&
                                      responseData.data?.payBody
                                    ) {
                                      if (responseData.data.payInfoId) {
                                        setPayInfoId(responseData.data.payInfoId)
                                      }
                                      // 更新 createdTime
                                      if (responseData.data.createdTime) {
                                        setCreatedTime(responseData.data.createdTime)
                                      }
                                      const payBody = responseData.data.payBody
                                      if (
                                        payBody.startsWith('data:image') ||
                                        payBody.startsWith('/9j/') ||
                                        payBody.startsWith('iVBORw0KGgo')
                                      ) {
                                        const qrUrl = payBody.startsWith('data:')
                                          ? payBody
                                          : `data:image/png;base64,${payBody}`
                                        setQrCodeUrl(qrUrl)
                                      } else {
                                        setQrCodeUrl(payBody)
                                      }
                                      // 重置超时状态
                                      setTimeExpired(false)
                                      message.success(t('二维码已更新'))
                                    } else {
                                      message.error(responseData.message || t('获取支付二维码失败'))
                                    }
                                  } catch (error: any) {
                                    console.error('重新获取支付二维码失败:', error)
                                    message.error(error?.message || t('获取支付二维码失败，请重试'))
                                  } finally {
                                    setQrCodeLoading(false)
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
                    <div className="w-[100%] h-[50rem] flex justify-center items-center">
                      <img className="h-[30rem] mr-[10rem]" src="/image/scanCode.png" alt="" />
                      {selectedPaymentOption === 'wechatPay' && (
                        <div>
                          {t('打开')} <span className="text-[#1aad19] font-bold">{t('微信')}</span>{' '}
                          {t('的')} <span className="text-[#1aad19] font-bold">{t('扫一扫')}</span>
                        </div>
                      )}
                      {selectedPaymentOption === 'alipay' && (
                        <div>
                          {t('打开')}{' '}
                          <span className="text-[#0d99ff] font-bold">{t('支付宝')}</span> {t('的')}{' '}
                          <span className="text-[#0d99ff] font-bold">{t('扫一扫')}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-[14rem] tracking-[1rem] text-gray-400">
                      {t('扫描上方二维码进行支付')}
                    </div>
                  </div>
                )}
              </div>
              {/* 时间已过期文案（暂时隐藏，仅保留代码方便以后开启） */}
              {false && timeExpired && (
                <div className="  flex flex-col mt-[20rem] ">
                  <div className="text-[16rem] font-bold tracking-[1rem]  font-bold">
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
                        '信用卡登记仅作担保之用，实际付款需到现场办理。为了验证您的信用卡，您的对账单上可能会有1美元的临时授权。这笔款项将立即被删除。你不会被收取任何费用。'
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
                  {/* 信用卡不显示倒计时，只显示按钮；微信/支付宝显示倒计时 + 按钮 */}
                  {selectedPaymentOption !== 'creditCard' && createdTime && (
                    <CountdownTimer
                      createdTime={createdTime}
                      label={t('支付剩余时间')}
                      onExpire={handleCountdownExpire}
                    />
                  )}
                  <div
                    className=" text-[14rem] flex cursor-pointer  text-[white]  justify-center items-center px-[20rem] py-[10rem] tracking-[1rem] bg-[#272727]  "
                    onClick={() => {
                      if (selectedPaymentOption === 'creditCard') {
                        // 触发表单提交
                        onSubmit()
                      } else {
                        // 微信/支付宝支付完成处理
                        message.success(t('支付完成！'))
                      }
                    }}
                  >
                    {selectedPaymentOption === 'creditCard' ? t('确认担保') : t('我已完成')}
                  </div>
                </div>
              </div>
            </div>
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
