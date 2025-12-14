'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useEffect, useState, useCallback } from 'react'

type BackendUser = {
  userId: string
  walletAddress?: string
}

export default function Auth() {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy()
  const { wallets } = useWallets()
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchBackendUser = useCallback(async () => {
    try {
      setLoading(true)
      const token = await getAccessToken()
      const response = await fetch('http://localhost:8787/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBackendUser(data)
      } else {
        console.error('Failed to fetch user from backend')
      }
    } catch (error) {
      console.error('Error fetching backend user:', error)
    } finally {
      setLoading(false)
    }
  }, [getAccessToken])

  useEffect(() => {
    if (authenticated && ready) {
      fetchBackendUser()
    } else {
      setBackendUser(null)
    }
  }, [authenticated, ready, fetchBackendUser])

  if (!ready) {
    return <div>Loading...</div>
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold">Login</h2>
        <button
          onClick={login}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login with Email or Phone
        </button>
      </div>
    )
  }

  const walletAddress = wallets[0]?.address || backendUser?.walletAddress

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Welcome!</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <strong>User ID:</strong> {user?.id}
        </div>
        {walletAddress && (
          <div>
            <strong>Wallet Address:</strong> {walletAddress}
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Backend Auth Result:</h3>
        {loading ? (
          <div>Loading...</div>
        ) : backendUser ? (
          <pre className="text-sm">{JSON.stringify(backendUser, null, 2)}</pre>
        ) : (
          <div>No backend data</div>
        )}
      </div>
    </div>
  )
}
