// src/App.tsx
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import { routes } from './router/router'
// import { Provider } from 'react-redux'; // 或 Zustand/Jotai
// import store from './store';            // 状态管理
import ErrorBoundary from './components/ErrorBoundary'
import RootLayout from './layouts/RootLayout' // 全局布局

// 创建路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // 使用全局布局
    // errorElement: <ErrorBoundary />, // 路由级错误边界
    children: routes, // 导入路由配置
  },
])

export default function App() {
  return (

    // 混用注释代码，报错
    //  {/* 全局错误边界 */}
    //    </** */> <ErrorBoundary fallback={<div>全局错误</div>}>
    //   {/* 其他全局组件 */}
    //   {/* <GlobalNotification /> */}
    //   {/* <AnalyticsTracker> */}
    //     {/* 路由提供者 */}
    //     <RouterProvider router={router} />
    //   {/* </AnalyticsTracker> */}
    //   </ErrorBoundary>

    // 全局错误边界
    // <ErrorBoundary fallback={<div>全局错误</div>}>
    // 其他全局组件
    // <GlobalNotification />
    // <AnalyticsTracker>
    // 路由提供者123
    <div>
      
    <RouterProvider router={router} />
    </div>
    // </AnalyticsTracker>
    // </ErrorBoundary>
  )
}
