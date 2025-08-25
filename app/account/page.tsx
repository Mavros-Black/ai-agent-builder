'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UsageLog } from '@/lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AccountPage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    fetchUsageLogs()
  }, [user, router])

  const fetchUsageLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: false })
        .limit(30)

      if (error) throw error
      setUsageLogs(data || [])
    } catch (error) {
      console.error('Error fetching usage logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const usagePercentage = profile?.max_usage ? (profile.usage_count / profile.max_usage) * 100 : 0

  // Prepare chart data
  const chartData = usageLogs.reduce((acc, log) => {
    const date = new Date(log.created_at).toLocaleDateString()
    const existing = acc.find(item => item.date === date)
    if (existing) {
      existing.count++
    } else {
      acc.push({ date, count: 1 })
    }
    return acc
  }, [] as { date: string; count: number }[]).slice(0, 7).reverse()

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account, subscription, and usage
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  Back to Dashboard
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-sm">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold capitalize">{profile?.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.role === 'free' ? 'Free Plan' : `${profile?.role} Plan`}
                    </p>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => router.push('/pricing')}
                  >
                    {profile?.role === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Usage & Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                  <CardDescription>Workflow runs and limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Workflow Runs</span>
                      <span>
                        {profile?.usage_count} / {profile?.max_usage === -1 ? '∞' : profile?.max_usage}
                      </span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>
                  {profile?.role === 'free' && profile?.usage_count >= profile?.max_usage && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      Usage limit reached. Upgrade your plan to continue.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                  <CardDescription>Workflow runs over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest workflow runs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {usageLogs.length > 0 ? (
                      usageLogs.slice(0, 10).map((log) => (
                        <div key={log.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <p className="text-sm font-medium">{log.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No recent activity</p>
                        <p className="text-sm">Start building your first AI agent to see activity here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
