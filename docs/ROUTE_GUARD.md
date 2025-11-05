# 🛡️ 路由守卫指南

## 📌 核心概念

本项目使用**两个互补的守卫**实现跨端路由保护：

| 守卫 | 位置 | 触发时机 | 用途 |
|------|------|----------|------|
| **静态守卫** | `generateRoutes.tsx` | 路由匹配时 | 拦截错误路径访问 |
| **动态守卫** | `App.tsx` | 窗口变化时 | 自动切换端并跳转 |

---

## 🎯 已实现功能

### 1. 静态路由拦截（generateRoutes.tsx）

```typescript
// 移动端捕获 PC 路径
{ path: '/admin/*', element: <Navigate to="/mobile" /> }

// PC 端捕获移动端路径
{ path: '/mobile/*', element: <Navigate to="/admin/home/page" /> }
```

**效果：** 手机访问 `/admin/home/page` → 自动重定向到 `/mobile`

---

### 2. 动态窗口监听（App.tsx）

```typescript
useEffect(() => {
  if (prevIsMobileRef.current === isMobile) return
  
  const currentPath = window.location.pathname
  
  if (isMobile && currentPath.startsWith('/admin')) {
    window.location.href = '/mobile'
  }
  
  if (!isMobile && currentPath.startsWith('/mobile')) {
    window.location.href = '/admin/home/page'
  }
}, [isMobile])
```

**效果：** PC 页面缩小窗口 < 768px → 自动跳转到移动端

---

## 🔧 添加新守卫

### 方式 1：路由配置守卫

适用于全局重定向，直接在 `generateRoutes.tsx` 中添加路由规则。

### 方式 2：守卫组件

创建 `src/router/guards/AuthGuard.tsx`：

```typescript
export default function AuthGuard({ children }) {
  const { isLoggedIn } = useSelector(state => state.auth)
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }
  
  return <>{children}</>
}
```

使用：
```typescript
{
  path: 'admin',
  element: (
    <AuthGuard>
      <AdminLayout />
    </AuthGuard>
  )
}
```

**原理：** 守卫组件先执行验证逻辑，验证通过才渲染 `children`（目标页面）。

---

## 📊 守卫位置对比

| 位置 | 适用场景 | 优先级 |
|------|----------|--------|
| `generateRoutes.tsx` | 全局路由重定向 | 最高 |
| `App.tsx` | 状态变化响应 | 高 |
| 守卫组件 | 权限验证、登录检查 | 中 |
| 布局组件 | 布局级权限 | 中 |
| 页面组件 | 页面特定逻辑 | 低 |

---

## 🧪 测试

访问测试工具：
- PC：`/admin/test/route-test`
- 移动端：`/mobile/route-test`（窗口 < 768px）

---

## 📚 相关文档

- [项目结构](./PROJECT_STRUCTURE.md)
- [响应式系统](./RESPONSIVE.md)

