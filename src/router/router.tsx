
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound/NotFound';
import Computer from '@/router/computer';
import Mobile from '@/router/mobile';

// 导出路由配置
export const routes: RouteObject[] = [
  ...Computer.map((route) => ({ ...route, meta: { ...(route as any)?.meta ?? {}, isMobile: false } })),
  ...Mobile.map(route => ({ ...route, meta: {...(route as any)?.meta ?? {}, isMobile: true } })),
  {
    path: '*',
    element: <NotFound />,
  },
];


// import * as React from 'react'
// // import Home from '../components/Home';
// import NotFound from '@/pages/NotFound'
// import Computer from '@/router/computer'
// import Mobile from '@/router/mobile'
// // src/router.ts
// import { RouteObject } from 'react-router-dom'

// // // 导出路由配置
// export const routes: RouteObject[] = [
//   { path: '/', children: [...Computer,...Mobile] },
//   {
//     path: '*',
//     element: <NotFound />,
//   },
// ]




// import { RouteObject } from 'react-router-dom';
// import  Computer  from '@/router/computer'; // Web 端路由
// import  Phone  from '@/router/computer'; // 移动端路由
// import NotFound from '../pages/NotFound';
// import ComputerLayout from '../layouts/ComputerLayout';
// import MobileLayout from '../layouts/MobileLayout';
// import { Outlet } from 'react-router-dom';

// export function createRoutes(isMobile: boolean): RouteObject[] {
//   const Layout = isMobile ? MobileLayout : ComputerLayout; // 动态选择布局组件

//   return [
//     {
//       element: <Layout><Outlet /></Layout>, // 使用动态选择的布局组件
//       // element: <Layout />, // 使用动态选择的布局组件
//       children: isMobile ? [...Phone] : [...Computer],
//     },
//     {
//       path: '*',
//       element: <NotFound />,
//     },
//   ];
// }