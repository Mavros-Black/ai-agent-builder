'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  UserPlus, 
  Users, 
  Settings, 
  Database, 
  CheckCircle, 
  AlertCircle,
  Copy,
  RefreshCw
} from 'lucide-react'

interface AdminUser {
  email: string
  role: string
  status: string
  user_id: string
}

interface SystemStatus {
  total_users: number
  total_workflows: number
  active_workflows: number
  database_connected: boolean
}

export default function AdminPanel() {
  const [loading, setLoading] = useState(false)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [newUser, setNewUser] = useState({
    email: 'mavros.black@yahoo.com',
    password: 'Monster123',
    role: 'enterprise'
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const createAdminUser = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: `Admin user created: ${result.data.email}` })
        setAdminUsers(prev => [...prev, result.data])
                 setNewUser({ email: 'mavros.black@yahoo.com', password: 'Monster123', role: 'enterprise' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create admin user' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage({ type: 'success', text: 'Copied to clipboard!' })
    setTimeout(() => setMessage(null), 2000)
  }

  const refreshSystemStatus = async () => {
    try {
      // This would call your actual API endpoints
      setSystemStatus({
        total_users: 150,
        total_workflows: 45,
        active_workflows: 23,
        database_connected: true
      })
    } catch (error) {
      console.error('Error fetching system status:', error)
    }
  }

  useEffect(() => {
    refreshSystemStatus()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-gray-600">Manage test users and system status</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Development Only
        </Badge>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? <CheckCircle className="h-4 w-4 mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
            {message.text}
          </div>
        </div>
      )}

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Test Users</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="quick">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Create Admin User
              </CardTitle>
              <CardDescription>
                Create test users with different plan levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                                         placeholder="mavros.black@yahoo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                                         placeholder="Monster123"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Plan</Label>
                  <select
                    id="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="business">Business</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
              <Button 
                onClick={createAdminUser} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                {loading ? 'Creating...' : 'Create Admin User'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Admin Users
              </CardTitle>
              <CardDescription>
                Recently created test users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adminUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No admin users created yet</p>
                  <p className="text-sm">Create your first test user above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {adminUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-gray-500">Plan: {user.role}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{user.role}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`${user.email} / admin123`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{systemStatus?.total_users || 0}</p>
                    <p className="text-sm text-gray-500">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Database className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{systemStatus?.total_workflows || 0}</p>
                    <p className="text-sm text-gray-500">Total Workflows</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{systemStatus?.active_workflows || 0}</p>
                    <p className="text-sm text-gray-500">Active Workflows</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">
                      {systemStatus?.database_connected ? 'Online' : 'Offline'}
                    </p>
                    <p className="text-sm text-gray-500">Database Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Environment:</span>
                  <Badge variant="outline">{process.env.NODE_ENV}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span>{systemStatus?.database_connected ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>API Status:</span>
                  <Badge variant="outline">Healthy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common admin tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewUser({ email: 'free@test.com', password: 'test123', role: 'free' })
                    setMessage({ type: 'success', text: 'Free user template loaded' })
                  }}
                  className="h-20 flex-col"
                >
                  <UserPlus className="h-6 w-6 mb-2" />
                  <span>Free User Template</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setNewUser({ email: 'pro@test.com', password: 'test123', role: 'pro' })
                    setMessage({ type: 'success', text: 'Pro user template loaded' })
                  }}
                  className="h-20 flex-col"
                >
                  <UserPlus className="h-6 w-6 mb-2" />
                  <span>Pro User Template</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setNewUser({ email: 'business@test.com', password: 'test123', role: 'business' })
                    setMessage({ type: 'success', text: 'Business user template loaded' })
                  }}
                  className="h-20 flex-col"
                >
                  <UserPlus className="h-6 w-6 mb-2" />
                  <span>Business User Template</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setNewUser({ email: 'enterprise@test.com', password: 'test123', role: 'enterprise' })
                    setMessage({ type: 'success', text: 'Enterprise user template loaded' })
                  }}
                  className="h-20 flex-col"
                >
                  <UserPlus className="h-6 w-6 mb-2" />
                  <span>Enterprise User Template</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login Credentials</CardTitle>
              <CardDescription>
                Quick copy-paste credentials for testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                                     { email: 'mavros.black@yahoo.com', password: 'Monster123', plan: 'Enterprise' },
                  { email: 'free@test.com', password: 'test123', plan: 'Free' },
                  { email: 'pro@test.com', password: 'test123', plan: 'Pro' },
                  { email: 'business@test.com', password: 'test123', plan: 'Business' }
                ].map((cred, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{cred.email}</p>
                      <p className="text-sm text-gray-500">Password: {cred.password} | Plan: {cred.plan}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`${cred.email} / ${cred.password}`)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
