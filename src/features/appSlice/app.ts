import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isMobile: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'zh';
}

// 安全的初始值获取函数
const getInitialState = (): AppState => {
  // 如果 window 对象不存在（SSR），返回默认值
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      theme: 'dark',
      language: 'zh',
    };
  }
  
  return {
    isMobile: window.innerWidth < 768, // 初始值
    theme: 'dark', // 默认暗色主题
    language: 'zh', // 默认中文
  };
};

const initialState: AppState = getInitialState();

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'zh'>) => {
      state.language = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleLanguage: (state) => {
      state.language = state.language === 'en' ? 'zh' : 'en';
    },
  },
});

export const { setIsMobile, setTheme, setLanguage, toggleTheme, toggleLanguage } = appSlice.actions;
export default appSlice.reducer;