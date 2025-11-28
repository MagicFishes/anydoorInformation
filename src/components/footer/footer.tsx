import { useIsMobile } from '@/store/storeZustand'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type Props = {
  title: string
}
Footer.defaultProps = {
  title: '我是footer',
}
const footerList = [
  {
    title: '粤ICP备2021053350号-2',
  },
  {
    title: '粤公网安备44010602011266号',
  },
  {
    title: '旅行社业务经营许可证： L-GD-102405',
  },
  {
    title: 'IATA/TIDS: 08355896 / 96147273',
  },
  {
    title: '电信增值业务许可证：粤B2-20241708',
  },
]
export default function Footer(item: Props) {
  // 🎯 Zustand：使用便捷 hook，只订阅需要的状态
  const isMobile = useIsMobile()
  // 使用翻译
  const { t } = useTranslation()
  // 使用 React Router 导航
  const navigate = useNavigate()

  return (
    <>
      <div
        className={`w-full py-[10rem] flex ${isMobile ? 'flex-col p-[10rem]' : 'justify-between'}`}
      >
        <div className={isMobile ? 'w-full' : 'w-[70%]'}>
          <div className={`w-full flex ${isMobile ? 'justify-center' : ''}`}>
            <img src="/image/logo.png" alt="" className="h-[40rem]" />
          </div>
          <div className={`w-full flex text-[14rem] mt-[10rem] text-gray-500 ${isMobile ? 'text-center' : ''}`}>
            © 2025 Jiudianzhifu Getaways Co., LLC All Rights Reserved.
          </div>
        </div>
        <div
          className={`${isMobile ? 'w-full' : 'w-[30%]'} flex ${isMobile ? 'justify-center mt-[20rem] ' : 'justify-end items-end'}`}
        >
          <div
            onClick={() => navigate('/CommonPage/privacy-policy')}
            className="text-[14rem] mr-[10rem] text-gray-500 cursor-pointer hover:text-blue-500 underline"
          >
            {t('隐私政策')}
          </div>
          <div
            onClick={() => navigate('/CommonPage/terms-service')}
            className="text-[14rem] mr-[10rem] text-gray-500 cursor-pointer hover:text-blue-500 underline"
          >
            {t('服务条款')}
          </div>
        </div>
      </div>
    </>
  )
}
