'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy, Download, ExternalLink, CheckCircle } from 'lucide-react'

const N8N_WORKFLOWS = {
  chat: {
    title: 'Chat Agent (MVP)',
    description: 'Webhook → LLM → Reply',
    complexity: 'Beginner',
    estimatedTime: '15 minutes',
    mermaidDiagram: `
flowchart LR
  W[Webhook Trigger] --> C[Set/Code: normalize payload]
  C --> P[Prompt Builder\\n(system + user)]
  P --> L[LLM Chat Completions]
  L --> R[Respond Webhook Return]
  R --> G[Log to DB/Sheets]
    `,
    nodes: [
      {
        name: 'Webhook Trigger',
        type: 'Webhook',
        config: 'HTTP Method = POST; Response Mode = On Received'
      },
      {
        name: 'Normalize Input',
        type: 'Set/Code',
        config: 'Map user_input = {{$json.body.message || $json.message}}'
      },
      {
        name: 'LLM Call',
        type: 'HTTP Request',
        config: 'POST to OpenAI Chat Completions API'
      },
      {
        name: 'Respond',
        type: 'Respond to Webhook',
        config: 'Send {{$json.response}}'
      }
    ],
    jsonWorkflow: {
      meta: { instanceId: 'n8n-instance' },
      nodes: [
        {
          id: 'webhook',
          name: 'Webhook',
          type: 'n8n-nodes-base.webhook',
          parameters: {
            httpMethod: 'POST',
            path: 'chat-agent',
            responseMode: 'onReceived'
          }
        }
        // ... other nodes would be here
      ]
    }
  },
  tools: {
    title: 'Tool-Using Agent',
    description: 'Function calling with external APIs',
    complexity: 'Advanced',
    estimatedTime: '45 minutes',
    mermaidDiagram: `
flowchart TD
  A[Webhook/Channel] --> B[Build Prompt + Tool Schemas]
  B --> C[LLM: Ask for next action]
  C -->|final_answer| Z[Return]
  C -->|tool_call| D[Switch: tool_name]
  D -->|web_search| E[Sub-WF: Web Search]
  D -->|get_weather| F[Sub-WF: Weather]
  D -->|write_file| G[Sub-WF: File/Notion]
  E --> H[Back to LLM observe result]
  F --> H
  G --> H
  H --> C
    `,
    nodes: [
      {
        name: 'Webhook',
        type: 'Webhook',
        config: 'Accept user input with tool schemas'
      },
      {
        name: 'LLM with Tools',
        type: 'HTTP Request',
        config: 'OpenAI function calling with tool schema'
      },
      {
        name: 'Tool Router',
        type: 'Switch',
        config: 'Route based on tool_name'
      },
      {
        name: 'Tool Subworkflows',
        type: 'Execute Workflow',
        config: 'Call tool-specific workflows'
      }
    ]
  },
  rag: {
    title: 'RAG Agent',
    description: 'Retrieval-augmented generation with vector search',
    complexity: 'Intermediate',
    estimatedTime: '30 minutes',
    mermaidDiagram: `
flowchart TD
  U[User Query] --> P[Preprocess: clean, detect intent]
  P --> E[Embed Query]
  E --> V[Vector DB: similarity search]
  V --> K[Context: top-k chunks]
  K --> L[LLM: answer with citations]
  L --> R[Return + Log]
    `,
    nodes: [
      {
        name: 'Query Embedding',
        type: 'HTTP Request',
        config: 'OpenAI Embeddings API'
      },
      {
        name: 'Vector Search',
        type: 'Postgres/Supabase',
        config: 'pgvector similarity search'
      },
      {
        name: 'Context Builder',
        type: 'Code',
        config: 'Format retrieved chunks with citations'
      },
      {
        name: 'RAG LLM',
        type: 'HTTP Request',
        config: 'OpenAI with context + citations'
      }
    ]
  },
  supervisor: {
    title: 'Multi-Agent Supervisor',
    description: 'Orchestrates multiple specialist agents',
    complexity: 'Expert',
    estimatedTime: '60 minutes',
    mermaidDiagram: `
sequenceDiagram
  participant U as User
  participant S as Supervisor LLM
  participant C as Chat Agent
  participant R as RAG Agent
  participant T as Tool Agent
  U->>S: Task
  S-->>S: Decide route / plan
  alt Needs knowledge
    S->>R: Query with question
    R-->>S: Answer + sources
  else Needs action
    S->>T: Call tools
    T-->>S: Results
  else Simple
    S->>C: Respond
    C-->>S: Draft
  end
  S-->>U: Final response
    `,
    nodes: [
      {
        name: 'Supervisor LLM',
        type: 'HTTP Request',
        config: 'Route decisions with planning'
      },
      {
        name: 'Agent Router',
        type: 'Switch',
        config: 'Route to chat/rag/tools agents'
      },
      {
        name: 'Execute Child Workflows',
        type: 'Execute Workflow',
        config: 'Call specialist agent workflows'
      },
      {
        name: 'Result Synthesizer',
        type: 'Code',
        config: 'Merge outputs from multiple agents'
      }
    ]
  }
}

const SETUP_STEPS = [
  {
    title: 'n8n Setup',
    steps: [
      'Install n8n: npm install n8n -g or use Docker',
      'Start n8n: npx n8n start or docker run',
      'Access at http://localhost:5678',
      'Set up OpenAI credentials in n8n'
    ]
  },
  {
    title: 'Database Setup',
    steps: [
      'Set up Supabase project with pgvector extension',
      'Run the workflow schema migration',
      'Configure Postgres credentials in n8n',
      'Test database connection'
    ]
  },
  {
    title: 'API Integration',
    steps: [
      'Get OpenAI API key',
      'Configure webhook URLs in your app',
      'Set up vector database for RAG',
      'Test workflow execution'
    ]
  }
]

export default function N8nGuide() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('chat')
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const currentWorkflow = N8N_WORKFLOWS[selectedWorkflow as keyof typeof N8N_WORKFLOWS]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">n8n AI Agent Implementation Guide</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Step-by-step instructions to build production-ready AI agents in n8n.
          Copy diagrams to mermaid.live to visualize.
        </p>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(N8N_WORKFLOWS).map(([key, workflow]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedWorkflow === key ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedWorkflow(key)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm">{workflow.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {workflow.complexity}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {workflow.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-500">
                    Est. {workflow.estimatedTime}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {currentWorkflow && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {currentWorkflow.title}
                  <div className="flex space-x-2">
                    <Badge>{currentWorkflow.complexity}</Badge>
                    <Badge variant="outline">{currentWorkflow.estimatedTime}</Badge>
                  </div>
                </CardTitle>
                <CardDescription>{currentWorkflow.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mermaid Diagram */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Flow Diagram</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentWorkflow.mermaidDiagram.trim(), 'diagram')}
                    >
                      {copied === 'diagram' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied === 'diagram' ? 'Copied!' : 'Copy Mermaid'}
                    </Button>
                  </div>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{currentWorkflow.mermaidDiagram.trim()}</code>
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">
                    Copy this to <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mermaid.live</a> to visualize
                  </p>
                </div>

                {/* Node Configuration */}
                <div>
                  <h4 className="font-medium mb-3">Node Configuration</h4>
                  <div className="space-y-3">
                    {currentWorkflow.nodes.map((node, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium text-sm">{node.name}</h5>
                          <Badge variant="secondary" className="text-xs">{node.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{node.config}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      if ('jsonWorkflow' in currentWorkflow) {
                        copyToClipboard(JSON.stringify(currentWorkflow.jsonWorkflow, null, 2), 'json')
                      }
                    }}
                    variant="outline"
                  >
                    {copied === 'json' ? <CheckCircle className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                    {copied === 'json' ? 'Copied!' : 'Copy n8n JSON'}
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in n8n
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <div className="grid gap-6">
            {SETUP_STEPS.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ready-to-Import Templates</CardTitle>
              <CardDescription>
                Production-ready n8n workflow templates with detailed documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(N8N_WORKFLOWS).map(([key, workflow]) => (
                  <div key={key} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{workflow.title}</h4>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if ('jsonWorkflow' in workflow) {
                            copyToClipboard(JSON.stringify(workflow.jsonWorkflow, null, 2), `template-${key}`)
                          }
                        }}
                      >
                        {copied === `template-${key}` ? <CheckCircle className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                        {copied === `template-${key}` ? 'Copied!' : 'Export JSON'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Options</CardTitle>
              <CardDescription>
                Choose the best deployment strategy for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">n8n Cloud (Recommended)</h4>
                  <p className="text-sm text-gray-600 mb-3">Fastest setup with managed infrastructure</p>
                  <ul className="text-sm space-y-1">
                    <li>• No server management required</li>
                    <li>• Automatic updates and backups</li>
                    <li>• Built-in SSL and security</li>
                    <li>• Pay-as-you-scale pricing</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Self-Hosted (Docker)</h4>
                  <p className="text-sm text-gray-600 mb-3">Full control with Docker deployment</p>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    <code>{`docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  docker.n8n.io/n8nio/n8n`}</code>
                  </pre>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Production Setup</h4>
                  <p className="text-sm text-gray-600 mb-3">Scalable deployment with external database</p>
                  <ul className="text-sm space-y-1">
                    <li>• External PostgreSQL database</li>
                    <li>• Redis for queue management</li>
                    <li>• NGINX/Traefik for load balancing</li>
                    <li>• SSL certificates with Let's Encrypt</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
