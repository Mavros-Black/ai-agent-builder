'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  MessageSquare, 
  Mail, 
  FileText, 
  TrendingUp, 
  FolderOpen,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  ExternalLink
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'communication' | 'productivity' | 'crm' | 'storage'
  status: 'connected' | 'disconnected' | 'pending'
  lastSync?: string
  features: string[]
  pricing: 'free' | 'pro' | 'business'
}

const integrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and notifications',
    icon: <MessageSquare className="w-6 h-6" />,
    category: 'communication',
    status: 'connected',
    lastSync: '2 minutes ago',
    features: ['Send notifications', 'Create channels', 'Message automation'],
    pricing: 'free'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Email automation and management',
    icon: <Mail className="w-6 h-6" />,
    category: 'communication',
    status: 'connected',
    lastSync: '5 minutes ago',
    features: ['Send emails', 'Read inbox', 'Auto-replies'],
    pricing: 'free'
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Knowledge base and document management',
    icon: <FileText className="w-6 h-6" />,
    category: 'productivity',
    status: 'disconnected',
    features: ['Read pages', 'Create content', 'Database sync'],
    pricing: 'pro'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM and marketing automation',
    icon: <TrendingUp className="w-6 h-6" />,
    category: 'crm',
    status: 'pending',
    features: ['Contact management', 'Lead tracking', 'Email campaigns'],
    pricing: 'business'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'File storage and document access',
    icon: <FolderOpen className="w-6 h-6" />,
    category: 'storage',
    status: 'disconnected',
    features: ['Read files', 'Upload documents', 'Share links'],
    pricing: 'free'
  }
]

const categoryColors = {
  communication: 'bg-blue-100 text-blue-800 border-blue-200',
  productivity: 'bg-green-100 text-green-800 border-green-200',
  crm: 'bg-purple-100 text-purple-800 border-purple-200',
  storage: 'bg-orange-100 text-orange-800 border-orange-200'
}

const statusIcons = {
  connected: <CheckCircle className="w-4 h-4 text-green-600" />,
  disconnected: <XCircle className="w-4 h-4 text-gray-400" />,
  pending: <Clock className="w-4 h-4 text-yellow-600" />
}

export function IntegrationsDashboard() {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(['slack', 'gmail'])

  const handleToggleIntegration = (integrationId: string) => {
    if (connectedIntegrations.includes(integrationId)) {
      setConnectedIntegrations(connectedIntegrations.filter(id => id !== integrationId))
    } else {
      setConnectedIntegrations([...connectedIntegrations, integrationId])
    }
  }

  const getIntegrationStatus = (integration: Integration) => {
    if (connectedIntegrations.includes(integration.id)) {
      return 'connected'
    }
    return integration.status
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
          <p className="text-gray-600">Connect your favorite tools and automate workflows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Manage API Keys
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Documentation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected</p>
                <p className="text-2xl font-bold">{connectedIntegrations.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Sync</p>
                <p className="text-2xl font-bold">2m ago</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Automations</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => {
          const status = getIntegrationStatus(integration)
          const isConnected = status === 'connected'
          
          return (
            <Card key={integration.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {integration.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcons[status]}
                    <Badge className={`text-xs ${categoryColors[integration.category]}`}>
                      {integration.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Features</Label>
                  <div className="mt-2 space-y-1">
                    {integration.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {feature}
                      </div>
                    ))}
                    {integration.features.length > 2 && (
                      <div className="text-sm text-gray-500">
                        +{integration.features.length - 2} more features
                      </div>
                    )}
                  </div>
                </div>

                {isConnected && integration.lastSync && (
                  <div className="text-sm text-gray-500">
                    Last sync: {integration.lastSync}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {integration.pricing === 'free' ? 'Free' : 
                     integration.pricing === 'pro' ? 'Pro Plan' : 'Business Plan'}
                  </Badge>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant={isConnected ? "outline" : "default"}
                        size="sm"
                        className={isConnected ? "text-red-600 border-red-200 hover:bg-red-50" : ""}
                      >
                        {isConnected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {isConnected ? 'Disconnect' : 'Connect'} {integration.name}
                        </DialogTitle>
                        <DialogDescription>
                          {isConnected 
                            ? `Are you sure you want to disconnect ${integration.name}? This will stop all automated workflows.`
                            : `Connect ${integration.name} to enable automated workflows and data synchronization.`
                          }
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {!isConnected && (
                          <div className="space-y-2">
                            <Label>API Key</Label>
                            <input 
                              type="password" 
                              placeholder="Enter your API key"
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleToggleIntegration(integration.id)}
                            variant={isConnected ? "destructive" : "default"}
                            className="flex-1"
                          >
                            {isConnected ? 'Disconnect' : 'Connect'}
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common integration tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Settings className="w-5 h-5 mb-2" />
              <span className="font-medium">Configure Webhooks</span>
              <span className="text-sm text-gray-600">Set up real-time notifications</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <TrendingUp className="w-5 h-5 mb-2" />
              <span className="font-medium">View Analytics</span>
              <span className="text-sm text-gray-600">Monitor integration usage</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <ExternalLink className="w-5 h-5 mb-2" />
              <span className="font-medium">API Documentation</span>
              <span className="text-sm text-gray-600">Learn about available endpoints</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
