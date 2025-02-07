import * as React from 'react';
import Home from '../components/Home';
import { createBrowserRouter } from 'react-router-dom';
const routes = [
  {
    path: "/",
    element: <Home />,
    children: [
      { path:'home', element: <Home /> }, // 使用 <Home /> 作为元素
      // { path: "Tags", element: <Tags /> },
      // { path: "user/:id", element: <UserProfile /> },
      // { path: "*", element: <NotFound /> }
    ]
  }
];
const router = createBrowserRouter(routes); // 使用 createBrowserRouter 创建 router 对象
export default router;