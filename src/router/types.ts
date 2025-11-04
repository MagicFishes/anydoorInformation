import { RouteObject as ReactRouterRouteObject } from 'react-router-dom'

// 路由元数据类型定义
export interface RouteMeta {
  key: string
  label: string
  icon?: string
  hidden?: boolean // 是否在侧边栏隐藏
}

// 扩展 RouteObject 类型，添加 meta 字段
export interface RouteObject extends Omit<ReactRouterRouteObject, 'children'> {
  meta?: RouteMeta
  children?: RouteObject[]
}

