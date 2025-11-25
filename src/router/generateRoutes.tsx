import { Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { RouteObject } from './types'
import BasicLayout from '@/layouts/BasicLayout'
import MobileLayout from '@/layouts/MobileLayout'
import { computerModules } from './computer'
import { mobileModules } from './mobile/index'
import NotFound from '@/pages/NotFound/NotFound'
import RedirectWithParams from './RedirectWithParams'

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
      // 🔥 路由守卫：捕获 PC 端路径并重定向到移动端首页，保留URL参数
      {
        path: '/homeManager/*',
        element: <RedirectWithParams to="/mobile" />
      },
      {
        path: '/home/*',
        element: <RedirectWithParams to="/mobile" />
      },
      {
        path: '/pages/*',
        element: <RedirectWithParams to="/mobile" />
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
      // 网站端路由（无侧边栏）
      {
        path: '/',
        element: <BasicLayout />,
        children: [
          // 根路径重定向到首页
          {
            index: true,
            element: <Navigate to="/homeManager/home" replace />
          },
          ...computerModules
        ]
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
      // 🔥 路由守卫：捕获移动端路径并重定向到 PC 端首页
      {
        path: '/mobile/*',
        element: <Navigate to="/homeManager/home" replace />
      },
      // 404
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
}

