import { Hono, Context } from 'hono'
import { verifyToken } from './lib/privy'
import { createTipPaymentRequest, verifyTipPayment } from './lib/x402'

type User = {
  userId: string
  walletAddress?: string
}

type Env = {
  Variables: {
    user: User
  }
}

export const app = new Hono<Env>()

// Auth middleware
const authMiddleware = async (c: Context<Env>, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401)
  }

  const token = authHeader.substring(7)
  
  try {
    const user = await verifyToken(token)
    c.set('user', user)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

app.get('/health', c => {
  return c.json({ status: 'ok' })
})

app.get('/me', authMiddleware, c => {
  const user = c.get('user')
  return c.json(user)
})

app.post('/tip', async (c) => {
  const paymentProof = c.req.header('X-PAYMENT')
  
  // If no payment proof, return 402 with payment request
  if (!paymentProof) {
    const paymentRequest = createTipPaymentRequest()
    return c.json(
      {
        error: 'Payment required',
        payment: paymentRequest,
      },
      402
    )
  }
  
  // Verify payment
  const verification = await verifyTipPayment(paymentProof)
  
  if (!verification.valid) {
    const paymentRequest = createTipPaymentRequest()
    return c.json(
      {
        error: 'Invalid payment',
        payment: paymentRequest,
      },
      402
    )
  }
  
  // Payment successful - log tx hash
  console.log('Tip payment successful. Transaction hash:', verification.txHash)
  
  return c.json({
    success: true,
    message: 'Tip received',
    txHash: verification.txHash,
  })
})