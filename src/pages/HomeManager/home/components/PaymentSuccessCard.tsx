import { useTranslation } from 'react-i18next'
import { CheckCircleOutlined } from '@ant-design/icons'

interface PaymentSuccessCardProps {
  isPaymentSuccess: boolean // true: 支付成功, false: 提交成功
}

export const PaymentSuccessCard = ({ isPaymentSuccess }: PaymentSuccessCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-[50rem] px-[5%]">
      <div className="flex flex-col items-center ">
        {/* 成功图标 */}
        <CheckCircleOutlined
          style={{
            fontSize: '120rem',
            color: '#52c41a',
            marginBottom: '30rem',
          }}
        />
        {isPaymentSuccess ? (
          <>
            {/* 成功标题 */}
            <div className="text-[40rem] font-bold mb-[20rem] tracking-[2rem] text-center">
              {t('支付成功')}
            </div>
            {/* 成功描述 */}
            <div className="text-[18rem] text-gray-600 mb-[40rem] text-center leading-[1.6]">
              {t('您的支付已成功完成，感谢您的使用！')}
            </div>
          </>
        ) : (
          <>
            {/* 成功标题 */}
            <div className="text-[40rem] font-bold mb-[20rem] tracking-[2rem] text-center">
              {t('提交成功')}
            </div>
            {/* 成功描述 */}
            <div className="text-[18rem] text-gray-600 mb-[40rem] text-center leading-[1.6]">
              {t('您的信息已成功提交，感谢您的使用！')}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

