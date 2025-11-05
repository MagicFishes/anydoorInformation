# ⚛️ myReact - 响应式路由系统

基于 React 19 + TypeScript + Vite 的现代化响应式路由系统，支持 PC/移动端自动切换。

---

## ✨ 核心特性

- 🔄 **响应式路由** - 根据设备宽度（768px）自动切换路由
- 🛡️ **路由守卫** - 跨端路径自动重定向，避免 404
- 📱 **移动端优化** - 专门的移动端布局和导航
- 🖥️ **PC 端后台** - 带侧边栏的管理系统
- ⚡ **自动导航** - 窗口变化自动跳转首页
- 🧪 **测试工具** - 内置路由测试页面

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:3000

# 构建生产版本
npm run build
```

---

## 📚 文档

完整文档请访问 **[docs 文件夹](./docs/)**：

| 文档 | 说明 |
|------|------|
| [📚 文档中心](./docs/README.md) | 文档索引和快速开始 |
| [🛡️ 路由守卫](./docs/ROUTE_GUARD.md) | 路由守卫机制和使用 |
| [📱 响应式系统](./docs/RESPONSIVE.md) | PC/移动端自动切换 |
| [📁 项目结构](./docs/PROJECT_STRUCTURE.md) | 目录结构和技术栈 |

---

## 🧪 测试

### 路由测试工具

- **PC 端：** `http://localhost:3000/admin/test/route-test`
- **移动端：** `http://localhost:3000/mobile/route-test`（窗口 < 768px）

### 测试清单

- [x] PC 端访问 PC 路径 → 正常
- [x] 移动端访问移动端路径 → 正常
- [x] 跨端访问 → 自动重定向
- [x] 窗口缩放 → 自动切换端

---

## 📊 路由规则

| 设备 | 根路径 | 主要路由 | 布局 |
|------|--------|----------|------|
| PC | `/admin/home/page` | `/admin/*` | 侧边栏 |
| 移动端 | `/mobile` | `/mobile/*` | 底部导航 |
| 通用 | `/login` | 登录页 | - |

---

## 🔧 技术栈

- ⚛️ **React 19** + 📘 **TypeScript** + ⚡ **Vite**
- 🎨 **Ant Design** + **Tailwind CSS**
- 🔄 **React Router v7** + **Redux Toolkit**

---

## 📝 开发指南

### 添加新页面

#### PC 端
```typescript
// 1. 创建组件：src/pages/NewPage.tsx
// 2. 添加路由：src/router/computer/homeModule.tsx
{
  path: 'newpage',
  element: <NewPage />,
  meta: { key: 'new-page', label: '新页面' }
}
```

#### 移动端
```typescript
// 1. 创建组件：src/pages/mobile/NewPage.tsx
// 2. 添加路由：src/router/mobile/index.tsx
{
  path: 'newpage',
  element: <NewPage />,
  meta: { key: 'mobile-newpage', label: '新页面' }
}
```

### 添加路由守卫

详见 [路由守卫文档](./docs/ROUTE_GUARD.md)

---

## ⚙️ 配置

### 修改断点

```typescript
// src/App.tsx
dispatch(setIsMobile(window.innerWidth < 1024)) // 改为 1024px
```

### 切换路由模式

```typescript
// src/App.tsx - Hash 模式（解决刷新 404）
import { createHashRouter } from 'react-router-dom'
const router = useMemo(() => {
  return createHashRouter(generateRoutes(isMobile))
}, [isMobile])
```

---

## 💡 常见问题

**Q: 为什么窗口缩放后会自动跳转？**  
A: 自动导航功能，确保用户在正确的端。详见 [响应式系统](./docs/RESPONSIVE.md)

**Q: 如何添加登录验证？**  
A: 创建守卫组件。详见 [路由守卫](./docs/ROUTE_GUARD.md)

**Q: 刷新页面出现 404？**  
A: 配置服务器重写规则或使用 Hash 路由。详见 [响应式系统](./docs/RESPONSIVE.md#配置)

---

## 📄 许可证

MIT

---

## 🙏 致谢

基于 [React](https://react.dev/)、[Vite](https://vitejs.dev/)、[React Router](https://reactrouter.com/)、[Redux Toolkit](https://redux-toolkit.js.org/)、[Ant Design](https://ant.design/) 等优秀开源项目构建。
