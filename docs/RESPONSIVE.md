# 📱 响应式路由系统

## 🎯 核心机制

根据设备宽度（临界点 **768px**）自动切换 PC/移动端路由。

```typescript
// App.tsx
useEffect(() => {
  const handleResize = () => {
    dispatch(setIsMobile(window.innerWidth < 768))
  }
  window.addEventListener('resize', handleResize)
  handleResize()
}, [dispatch])

// 动态生成路由
const router = useMemo(() => {
  const routes = generateRoutes(isMobile)
  return createBrowserRouter(routes as any)
}, [isMobile])
```

---

## 🗺️ 路由对比

| 设备 | 根路径 | 主要路由 | 布局 |
|------|--------|----------|------|
| **PC** | → `/admin/home/page` | `/admin/*` | 侧边栏 |
| **移动端** | → `/mobile` | `/mobile/*` | 底部导航 |
| **通用** | `/login` | 登录页 | - |

---

## 🎨 布局特点

| 布局 | 导航位置 | 特点 |
|------|----------|------|
| **AdminLayout** | 左侧侧边栏 | 可折叠、多级菜单 |
| **MobileLayout** | 底部导航 | 触摸优化、图标导航 |
| **BasicLayout** | 顶部 | 简单页面布局 |

---

## ⚙️ 配置

### 修改断点

```typescript
// src/App.tsx
dispatch(setIsMobile(window.innerWidth < 1024)) // 改为 1024px
```

### 切换路由模式

```typescript
// Hash 模式（解决刷新 404）
import { createHashRouter } from 'react-router-dom'
const router = useMemo(() => {
  return createHashRouter(generateRoutes(isMobile))
}, [isMobile])
```

---

## 📚 相关

- [路由守卫](./ROUTE_GUARD.md)
- [项目结构](./PROJECT_STRUCTURE.md)

