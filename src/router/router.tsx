import * as React from 'react';
// import Home from '../components/Home';
import Home from '@/pages/home/home';
import NotFound from '@/pages/NotFound';
import { createBrowserRouter, useRoutes } from 'react-router-dom';
// import { RouteObject } from 'react-router-dom';
// const routes = [
//   {
//     path: "/",
//     element: <Home />,
//     children: [
//       { path:'home', element: <Home /> }, // 使用 <Home /> 作为元素
//       // { path: "Tags", element: <Tags /> },
//       // { path: "user/:id", element: <UserProfile /> },
//       // { path: "*", element: <NotFound /> }
//     ]
//   }
// ];
// const router = createBrowserRouter(routes); // 使用 createBrowserRouter 创建 router 对象
// export default router;
// export default function Router(){
//   return useRoutes([
//     {path:'/',element:<Home></Home>,children:[]},
//     {path:'*',element:<NotFound></NotFound>}
//   ])
// }

// export const routes=[
//   {
//     path:'/',
//     Component:Home,
//     // 数据预加载
//     // loader:()=>fetchData()
//     // errorElement:<ErrorPage/>
//   },

// ]
// src/router.ts
import { RouteObject } from 'react-router-dom';


// 导出路由配置
export const routes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
    // loader: homeLoader // 数据预加载
  },
  
  {
    path: '*',
    element: <NotFound />
  }
];

// 示例数据加载函数
// async function homeLoader() {
//   const data = await fetch('/api/home-data');
//   return data.json();
// }