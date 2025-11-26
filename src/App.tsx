// src/App.tsx
import React, { useEffect, useMemo, useRef } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { generateRoutes } from './router/generateRoutes'
import { useLanguage } from './hooks/useLanguage'
import { useAppStore } from './store/storeZustand'

export default function App() {
  // 🎯 Zustand：直接解构使用，超级简洁！
  const { isMobile, theme, setIsMobile } = useAppStore()
  const prevIsMobileRef = useRef(isMobile)
  
  // 同步语言到 i18n
  useLanguage()

  // 初始化主题：从 Zustand store 读取并应用到 document
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme || 'dark')
  }, [theme])

  // 响应式判断：监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // 初始化时设置一次

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setIsMobile])

  // 🔥 监听 isMobile 变化，自动重定向到对应端的首页
  useEffect(() => {
    // 跳过首次渲染
    if (prevIsMobileRef.current === isMobile) {
      return
    }
    
    prevIsMobileRef.current = isMobile
    
    // 获取当前路径
    const currentPath = window.location.pathname
    
    // 如果从 PC 切换到移动端，且当前在 PC 路径上（排除 /login 等公共路径）
    if (isMobile && !currentPath.startsWith('/mobile') && !currentPath.startsWith('/login')) {
      window.location.href = '/mobile'
    }
    
    // 如果从移动端切换到 PC，且当前在移动端路径上
    if (!isMobile && currentPath.startsWith('/mobile')) {
      window.location.href = '/home/page'
    }
  }, [isMobile])

  // 根据 isMobile 动态生成路由
  const router = useMemo(() => {
    const routes = generateRoutes(isMobile)
    return createBrowserRouter(routes as any)
  }, [isMobile])

  return (
    <>
      {/* 🔥 添加 key 属性，当 isMobile 变化时强制重新挂载路由 */}
      <RouterProvider key={isMobile ? 'mobile' : 'pc'} router={router} />
    </>
  )
}
