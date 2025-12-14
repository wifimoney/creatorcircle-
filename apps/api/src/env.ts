import 'dotenv/config'

export const env = {
  PORT: process.env.PORT ?? '8787',
  PRIVY_APP_ID: process.env.PRIVY_APP_ID!,
  PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET!
}