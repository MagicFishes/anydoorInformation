# 📚 myReact 文档中心

## 🚀 快速开始

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

---

## 📖 核心文档

### [🛡️ 路由守卫](./ROUTE_GUARD.md)
路由守卫机制、已实现功能、如何添加新守卫

### [📱 响应式系统](./RESPONSIVE.md)
PC/移动端自动切换、路由配置、布局对比

### [📁 项目结构](./PROJECT_STRUCTURE.md)
目录结构、文件说明、技术栈

---

## ✨ 核心特性

- ✅ **响应式路由** - 根据窗口宽度（768px）自动切换
- ✅ **路由守卫** - 跨端访问自动重定向
- ✅ **自动导航** - 窗口变化自动跳转首页
- ✅ **测试工具** - 内置路由测试页面

---

## 🎯 快速链接

| 功能 | PC 端 | 移动端 |
|------|-------|--------|
| **首页** | `/admin/home/page` | `/mobile` |
| **测试工具** | `/admin/test/route-test` | `/mobile/route-test` |
| **登录** | `/login` | `/login` |

---

## 🔧 技术栈

- React 19 + TypeScript + Vite
- React Router v7 + Redux Toolkit
- Ant Design + Tailwind CSS

---

## 📝 开发指南

### 添加 PC 端页面
1. 在 `src/pages/` 创建组件
2. 在 `src/router/computer/` 添加路由
3. 配置 `meta` 信息

### 添加移动端页面
1. 在 `src/pages/mobile/` 创建组件
2. 在 `src/router/mobile/index.tsx` 添加路由

### 添加路由守卫
参考 [路由守卫文档](./ROUTE_GUARD.md)

---

## ⚡ 常见问题

**Q: 为什么窗口缩放后会跳转？**  
A: 自动导航功能，确保用户在正确的端。详见 [响应式系统](./RESPONSIVE.md)

**Q: 如何添加权限验证？**  
A: 创建守卫组件。详见 [路由守卫](./ROUTE_GUARD.md)

**Q: 刷新页面出现 404？**  
A: 配置服务器重写规则或使用 Hash 路由。详见 [响应式系统](./RESPONSIVE.md#配置)
