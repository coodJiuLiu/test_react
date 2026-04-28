import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: 'src/mock',
      enable: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
