// // src/App.tsx
// App.tsx
import React, { useEffect, useMemo } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store/store'
import { setIsMobile } from '@/features/appSlice/app'
import { RootState } from './store/store'
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
  useRoutes,
} from 'react-router-dom'
import { generateRoutes } from './router/generateRoutes'
import RootLayout from './layouts/RootLayout'

export default function App() {
  const dispatch = useDispatch()
  const isMobile = useSelector((state: RootState) => state.app.isMobile)

  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 768))
    }

    window.addEventListener('resize', handleResize)
    handleResize() // 初始化时设置一次

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dispatch])

  const router = useMemo(() => {
    return createBrowserRouter(generateRoutes(isMobile))
  }, [isMobile])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* {element} */}
        <RootLayout>
          <RouterProvider router={router} />
        </RootLayout>
      </PersistGate>
    </Provider>
  )
}

// import { RouterProvider } from 'react-router-dom'
// import { createBrowserRouter } from 'react-router-dom'
// import { routes } from './router/router'
// // import { Provider } from 'react-redux'; // 或 Zustand/Jotai
// // import store from './store';            // 状态管理
// import ErrorBoundary from './components/ErrorBoundary'
// import RootLayout from './layouts/RootLayout' // 全局布局
// import ContentProvider from '@/pages/home/useContentCreat'
// import { Provider } from 'react-redux'
// import { store } from './store/store'
// // 创建路由实例
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <RootLayout />, // 使用全局布局
//     // errorElement: <ErrorBoundary />, // 路由级错误边界
//     children: routes, // 导入路由配置
//   },
// ])

// export default function App() {
//   return (

//     // 混用注释代码，报错
//     //  {/* 全局错误边界 */}
//     //    </** */> <ErrorBoundary fallback={<div>全局错误</div>}>
//     //   {/* 其他全局组件 */}
//     //   {/* <GlobalNotification /> */}
//     //   {/* <AnalyticsTracker> */}
//     //     {/* 路由提供者 */}
//     //     <RouterProvider router={router} />
//     //   {/* </AnalyticsTracker> */}
//     //   </ErrorBoundary>

//     // 全局错误边界
//     // <ErrorBoundary fallback={<div>全局错误</div>}>
//     // 其他全局组件
//     // <GlobalNotification />
//     // <AnalyticsTracker>
//     // 路由提供者123
//     <div>
//       <Provider store={store}>
//       {/* <ContentProvider> */}
//         <RouterProvider router={router} />
//       {/* </ContentProvider> */}
//       </Provider>

//     </div>
//     // </AnalyticsTracker>
//     // </ErrorBoundary>
//   )
// }
