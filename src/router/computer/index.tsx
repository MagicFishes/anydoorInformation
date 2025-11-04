import { RouteObject } from '../types'
import { homeModule } from './homeModule'
import { hooksModule } from './hooksModule'
import { testModule } from './testModule'

// Computer 端路由模块（后台管理系统）
// 路由配置中已包含菜单元数据（通过 meta 字段）
export const computerModules: RouteObject[] = [
  homeModule,
  hooksModule,
  testModule
]
