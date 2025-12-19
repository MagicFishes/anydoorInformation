import { Select, Space } from 'antd'
import { useAppStore } from '@/store/storeZustand'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CreditCard, Lock, Smartphone, CheckCircle, Loader2, ShieldCheck, Globe, ChevronDown, Shield } from 'lucide-react';


export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  // 🎯 Zustand：超级简洁！直接解构使用
  const { isMobile, language: currentLanguage, setLanguage } = useAppStore()

  const handleChange = (value: string) => {
    // 将 'ZH' 转换为 'zh-CN'，'EN' 转换为 'en-US'
    const language = value === 'ZH' ? 'zh-CN' : 'en-US'
    // 🎯 直接调用方法，无需 dispatch！
    setLanguage(language)
    console.log(`语言已切换为: ${language}`)

    // 同时替换当前 URL 中的语言段（例如 /zh-CN/xxx → /en-US/xxx），保持后面的参数不变
    const { pathname, search, hash } = location
    const segments = pathname.split('/')

    // segments[0] 为空字符串，segments[1] 才是第一个路径段
    if (segments[1] === 'zh-CN' || segments[1] === 'en-US') {
      segments[1] = language
      const newPath = segments.join('/') + search + hash
      navigate(newPath, { replace: true })
    }
  }

  // 将 Zustand store 中的语言状态转换为 Select 需要的格式
  const selectValue = currentLanguage === 'zh-CN' ? 'ZH' : 'EN'

  const HeaderSelect = () => (
    <Space wrap>
      <Select
        value={selectValue}
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: 'ZH', label: '简体中文' },
          { value: 'EN', label: 'English' },
        ]}
      />
    </Space>
  )

  return (
    <>
      <div className={`flex w-[100%] items-center justify-between py-[20rem] text-[12rem] ${isMobile ? 'p-[10rem]' : ''}`}>
        <div className="flex items-center justify-center">
          {/* <img onClick={() => window.open('https://jiudianzhifu.com', '_blank')} src="/image/logo.png" alt="" className=" h-[40rem]  cursor-pointer" /> */}
          <div
            onClick={() => window.open('https://jiudianzhifu.com', '_blank')}
            className="cursor-pointer flex items-center gap-[10rem]"
          >
            {/* 品牌图标圆形徽章 */}
            <div className="w-[50px] h-[50px] rounded-[10rem] bg-slate-900 text-[#c8a562]  flex items-center justify-center shadow-lg relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <Shield className="w-[28px] fill-current h-[28px]" strokeWidth={2.5} />
            </div>

            {/* 品牌文案 */}
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-[4rem]">
                <span className="text-[20rem] md:text-[24rem] font-bold">StayPayment</span>
              </div>
              <div className="mt-[4rem] text-[11rem] md:text-[12rem] text-gray-500 flex">
              <Lock className="w-[12rem] h-[12rem] text-green-500" />
                Secure Checkout
              </div>
            </div>
          </div>
          {!isMobile && (
            <>
              <div className="text-[20rem] mx-[10rem]  text-gray-500 ">/</div>
              <div className="flex flex-col ">
                {/* 字体需要斜体 - 使用 transform skewX 实现中文斜体效果 */}
                <div className="text-[16rem] font-bold" style={{ transform: 'skewX(-12deg)' }}>
                  {t('安全·智能·创新')}
                </div>
                <div className="text-[14rem] text-gray-400" style={{ transform: 'skewX(-10deg)' }}>
                  {t('改变一点就是新的起点，酒旅一站式解决方案专家！')}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-center">
          <div>
            <HeaderSelect />
          </div>
        </div>
      </div>
    </>
  )
}
