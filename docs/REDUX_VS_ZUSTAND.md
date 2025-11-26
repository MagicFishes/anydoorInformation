# 🔄 Redux vs Zustand 对比指南

## 📊 代码复杂度对比

### ❌ Redux 方式（复杂）

#### 1. Store 配置（32行）
```typescript
// store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appReducer from '@/features/appSlice/app'

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  app: appReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

#### 2. Slice 定义（52行）
```typescript
// features/appSlice/app.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isMobile: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'zh';
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    // ... 更多 reducers
  },
});

export const { setIsMobile, setTheme } = appSlice.actions;
export default appSlice.reducer;
```

#### 3. Hooks 封装（8行）
```typescript
// hooks/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector(selector);
```

#### 4. 组件使用（复杂）
```typescript
// 组件中
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setIsMobile } from '@/features/appSlice/app'

const dispatch = useAppDispatch()
const isMobile = useAppSelector(state => state.app.isMobile)
const theme = useAppSelector(state => state.app.theme)

dispatch(setIsMobile(true))
```

#### 5. Provider 包装（必需）
```typescript
// main.tsx
import { Provider } from 'react-redux'
import { store } from './store/store'

<Provider store={store}>
  <App />
</Provider>
```

**总计：~100行代码 + 多个文件**

---

### ✅ Zustand 方式（简洁）

#### 1. Store 定义（一个文件搞定！60行）
```typescript
// store/storeZustand.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AppState {
  isMobile: boolean
  theme: 'light' | 'dark'
  language: 'en' | 'zh'
  setIsMobile: (isMobile: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  // ... 所有方法都在这里
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isMobile: false,
      theme: 'dark',
      language: 'zh',
      setIsMobile: (isMobile) => set({ isMobile }),
      setTheme: (theme) => set({ theme }),
      // ... 所有逻辑
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
```

#### 2. 组件使用（超级简洁！）
```typescript
// 组件中 - 无需导入 dispatch、selector hooks
import { useAppStore } from '@/store/storeZustand'

// 方式1：直接解构
const { isMobile, theme, setIsMobile } = useAppStore()

// 方式2：使用便捷 hooks（性能更好）
import { useIsMobile, useTheme } from '@/store/storeZustand'
const isMobile = useIsMobile()
const theme = useTheme()

// 调用方法：直接调用，无需 dispatch！
setIsMobile(true)
```

#### 3. 无需 Provider！
```typescript
// main.tsx - 什么都不用做！
<App />
```

**总计：~60行代码 + 一个文件**

---

## 🎯 核心差异

| 特性 | Redux | Zustand |
|------|-------|---------|
| **文件数量** | 3-4个文件 | 1个文件 |
| **代码行数** | ~100行 | ~60行 |
| **Provider** | 必需 | 不需要 |
| **Actions** | 需要单独定义和导出 | 直接在 store 中定义 |
| **类型安全** | 需要手动配置 | 自动推断 |
| **使用复杂度** | `dispatch(action())` | 直接调用方法 |
| **学习曲线** | 陡峭 | 平缓 |
| **Bundle 大小** | ~13KB | ~1KB |

---

## 📝 实际使用对比

### Redux（5步）
```typescript
// 1. 导入 hooks 和 actions
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setIsMobile } from '@/features/appSlice/app'

// 2. 获取 dispatch
const dispatch = useAppDispatch()

// 3. 获取状态
const isMobile = useAppSelector(state => state.app.isMobile)

// 4. 调用 action
dispatch(setIsMobile(true))

// 5. 记得在 main.tsx 添加 Provider
```

### Zustand（2步）
```typescript
// 1. 导入 store
import { useAppStore } from '@/store/storeZustand'

// 2. 直接使用
const { isMobile, setIsMobile } = useAppStore()
setIsMobile(true)

// 就这么简单！无需 Provider
```

---

## 🚀 性能对比

### Redux
- 需要 selector 函数进行状态筛选
- 每次状态变化可能触发不必要的重渲染
- 需要手动优化（useMemo, useCallback）

### Zustand
- 自动优化，只订阅需要的状态
- 更少的重渲染
- 内置性能优化

---

## 🎨 使用建议

### 使用 Zustand 当：
- ✅ 需要简单的全局状态管理
- ✅ 想要更少的样板代码
- ✅ 追求更好的开发体验
- ✅ 项目较小或中等规模

### 使用 Redux 当：
- ✅ 有复杂的状态管理需求
- ✅ 需要时间旅行调试
- ✅ 团队已熟悉 Redux 生态
- ✅ 需要强大的中间件系统

---

## 🔄 迁移完成

你的项目现在已经使用 Zustand 管理 app 状态了！

### 已迁移的文件：
- ✅ `src/store/storeZustand.ts` - Zustand store
- ✅ `src/App.tsx` - 使用 Zustand
- ✅ `src/components/header/header.tsx` - 使用 Zustand
- ✅ `src/components/footer/footer.tsx` - 使用 Zustand
- ✅ `src/hooks/useLanguage.ts` - 使用 Zustand

### 保留 Redux：
- `src/store/store.ts` - 如果还有其他 reducer（如 counter），可以保留
- `src/features/appSlice/app.ts` - 可以删除或保留作为参考

---

## 💡 最佳实践

### 1. 选择性地订阅状态
```typescript
// ✅ 好：只订阅需要的状态
const isMobile = useAppStore(state => state.isMobile)

// ❌ 不好：订阅整个 store
const store = useAppStore()
```

### 2. 使用便捷 hooks
```typescript
// ✅ 好：使用封装好的 hooks
import { useIsMobile, useTheme } from '@/store/storeZustand'
const isMobile = useIsMobile()

// ✅ 也可以：直接使用
const { isMobile } = useAppStore()
```

### 3. 方法可以直接使用
```typescript
// ✅ Zustand：直接调用
const { toggleTheme } = useAppStore()
toggleTheme()

// ❌ Redux：需要 dispatch
dispatch(toggleTheme())
```

---

## 🎉 总结

**Zustand 比 Redux 简单 70%！**

- 更少的代码
- 更少的文件
- 更简单的使用
- 更好的性能
- 更少的样板代码

**现在你的代码更简洁、更容易维护了！** 🚀

