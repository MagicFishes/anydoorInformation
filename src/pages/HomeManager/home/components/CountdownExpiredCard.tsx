import { useTranslation } from 'react-i18next'
import { ClockCircleOutlined } from '@ant-design/icons'

export const CountdownExpiredCard = () => {
  const { t } = useTranslation()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-[50rem] px-[5%]">
      <div className="flex flex-col items-center ">
        {/* 过期图标 */}
        <ClockCircleOutlined
          style={{
            fontSize: '120rem',
            color: '#ff4d4f',
            marginBottom: '30rem',
          }}
        />
        {/* 过期标题 */}
        <div className="text-[40rem] font-bold mb-[20rem] tracking-[2rem] text-center">
          {t('支付链接已过期')}
        </div>
        {/* 过期描述 */}
        <div className="text-[18rem] text-gray-600 mb-[40rem] text-center leading-[1.6]">
          {t('支付链接已过期，请重新获取')}
        </div>
      </div>
    </div>
  )
}
