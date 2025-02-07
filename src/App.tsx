// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import '../public/style/App.css'
import { Outlet } from 'react-router-dom'
function App() {

  return (
    <>
      <h1>Vite + React</h1>
      <Outlet />
    </>
  )
}

export default App
