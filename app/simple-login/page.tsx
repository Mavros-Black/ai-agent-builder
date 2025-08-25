'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('mavros.black@yahoo.com')
  const [password, setPassword] = useState('Monster123')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('Attempting login with:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Login error:', error)
        setResult(`Login failed: ${error.message}`)
      } else {
        console.log('Login successful:', data)
        setResult(`Login successful! User: ${data.user?.email}`)
      }
    } catch (error: any) {
      console.error('Login exception:', error)
      setResult(`Exception: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setResult(`Sign out failed: ${error.message}`)
      } else {
        setResult('Sign out successful')
      }
    } catch (error: any) {
      setResult(`Sign out exception: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkSession = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setResult(`Session check failed: ${error.message}`)
      } else {
        setResult(`Session: ${data.session ? 'Found' : 'Not found'}`)
      }
    } catch (error: any) {
      setResult(`Session check exception: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Simple Login Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            
            <Button 
              onClick={handleSignOut} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Sign Out
            </Button>
            
            <Button 
              onClick={checkSession} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Check Session
            </Button>
          </div>
          
          {result && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p className="text-sm">{result}</p>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => window.location.href = '/test-auth'}
            >
              Go to Auth Test Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
