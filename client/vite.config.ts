import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In development, send /api requests to the Express server so the
    // frontend can use relative URLs without needing CORS.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
