import { Input, Select } from 'antd'
import { Controller, Control, FieldErrors, UseFormRegister } from 'react-hook-form'

// 为了降低耦合，这里不强绑具体的表单类型，使用 any 即可
interface CreditCardFormProps {
  control: Control<any>
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  t: (key: string) => string
  onSubmit: () => void
}

/**
 * 信用卡表单，仅负责渲染 UI，不持有自己的 useForm 逻辑
 */
export const CreditCardForm = ({
  control,
  register,
  errors,
  t,
  onSubmit,
}: CreditCardFormProps) => {
  return (
    <form id="payment-form" onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-[20rem]">
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
                  // 移除所有空格和非数字字符
                  const digitsOnly = inputValue.replace(/\s/g, '').replace(/\D/g, '')
                  // 每4位数字后添加空格
                  const formattedValue =
                    digitsOnly.match(/.{1,4}/g)?.join(' ') || digitsOnly
                  // 更新字段值
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
                  { value: 'VISA', label: 'Visa' },
                  { value: 'MASTER', label: 'MasterCard' },
                  { value: 'AMEX', label: 'American Express' },
                  { value: 'UNIONPAY', label: t('银联') },
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
                placeholder={t('MM/YY')}
                maxLength={5}
                className="bg-[#f6f6f6] p-[10rem] text-[14rem] h-[40rem]"
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
            autoComplete="cc-csc"
            className="bg-[#f6f6f6] p-[10rem] text-[14rem] h-[40rem]"
            status={errors.cvv ? 'error' : ''}
          />
          {errors.cvv && (
            <span className="text-red-500 text-[12rem] mt-[5rem]">
              {String(errors.cvv.message || '')}
            </span>
          )}
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


