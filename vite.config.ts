import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 9001,
    strictPort: true,
    host: true, // Cho phép truy cập từ bên ngoài
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'source-thereby-highways-ecommerce.trycloudflare.com',
      '.trycloudflare.com' // Cho phép tất cả subdomain của trycloudflare.com
    ],
    // Proxy được sử dụng khi dev để tránh CORS, nhưng vì đã set VITE_API_URL=http://localhost:8000/api
    // nên không cần proxy nữa, frontend sẽ gọi trực tiếp đến API
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8000',
    //     changeOrigin: true
    //   }
    // }
  }
}) 