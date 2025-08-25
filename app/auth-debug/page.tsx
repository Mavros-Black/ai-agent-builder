'use client'

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function AuthDebugPage() {
  const { user, profile, loading } = useAuth()

  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    console.log('Direct session check:', { data, error })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Auth Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Auth Context State:</h3>
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-sm">
                  {JSON.stringify({
                    loading,
                    user: user ? {
                      id: user.id,
                      email: user.email,
                      created_at: user.created_at
                    } : null,
                    profile: profile ? {
                      id: profile.id,
                      role: profile.role,
                      usage_count: profile.usage_count,
                      max_usage: profile.max_usage
                    } : null
                  }, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={checkSession}>
                Check Session Directly
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Navigation:</h3>
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/wizard'}
                >
                  Go to Wizard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/simple-dashboard'}
                >
                  Go to Simple Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
