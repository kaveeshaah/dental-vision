import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '^/(predict|health|login|register|patients|report|analytics|chat)(/.*)?$': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        bypass(req) {
          if (req.headers.accept?.includes('text/html')) {
            return req.url
          }
        }
      }
    },
  },
})
