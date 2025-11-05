import { lazy } from 'react'
import { RouteObject } from '../types'
import { mobileHomeModule } from './homeModule'
import { mobileAppsModule } from './appsModule'
import { mobileProfileModule } from './profileModule'

// 测试页面
const RouteTest = lazy(() => import('@/pages/DevTools/RouteTest'))

// 移动端路由模块（模块化管理）
export const mobileModules: RouteObject[] = [
  mobileHomeModule,
  mobileAppsModule,
  mobileProfileModule,
  // 测试路由
  {
    path: 'route-test',
    element: <RouteTest />,
    meta: { 
      key: 'mobile-route-test', 
      label: '路由测试',
      icon: '🧪'
    }
  }
]

