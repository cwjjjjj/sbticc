import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxImportSource: '@emotion/react',
  })],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        love: 'love.html',
        work: 'work.html',
        values: 'values.html',
        cyber: 'cyber.html',
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
