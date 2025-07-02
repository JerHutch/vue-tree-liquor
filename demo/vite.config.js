import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8082
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      'liquor-tree': resolve(__dirname, '../src/main.js')
    }
  }
})