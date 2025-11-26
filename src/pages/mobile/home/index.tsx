// 移动端首页
import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import { Input, Select, message } from 'antd'
import { useState, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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

const payIconList = {
  Visa: '/image/home/payIcon/Visa.png',
  Mastercard: '/image/home/payIcon/Mastercard.png',
  Amex: '/image/home/payIcon/Amex.png',
  Unionpay: '/image/home/payIcon/UnionPay.png',
  Dinersclub: '/image/home/payIcon/DinersClub.png',
  JCB: '/image/home/payIcon/JCB.png',
}

const MobileHome = () => {
  // 使用翻译
  const { t } = useTranslation()
  
  // 动态创建 Schema（支持翻译）
  const paymentFormSchema = useMemo(() => createPaymentFormSchema(t), [t])
  
  // 从 Schema 推断类型
  type PaymentFormData = z.infer<typeof paymentFormSchema>
  
  // 获取URL参数
  const [searchParams] = useSearchParams()
  
  // 时间已过期
  const [timeExpired, setTimeExpired] = useState(false)
  
  // 读取URL参数示例（可根据实际需求使用）
  useEffect(() => {
    // 获取所有参数
    const params = Object.fromEntries(searchParams.entries())
    
    // 示例：如果有特定参数，可以在这里处理
    // 例如：订单ID、支付ID等
    if (params.orderId) {
      console.log('订单ID:', params.orderId)
      // 可以根据参数加载对应数据
    }
    if (params.paymentId) {
      console.log('支付ID:', params.paymentId)
    }
    
    // 打印所有参数（开发时使用）
    if (Object.keys(params).length > 0) {
      console.log('URL参数:', params)
    }
  }, [searchParams])
  
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
        <div className="w-full border-[1px] border-solid border-gray-300 mb-[20rem] bg-white">
          <div className="w-full min-h-[120rem]">
            <img src="/image/home/home1.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="p-[20rem]">
            {/* 酒店信息 */}
            <div className="text-[14rem] flex-col flex mb-[20rem] border-b-[1rem] border-solid border-gray-300 pb-[20rem]">
              <div className="text-[18rem] mb-[5rem] tracking-[2rem] font-bold">
                {t('上海宝格丽酒店')}
              </div>
              <div className="text-[14rem] text-gray-400">Bulgari Hotel Shanghai</div>
            </div>
            {/* 入住信息 */}
            <div className="text-[14rem] flex-col flex">
              <div className="text-[14rem] flex-col flex mb-[15rem]">
                <div className="text-gray-400 mb-[5rem] tracking-[1rem]">{t('客人')}</div>
                <div className="text-[18rem] font-bold tracking-[1rem]">Hua Zhong</div>
              </div>
              <div className="text-[14rem] flex-col flex mb-[15rem]">
                <div className="text-gray-400 mb-[5rem] tracking-[1rem]">{t('入住日期')}</div>
                <div className="text-[18rem] font-bold tracking-[1rem]">2025/03/31</div>
              </div>
              <div className="text-[14rem] flex-col flex">
                <div className="text-gray-400 mb-[5rem] tracking-[1rem]">{t('离店日期')}</div>
                <div className="text-[18rem] font-bold tracking-[1rem]">2025/04/01</div>
              </div>
            </div>
          </div>
        </div>

        {/* 支付区域 */}
        <div className="w-full border-[1px] border-solid border-gray-300 bg-white p-[20rem]">
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
          <div className="grid grid-cols-3 bg-[#f6f6f6] mb-[20rem]">
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

          {/* 时间未过期 */}
          {!timeExpired && (
            <div className="border-b-[1px] border-solid border-gray-300 pt-[20rem] pb-[20rem]">
              {/* 根据支付选项显示不同内容 */}
              {selectedPaymentOption === 'creditCard' && (
                <form
                  onSubmit={handleSubmit(async values => {
                    try {
                      setIsSubmitting(true)
                      setPaymentData(values)
                      console.log('表单提交:', values)
                      message.success(t('支付信息提交成功！'))
                    } catch (error) {
                      console.error('支付提交失败:', error)
                      message.error(t('支付提交失败，请重试'))
                    } finally {
                      setIsSubmitting(false)
                    }
                  })}
                >
                  <div className="flex flex-col gap-[20rem]">
                    {/* 第一项：卡号 */}
                    <div className="flex flex-col">
                      <label className="text-[14rem] tracking-[1rem] text-gray-400 mb-[5rem]">
                        {t('卡号')}
                      </label>
                      <Controller
                        name="cardNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t('请输入卡号')}
                            maxLength={23}
                            className="bg-[#f6f6f6] p-[10rem] text-[14rem] h-[40rem]"
                            status={errors.cardNumber ? 'error' : ''}
                            onChange={e => {
                              // 自动格式化：每4位数字后添加空格
                              const inputValue = e.target.value
                              const digitsOnly = inputValue.replace(/\s/g, '').replace(/\D/g, '')
                              const formattedValue =
                                digitsOnly.match(/.{1,4}/g)?.join(' ') || digitsOnly
                              field.onChange(formattedValue)
                            }}
                            value={field.value || ''}
                          />
                        )}
                      />
                      {errors.cardNumber && (
                        <span className="text-red-500 text-[12rem] mt-[5rem]">
                          {errors.cardNumber.message}
                        </span>
                      )}
                    </div>

                    {/* 第二项：卡种 */}
                    <div className="flex flex-col">
                      <label className="text-[14rem] tracking-[1rem] text-gray-400 mb-[5rem]">
                        {t('卡种')}
                      </label>
                      <Controller
                        name="cardType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value || undefined}
                            placeholder={t('请选择卡种')}
                            className="text-[14rem] [&_.ant-select-selector]:!bg-[#f6f6f6]"
                            style={{ height: '40rem' }}
                            status={errors.cardType ? 'error' : ''}
                            options={[
                              { value: 'visa', label: 'Visa' },
                              { value: 'mastercard', label: 'MasterCard' },
                              { value: 'amex', label: 'American Express' },
                              { value: 'unionpay', label: t('银联') },
                            ]}
                          />
                        )}
                      />
                      {errors.cardType && (
                        <span className="text-red-500 text-[12rem] mt-[5rem]">
                          {errors.cardType.message}
                        </span>
                      )}
                    </div>

                    {/* 第三项：有效期 */}
                    <div className="flex flex-col">
                      <label className="text-[14rem] tracking-[1rem] text-gray-400 mb-[5rem]">
                        {t('有效期')}
                      </label>
                      <Controller
                        name="expiryDate"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="bg-[#f6f6f6] p-[10rem] text-[14rem] h-[40rem]"
                            status={errors.expiryDate ? 'error' : ''}
                            onChange={e => {
                              // 自动格式化：MM/YY
                              const inputValue = e.target.value
                              let digitsOnly = inputValue.replace(/\D/g, '')
                              digitsOnly = digitsOnly.slice(0, 4)
                              let formattedValue = digitsOnly
                              if (digitsOnly.length >= 2) {
                                formattedValue =
                                  digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4)
                              }
                              field.onChange(formattedValue)
                            }}
                            value={field.value || ''}
                          />
                        )}
                      />
                      {errors.expiryDate && (
                        <span className="text-red-500 text-[12rem] mt-[5rem]">
                          {errors.expiryDate.message}
                        </span>
                      )}
                    </div>

                    {/* 第四项：安全码 */}
                    <div className="flex flex-col">
                      <label className="text-[14rem] tracking-[1rem] text-gray-400 mb-[5rem]">
                        {t('安全码')}
                      </label>
                      <Input
                        {...register('cvv')}
                        type="password"
                        placeholder="CVV/CVC"
                        maxLength={4}
                        className="bg-[#f6f6f6] p-[10rem] text-[14rem] h-[40rem]"
                        status={errors.cvv ? 'error' : ''}
                      />
                      {errors.cvv && (
                        <span className="text-red-500 text-[12rem] mt-[5rem]">
                          {errors.cvv.message}
                        </span>
                      )}
                    </div>
                  </div>
                </form>
              )}

              {/* 微信/支付宝扫码支付 */}
              {(selectedPaymentOption === 'wechatPay' || selectedPaymentOption === 'alipay') && (
                <div className="w-full flex justify-center items-center flex-col">
                  <div className="w-[200rem] h-[200rem] border-[1px] border-solid border-gray-300 mb-[20rem] bg-white flex items-center justify-center">
                    <span className="text-gray-400 text-[14rem]">{t('二维码占位')}</span>
                  </div>
                  <div className="w-full h-[50rem] flex justify-center items-center mb-[10rem]">
                    <img
                      className="h-[30rem] mr-[10rem]"
                      src="/image/scanCode.png"
                      alt=""
                    />
                    {selectedPaymentOption === 'wechatPay' && (
                      <div className="text-[14rem]">
                        {t('打开')} <span className="text-[#1aad19] font-bold">{t('微信')}</span> {t('的')}{' '}
                        <span className="text-[#1aad19] font-bold">{t('扫一扫')}</span>
                      </div>
                    )}
                    {selectedPaymentOption === 'alipay' && (
                      <div className="text-[14rem]">
                        {t('打开')} <span className="text-[#0d99ff] font-bold">{t('支付宝')}</span> {t('的')}{' '}
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
          )}

          {/* 时间已过期 */}
          {timeExpired && (
            <div className="flex flex-col mt-[20rem]">
              <div className="text-[16rem] font-bold tracking-[1rem]">{t('直付链接已过期')}</div>
              <div className="text-[14rem] mt-[10rem] tracking-[1rem] text-gray-400">
                {t('出于安全原因，直付链接已过期。您可以在下面请求新链接。您将收到一封包含新直付链接的电子邮件。')}
              </div>
            </div>
          )}

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
              <div className="tracking-[1rem] flex justify-center items-center text-[14rem] w-full py-[10rem] px-[20rem] bg-[#ffe4e4] text-[#f65353]">
                {t('支付剩余时间')} 09:59
              </div>
              <div 
                className="flex text-[14rem] cursor-pointer text-white justify-center items-center px-[20rem] py-[10rem] tracking-[1rem] bg-[#272727] active:bg-[#1a1a1a]"
                onClick={() => {
                  if (selectedPaymentOption === 'creditCard') {
                    // 触发表单提交
                    handleSubmit(async values => {
                      try {
                        setIsSubmitting(true)
                        setPaymentData(values)
                        console.log('表单提交:', values)
                        message.success(t('支付信息提交成功！'))
                      } catch (error) {
                        console.error('支付提交失败:', error)
                        message.error(t('支付提交失败，请重试'))
                      } finally {
                        setIsSubmitting(false)
                      }
                    })()
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
        {/* 3列展示 - 移动端改为单列 */}
        <div className="w-full flex flex-col gap-[20rem] mt-[30rem] mb-[50rem] px-[20rem]">
          {showImageList.map((item, index) => {
            return (
              <div
                key={index}
                className="w-full py-[30rem] px-[20rem] border-[1px] border-solid border-gray-300"
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-center">
                    <div
                      className="w-[50rem] h-[50rem] flex justify-center items-center rounded-[50%] mb-[10rem]"
                      style={{ backgroundColor: item.bgColor }}
                    >
                      <img className="w-[30rem] h-[30rem]" src={item.image} alt="" />
                    </div>
                  </div>
                  <div className="text-[18rem] font-bold tracking-[1rem] text-center mb-[10rem]">
                    {item.title}
                  </div>
                  <div className="text-[14rem] text-gray-400 text-center">{item.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MobileHome

