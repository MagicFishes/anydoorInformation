import { useState, useEffect, useRef } from 'react'
import { Input, Select } from 'antd'
import { CreditCardOutlined, LockOutlined } from '@ant-design/icons'
import { Controller, Control, FieldErrors, UseFormRegister, useWatch } from 'react-hook-form'
import { useIsMobile } from '@/store/storeZustand'
// 为了降低耦合，这里不强绑具体的表单类型，使用 any 即可
interface CreditCardFormProps {
  control: Control<any>
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  t: (key: string) => string
  onSubmit: () => void
}

// 根据卡号检测卡种类型
const detectCardType = (cardNumber: string): string | null => {
  const digitsOnly = cardNumber.replace(/\s/g, '').replace(/\D/g, '')
  if (!digitsOnly) return null

  // Visa: 以4开头
  if (digitsOnly.startsWith('4')) return 'VISA'
  // Mastercard: 以51-55开头
  if (/^5[1-5]/.test(digitsOnly)) return 'MASTER'
  // AAE: 其他情况或特定规则
  if (/^3[47]/.test(digitsOnly)) return 'Amex' // Amex

  return null
}

// 获取卡种显示名称
const getCardTypeLabel = (cardType: string | null): string => {
  switch (cardType) {
    case 'VISA':
      return 'VISA'
    case 'MASTER':
      return 'MASTER'
    case 'UP':
      return 'UP'
    case 'Amex':
      return 'Amex'
    default:
      return ''
  }
}

// 卡种图标组件
const BrandLogo = ({ network, className }: { network: string, className?: string }) => {
  switch (network) {
    case 'VISA':
      return (
        <img src="/image/home/payIcon/Visa.png" alt="VISA" className={className} />
      )
    case 'MASTER':
      return (
        <img src="/image/home/payIcon/Mastercard.png" alt="MASTER" className={className} />
      )
    case 'AMEX':
      return (
        <img src="/image/home/payIcon/Amex.png" alt="AMEX" className={className} />
      )
    // case 'UP':
    //   return (
    //     <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    //       <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    //       <path d="M4 8H20" stroke="currentColor" strokeWidth="1"/>
    //       <path d="M4 16H20" stroke="currentColor" strokeWidth="1"/>
    //       <text x="50%" y="55%" textAnchor="middle" dy=".3em" fontSize="6" fill="currentColor" fontWeight="bold">UP</text>
    //     </svg>
    //   )
    default:
      return null
  }
}

/**
 * 信用卡表单，仅负责渲染 UI，不持有自己的 useForm 逻辑
 */
export const CreditCardForm = ({ control, register, errors, t, onSubmit }: CreditCardFormProps) => {
  const [detectedCardType, setDetectedCardType] = useState<string | null>(null)
  const isMobile = useIsMobile()

  // 卡种选项
  const cardTypes = [
    { value: 'VISA', label: 'VISA' },
    { value: 'MASTER', label: 'MASTER' },
    { value: 'AMEX', label: 'AMEX' },
  ]

  // 监听 cardType 的值
  const cardTypeValue = useWatch({
    control,
    name: 'cardType',
    defaultValue: cardTypes[0]?.value,
  })

  // 用于跟踪是否已设置默认值
  const defaultSetRef = useRef(false)

  // 确保默认值被设置
  useEffect(() => {
    if (!cardTypeValue && !defaultSetRef.current && cardTypes.length > 0) {
      // 通过 control 的内部方法设置值
      const setValue = (control as any)._setValue
      if (setValue) {
        setValue('cardType', cardTypes[0].value, { shouldValidate: false, shouldDirty: false })
        defaultSetRef.current = true
      } else {
        // 如果 _setValue 不可用，尝试通过 _formValues 直接设置
        const formValues = (control as any)._formValues
        if (formValues && !formValues.cardType) {
          formValues.cardType = cardTypes[0].value
          defaultSetRef.current = true
        }
      }
    }
  }, [cardTypeValue, cardTypes, control])

  return (
    <form id="payment-form" onSubmit={onSubmit}>
      {/* 2. 选择卡种 */}
      <div className="mb-[24rem]">
        {/* 原来的卡种选择（下拉框）- 已注释 */}
        {/* 
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
                className="text-[14rem] [&_.ant-select-selector]:!bg-[white]"
                style={{ height: '40rem' }}
                status={errors.cardType ? 'error' : ''}
                options={[
                  { value: 'VISA', label: 'Visa' },
                  { value: 'MASTER', label: 'MasterCard' },
                ]}
              />
            )}
          />
          {errors.cardType && (
            <span className="text-red-500 text-[12rem] mt-[5rem]">
              {String(errors.cardType.message || '')}
            </span>
          )}
        </div>
        */}
        <div className="text-[14rem] tracking-[1rem] text-gray-600 mb-[12rem] font-medium">
          {/* 2. {t('选择卡种')} */}
        </div>
        <Controller
          name="cardType"
          control={control}
          defaultValue={cardTypes[0]?.value}
          render={({ field }) => {
            // 如果值为空，设置默认值
            if (!field.value && cardTypes.length > 0 && !defaultSetRef.current) {
              field.onChange(cardTypes[0].value)
              defaultSetRef.current = true
            }
            
            // 使用实际值或默认值来显示选中状态
            const displayValue = field.value || cardTypes[0]?.value
            
            return (
              <div className="flex gap-[20rem]">
                {cardTypes.map(card => {
                  const isSelected = displayValue === card.value
                  return (
                    <div
                      key={card.value}
                      onClick={() => field.onChange(card.value)}
                      className={`flex-1 cursor-pointer flex flex-col justify-center items-center py-[8rem] rounded-[8px] transition-all transform border-[1px] ${
                        isSelected
                          ? 'bg-[white] border-gray-900 scale-[1.03] shadow-lg'
                          : 'bg-[white] border-gray-300 scale-[0.98] hover:scale-[1.01] hover:shadow-md'
                      }`}
                    >
                      <div
                        className={`mb-[8rem] transition-opacity flex items-center justify-center ${
                          isSelected ? 'opacity-100' : 'opacity-60'
                        }`}
                      >
                        <BrandLogo network={card.value} className="h-[20rem] " />
                      </div>
                      <span
                        className={`text-[12rem]  transition-colors ${
                          isSelected
                            ? 'text-gray-500  font-bold '
                            : 'text-gray-500'
                        }`}
                      >
                        {card.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          }}
        />
        {errors.cardType && (
          <span className="text-red-500 text-[12rem] mt-[5rem] block">
            {String(errors.cardType.message || '')}
          </span>
        )}
      </div>

      {/* 3. 卡片信息 */}
      <div>
        <div className="text-[14rem] tracking-[1rem] text-gray-600 mb-[12rem] font-medium">
          {/* 3. {t('卡片信息')} */}
        </div>

        <div className="flex flex-col gap-[20rem]">
          {/* 卡号 */}
          <div className="flex flex-col">
            <label className="text-[14rem] tracking-[1rem] text-gray-400 mb-[5rem]">
              {t('卡号')}
            </label>
            <Controller
              name="cardNumber"
              control={control}
              render={({ field }) => {
                // const cardType = detectCardType(field.value || '')

                return (
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="0000 0000 0000 0000"
                      maxLength={23}
                      className="bg-[white] pl-[40rem] pr-[60rem] text-[14rem] h-[40rem]"
                      status={errors.cardNumber ? 'error' : ''}
                      onChange={e => {
                        // 自动格式化：每4位数字后添加空格
                        const inputValue = e.target.value
                        // 移除所有空格和非数字字符
                        const digitsOnly = inputValue.replace(/\s/g, '').replace(/\D/g, '')
                        // 每4位数字后添加空格
                        const formattedValue = digitsOnly.match(/.{1,4}/g)?.join(' ') || digitsOnly
                        // 更新字段值
                        field.onChange(formattedValue)
                        // 更新检测到的卡种
                        setDetectedCardType(detectCardType(formattedValue))
                      }}
                      value={field.value || ''}
                    />
                    {/* 左侧芯片图标 */}
                    <div className="absolute left-[12rem] top-1/2 -translate-y-1/2">
                      <CreditCardOutlined className="text-gray-400 text-[16rem]" />
                    </div>
                    {/* 右侧卡种标签 */}
                    {/* {cardType && (
                      <div className="absolute right-[12rem] top-1/2 -translate-y-1/2">
                        <span className="text-gray-500 text-[12rem]">
                          {getCardTypeLabel(cardType)}
                        </span>
                      </div>
                    )} */}
                  </div>
                )
              }}
            />
            {errors.cardNumber && (
              <span className="text-red-500 text-[12rem] mt-[5rem]">
                {String(errors.cardNumber.message || '')}
              </span>
            )}
          </div>

          {/* 原来的布局（卡号和卡种并排）- 已注释 */}
          {/* 
          <div className={`grid gap-[20rem] ${useIsMobile() ? 'grid-cols-1' : 'grid-cols-2'}`}>
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
                    className="bg-[white] p-[10rem] text-[14rem] h-[40rem]"
                    status={errors.cardNumber ? 'error' : ''}
                    onChange={e => {
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
                  {String(errors.cardNumber.message || '')}
                </span>
              )}
            </div>
          </div>
          */}

          {/* 有效期和安全码 - 并排显示 */}
          <div className={`grid gap-[20rem] ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {/* 有效期 */}
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
                    placeholder={t('MM/YY')}
                    maxLength={5}
                    className="bg-[white] p-[10rem] text-[14rem] h-[40rem]"
                    status={errors.expiryDate ? 'error' : ''}
                    onChange={e => {
                      // 自动格式化：MM/YY
                      const inputValue = e.target.value
                      // 移除所有非数字字符（包括斜杠）
                      let digitsOnly = inputValue.replace(/\D/g, '')
                      // 限制最多4位数字
                      digitsOnly = digitsOnly.slice(0, 4)
                      // 当输入超过2位时，自动添加斜杠
                      let formattedValue = digitsOnly
                      if (digitsOnly.length >= 2) {
                        formattedValue = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4)
                      }
                      // 更新字段值
                      field.onChange(formattedValue)
                    }}
                    value={field.value || ''}
                  />
                )}
              />
              {errors.expiryDate && (
                <span className="text-red-500 text-[12rem] mt-[5rem]">
                  {String(errors.expiryDate.message || '')}
                </span>
              )}
            </div>

            {/* 安全码 */}
            <div className="flex flex-col">
              <label className="text-[14rem] tracking-[1rem] text-gray-400 mb-[5rem]">
                {t('安全码')}
              </label>
              <Controller
                name="cvv"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type="password"
                      placeholder="123/1234"
                      maxLength={4}
                      autoComplete="cc-csc"
                      className="bg-[white] pl-[10rem] pr-[40rem] text-[14rem] h-[40rem]"
                      status={errors.cvv ? 'error' : ''}
                      onChange={e => {
                        // 只保留数字，并限制为 3 位
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 4)
                        field.onChange(digitsOnly)
                      }}
                      value={field.value || ''}
                    />
                    {/* 右侧锁图标 */}
                    <div className="absolute right-[12rem] top-1/2 -translate-y-1/2">
                      <LockOutlined className="text-gray-400 text-[14rem]" />
                    </div>
                  </div>
                )}
              />
              {errors.cvv && (
                <span className="text-red-500 text-[12rem] mt-[5rem]">
                  {String(errors.cvv.message || '')}
                </span>
              )}
            </div>
          </div>

          {/* 持卡人姓名 */}
          {/* <div className="flex flex-col">
            <label className="text-[14rem] tracking-[1rem] text-gray-400 mb-[5rem]">
              {t('持卡人姓名')}
            </label>
            <Controller
              name="cardholderName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="NAME ON CARD"
                  className="bg-[white] p-[10rem] text-[14rem] h-[40rem]"
                  status={errors.cardholderName ? 'error' : ''}
                  value={field.value || ''}
                />
              )}
            />
            {errors.cardholderName && (
              <span className="text-red-500 text-[12rem] mt-[5rem]">
                {String(errors.cardholderName.message || '')}
              </span>
            )}
          </div> */}
        </div>
      </div>

      {/* 提交按钮：如果以后要恢复，可以放回这里 */}
      {/* 
      <div className="mt-[30rem]">
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isSubmitting}
          className="h-[50rem] text-[16rem] font-bold"
        >
          {isSubmitting ? t('提交中...') : t('确认支付')}
        </Button>
      </div>
      */}
    </form>
  )
}
