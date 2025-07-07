// // src/layouts/ComputerLayout.tsx
import React, { useState, useEffect, memo } from 'react'

interface ComputerLayoutProps {
  children: React.ReactNode
}

const SidebarContent = memo(() => {
  console.log('SidebarContent 组件重新渲染')
  return <div>侧边栏内容</div>
})

function ComputerLayout({ children }: ComputerLayoutProps) {
  // 从 localStorage 中读取 showTab 的状态，如果不存在则默认为 true
  const [showTab, setShowTab] = useState<boolean>(() => {
    const storedShowTab = localStorage.getItem('showTab')
    return storedShowTab === null ? true : storedShowTab === 'true'
  })

  // 根据 showTab 的初始值设置 contentVisible 的初始值
  const [contentVisible, setContentVisible] = useState<boolean>(() => {
    return showTab
  })

  const [tabContentVisible, setTabContentVisible] = useState<boolean>(() => {
    return !showTab
  })

  useEffect(() => {
    // 将 showTab 的状态保存到 localStorage 中
    localStorage.setItem('showTab', String(showTab))

    let timer: NodeJS.Timeout

    if (showTab) {
      timer = setTimeout(() => {
        setContentVisible(true) // 2秒后显示内容
      }, 500) // 动画持续时间
    } else {
      setContentVisible(false)
      timer = setTimeout(() => {
        setTabContentVisible(true)
      }, 500)
    }
    return () => clearTimeout(timer) // 清除定时器
  }, [showTab])

  // 获取当前路由
  // const location = useLocation()
  // 不显示侧边栏的页面
  // const unShowSiderTabArr = ['/login']
  // const isShowSiderTab = unShowSiderTabArr.includes(location?.pathname)
  return (
    <div className="flex w-full min-h-screen">
      {
        <div
          className={`
          p-[.5rem]
          relative
          h-full
          transition-all
          duration-500
          ${showTab ? 'w-[20%]' : 'w-[3%]'}
        `}
        >
          <div className="flex flex-1">
            {showTab && contentVisible && <SidebarContent />}
            {showTab ? (
              <div
                onClick={() => setShowTab(!showTab)}
                className="absolute bg-blue-500 p-[.2rem] px-[.2rem] text-white rounded-[20rem] cursor-pointer right-[.5rem] top-[.5rem]"
              >
                {showTab ? '隐藏' : '展开'}
              </div>
            ) : (
              !showTab &&
              tabContentVisible && (
                <div
                  onClick={() => setShowTab(!showTab)}
                  className="w-[100%] flex justify-evenly items-center text-[#000000] cursor-pointer"
                >
                  展开
                </div>
              )
            )}
          </div>
        </div>
      }
      <div className="transition-all duration-[2s] flex-1">{children}</div>
    </div>
  )
}

export default ComputerLayout
