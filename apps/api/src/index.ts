import { serve } from '@hono/node-server'
import { app } from './server'
import { env } from './env'

serve({
  fetch: app.fetch,
  port: Number(env.PORT)
})

console.log(`🚀 API running on http://localhost:${env.PORT}`)