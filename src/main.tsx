// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'antd/dist/reset.css'
// 引入 rem 设置
import './utils/rem'
// 引入 i18n
import './i18n'
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <App />
  // {/* </React.StrictMode> */}
)