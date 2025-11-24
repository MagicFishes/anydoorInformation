import { Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { RouteObject } from '../types'

// 路由懒加载 - 首页模块
const HomePage = lazy(() => import('@/pages/HomePage/index'))

// 首页模块路由配置
export const homeModule: RouteObject = {
  path: 'home',
  meta: {
    key: 'home',
    label: '首页模块',
    icon: '🏠'
  },
  children: [
    {
      index: true,
      element: <Navigate to="page" replace />
    },
    {
      path: 'page',
      element: <HomePage />,
      meta: {
        key: 'home-page',
        label: '主页'
      }
    }
  ]
}
