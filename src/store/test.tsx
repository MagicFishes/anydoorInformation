import {create} from 'zustand'
import {persist,createJSONStorage} from 'zustand/middleware'
interface TestState {
    count: number
    increase: () => void
    decrease: () => void
  }
export const useTestStore = create<TestState>()(
    persist((set) => ({
        count: 0,
        increase: () => set((state) => ({count: state.count + 1})),
        decrease: () => set((state) => ({count: state.count - 1})),
    }),{
        name: 'test',
        storage: createJSONStorage(() => localStorage),
    })
)