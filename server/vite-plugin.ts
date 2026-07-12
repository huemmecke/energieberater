import type { Plugin } from 'vite'
import { handleGeminiChat } from './gemini.js'

export function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        handleGeminiChat(req, res)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        handleGeminiChat(req, res)
      })
    },
  }
}
