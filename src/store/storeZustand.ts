// Zustand Store - 轻量级状态管理
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface StoreState {
  bears: number
  sound: string
  fishies: any
  increasePopulation: () => void
  removeAllBears: () => void
  fetch: (pond: any) => Promise<void>
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      bears: 0,
      sound: '',
      fishies: {},
      increasePopulation: () => set((state) => ({ ...state, bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
      fetch: async (pond: any) => {
        const sound = get().sound
        const response = await fetch(pond)
        const data = await response.json()
        set({ fishies: data })
      },
    }),
    {
      name: 'my-store', // 存储在 localStorage 中的 key
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
    },
  ),
)

export default useStore

