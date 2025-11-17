# useContext Hook 完整教程

## 📖 一、useContext 的作用

`useContext` 是 React 提供的一个 Hook，用于**在组件树中跨层级传递数据**，避免通过 props 逐层传递（避免 "prop drilling" 问题）。

### 核心作用：
1. **订阅 Context 值**：让组件能够读取最近的 Context Provider 提供的值
2. **避免 prop drilling**：不需要通过中间组件一层层传递 props
3. **自动更新**：当 Context 的值发生变化时，使用 `useContext` 的组件会自动重新渲染
  
---

## 🎯 二、使用场景

### 1. **主题切换（深色/浅色模式）**
```typescript
// 主题 Context
const ThemeContext = createContext<'light' | 'dark'>('light')

// 在任意组件中切换主题
const { theme, toggleTheme } = useContext(ThemeContext)
```

### 2. **用户认证信息**
```typescript
// 用户信息 Context
const AuthContext = createContext<{
  user: User | null
  login: (user: User) => void
  logout: () => void
} | null>(null)

// 在任意组件中获取用户信息
const { user, login, logout } = useContext(AuthContext)
```

### 3. **语言/国际化**
```typescript
// 语言 Context
const LanguageContext = createContext<{
  language: 'zh' | 'en'
  t: (key: string) => string
} | null>(null)
```

### 4. **全局配置**
```typescript
// API 配置、功能开关等
const ConfigContext = createContext<{
  apiUrl: string
  features: Record<string, boolean>
} | null>(null)
```

### 5. **共享状态管理**
```typescript
// 购物车、通知、全局状态等
const CartContext = createContext<{
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
} | null>(null)
```

---

## 🔧 三、如何使用

### 步骤 1：创建 Context

```typescript
import { createContext } from 'react'

// 定义 Context 的类型
interface MyContextType {
  value: string
  setValue: (value: string) => void
}

// 创建 Context，初始值可以是 null 或默认值
export const MyContext = createContext<MyContextType | null>(null)
```

### 步骤 2：创建 Provider 组件

```typescript
import { useState, useMemo } from 'react'
import { MyContext } from './MyContext'

export function MyProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState('初始值')

  // ⚠️ 重要：使用 useMemo 优化 value
  // 避免每次渲染都创建新对象，导致不必要的重渲染
  const contextValue = useMemo(
    () => ({ value, setValue }),
    [value] // 依赖项
  )

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  )
}
```

### 步骤 3：在组件中使用 useContext

```typescript
import { useContext } from 'react'
import { MyContext } from './MyContext'

function MyComponent() {
  // 获取 Context 的值
  const context = useContext(MyContext)

  // ⚠️ 重要：进行空值检查
  if (!context) {
    return <div>错误：组件未被 Provider 包裹</div>
  }

  const { value, setValue } = context

  return (
    <div>
      <p>当前值：{value}</p>
      <button onClick={() => setValue('新值')}>更新</button>
    </div>
  )
}
```

### 步骤 4：在应用中使用 Provider

```typescript
import { MyProvider } from './MyProvider'
import { MyComponent } from './MyComponent'

function App() {
  return (
    <MyProvider>
      <MyComponent />
    </MyProvider>
  )
}
```

---

## ⚠️ 四、需要注意的知识点

### 1. **性能优化：使用 useMemo 优化 value**

❌ **错误示例**（会导致不必要的重渲染）：
```typescript
function MyProvider({ children }) {
  const [value, setValue] = useState('初始值')
  
  // 每次渲染都会创建新对象，导致所有子组件重新渲染
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  )
}
```

✅ **正确示例**：
```typescript
function MyProvider({ children }) {
  const [value, setValue] = useState('初始值')
  
  // 使用 useMemo，只有 value 变化时才创建新对象
  const contextValue = useMemo(
    () => ({ value, setValue }),
    [value]
  )
  
  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  )
}
```

### 2. **空值检查**

如果 Context 的初始值是 `null`，使用前必须检查：

```typescript
const context = useContext(MyContext)

if (!context) {
  // 处理未包裹 Provider 的情况
  return <div>错误提示</div>
}

// 安全使用
const { value } = context
```

### 3. **Context 拆分**

如果 Context 包含很多数据，考虑拆分成多个 Context，避免不必要的重渲染：

```typescript
// ❌ 不推荐：一个大的 Context
const AppContext = createContext<{
  user: User
  theme: Theme
  language: Language
  // ... 很多其他数据
} | null>(null)

// ✅ 推荐：拆分成多个 Context
const UserContext = createContext<User | null>(null)
const ThemeContext = createContext<Theme | null>(null)
const LanguageContext = createContext<Language | null>(null)
```

### 4. **避免过度使用**

Context 不是万能的，不要用它替代所有状态管理：

- ✅ **适合**：全局配置、主题、用户信息等需要跨多个组件共享的数据
- ❌ **不适合**：局部状态、父子组件之间的简单数据传递

### 5. **默认值的使用**

```typescript
// 方式 1：使用 null（需要空值检查）
const MyContext = createContext<MyType | null>(null)

// 方式 2：提供默认值（不需要空值检查，但可能不够灵活）
const MyContext = createContext<MyType>({
  value: '默认值',
  setValue: () => {}
})
```

### 6. **多个 Provider 嵌套**

可以嵌套多个 Provider，组件会使用最近的 Provider 的值：

```typescript
<ThemeProvider>
  <LanguageProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </LanguageProvider>
</ThemeProvider>
```

### 7. **自定义 Hook 封装**

为了更好的类型安全和易用性，可以封装自定义 Hook：

```typescript
// 创建自定义 Hook
export function useMyContext() {
  const context = useContext(MyContext)
  
  if (!context) {
    throw new Error('useMyContext 必须在 MyProvider 内部使用')
  }
  
  return context
}

// 使用
function MyComponent() {
  const { value, setValue } = useMyContext() // 不需要空值检查
  // ...
}
```

---

## 📊 五、useContext vs 其他方案

| 方案 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **useContext** | 跨层级传递数据 | 简单、内置支持 | 可能导致不必要的重渲染 |
| **Props** | 父子组件传递 | 简单、明确 | 需要逐层传递（prop drilling） |
| **Redux/Zustand** | 复杂全局状态 | 强大的状态管理 | 学习成本、代码复杂度 |
| **状态提升** | 兄弟组件共享 | 简单直接 | 只适合简单场景 |

---

## 🎓 六、最佳实践总结

1. ✅ **使用 useMemo 优化 Provider 的 value**
2. ✅ **进行空值检查或使用自定义 Hook**
3. ✅ **合理拆分 Context，避免单个 Context 过大**
4. ✅ **不要过度使用，只用于真正需要跨层级共享的数据**
5. ✅ **考虑使用自定义 Hook 封装，提高代码可读性**
6. ✅ **为 Context 提供清晰的类型定义**

---

## 📝 七、完整示例

参考项目中的文件：
- `src/pages/home/useContentCreat.tsx` - Context 创建和 Provider
- `src/pages/home/useContent.tsx` - useContext 使用示例

运行项目后访问 `/admin/hooks/useContext` 查看完整示例。

---

## 🔗 相关资源

- [React 官方文档 - useContext](https://react.dev/reference/react/useContext)
- [React 官方文档 - Context](https://react.dev/learn/passing-data-deeply-with-context)

