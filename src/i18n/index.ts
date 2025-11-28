import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhTranslations from '@/locales/zh.json'

// 定义翻译项的类型
type TranslationItem = {
  zh: string
  en: string
}

// 将中文键名的翻译文件转换为 i18next 需要的格式
// 使用 zh-CN 和 en-US 作为语言代码
const resources = {
  'zh-CN': {
    translation: Object.fromEntries(
      Object.entries(zhTranslations as Record<string, TranslationItem>).map(([key, value]) => [
        key,
        value.zh,
      ])
    ),
  },
  'en-US': {
    translation: Object.fromEntries(
      Object.entries(zhTranslations as Record<string, TranslationItem>).map(([key, value]) => [
        key,
        value.en,
      ])
    ),
  },
}

// 从 localStorage 或默认值获取初始语言
const getInitialLanguage = (): 'zh-CN' | 'en-US' => {
  if (typeof window !== 'undefined') {
    // 尝试从 localStorage 读取（Zustand persist 会保存为 'app-store'）
    try {
      const persistedState = localStorage.getItem('app-store')
      if (persistedState) {
        const parsed = JSON.parse(persistedState)
        if (parsed.state?.language) {
          const lang = parsed.state.language
          // 只接受 zh-CN 或 en-US
          if (lang === 'zh-CN' || lang === 'en-US') {
            return lang as 'zh-CN' | 'en-US'
          }
        }
      }
    } catch (e) {
      // 解析失败，使用默认值
    }
  }
  return 'zh-CN' // 默认中文
}

// 初始化 i18next
i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(), // 从存储中读取或使用默认值
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false, // React 已经转义了
  },
})

// 更新语言的函数
export const updateLanguage = (language: 'zh-CN' | 'en-US') => {
  i18n.changeLanguage(language)
}

export default i18n

