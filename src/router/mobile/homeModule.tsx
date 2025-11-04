import { lazy } from 'react'
import { RouteObject } from '../types'

// 移动端页面懒加载
const MobileHome = lazy(() => import('@/pages/mobile/Home'))

// 移动端首页模块
export const mobileHomeModule: RouteObject = {
  index: true,
  element: <MobileHome />,
  meta: { 
    key: 'mobile-home', 
    label: '首页',
    icon: '🏠'
  }
}

