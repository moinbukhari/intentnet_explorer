import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // 98.css contains `@media (not(hover))`, which lightningcss rejects.
    cssMinify: 'esbuild',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
