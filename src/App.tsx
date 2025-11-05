// src/App.tsx
import React, { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, RootState } from './store/store'
import { setIsMobile } from '@/features/appSlice/app'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { generateRoutes } from './router/generateRoutes'

export default function App() {
  const dispatch = useDispatch()
  const isMobile = useSelector((state: RootState) => state.app.isMobile)
  const prevIsMobileRef = useRef(isMobile)

  // 响应式判断：监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 768))
    }

    window.addEventListener('resize', handleResize)
    handleResize() // 初始化时设置一次

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dispatch])

  // 🔥 监听 isMobile 变化，自动重定向到对应端的首页
  useEffect(() => {
    // 跳过首次渲染
    if (prevIsMobileRef.current === isMobile) {
      return
    }
    
    prevIsMobileRef.current = isMobile
    
    // 获取当前路径
    const currentPath = window.location.pathname
    
    // 如果从 PC 切换到移动端，且当前在 PC 路径上
    if (isMobile && (currentPath.startsWith('/admin') || currentPath.startsWith('/pages'))) {
      window.location.href = '/mobile'
    }
    
    // 如果从移动端切换到 PC，且当前在移动端路径上
    if (!isMobile && currentPath.startsWith('/mobile')) {
      window.location.href = '/admin/home/page'
    }
  }, [isMobile])

  // 根据 isMobile 动态生成路由
  const router = useMemo(() => {
    const routes = generateRoutes(isMobile)
    return createBrowserRouter(routes as any)
  }, [isMobile])

  return (
    <PersistGate loading={null} persistor={persistor}>
      {/* 🔥 添加 key 属性，当 isMobile 变化时强制重新挂载路由 */}
      <RouterProvider key={isMobile ? 'mobile' : 'pc'} router={router} />
    </PersistGate>
  )
}
