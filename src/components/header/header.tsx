import { Select, Space } from 'antd'
import { useAppStore } from '@/store/storeZustand'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  // 🎯 Zustand：超级简洁！直接解构使用
  const { isMobile, language: currentLanguage, setLanguage } = useAppStore()

  const handleChange = (value: string) => {
    // 将 'ZH' 转换为 'zh-CN'，'EN' 转换为 'en-US'
    const language = value === 'ZH' ? 'zh-CN' : 'en-US'
    // 🎯 直接调用方法，无需 dispatch！
    setLanguage(language)
    console.log(`语言已切换为: ${language}`)
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
          <img onClick={() => navigate('/')} src="/image/logo.png" alt="" className=" h-[40rem]  cursor-pointer" />
          {!isMobile && (
            <>
              <div className="text-[20rem] mx-[10rem]  text-gray-500 ">/</div>
              <div className="flex flex-col ">
                {/* 字体需要斜体 - 使用 transform skewX 实现中文斜体效果 */}
                <div className="text-[16rem] font-bold" style={{ transform: 'skewX(-12deg)' }}>安全·智能·创新</div>
                <div className="text-[14rem] text-gray-400" style={{ transform: 'skewX(-10deg)' }}>
                  改变一点就是新的起点，酒旅一站式解决方案专家！
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
