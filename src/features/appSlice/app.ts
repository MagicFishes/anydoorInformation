import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isMobile: boolean;
}

const initialState: AppState = {
  isMobile: window.innerWidth < 768, // 初始值
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
});

export const { setIsMobile } = appSlice.actions;
export default appSlice.reducer;