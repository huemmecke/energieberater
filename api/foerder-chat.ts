import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleFoerderChat } from '../server/foerder-gemini.js'

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return handleFoerderChat(req, res)
}
