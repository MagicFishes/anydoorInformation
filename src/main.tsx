// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
// 声明式模式
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import App from './App'
// import Home from './components/Home'
// import Tags from './pages/Tags'
// ReactDOM.createRoot(document.getElementById('root')!).render(
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />}>
//           <Route path='home' element={<Home />} />
//           <Route path="tags" element={<Tags />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
// )
// v7写法不用到app.tsx但是需要使用app.tsx进行全局管理等
// import { RouterProvider } from "react-router";
// import { routes } from "./router/router";
// import ReactDOM from "react-dom/client";
// import { createBrowserRouter } from "react-router-dom";
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <RouterProvider router={createBrowserRouter(routes)} />
// );
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // 全局容器组件
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
    </Provider>

);