import { Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { RouteObject } from '../types'

// 路由懒加载 - Hooks 学习模块
const UseCallback = lazy(() => import('@/pages/home/useCallback'))
const UseActionState = lazy(() => import('@/pages/home/useActionState'))
const UseContext = lazy(() => import('@/pages/home/useContent'))
const UseOptimistic = lazy(() => import('@/pages/home/useOptimistic'))
const UseReducer = lazy(() => import('@/pages/home/useReducer'))
const UseSyncExternalStore = lazy(() => import('@/pages/home/useSyncExternalStore'))

// Hooks 学习模块路由配置
export const hooksModule: RouteObject = {
  path: 'hooks',
  meta: {
    key: 'hooks',
    label: 'Hooks 学习',
    icon: '🎣'
  },
  children: [
    {
      index: true,
      element: <Navigate to="useCallback" replace />
    },
    {
      path: 'useCallback',
      element: <UseCallback />,
      meta: { key: 'hooks-useCallback', label: 'useCallback' }
    },
    {
      path: 'useActionState',
      element: <UseActionState />,
      meta: { key: 'hooks-useActionState', label: 'useActionState' }
    },
    {
      path: 'useContext',
      element: <UseContext />,
      meta: { key: 'hooks-useContext', label: 'useContext' }
    },
    {
      path: 'useOptimistic',
      element: <UseOptimistic />,
      meta: { key: 'hooks-useOptimistic', label: 'useOptimistic' }
    },
    {
      path: 'useReducer',
      element: <UseReducer />,
      meta: { key: 'hooks-useReducer', label: 'useReducer' }
    },
    {
      path: 'useSyncExternalStore',
      element: <UseSyncExternalStore />,
      meta: { key: 'hooks-useSyncExternalStore', label: 'useSyncExternalStore' }
    }
  ]
}
