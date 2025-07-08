// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware';
// interface StoreState {
//   bears: number;
//   sound: string;
//   fishies: any; // 假设 fishies 的类型是 any，根据实际情况修改
//   increasePopulation: () => void;
//   removeAllBears: () => void;
//   fetch: (pond: any) => Promise<void>;
// }
// const useStore = create<StoreState>((set, get) => ({
//   bears: 0,
//   sound: '',
//   fishies:{},
//   increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
//   fetch: async (pond: any) => {
//     const sound = get().sound
//     const response = await fetch(pond)
//     set({ fishies: await response.json() })
//   },
// }))

// export default useStore
// 添加持久化
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
      increasePopulation: () => set((state) => ({...state, bears: state.bears + 1 })),
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
