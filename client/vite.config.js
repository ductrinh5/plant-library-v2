// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/plant-library-v2/',   // ← Add this line
  plugins: [react()],
})
