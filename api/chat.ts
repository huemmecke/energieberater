import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleGeminiChat } from '../server/gemini.js'

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return handleGeminiChat(req, res)
}
