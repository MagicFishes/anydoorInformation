// src/App.tsx
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, RootState } from './store/store'
import { setIsMobile } from '@/features/appSlice/app'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { generateRoutes } from './router/generateRoutes'

export default function App() {
  const dispatch = useDispatch()
  const isMobile = useSelector((state: RootState) => state.app.isMobile)

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

  // 根据 isMobile 动态生成路由
  const router = useMemo(() => {
    const routes = generateRoutes(isMobile)
    return createBrowserRouter(routes as any)
  }, [isMobile])

  return (
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  )
}
