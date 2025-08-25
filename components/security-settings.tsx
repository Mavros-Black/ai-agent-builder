'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2, 
  Plus,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Download,
  Upload
} from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  permissions: string[]
  status: 'active' | 'expired' | 'revoked'
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk_live_1234567890abcdef',
    created: '2024-01-15',
    lastUsed: '2024-01-20',
    permissions: ['read', 'write'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'sk_test_abcdef1234567890',
    created: '2024-01-10',
    lastUsed: '2024-01-18',
    permissions: ['read'],
    status: 'active'
  }
]

export function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [dataPrivacyMode, setDataPrivacyMode] = useState<'cloud' | 'local'>('cloud')
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [newKeyName, setNewKeyName] = useState('')

  const handleCreateApiKey = () => {
    if (!newKeyName) return
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      permissions: ['read'],
      status: 'active'
    }
    
    setApiKeys([...apiKeys, newKey])
    setNewKeyName('')
  }

  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key
    ))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security & Privacy</h2>
        <p className="text-gray-600">Manage your account security and data privacy settings</p>
      </div>

      <Tabs defaultValue="authentication" className="space-y-4">
        <TabsList>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
        </TabsList>

        {/* Authentication Tab */}
        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Enable 2FA</Label>
                  <p className="text-sm text-gray-600">
                    Require a second form of verification when signing in
                  </p>
                </div>
                <Switch 
                  checked={twoFactorEnabled} 
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              
              {twoFactorEnabled && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">2FA is enabled</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your account is now protected with two-factor authentication. 
                        You'll need to enter a code from your authenticator app when signing in.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Backup Codes
                </Button>
                <Button variant="outline" size="sm">
                  <Key className="w-4 h-4 mr-2" />
                  Recovery Options
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Password Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Password Strength</Label>
                  <p className="text-sm text-gray-600">Your password meets security requirements</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Strong
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Last Changed</Label>
                  <p className="text-sm text-gray-600">January 15, 2024</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    API Keys
                  </CardTitle>
                  <CardDescription>
                    Manage API keys for programmatic access
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Generate a new API key for your applications
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="keyName">Key Name</Label>
                        <Input
                          id="keyName"
                          placeholder="e.g., Production App"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Permissions</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="read" defaultChecked />
                            <Label htmlFor="read">Read access</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="write" />
                            <Label htmlFor="write">Write access</Label>
                          </div>
                        </div>
                      </div>
                      <Button onClick={handleCreateApiKey} className="w-full">
                        Create API Key
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {apiKey.key.substring(0, 12)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{apiKey.created}</TableCell>
                      <TableCell>{apiKey.lastUsed}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            apiKey.status === 'active' 
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }
                        >
                          {apiKey.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeApiKey(apiKey.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Data Privacy
              </CardTitle>
              <CardDescription>
                Control how your data is stored and processed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Data Storage Mode</Label>
                  <p className="text-sm text-gray-600">
                    Choose where your workflow data is stored
                  </p>
                </div>
                <Select value={dataPrivacyMode} onValueChange={(value: any) => setDataPrivacyMode(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="local">Local Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {dataPrivacyMode === 'cloud' && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Cloud Storage Enabled</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your data is stored securely in the cloud. This enables collaboration, 
                        backups, and access from multiple devices.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {dataPrivacyMode === 'local' && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Local Storage Enabled</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your data is stored locally on your device. This provides maximum privacy 
                        but limits collaboration features.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Analytics & Usage Data</Label>
                  <p className="text-sm text-gray-600">
                    Help us improve by sharing anonymous usage data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Marketing Communications</Label>
                  <p className="text-sm text-gray-600">
                    Receive updates about new features and improvements
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="w-5 h-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage your active login sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-600">Windows 10 • Chrome • 192.168.1.100</p>
                      <p className="text-xs text-gray-500">Active now</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Current
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Mobile Session</p>
                      <p className="text-sm text-gray-600">iPhone • Safari • 192.168.1.101</p>
                      <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Revoke All Other Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
