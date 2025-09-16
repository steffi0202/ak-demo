import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
  plugins: [react()],
  base: isDev ? '/' : '/ak-demo/',
  server: {
    proxy: {
      '/api/bff': {
        target: 'https://ak-kpr8p6ezw-steffis-projects-44b1523a.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})