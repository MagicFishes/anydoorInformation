import { RouteObject } from '../types'
import { homeModule } from './homeModule'

// Computer 端路由模块（网站端）
// 路由配置中已包含菜单元数据（通过 meta 字段）
export const computerModules: RouteObject[] = [
  homeModule
]
