import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 前端统一用 /api 前缀；代理时把 /api 去掉转发到后端
      '/api': {
        target: 'http://172.20.10.2:9000', // 你的后端
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // /api/code -> /code
      },
    },
  },
  resolve: { alias: { '@': '/src' } },
})
