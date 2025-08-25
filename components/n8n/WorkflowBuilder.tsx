'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bot, Zap, Database, Users, Settings, Play, Pause, Trash2 } from 'lucide-react'

interface AgentWorkflow {
  id: string
  name: string
  type: 'chat' | 'rag' | 'tools' | 'supervisor'
  status: 'active' | 'inactive' | 'testing'
  description: string
  webhookUrl?: string
  created_at: string
  execution_count: number
  last_executed?: string
}

const AGENT_TYPES = [
  {
    id: 'chat',
    name: 'Chat Agent',
    description: 'Basic conversational AI with custom prompts',
    icon: Bot,
    complexity: 'Beginner',
    features: ['Custom system prompts', 'Memory management', 'Response templating'],
    estimatedTime: '15 minutes'
  },
  {
    id: 'rag',
    name: 'RAG Agent',
    description: 'Retrieval-augmented generation with your data',
    icon: Database,
    complexity: 'Intermediate',
    features: ['Vector embeddings', 'Document search', 'Citation tracking'],
    estimatedTime: '30 minutes'
  },
  {
    id: 'tools',
    name: 'Tool-Using Agent',
    description: 'Function-calling agent with external integrations',
    icon: Zap,
    complexity: 'Advanced',
    features: ['API integrations', 'Function calling', 'Multi-step reasoning'],
    estimatedTime: '45 minutes'
  },
  {
    id: 'supervisor',
    name: 'Multi-Agent Supervisor',
    description: 'Orchestrates multiple specialist agents',
    icon: Users,
    complexity: 'Expert',
    features: ['Agent routing', 'Task delegation', 'Result synthesis'],
    estimatedTime: '60 minutes'
  }
]

export default function WorkflowBuilder() {
  const { user, profile } = useAuth()
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock workflows for demonstration
  useEffect(() => {
    setWorkflows([
      {
        id: '1',
        name: 'Customer Support Agent',
        type: 'chat',
        status: 'active',
        description: 'Handles customer inquiries with knowledge base',
        webhookUrl: 'https://your-n8n.com/webhook/customer-support',
        created_at: '2024-01-15T10:00:00Z',
        execution_count: 245,
        last_executed: '2024-01-20T14:30:00Z'
      },
      {
        id: '2',
        name: 'Document Q&A',
        type: 'rag',
        status: 'active',
        description: 'Answers questions from uploaded documents',
        webhookUrl: 'https://your-n8n.com/webhook/doc-qa',
        created_at: '2024-01-10T09:00:00Z',
        execution_count: 89,
        last_executed: '2024-01-20T11:15:00Z'
      }
    ])
  }, [])

  const canCreateAgent = (type: string) => {
    if (!profile) return false
    
    const complexityLimits = {
      free: ['chat'],
      pro: ['chat', 'rag'],
      business: ['chat', 'rag', 'tools'],
      enterprise: ['chat', 'rag', 'tools', 'supervisor']
    }
    
    return complexityLimits[profile.role]?.includes(type) || false
  }

  const createWorkflow = async (type: string) => {
    if (!canCreateAgent(type)) {
      alert('This agent type requires a plan upgrade')
      return
    }

    setLoading(true)
    try {
      // Here you would call your API to create the n8n workflow
      const response = await fetch('/api/n8n/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, user_id: user?.id })
      })
      
      if (response.ok) {
        const newWorkflow = await response.json()
        setWorkflows(prev => [...prev, newWorkflow])
        setSelectedType(null)
      }
    } catch (error) {
      console.error('Error creating workflow:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleWorkflow = async (workflowId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    
    try {
      const response = await fetch(`/api/n8n/workflows/${workflowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        setWorkflows(prev => 
          prev.map(w => w.id === workflowId ? { ...w, status: newStatus as any } : w)
        )
      }
    } catch (error) {
      console.error('Error toggling workflow:', error)
    }
  }

  const deleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return
    
    try {
      const response = await fetch(`/api/n8n/workflows/${workflowId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setWorkflows(prev => prev.filter(w => w.id !== workflowId))
      }
    } catch (error) {
      console.error('Error deleting workflow:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Agent Workflows</h2>
          <p className="text-gray-600">Build and manage your n8n AI agents</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {profile?.role?.toUpperCase()} Plan
        </Badge>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">My Workflows</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {workflows.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No workflows yet</h3>
                <p className="text-gray-600 mb-4">Create your first AI agent to get started</p>
                <Button onClick={() => setSelectedType('chat')}>
                  Create Chat Agent
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        workflow.type === 'chat' ? 'bg-blue-100' :
                        workflow.type === 'rag' ? 'bg-green-100' :
                        workflow.type === 'tools' ? 'bg-purple-100' :
                        'bg-orange-100'
                      }`}>
                        {workflow.type === 'chat' && <Bot className="h-5 w-5" />}
                        {workflow.type === 'rag' && <Database className="h-5 w-5" />}
                        {workflow.type === 'tools' && <Zap className="h-5 w-5" />}
                        {workflow.type === 'supervisor' && <Users className="h-5 w-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                        {workflow.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWorkflow(workflow.id, workflow.status)}
                      >
                        {workflow.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteWorkflow(workflow.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Executions:</span>
                        <p className="font-medium">{workflow.execution_count}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Last run:</span>
                        <p className="font-medium">
                          {workflow.last_executed ? 
                            new Date(workflow.last_executed).toLocaleDateString() : 
                            'Never'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Webhook:</span>
                        <p className="font-mono text-xs truncate">{workflow.webhookUrl}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AGENT_TYPES.map((agentType) => {
              const IconComponent = agentType.icon
              const canCreate = canCreateAgent(agentType.id)
              
              return (
                <Card key={agentType.id} className={`cursor-pointer transition-all ${
                  canCreate ? 'hover:shadow-lg' : 'opacity-50'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">{agentType.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {agentType.complexity}
                          </Badge>
                        </div>
                      </div>
                      {!canCreate && (
                        <Badge variant="secondary">Upgrade Required</Badge>
                      )}
                    </div>
                    <CardDescription>{agentType.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Features:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {agentType.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Est. setup: {agentType.estimatedTime}
                        </span>
                        <Button
                          onClick={() => createWorkflow(agentType.id)}
                          disabled={!canCreate || loading}
                          size="sm"
                        >
                          {loading ? 'Creating...' : 'Create Agent'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>
                Pre-built workflow templates for common use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Coming soon! We're preparing ready-to-import n8n workflow templates.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
