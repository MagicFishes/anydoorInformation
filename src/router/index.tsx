// router/index.jsx
// import { useRoutes } from 'react-router-dom';
import * as React from 'react';
import { RouterProvider } from 'react-router-dom';
// import router from './router';
// import router from "@/router"
import router from '@/router'
export default function Router() {
  return <RouterProvider router={router} />; // 使用 RouterProvider 提供路由
  // return useRoutes(router);
}