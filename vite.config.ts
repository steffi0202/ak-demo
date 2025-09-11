import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ak-demo/',   // <— muss exakt so heißen wie dein Repo
  plugins: [react()],
})