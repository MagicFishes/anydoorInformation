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
          'react-router',
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
        // outDir: "dist"+(env==='GORYM'?'':'_'+env),
      outDir: 'dist', // 根据需求修改输出目录
      emptyOutDir: true, // 打包前清空输出目录
      
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    }
  }
})
// https://qiuyedx.com/?p=2438
