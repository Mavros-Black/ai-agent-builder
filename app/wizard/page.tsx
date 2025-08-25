'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { MessageSquare, Database, Zap, Users, ChevronLeft, ChevronRight, Download, Info, Building2, Sparkles } from 'lucide-react'
import { PromptPicker } from '@/components/prompt-picker'
import { BUSINESS_TEMPLATES, getTemplatesByCategory } from '@/lib/business-templates'
import { AIRecommendations } from '@/components/ai-recommendations'
import { AIRecommendation } from '@/lib/ai-service'
import { WizardWhimsicalDiagram } from '@/components/wizard-whimsical-diagram'

interface AgentConfig {
  name: string
  type: 'personal-assistant' | 'study-research' | 'business-productivity' | 'information-research' | 'business-templates'
  description: string
  systemPrompt: string
  personality: string
  tools: string[]
  goals: string[]
  channels: string[]
  memory: {
    enabled: boolean
    type: 'conversation' | 'vector' | 'hybrid'
  }
}

const AGENT_TYPES = [
  {
    id: 'personal-assistant',
    name: 'Personal Assistant',
    description: 'Daily productivity and task management',
    icon: MessageSquare,
    explanation: {
      what: 'AI assistant for daily productivity and task management',
      why: 'Perfect for managing schedule, notes, and daily tasks',
      advanced: 'Integrates with calendar, email, and productivity tools',
      example: 'Organize your day, track goals, manage appointments'
    }
  },
  {
    id: 'study-research',
    name: 'Study & Research',
    description: 'Learning, summarization, and academic work',
    icon: Database,
    explanation: {
      what: 'AI that helps with learning, research, and academic work',
      why: 'Creates study guides, explains concepts, summarizes research',
      advanced: 'Analyzes papers, creates materials, tracks progress',
      example: 'Upload research → AI creates study guides and explanations'
    }
  },
  {
    id: 'business-productivity',
    name: 'Business Productivity',
    description: 'Workplace assistance and professional tasks',
    icon: Zap,
    explanation: {
      what: 'AI for professional work and business tasks',
      why: 'Drafts emails, creates reports, manages team tasks',
      advanced: 'Integrates with business tools, analyzes data',
      example: 'Draft emails, create reports, manage team tasks'
    }
  },
  {
    id: 'information-research',
    name: 'Information & Research',
    description: 'Factual questions with web search and APIs',
    icon: Users,
    explanation: {
      what: 'AI that finds and verifies information from sources',
      why: 'Provides accurate, up-to-date information with sources',
      advanced: 'Searches web, compares sources, comprehensive research',
      example: 'Ask about events → AI searches and provides verified info'
    }
  },
  {
    id: 'business-templates',
    name: 'Business Templates',
    description: 'Pre-configured enterprise solutions',
    icon: Building2,
    explanation: {
      what: 'Ready-to-use business agent templates',
      why: 'Save time with pre-configured workflows',
      advanced: 'Includes tools, integrations, and best practices',
      example: 'Customer Support Bot, Sales Outreach with CRM'
    }
  }
]

const AVAILABLE_TOOLS = [
  {
    id: 'search',
    name: 'Web Search',
    description: 'Search the internet for current information',
    explanation: {
      what: 'Lets your AI search for current information',
      why: 'Keeps answers up-to-date and factual',
      advanced: 'Uses specific search engines or custom sources',
      example: '"Weather today?" → AI searches and responds'
    }
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Schedule and manage calendar events',
    explanation: {
      what: 'AI can check and schedule calendar events',
      why: 'Perfect for booking meetings and managing schedules',
      advanced: 'Works with Google Calendar, Outlook, Calendly',
      example: '"Schedule meeting tomorrow 2pm" → AI books it'
    }
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Read and write to Notion databases',
    explanation: {
      what: 'AI can read and write to your Notion workspace',
      why: 'Keeps knowledge organized and searchable',
      advanced: 'Creates pages, updates databases, manages projects',
      example: '"Save notes to Notion" → AI creates organized page'
    }
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send and receive emails',
    explanation: {
      what: 'Your AI can send and receive emails',
      why: 'Automates communication and follow-ups',
      advanced: 'Parses emails, extracts data, sends templates',
      example: '"Send follow-up to leads" → AI personalizes and sends'
    }
  }
]

function ExplanationHoverCard({ explanation, children }: { explanation: any, children: React.ReactNode }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">What is this?</h4>
            <p className="text-sm text-gray-700">{explanation.what}</p>
          </div>
          <div>
            <h4 className="font-semibold text-green-900 text-sm">Why is it useful?</h4>
            <p className="text-sm text-gray-700">{explanation.why}</p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-900 text-sm">Advanced</h4>
            <p className="text-sm text-gray-700">{explanation.advanced}</p>
          </div>
          <div>
            <h4 className="font-semibold text-orange-900 text-sm">Example</h4>
            <p className="text-sm text-gray-700">{explanation.example}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default function WizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [config, setConfig] = useState<AgentConfig>({
    name: '',
    type: 'personal-assistant',
    description: '',
    systemPrompt: '',
    personality: '',
    tools: [],
    goals: [],
    channels: [],
    memory: {
      enabled: false,
      type: 'conversation'
    }
  })

  const updateConfig = (updates: Partial<AgentConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const handleAIRecommendation = (recommendation: AIRecommendation) => {
    updateConfig({
      type: recommendation.agentType as any,
      tools: recommendation.tools,
      systemPrompt: recommendation.systemPrompt
    })
  }

  const handleGenerateWorkflow = async () => {
    try {
      const response = await fetch('/api/ai/generate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        const result = await response.json()
        localStorage.setItem('generatedWorkflow', JSON.stringify(result.workflow))
        localStorage.setItem('agentConfig', JSON.stringify(config))
        router.push('/wizard/preview')
      }
    } catch (error) {
      console.error('Error generating workflow:', error)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const stepTitles = ['Agent Type', 'Configuration', 'Tools & Goals', 'Review']
  const stepDescriptions = [
    'Choose your agent type',
    'Set personality and behavior',
    'Add tools and define goals',
    'Review and generate workflow'
  ]

  return (
    <DashboardLayout 
      title="Agent Builder"
      description="Create your custom AI agent"
    >
      {/* AI Recommendations */}
      <div className="mb-6">
        <AIRecommendations 
          onApplyRecommendation={handleAIRecommendation}
          currentConfig={config}
        />
      </div>

      {/* Compact Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2 space-x-8">
          {stepTitles.map((name, index) => (
            <span key={index} className={`text-xs font-medium ${
              currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Step Content */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">{currentStep}</span>
                </div>
                <div>
                  <CardTitle className="text-lg">{stepTitles[currentStep - 1]}</CardTitle>
                  <CardDescription className="text-sm">{stepDescriptions[currentStep - 1]}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step 1: Agent Type */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 gap-3">
                  {AGENT_TYPES.map(type => (
                    <ExplanationHoverCard key={type.id} explanation={type.explanation}>
                      <Card 
                        className={`cursor-pointer transition-all border-2 ${
                          config.type === type.id 
                            ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                            : 'hover:shadow-sm border-gray-100'
                        }`}
                        onClick={() => updateConfig({ type: type.id as any })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <type.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900 text-sm">{type.name}</h3>
                                <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ExplanationHoverCard>
                  ))}

                  {/* Business Templates */}
                  {config.type === 'business-templates' && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <h3 className="text-sm font-semibold text-purple-900 mb-3">
                        🏢 Business Templates
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {BUSINESS_TEMPLATES.slice(0, 4).map(template => (
                          <Card key={template.id} className="cursor-pointer hover:shadow-sm transition-shadow border border-purple-100">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{template.icon}</span>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
                                  <p className="text-xs text-gray-600">{template.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Configuration */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">Agent Name</Label>
                      <Input
                        id="name"
                        value={config.name}
                        onChange={(e) => updateConfig({ name: e.target.value })}
                        placeholder="My AI Assistant"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="personality" className="text-sm font-medium">Personality</Label>
                      <Input
                        id="personality"
                        value={config.personality}
                        onChange={(e) => updateConfig({ personality: e.target.value })}
                        placeholder="Friendly and helpful"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => updateConfig({ description: e.target.value })}
                      placeholder="Describe what your agent does..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="systemPrompt" className="text-sm font-medium">System Prompt</Label>
                    <PromptPicker
                      agentType={config.type}
                      onSelectPrompt={(prompt) => updateConfig({ systemPrompt: prompt })}
                    />
                    <Textarea
                      id="systemPrompt"
                      value={config.systemPrompt}
                      onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
                      placeholder="Define how your agent should behave..."
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Tools & Goals */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Tools Selection */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Available Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {AVAILABLE_TOOLS.map(tool => (
                        <ExplanationHoverCard key={tool.id} explanation={tool.explanation}>
                          <Card className={`cursor-pointer transition-all border-2 ${
                            config.tools.includes(tool.id)
                              ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
                              : 'hover:shadow-sm border-gray-100'
                          }`}>
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={config.tools.includes(tool.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      updateConfig({ tools: [...config.tools, tool.id] })
                                    } else {
                                      updateConfig({ tools: config.tools.filter(t => t !== tool.id) })
                                    }
                                  }}
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm text-gray-900">{tool.name}</h4>
                                  <p className="text-xs text-gray-600">{tool.description}</p>
                                </div>
                                <Info className="w-4 h-4 text-gray-400" />
                              </div>
                            </CardContent>
                          </Card>
                        </ExplanationHoverCard>
                      ))}
                    </div>
                  </div>

                  {/* Goals */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Agent Goals</h3>
                    <div className="space-y-2">
                      {['Improve productivity', 'Save time', 'Provide accurate information', 'Automate tasks'].map(goal => (
                        <div key={goal} className="flex items-center gap-2">
                          <Checkbox
                            checked={config.goals.includes(goal)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateConfig({ goals: [...config.goals, goal] })
                              } else {
                                updateConfig({ goals: config.goals.filter(g => g !== goal) })
                              }
                            }}
                          />
                          <Label className="text-sm">{goal}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Memory */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Memory & Context</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                                                    checked={config.memory.enabled}       
                          onCheckedChange={(checked) => updateConfig({
                            memory: { ...config.memory, enabled: checked as boolean }
                          })}
                        />
                        <Label className="text-sm">Enable conversation memory</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Agent Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500">Name:</span>
                          <p className="text-sm font-medium">{config.name || 'Not set'}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Type:</span>
                          <p className="text-sm font-medium">{AGENT_TYPES.find(t => t.id === config.type)?.name}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Tools:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {config.tools.map(tool => (
                              <Badge key={tool} variant="secondary" className="text-xs">
                                {AVAILABLE_TOOLS.find(t => t.id === tool)?.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">System Prompt</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 line-clamp-4">
                          {config.systemPrompt || 'No system prompt set'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-center">
                    <Button 
                      onClick={handleGenerateWorkflow}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate n8n Workflow
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            {currentStep < 4 && (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right Side - Diagram */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="text-blue-600">📊</span>
                Agent Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WizardWhimsicalDiagram
                config={config}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
