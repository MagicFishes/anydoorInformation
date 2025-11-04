import { RouteObject } from '../types'
import { mobileHomeModule } from './homeModule'
import { mobileAppsModule } from './appsModule'
import { mobileProfileModule } from './profileModule'

// 移动端路由模块（模块化管理）
export const mobileModules: RouteObject[] = [
  mobileHomeModule,
  mobileAppsModule,
  mobileProfileModule
]

