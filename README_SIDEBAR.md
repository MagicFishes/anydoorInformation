# 侧边栏布局使用说明

## 📚 简单设计思路

通过**引入不同的布局组件**来控制是否显示侧边栏，不需要复杂的权限验证系统。

## 🎯 核心概念

### 1. 布局控制侧边栏

```tsx
// ✅ 需要侧边栏 - 路由放在 AdminLayout 下
{
  path: '/admin',
  element: <AdminLayout />,  // 带侧边栏的布局
  children: [
    { path: 'home', element: <Home /> },
    { path: 'hooks', element: <Hooks /> }
  ]
}

// ❌ 不需要侧边栏 - 路由独立定义
{
  path: '/login',
  element: <Login />  // 没有布局包裹，自然没有侧边栏
}
```

### 2. 侧边栏自动生成

侧边栏菜单直接从 `menuConfig.ts` 配置生成，不需要手动创建：

```typescript
// src/router/menuConfig.ts
export const menuConfig: MenuItem[] = [
  {
    key: 'home',
    label: '首页模块',
    icon: '🏠',
    path: '/admin/home',
    children: [
      { key: 'home-page', label: '主页', path: '/admin/home/page' }
    ]
  }
]
```

## 📁 文件结构

```
src/
├── layouts/
│   ├── AdminLayout.tsx         # 带侧边栏的后台布局
│   ├── BasicLayout.tsx         # 基础布局（无侧边栏）
│   └── MobileLayout.tsx        # 移动端布局
├── router/
│   ├── generateRoutes.tsx      # 动态路由生成器（根据设备类型）
│   ├── types.ts                # 路由类型定义
│   ├── computer/               # PC端路由模块
│   │   ├── index.tsx           # 模块导出
│   │   ├── homeModule.tsx      # 首页模块
│   │   ├── hooksModule.tsx     # Hooks 模块
│   │   └── testModule.tsx      # 测试模块
│   └── mobile/                 # 移动端路由模块
│       ├── index.tsx           # 模块导出
│       ├── homeModule.tsx      # 首页模块
│       ├── appsModule.tsx      # 应用模块
│       └── profileModule.tsx   # 个人中心模块
└── components/
    └── SidebarMenu/
        └── index.tsx           # 侧边栏菜单组件
```

## 🚀 使用方法

### 添加新的模块（路由 + 菜单）

#### Step 1: 创建模块文件（路由 + 菜单一起）

```typescript
// src/router/computer/newModule.tsx
import { RouteObject, Navigate } from 'react-router-dom'
import { lazy } from 'react'

// 页面懒加载
const NewModulePage1 = lazy(() => import('@/pages/newModule/Page1'))
const NewModulePage2 = lazy(() => import('@/pages/newModule/Page2'))

// 路由配置
export const newModule: RouteObject = {
  path: 'newModule',
  children: [
    { index: true, element: <Navigate to="page1" replace /> },
    { path: 'page1', element: <NewModulePage1 /> },
    { path: 'page2', element: <NewModulePage2 /> }
  ]
}

// 菜单元数据（用于侧边栏显示）
export const newModuleMenuMeta = {
  key: 'newModule',
  label: '新模块',
  icon: '🎉',
  path: '/admin/newModule',
  children: [
    { key: 'newModule-page1', label: '页面1', path: '/admin/newModule/page1' },
    { key: 'newModule-page2', label: '页面2', path: '/admin/newModule/page2' }
  ]
}
```

#### Step 2: 在 `computer/index.tsx` 中导出

```typescript
// src/router/computer/index.tsx
import { homeModule, homeMenuMeta } from './homeModule'
import { hooksModule, hooksMenuMeta } from './hooksModule'
import { testModule, testMenuMeta } from './testModule'
import { newModule, newModuleMenuMeta } from './newModule' // 新增

// 路由模块
export const computerModules: RouteObject[] = [
  homeModule,
  hooksModule,
  testModule,
  newModule // 新增
]

// 菜单配置
export const computerMenus: MenuItem[] = [
  homeMenuMeta,
  hooksMenuMeta,
  testMenuMeta,
  newModuleMenuMeta // 新增
]
```

✅ 完成！只需在一个文件中配置，侧边栏和路由自动生效。

### 添加不需要侧边栏的页面

直接在 `routes` 数组中添加平级路由：

```typescript
export const routes: RouteObject[] = [
  // ...admin routes
  {
    path: '/standalone',
    element: <StandalonePage />  // 不被任何布局包裹
  }
]
```

## 🎨 布局类型

### 1. AdminLayout（后台管理布局）

- ✅ 带侧边栏
- ✅ 侧边栏可折叠
- ✅ 状态持久化
- 适用于：后台管理系统、仪表盘

### 2. 普通页面（无布局）

- ❌ 无侧边栏
- 适用于：登录页、落地页、公开页面

### 3. MobileLayout（移动端布局）

- ❌ 无侧边栏
- 适用于：移动端页面

## 💡 特性

### 侧边栏功能

- ✅ **自动展开/收起** - 点击模块标题切换
- ✅ **路由高亮** - 当前页面自动高亮
- ✅ **状态缓存** - 记住展开状态到 localStorage
- ✅ **折叠模式** - 侧边栏可以折叠为图标模式
- ✅ **响应式** - 自适应不同屏幕尺寸

### 路由特性

- ✅ **懒加载** - 页面组件按需加载
- ✅ **重定向** - 模块根路径自动跳转到默认页面
- ✅ **嵌套路由** - 支持多级路由结构

## 📊 路由结构示例

```
/                           → 重定向到 /admin/home/page
/admin                      → AdminLayout (带侧边栏)
  ├─ /admin/home           
  │   ├─ /admin/home/index
  │   └─ /admin/home/page
  ├─ /admin/hooks
  │   ├─ /admin/hooks/useCallback
  │   └─ /admin/hooks/useContext
  └─ /admin/test
      └─ /admin/test/text
/login                      → 独立页面（无侧边栏）
/mobile                     → MobileLayout
```

## 🔧 自定义

### 修改侧边栏宽度

```tsx
// src/layouts/AdminLayout.tsx
${collapsed ? 'w-[60px]' : 'w-[260px]'}  // 修改这里的宽度
```

### 修改侧边栏样式

```tsx
// src/components/SidebarMenu/index.tsx
className="bg-gray-50 border-r border-gray-200"  // 修改背景和边框
```

### 添加顶部导航栏

在 `AdminLayout.tsx` 中添加：

```tsx
<div className="flex flex-col h-screen">
  {/* 顶部导航栏 */}
  <header className="h-16 bg-white shadow">
    <div>顶部导航栏</div>
  </header>
  
  {/* 侧边栏 + 内容 */}
  <div className="flex flex-1">
    {/* 侧边栏 */}
    <div>...</div>
    
    {/* 内容区 */}
    <div>...</div>
  </div>
</div>
```

## ⚠️ 注意事项

1. **路径一致性**：菜单元数据中的 `path` 必须和路由配置的路径一致
2. **key 唯一性**：每个菜单项的 `key` 必须唯一
3. **模块重定向**：建议为每个模块添加 `index: true` 的重定向路由
4. **单一数据源**：路由和菜单配置在同一个模块文件中，避免维护两份配置

## 🔄 线上部署（权限控制）

如果需要线上动态权限控制，可以这样改造：

```typescript
// 1. 从接口获取用户权限菜单
const fetchUserMenu = async () => {
  const response = await fetch('/api/user/menu')
  return response.json()
}

// 2. 在 AdminLayout 中使用
const [userMenu, setUserMenu] = useState<MenuItem[]>([])

useEffect(() => {
  fetchUserMenu().then(setUserMenu)
}, [])

// 3. 传递给 SidebarMenu
<SidebarMenu menuItems={userMenu} />
```

这样线上可以根据后端接口返回不同的菜单，线下直接使用 `computerMenus` 全量显示。

## 📂 模块化路由结构

### 当前结构（单一数据源）

```typescript
// src/router/computer/homeModule.tsx
export const homeModule: RouteObject = { ... }      // 路由配置
export const homeMenuMeta = { ... }                  // 菜单配置

// src/router/computer/index.tsx
export const computerModules: RouteObject[] = [     // 导出路由
  homeModule, hooksModule, testModule
]
export const computerMenus: MenuItem[] = [          // 导出菜单
  homeMenuMeta, hooksMenuMeta, testMenuMeta
]

// src/router/router.tsx
{
  path: '/admin',
  element: <AdminLayout />,
  children: computerModules                         // 使用路由
}

// src/components/SidebarMenu/index.tsx
import { computerMenus } from '@/router/computer'   // 使用菜单
```

### 单一数据源优势

1. ✅ **单一数据源** - 路由和菜单在同一文件中，避免不一致
2. ✅ **易于维护** - 添加模块只需创建一个文件
3. ✅ **类型安全** - TypeScript 确保路由和菜单配置正确
4. ✅ **团队协作友好** - 独立开发不同模块

## 📝 总结

- ✅ **简单直观** - 通过布局控制侧边栏
- ✅ **模块化** - 路由按功能模块组织
- ✅ **单一数据源** - 路由和菜单配置在一起，避免不一致
- ✅ **灵活扩展** - 添加模块只需一个文件
- ✅ **性能优化** - 路由懒加载、状态缓存

## 🎯 添加新模块仅需 2 步

1. 创建模块文件（包含路由 + 菜单元数据）
2. 在 `computer/index.tsx` 中导出

