'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { AuthGuard } from '@/components/auth-guard'
import { Download, ArrowLeft, Eye, Code, FileText, Settings } from 'lucide-react'
import { WhimsicalWorkflowDiagram } from '@/components/whimsical-workflow-diagram'

export default function WorkflowPreviewPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('diagram')
  const [workflow, setWorkflow] = useState<any>(null)
  const [agentConfig, setAgentConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load AI-generated workflow from localStorage
  useEffect(() => {
    try {
      const storedWorkflow = localStorage.getItem('generatedWorkflow')
      const storedConfig = localStorage.getItem('agentConfig')
      
      if (storedWorkflow && storedConfig) {
        setWorkflow(JSON.parse(storedWorkflow))
        setAgentConfig(JSON.parse(storedConfig))
      } else {
        // Fallback to mock data if no AI-generated workflow
        setWorkflow({
          name: 'Customer Support Bot',
          type: 'chat',
          description: 'AI-powered customer support agent',
          nodes: [
            {
              id: 'start',
              type: 'n8n-nodes-base.start',
              position: [0, 0],
              parameters: {}
            },
            {
              id: 'webhook',
              type: 'n8n-nodes-base.webhook',
              position: [200, 0],
              parameters: {
                httpMethod: 'POST',
                path: 'customer-support'
              }
            },
            {
              id: 'ai',
              type: 'n8n-nodes-base.openAi',
              position: [400, 0],
              parameters: {
                model: 'gpt-4',
                prompt: 'You are a helpful customer support assistant. Be friendly and professional.'
              }
            },
            {
              id: 'response',
              type: 'n8n-nodes-base.respondToWebhook',
              position: [600, 0],
              parameters: {}
            }
          ],
          connections: {
            start: {
              main: [[{ node: 'webhook', type: 'main', index: 0 }]]
            },
            webhook: {
              main: [[{ node: 'ai', type: 'main', index: 0 }]]
            },
            ai: {
              main: [[{ node: 'response', type: 'main', index: 0 }]]
            }
          }
        })
      }
    } catch (error) {
      console.error('Error loading workflow:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI-generated workflow...</p>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No workflow found. Please go back to the wizard.</p>
          <Button onClick={() => router.push('/wizard')}>
            Back to Wizard
          </Button>
        </div>
      </div>
    )
  }

  // Transform workflow data for Whimsical diagram
  const transformWorkflowForDiagram = (workflow: any) => {
    return {
      name: workflow?.name || 'AI Agent Workflow',
      type: workflow?.type || 'chat',
      description: workflow?.description || 'AI-powered workflow',
      nodes: workflow?.nodes?.map((node: any) => ({
        id: node.id || node.name || 'node',
        name: node.name || 'Node',
        type: node.type || 'n8n-nodes-base.noOp',
        position: node.position || [0, 0],
        parameters: node.parameters || {}
      })) || [],
      connections: workflow?.connections || {}
    }
  }

  const handleDownloadWorkflow = () => {
    if (!workflow) {
      console.error('No workflow available for download')
      return
    }
    
    const dataStr = JSON.stringify(workflow, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    // Safely handle workflow name - use fallback if name is undefined
    const workflowName = workflow?.name || 'ai-agent-workflow'
    const exportFileDefaultName = `${workflowName.toLowerCase().replace(/\s+/g, '-')}-workflow.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleDownloadDocs = () => {
    if (!workflow) {
      console.error('No workflow available for documentation')
      return
    }
    
    // Safely handle workflow name and description
    const workflowName = workflow?.name || 'AI Agent Workflow'
    const workflowDescription = workflow?.description || 'AI-powered workflow generated by the Agent Builder'
    
    const docs = `# ${workflowName}

## Overview
${workflowDescription}

## Workflow Structure
This workflow consists of ${workflow.nodes?.length || 0} nodes:

${workflow.nodes?.map((node: any) => `- **${node.id}**: ${node.type}`).join('\n') || 'No nodes defined'}

## Deployment Instructions

### 1. Import to n8n
1. Open your n8n instance
2. Go to Workflows
3. Click "Import from file"
4. Select the downloaded JSON file

### 2. Configure Credentials
- Set up OpenAI API credentials
- Configure webhook endpoints

### 3. Activate Workflow
- Click "Active" to start the workflow
- Test with a webhook call

## Usage
Send POST requests to the webhook endpoint to interact with the AI agent.

\`\`\`bash
curl -X POST https://your-n8n-instance.com/webhook/customer-support \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello, I need help with my order"}'
\`\`\`
`

    const dataStr = docs
    const dataUri = 'data:text/markdown;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${workflowName.toLowerCase().replace(/\s+/g, '-')}-documentation.md`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    // <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.push('/wizard')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Wizard
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Workflow Preview</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={handleDownloadDocs}
                  disabled={!workflow}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Docs
                </Button>
                <Button 
                  onClick={handleDownloadWorkflow}
                  disabled={!workflow}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Workflow
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Content - Full Width for Diagram */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Workflow Preview
                </CardTitle>
                <CardDescription>
                  Review your generated n8n workflow before downloading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="diagram" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Diagram
                    </TabsTrigger>
                    <TabsTrigger value="json" className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documentation
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="diagram" className="mt-6">
                    <div className="w-full overflow-hidden">
                      <WhimsicalWorkflowDiagram 
                        workflow={transformWorkflowForDiagram(workflow)}
                        className="w-full min-h-[600px]"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="json" className="mt-6">
                    <div className="bg-white border rounded-lg p-6">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold">n8n Workflow JSON</h3>
                        <p className="text-sm text-gray-600">Ready-to-import workflow configuration</p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-sm text-green-400 overflow-x-auto">
                          {workflow ? JSON.stringify(workflow, null, 2) : 'No workflow available'}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="docs" className="mt-6">
                    <div className="bg-white border rounded-lg p-6">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold">Documentation</h3>
                        <p className="text-sm text-gray-600">Complete setup and usage guide</p>
                      </div>
                      <div className="prose max-w-none">
                        <h2>{workflow?.name || 'AI Agent Workflow'}</h2>
                        <p><strong>Type:</strong> {workflow?.type || 'chat'} Agent</p>
                        <p><strong>Description:</strong> {workflow?.description || 'AI-powered workflow'}</p>
                        
                        <h3>Workflow Structure</h3>
                        <p>This workflow consists of {workflow?.nodes?.length || 0} nodes:</p>
                        <ul>
                          {workflow?.nodes?.map((node: any) => (
                            <li key={node.id || 'node'}><strong>{node.id || 'node'}</strong>: {node.type || 'unknown'}</li>
                          )) || <li>No nodes defined</li>}
                        </ul>
                        
                        <h3>Deployment Instructions</h3>
                        <h4>1. Import to n8n</h4>
                        <ol>
                          <li key="step1">Open your n8n instance</li>
                          <li key="step2">Go to Workflows</li>
                          <li key="step3">Click "Import from file"</li>
                          <li key="step4">Select the downloaded JSON file</li>
                        </ol>
                        
                        <h4>2. Configure Credentials</h4>
                        <ul>
                          <li key="cred1">Set up OpenAI API credentials</li>
                          <li key="cred2">Configure webhook endpoints</li>
                        </ul>
                        
                        <h4>3. Activate Workflow</h4>
                        <ul>
                          <li key="activate1">Click "Active" to start the workflow</li>
                          <li key="activate2">Test with a webhook call</li>
                        </ul>
                        
                        <h3>Usage</h3>
                        <p>Send POST requests to the webhook endpoint to interact with the AI agent.</p>
                        <pre className="bg-gray-100 p-4 rounded">
{`curl -X POST https://your-n8n-instance.com/webhook/customer-support \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello, I need help with my order"}'`}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Full Width Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Workflow Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Name</Label>
                  <p className="font-medium">{workflow?.name || 'AI Agent Workflow'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Type</Label>
                  <Badge variant="secondary" className="mt-1">
                    {workflow?.type || 'chat'} Agent
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Description</Label>
                  <p className="text-sm">{workflow?.description || 'AI-powered workflow'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Nodes</Label>
                  <p className="text-sm">{workflow?.nodes?.length || 0} nodes</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleDownloadWorkflow}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Workflow
                </Button>
                <Button 
                  onClick={handleDownloadDocs}
                  className="w-full"
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Documentation
                </Button>
                <Button 
                  onClick={() => router.push('/wizard')}
                  className="w-full"
                  variant="outline"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Workflow
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div key="step1" className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Download the workflow JSON file</p>
                  </div>
                  <div key="step2" className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Import it into your n8n instance</p>
                  </div>
                  <div key="step3" className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Configure your API credentials</p>
                  </div>
                  <div key="step4" className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Activate the workflow</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    // </AuthGuard>
  )
}
