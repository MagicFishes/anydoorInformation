import { Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { RouteObject } from '../types'

// 路由懒加载 - 测试模块
const Text = lazy(() => import('@/pages/text/text'))
const RouteTest = lazy(() => import('@/pages/DevTools/RouteTest'))

// 测试模块路由配置
export const testModule: RouteObject = {
  path: 'test',
  meta: {
    key: 'test',
    label: '测试模块',
    icon: '🧪'
  },
  children: [
    {
      index: true,
      element: <Navigate to="text" replace />
    },
    {
      path: 'text',
      element: <Text />,
      meta: {
        key: 'test-text',
        label: '测试页面'
      }
    },
    {
      path: 'route-test',
      element: <RouteTest />,
      meta: {
        key: 'test-route',
        label: '路由跨端测试'
      }
    }
  ]
}
