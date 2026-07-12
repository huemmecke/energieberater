import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { geminiApiPlugin } from './server/vite-plugin.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), geminiApiPlugin()],
  build: {
    rollupOptions: {
      input: {
        website: resolve(__dirname, 'index.html'),
        berater: resolve(__dirname, 'berater.html'),
        checkliste: resolve(__dirname, 'checkliste.html'),
        ui: resolve(__dirname, 'ui.html'),
      },
    },
  },
})
