import {  defineConfig  } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import AntdResolver from 'unplugin-auto-import-antd'
// import react from '@vitejs/plugin-react-swc'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // const _env = loadEnv(mode, process.cwd()).VITE_APP_ID??''
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
    },
    plugins: [
      react(),
      AutoImport({
        include: [/\.[tj]sx?$/], // .ts, .tsx, .js, .jsx
        // 插件配置
        imports: [
          'react',
          'react-router-dom',
          {
            'react-redux': ['useSelector', 'useDispatch'], // 导入 useSelector 和 useDispatch
          },
        ],
        dts: './auto-imports.d.ts', // 生成 .d.ts 文件
        resolvers: [
          AntdResolver({
            // prefix: 'A', // 自定义前缀
            //  packageName: 'antd-v5' 包别名引入
          }),
        ],
        // 处理eslint配置
        eslintrc:{
          enabled:true,
          filepath:'./.eslintrc-auto-import.json',
          globalsPropValue:true
        }
      }),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode !== 'production', // 生产环境关闭 sourcemap
      chunkSizeWarningLimit: 1000, // 提高警告阈值
      rollupOptions: {
        output: {
          // 代码分割策略
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
            'ui-vendor': ['antd', '@ant-design/icons'],
          },
          // 优化文件命名
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
      },
      // 压缩配置
      minify: 'esbuild',
      // CSS 代码分割
      cssCodeSplit: true,
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    // 性能优化
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'antd'],
    },
    // 服务器配置
    server: {
      port: 3000,
      open: true,
      cors: true,
    }
  }
})
// https://qiuyedx.com/?p=2438
