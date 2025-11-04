// src/layouts/AdminLayout.tsx - 带侧边栏的后台管理布局
import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { Spin } from 'antd'
import SidebarMenu from '@/components/SidebarMenu'

const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" tip="加载中..." />
  </div>
)

const AdminLayout: React.FC = () => {
  // 从 localStorage 中读取侧边栏折叠状态
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const storedCollapsed = localStorage.getItem('sidebarCollapsed')
    return storedCollapsed === 'true'
  })

  // 保存折叠状态到 localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(collapsed))
  }, [collapsed])

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div
        className={`
          h-screen
          sticky
          top-0
          transition-all
          duration-300
          ${collapsed ? 'w-[60px]' : 'w-[260px]'}
        `}
      >
        {/* 侧边栏内容 */}
        <SidebarMenu collapsed={collapsed} />
        
        {/* 折叠/展开按钮 */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            absolute 
            -right-3 
            top-6 
            bg-blue-500 
            text-white 
            w-6 
            h-6 
            rounded-full 
            flex 
            items-center 
            justify-center 
            shadow-lg
            hover:bg-blue-600
            transition-colors
            z-10
          "
        >
          <span className={`transition-transform duration-300 ${collapsed ? 'rotate-0' : 'rotate-180'}`}>
            ◀
          </span>
        </button>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 transition-all duration-300 overflow-auto">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default AdminLayout

