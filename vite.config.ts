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
        sbti: 'sbti.html',
        love: 'love.html',
        work: 'work.html',
        values: 'values.html',
        cyber: 'cyber.html',
        desire: 'desire.html',
        gsti: 'gsti.html',
        fpi: 'fpi.html',
        fsi: 'fsi.html',
        mpi: 'mpi.html',
        xpti: 'xpti.html',
        emti: 'emti.html',
        mbti: 'mbti.html',
        dogti: 'dogti.html',
        cati: 'cati.html',
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
