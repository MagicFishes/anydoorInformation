import { configureStore, combineReducers } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appReducer from '@/features/appSlice/app'

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['counter'], // 只持久化指定的 reducer
  // blacklist: [], // 指定不持久化的 reducer
}

const rootReducer = combineReducers({
  counter: counterReducer,
  app: appReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist 需要禁用序列化检查
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch