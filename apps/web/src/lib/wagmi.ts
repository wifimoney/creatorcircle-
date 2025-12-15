import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'

const movementChainId = Number(process.env.NEXT_PUBLIC_MOVEMENT_CHAIN_ID || '1')
const movementRpcUrl = process.env.NEXT_PUBLIC_MOVEMENT_RPC_URL || 'http://localhost:8545'

export const movementChain = defineChain({
  id: movementChainId,
  name: 'Movement',
  nativeCurrency: {
    name: 'MOV',
    symbol: 'MOV',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [movementRpcUrl],
    },
  },
})

export const wagmiConfig = createConfig({
  chains: [movementChain],
  transports: {
    [movementChain.id]: http(),
  },
})

