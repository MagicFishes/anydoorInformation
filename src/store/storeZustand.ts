// Zustand Store - 轻量级状态管理（替代 Redux）
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { updateLanguage } from '@/i18n'

interface AppState {
  // 状态
  isMobile: boolean
  theme: 'light' | 'dark'
  language: 'en-US' | 'zh-CN'
  
  // 方法（Actions）
  setIsMobile: (isMobile: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'en-US' | 'zh-CN') => void
  toggleTheme: () => void
  toggleLanguage: () => void
}

// 🎯 Zustand Store - 超级简洁！
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 初始状态
      // ⚠️ 注意：persist 中间件会优先从 localStorage 读取持久化的数据
      // 只有在 localStorage 中没有数据时，才会使用这里的初始值
      // 
      // theme 和 language：会被持久化，如果 localStorage 中有值，会使用持久化的值
      // isMobile：不会被持久化（见 partialize），每次页面加载时在组件中重新计算
      isMobile: false, // 占位值，App.tsx 中会在组件挂载时立即设置正确值
      theme: 'dark' as const, // 默认值，会被 localStorage 中的值覆盖（如果存在）
      language: 'zh-CN' as const, // 默认值，会被 localStorage 中的值覆盖（如果存在）
      
      // Actions（方法）- 直接在 store 中定义，无需额外文件
      setIsMobile: (isMobile) => set({ isMobile }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => {
        set({ language })
        // 自动同步更新 i18n 语言
        updateLanguage(language)
      },
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      toggleLanguage: () => set((state) => {
        const newLanguage = state.language === 'en-US' ? 'zh-CN' : 'en-US'
        // 自动同步更新 i18n 语言
        updateLanguage(newLanguage)
        return { language: newLanguage }
      }),
    }),
    {
      name: 'app-store', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // 🔥 关键：只持久化 theme 和 language，不持久化 isMobile（因为它是响应式的）
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        // isMobile 不持久化，每次根据窗口大小动态计算
      }),
    },
  ),
)

// 可选：导出便捷的 selector hooks（更简洁的使用方式）
export const useAppState = () => useAppStore()
export const useIsMobile = () => useAppStore(state => state.isMobile)
export const useTheme = () => useAppStore(state => state.theme)
export const useLanguage = () => useAppStore(state => state.language)
