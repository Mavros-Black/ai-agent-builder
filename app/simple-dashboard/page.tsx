'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SimpleDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      setLoading(true)
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        setError(`Session error: ${error.message}`)
      } else if (session?.user) {
        setUser(session.user)
        setError('')
      } else {
        setError('No user session found')
      }
    } catch (err: any) {
      setError(`Exception: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setError(`Sign out error: ${error.message}`)
      } else {
        setUser(null)
        setError('Signed out successfully')
      }
    } catch (err: any) {
      setError(`Sign out exception: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Simple Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div>
                <h3 className="text-lg font-medium mb-4">Welcome, {user.email}!</h3>
                <div className="bg-gray-100 p-4 rounded mb-4">
                  <h4 className="font-medium mb-2">User Info:</h4>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">No user logged in</p>
                <Button onClick={() => window.location.href = '/simple-login'}>
                  Go to Login
                </Button>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            <div className="mt-6 space-x-4">
              <Button 
                variant="outline" 
                onClick={checkUser}
              >
                Refresh User
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/test-auth'}
              >
                Go to Auth Test
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Full Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
