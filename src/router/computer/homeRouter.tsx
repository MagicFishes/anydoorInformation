import { RouteObject, Navigate } from 'react-router-dom'
import Home from '@/pages/home/home'
import UseCallback from '@/pages/home/useCallback'
import UseActionState from '@/pages/home/useActionState'
import UseContext from '@/pages/home/useContent'
import UseOptimistic from '@/pages/home/useOptimistic'
import UseReducer from '@/pages/home/useReducer'
import UseSyncExternalStore from '@/pages/home/useSyncExternalStore'
import Login from '@/pages/Login/Login'
import Text from '@/pages/text/text'
export const homeRoutes: RouteObject[] = [

  {
    // index:true,
    path:'text',
    element:<Text></Text>
  },
  {
    // index:true,
    path:'login',
    element:<Login></Login>
  },
  {
    path:'home',
    element: <Home />,
    // loader: homeLoader // 数据预加载
  },
  {
    path: 'useCallback',
    element: <UseCallback />,
  },
  {
    path: 'useActionState',
    element: <UseActionState />,
  },
  {
    path: 'useContext',
    element: <UseContext></UseContext>,
  },
  {
    path: 'useOptimistic',
    element: <UseOptimistic></UseOptimistic>,
  },
  {
    path: 'useReducer',
    element: <UseReducer></UseReducer>,
  },
  {
    path: 'useSyncExternalStore',
    element: <UseSyncExternalStore></UseSyncExternalStore>,
  },
]
