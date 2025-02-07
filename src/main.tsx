// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Tags from './pages/Tags'
// import Register from './pages/Register'
// import Login from './pages/Login'

ReactDOM.createRoot(document.getElementById('root')!).render(
// const baseRouter = () => {
  // return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* <Route path="/" element={<Navigate to="/home" />} /> */}
          <Route path='home' element={<Home />} />
          <Route path="tags" element={<Tags />} />
        </Route>

        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  // );
// }
// export default baseRouter
)