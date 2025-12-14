'use client'

import { useChainId } from 'wagmi'
import { useEffect } from 'react'

export function ChainLogger() {
  const chainId = useChainId()

  useEffect(() => {
    console.log('Current chain ID:', chainId)
  }, [chainId])

  return null
}
