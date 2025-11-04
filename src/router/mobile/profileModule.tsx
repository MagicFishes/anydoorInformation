import { lazy } from 'react'
import { RouteObject } from '../types'

// 移动端页面懒加载
const MobileProfile = lazy(() => import('@/pages/mobile/Profile'))

// 移动端个人中心模块
export const mobileProfileModule: RouteObject = {
  path: 'profile',
  element: <MobileProfile />,
  meta: { 
    key: 'mobile-profile', 
    label: '我的',
    icon: '👤'
  }
}

