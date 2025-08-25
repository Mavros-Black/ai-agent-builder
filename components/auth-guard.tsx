'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('AuthGuard: user =', user ? 'exists' : 'null', 'loading =', loading)
    
    // Only redirect if not loading and definitely no user
    if (!loading && !user) {
      const currentPath = window.location.pathname
      console.log('AuthGuard: Redirecting to login from', currentPath)
      // Add a small delay to prevent rapid redirects
      const timeoutId = setTimeout(() => {
        router.push(`/auth/login?return_to=${encodeURIComponent(currentPath)}`)
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [user, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show fallback or nothing while redirecting
  if (!user) {
    return fallback || null
  }

  // Show children if authenticated
  return <>{children}</>
}
