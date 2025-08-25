'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect } from 'react'

export default function TestPage() {
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    console.log('🔍 Test page auth state:', { user: !!user, loading, userId: user?.id, profile })
  }, [user, loading, profile])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>No user found</div>
  }

  return (
    <div className="p-8">
      <h1>Test Page</h1>
      <p>User: {user.email}</p>
      <p>Profile: {JSON.stringify(profile)}</p>
      <p>Loading: {loading.toString()}</p>
    </div>
  )
}
