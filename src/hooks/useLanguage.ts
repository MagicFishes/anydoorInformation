import { useEffect } from 'react'
import { updateLanguage } from '@/i18n'
import { useLanguage as useLanguageStore } from '@/store/storeZustand'

/**
 * Hook：监听 Zustand store 中的语言变化并同步到 i18n
 */
export const useLanguage = () => {
  // 🎯 Zustand：使用便捷 hook
  const language = useLanguageStore()

  useEffect(() => {
    updateLanguage(language)
  }, [language])

  return language
}

