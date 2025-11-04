import { lazy } from 'react'
import { RouteObject } from '../types'

// 移动端页面懒加载
const MobileApps = lazy(() => import('@/pages/mobile/Apps'))

// 移动端应用模块
export const mobileAppsModule: RouteObject = {
  path: 'apps',
  element: <MobileApps />,
  meta: { 
    key: 'mobile-apps', 
    label: '应用',
    icon: '📱'
  }
}

