// import { configureStore } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter/counterSlice';

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//   },
// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import appReducer from '@/features/appSlice/app'
const persistConfig = {
  key: 'root', // 存储的 key，可以自定义
  storage, // 使用的存储引擎，这里使用 localStorage
  // whitelist: ['counter'], // 白名单，只有 counterReducer 会被持久化
  // blacklist: [], // 黑名单，指定不持久化的 reducer
};

const rootReducer = combineReducers({
  counter: counterReducer,
  app: appReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 禁用序列化检查，因为 redux-persist 存储的值可能不可序列化
    }),
});

export const persistor = persistStore(store); // 创建 persistor 对象

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;