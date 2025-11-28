import { lazy } from 'react'
import { RouteObject } from '../types'

// 路由懒加载 - 首页模块
const HomeManager = lazy(() => import('@/pages/HomeManager/home/index'))

// 首页模块路由配置
export const homeModule: RouteObject = {
  path: '',
  element: <HomeManager />,
  meta: {
    key: 'home',
    label: '主页',
    icon: '🏠'
  }
}
