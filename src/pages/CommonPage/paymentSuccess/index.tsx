import Header from "@/components/header/header";
import Footer from '@/components/footer/footer'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

export default function PaymentSuccess() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center py-[50rem] px-[5%]">
        <div className="flex flex-col items-center max-w-[600rem]">
          {/* 成功图标 */}
          <CheckCircleOutlined 
            style={{ 
              fontSize: '120rem', 
              color: '#52c41a',
              marginBottom: '30rem'
            }} 
          />
          
          {/* 成功标题 */}
          <div className="text-[40rem] font-bold mb-[20rem] tracking-[2rem] text-center">
            {t('支付成功')}
          </div>
          
          {/* 成功描述 */}
          <div className="text-[18rem] text-gray-600 mb-[40rem] text-center leading-[1.6]">
            {t('您的支付已成功完成，感谢您的使用！')}
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-[20rem]">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/')}
              className="h-[50rem] px-[40rem] text-[16rem]"
            >
              {t('返回首页')}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

