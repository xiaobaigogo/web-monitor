import path from "path"
import typescript from "@rollup/plugin-typescript"
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: './src/index.ts',
  output: {
    file: path.resolve(__dirname, './dist/index.esm.js'),
    format: 'cjs'
  },
  plugins: [
    // 打包插件
    typescript(), // 解析TypeScript
    // 本地服务器
    serve({
      open: true, // 在浏览器中启动
      openPage: '/index.html', // 初始页面
      contentBase: './', // 入口 html 文件位置
      host: 'localhost',
      port: 8000,
    }),
    // 热更新 默认监听根文件夹
    livereload(),
  ],
}