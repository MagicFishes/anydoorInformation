import { RouteObject } from "react-router-dom";
import Home from '@/pages/home/home'
import UseCallback from '@/pages/home/useCallback'
import UseActionState from '@/pages/home/useActionState'
import UseContext from '@/pages/home/useContent'
import UseOptimistic from '@/pages/home/useOptimistic'
import UseReducer from '@/pages/home/useReducer'
import UseSyncExternalStore from '@/pages/home/useSyncExternalStore'
export const homeRoutes:RouteObject[]=[
    {
    index: true,
    element: <Home/>,
    // loader: homeLoader // 数据预加载
  },
  {
    path:'useCallback',
    element:<UseCallback/>
  },
  {
    path:'useActionState',
    element:<UseActionState/>
  },
  {
    path:'useContext',
    element:<UseContext></UseContext>
  },
  {
    path:'useOptimistic',
    element:<UseOptimistic></UseOptimistic>
  },
  {
    path:'useReducer',
    element:<UseReducer></UseReducer>
  },
  {
    path:'useSyncExternalStore',
    element:<UseSyncExternalStore></UseSyncExternalStore>
  },
]