// src/layouts/MobileLayout.tsx
import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Spin } from 'antd'

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

const MobileLayout: React.FC = () => {
  return (
    <div className="mobile-layout min-h-screen flex flex-col">
      {/* 移动端头部 */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center">
        <div className="text-lg font-bold">Mobile Header</div>
      </header>
      
      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
      
      {/* 移动端底部导航 */}
      <footer className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-2xl">🏠</div>
            <div className="text-xs">首页</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">📱</div>
            <div className="text-xs">应用</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">👤</div>
            <div className="text-xs">我的</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MobileLayout