// src/layouts/BasicLayout.tsx - 基础布局（无侧边栏，用于普通页面）
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

const BasicLayout: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* 可选：顶部导航栏 */}
      {/* <header className="bg-white shadow-sm h-16 flex items-center px-6">
        <div className="text-xl font-bold text-gray-800">网站 Logo</div>
      </header> */}
      
      {/* 主内容区 */}
      <main className="w-full">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
      
      {/* 可选：底部信息 */}
      {/* <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-600">
        <div>© 2024 Your Company. All rights reserved.</div>
      </footer> */}
    </div>
  )
}

export default BasicLayout

