import type { Plugin } from 'vite'
import { handleGeminiChat } from './gemini.js'
import { handleFoerderChat } from './foerder-gemini.js'

export function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        handleGeminiChat(req, res)
      })
      server.middlewares.use('/api/foerder-chat', (req, res) => {
        handleFoerderChat(req, res)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        handleGeminiChat(req, res)
      })
      server.middlewares.use('/api/foerder-chat', (req, res) => {
        handleFoerderChat(req, res)
      })
    },
  }
}
