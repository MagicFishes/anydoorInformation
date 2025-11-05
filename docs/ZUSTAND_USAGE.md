# 🐻 Zustand 使用指南

Zustand 是一个轻量级的状态管理库，比 Redux 更简单易用。

## 📦 已安装

```json
{
  "zustand": "^5.0.6"
}
```

## 📁 Store 位置

- **文件路径**：`src/store/storeZustand.ts`
- **特性**：带持久化（localStorage）

## 🚀 基础使用

### 1. 在组件中使用

```tsx
import useStore from '@/store/storeZustand'

function BearCounter() {
  // 订阅单个状态
  const bears = useStore((state) => state.bears)
  
  // 订阅多个状态
  const { bears, increasePopulation } = useStore((state) => ({
    bears: state.bears,
    increasePopulation: state.increasePopulation
  }))
  
  return (
    <div>
      <h1>{bears} 只熊在这里</h1>
      <button onClick={increasePopulation}>增加熊的数量</button>
    </div>
  )
}
```

### 2. 选择器优化（避免不必要的重渲染）

```tsx
// ✅ 好：只订阅需要的状态
const bears = useStore((state) => state.bears)

// ❌ 不好：订阅整个 store，任何变化都会触发重渲染
const store = useStore()
```

## 🔧 Store 配置示例

当前 `storeZustand.ts` 包含：

```typescript
interface StoreState {
  bears: number                           // 示例：熊的数量
  sound: string                           // 示例：声音
  fishies: any                            // 示例：鱼的数据
  increasePopulation: () => void          // 方法：增加熊的数量
  removeAllBears: () => void              // 方法：移除所有熊
  fetch: (pond: any) => Promise<void>     // 方法：异步获取数据
}
```

### 自定义你的 Store

修改 `src/store/storeZustand.ts`：

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserStore {
  user: {
    id: string
    name: string
    email: string
  } | null
  setUser: (user: UserStore['user']) => void
  logout: () => void
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useUserStore
```

## 🎯 常见使用场景

### 1. 用户认证状态

```typescript
// src/store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: any | null
  isAuthenticated: boolean
  login: (token: string, user: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)
```

### 2. 主题切换

```typescript
// src/store/themeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
    }),
    { name: 'theme-storage' }
  )
)
```

### 3. 购物车

```typescript
// src/store/cartStore.ts
import { create } from 'zustand'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  clearCart: () => set({ items: [] }),
  // 计算属性：使用 get() 获取最新状态
  get total() {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}))
```

## 🆚 Zustand vs Redux

### Zustand 优势
- ✅ **更简单**：无需 Provider、actions、reducers
- ✅ **更少代码**：通常减少 70% 的模板代码
- ✅ **更灵活**：可以创建多个独立的 store
- ✅ **TypeScript 友好**：天然支持，类型推断准确
- ✅ **体积小**：仅 1KB（gzipped）

### Redux 优势  
- ✅ **生态丰富**：有大量中间件和工具
- ✅ **DevTools 强大**：时间旅行调试
- ✅ **社区大**：更多学习资源

## 🔄 与 Redux 共存

你的项目同时有 Redux 和 Zustand，可以这样分工：

```typescript
// Redux：用于全局复杂状态（如用户认证、路由等）
// ✅ App.tsx 中已配置
import { useSelector, useDispatch } from 'react-redux'

// Zustand：用于组件级或模块级简单状态
import useStore from '@/store/storeZustand'

function MyComponent() {
  // Redux：全局 isMobile 状态
  const isMobile = useSelector((state: RootState) => state.app.isMobile)
  
  // Zustand：局部 UI 状态
  const bears = useStore((state) => state.bears)
  
  return <div>...</div>
}
```

## 📚 高级用法

### 1. 不持久化某些状态

```typescript
const useStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      tempData: null, // 这个会被持久化
    }),
    {
      name: 'storage',
      // 只持久化 user
      partialize: (state) => ({ user: state.user })
    }
  )
)
```

### 2. 订阅外部变化

```typescript
// 在组件外部监听状态变化
useStore.subscribe(
  (state) => state.bears,
  (bears) => {
    console.log('熊的数量变化了:', bears)
  }
)
```

### 3. 不触发渲染的状态更新

```typescript
// 临时获取状态，不订阅
const bears = useStore.getState().bears

// 手动设置状态，不触发渲染
useStore.setState({ bears: 5 })
```

## 🎨 示例：在你的项目中使用

```tsx
// src/pages/Test/ZustandDemo.tsx
import useStore from '@/store/storeZustand'

export default function ZustandDemo() {
  const { bears, increasePopulation, removeAllBears } = useStore()
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Zustand 示例</h1>
      
      <div className="space-y-4">
        <p className="text-lg">熊的数量: {bears}</p>
        
        <div className="space-x-2">
          <button 
            onClick={increasePopulation}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            增加熊 +1
          </button>
          
          <button 
            onClick={removeAllBears}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            移除所有熊
          </button>
        </div>
        
        <p className="text-sm text-gray-500">
          刷新页面后数据依然存在（已启用持久化）
        </p>
      </div>
    </div>
  )
}
```

## 📖 官方文档

- 官网：https://zustand-demo.pmnd.rs/
- GitHub：https://github.com/pmndrs/zustand
- 中文文档：https://awesomedevin.github.io/zustand-vue/docs/introduce/what-is-zustand

---

**现在你可以开始使用 Zustand 了！** 🎉

