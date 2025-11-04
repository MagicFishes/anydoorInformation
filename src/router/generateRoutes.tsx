import { Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { RouteObject } from './types'
import AdminLayout from '@/layouts/AdminLayout'
import BasicLayout from '@/layouts/BasicLayout'
import MobileLayout from '@/layouts/MobileLayout'
import { computerModules } from './computer'
import { mobileModules } from './mobile/index'
import NotFound from '@/pages/NotFound/NotFound'

// 独立页面
const Login = lazy(() => import('@/pages/Login/Login'))

/**
 * 根据设备类型生成不同的路由配置
 * @param isMobile - 是否为移动端
 */
export const generateRoutes = (isMobile: boolean): RouteObject[] => {
  if (isMobile) {
    // 移动端路由配置
    return [
      // 根路径重定向到移动端首页
      {
        path: '/',
        element: <Navigate to="/mobile" replace />
      },
      // 移动端主路由
      {
        path: '/mobile',
        element: <MobileLayout />,
        children: mobileModules
      },
      // 移动端也可以访问登录页
      {
        path: '/login',
        element: <Login />
      },
      // 404
      {
        path: '*',
        element: <NotFound />
      }
    ]
  } else {
    // PC端路由配置
    return [
      // 根路径重定向到后台首页
      {
        path: '/',
        element: <Navigate to="/admin/home/page" replace />
      },
      // 后台管理路由（带侧边栏）
      {
        path: '/admin',
        element: <AdminLayout />,
        children: computerModules
      },
      // 普通页面路由（无侧边栏）
      {
        path: '/pages',
        element: <BasicLayout />,
        children: [
          {
            path: 'about',
            element: <div className="p-8">关于我们页面</div>
          },
          {
            path: 'contact',
            element: <div className="p-8">联系我们页面</div>
          }
        ]
      },
      // 登录页
      {
        path: '/login',
        element: <Login />
      },
      // 404
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
}

