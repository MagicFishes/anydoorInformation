import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// import react from '@vitejs/plugin-react-swc'
// https://vite.dev/config/
export default defineConfig({

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
  plugins: [react()],
  build: {
    outDir: 'dist', // 根据需求修改输出目录
    emptyOutDir: true, // 打包前清空输出目录
  },
})
