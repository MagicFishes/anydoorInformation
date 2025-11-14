import { Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { RouteObject } from '../types'

// 路由懒加载 - Hooks 学习模块
const UseState = lazy(() => import('@/pages/home/useState'))
const UseCallback = lazy(() => import('@/pages/home/useCallback'))
const UseActionState = lazy(() => import('@/pages/home/useActionState'))
const UseContext = lazy(() => import('@/pages/home/useContent'))
const UseOptimistic = lazy(() => import('@/pages/home/useOptimistic'))
const UseReducer = lazy(() => import('@/pages/home/useReducer'))
const UseSyncExternalStore = lazy(() => import('@/pages/home/useSyncExternalStore'))
const UseEffect = lazy(() => import('@/pages/home/useEffect'))
const UseMemoUseRef = lazy(() => import('@/pages/home/useMemoUseRef'))
const UseActionStateShowcase = lazy(() => import('@/pages/home/useActionStateShowcase'))
const UseLayoutInsertion = lazy(() => import('@/pages/home/useLayoutInsertion'))

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
      element: <Navigate to="useState" replace />
    },
    {
      path: 'useState',
      element: <UseState />,
      meta: { key: 'hooks-useState', label: 'useState' }
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
      path: 'useActionState-demo',
      element: <UseActionStateShowcase />,
      meta: { key: 'hooks-useActionState-demo', label: 'useActionState 示例' }
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
    },
    {
      path: 'useEffect',
      element: <UseEffect />,
      meta: { key: 'hooks-useEffect', label: 'useEffect' }
    },
    {
      path: 'useMemo-useRef',
      element: <UseMemoUseRef />,
      meta: { key: 'hooks-useMemo-useRef', label: 'useMemo / useRef' }
    },
    {
      path: 'useLayout-insertion',
      element: <UseLayoutInsertion />,
      meta: {
        key: 'hooks-useLayout-insertion',
        label: 'useLayoutEffect & useInsertionEffect'
      }
    }
  ]
}
