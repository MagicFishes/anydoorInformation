# 布局系统说明

## 📚 布局类型

本项目提供了三种布局组件，用于不同的页面场景：

### 1. AdminLayout（后台管理布局）

**特点**：
- ✅ 带侧边栏
- ✅ 侧边栏可折叠
- ✅ 动态菜单生成
- ✅ 适合后台管理系统

**使用场景**：
- 后台管理页面
- 数据管理界面
- 仪表盘

**路由配置**：
```typescript
{
  path: '/admin',
  element: <AdminLayout />,
  children: computerModules
}
```

**访问示例**：
- `/admin/home/page` - 首页
- `/admin/hooks/useCallback` - Hooks 学习页面

---

### 2. BasicLayout（基础布局）

**特点**：
- ❌ 无侧边栏
- ✅ 简洁干净
- ✅ 支持顶部/底部（可选）
- ✅ 适合普通展示页面

**使用场景**：
- 关于我们
- 联系我们
- 帮助文档
- 产品介绍页

**路由配置**：
```typescript
{
  path: '/pages',
  element: <BasicLayout />,
  children: [
    { path: 'about', element: <About /> },
    { path: 'contact', element: <Contact /> }
  ]
}
```

**访问示例**：
- `/pages/about` - 关于我们
- `/pages/contact` - 联系我们

---

### 3. MobileLayout（移动端布局）

**特点**：
- ❌ 无侧边栏
- ✅ 移动端优化
- ✅ 可添加底部导航
- ✅ 响应式设计

**使用场景**：
- 移动端页面
- H5 页面
- 响应式布局

**路由配置**：
```typescript
{
  path: '/mobile',
  element: <MobileLayout><Outlet /></MobileLayout>
}
```

**访问示例**：
- `/mobile` - 移动端首页

---

## 🎯 布局对比

| 布局 | 侧边栏 | 适用场景 | 路由前缀 |
|------|--------|----------|----------|
| **AdminLayout** | ✅ 有 | 后台管理 | `/admin` |
| **BasicLayout** | ❌ 无 | 普通页面 | `/pages` |
| **MobileLayout** | ❌ 无 | 移动端 | `/mobile` |
| **无布局** | ❌ 无 | 独立页面 | `/login` 等 |

## 🚀 如何选择布局

### 需要后台管理功能？
→ 使用 **AdminLayout** + `/admin` 路径

### 普通展示页面？
→ 使用 **BasicLayout** + `/pages` 路径

### 移动端页面？
→ 使用 **MobileLayout** + `/mobile` 路径

### 完全独立的页面？
→ 不使用布局，直接渲染组件

## 📝 添加新布局

如果需要创建新的布局（如带顶部导航的布局），按以下步骤：

### Step 1: 创建布局组件

```typescript
// src/layouts/NavLayout.tsx
import { Outlet } from 'react-router-dom'

const NavLayout = () => {
  return (
    <div>
      <header>顶部导航栏</header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default NavLayout
```

### Step 2: 在路由中使用

```typescript
// src/router/router.tsx
import NavLayout from '@/layouts/NavLayout'

{
  path: '/shop',
  element: <NavLayout />,
  children: [...]
}
```

## 🎨 自定义布局

每个布局都可以根据需求自定义：

### 添加顶部导航

```typescript
<header className="bg-white shadow h-16">
  <nav>导航栏内容</nav>
</header>
```

### 添加底部信息

```typescript
<footer className="bg-gray-100 py-4">
  <div>版权信息</div>
</footer>
```

### 添加面包屑

```typescript
<div className="breadcrumb">
  Home / Products / Detail
</div>
```

## ⚡ 性能优化

所有布局都使用了 `<Suspense>` 进行懒加载优化：

```typescript
<Suspense fallback={<LoadingFallback />}>
  <Outlet />
</Suspense>
```

## 💡 最佳实践

1. **按功能分组** - 同类功能使用同一个布局
2. **路径规范** - 使用语义化的路由前缀
3. **保持简洁** - 布局组件只负责布局，不处理业务逻辑
4. **响应式设计** - 考虑不同屏幕尺寸的适配

## 🔄 布局切换示例

```typescript
// 路由配置展示三种布局的使用
export const routes = [
  // 1. 后台管理 - 有侧边栏
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [...]
  },
  
  // 2. 普通页面 - 无侧边栏
  {
    path: '/pages',
    element: <BasicLayout />,
    children: [...]
  },
  
  // 3. 移动端 - 无侧边栏
  {
    path: '/mobile',
    element: <MobileLayout>...</MobileLayout>
  },
  
  // 4. 独立页面 - 无布局
  {
    path: '/login',
    element: <Login />
  }
]
```

通过这种方式，可以灵活控制不同页面的布局形式！

