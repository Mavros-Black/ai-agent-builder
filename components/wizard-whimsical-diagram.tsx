'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  Bot, 
  Calendar, 
  FileText, 
  Globe, 
  Mail, 
  Search, 
  Database,
  Zap,
  ArrowRight,
  Sparkles,
  Target,
  Lightbulb
} from 'lucide-react'

interface WizardWhimsicalDiagramProps {
  config: {
    type: string
    tools: string[]
    systemPrompt: string
    name?: string
  }
  className?: string
}

const getAgentTypeInfo = (type: string) => {
  switch (type) {
    case 'personal-assistant':
      return {
        title: 'Personal Assistant Agent',
        description: 'Your daily productivity companion',
        icon: <MessageSquare className="w-5 h-5" />,
        color: 'from-blue-500 to-purple-600',
        bgColor: 'from-blue-50 to-purple-50',
        borderColor: 'border-blue-200'
      }
    case 'study-research':
      return {
        title: 'Study & Research Assistant',
        description: 'Your academic research partner',
        icon: <FileText className="w-5 h-5" />,
        color: 'from-green-500 to-teal-600',
        bgColor: 'from-green-50 to-teal-50',
        borderColor: 'border-green-200'
      }
    case 'business-productivity':
      return {
        title: 'Business Productivity Agent',
        description: 'Your professional workflow optimizer',
        icon: <Target className="w-5 h-5" />,
        color: 'from-purple-500 to-pink-600',
        bgColor: 'from-purple-50 to-pink-50',
        borderColor: 'border-purple-200'
      }
    case 'information-research':
      return {
        title: 'Information Research Agent',
        description: 'Your knowledge discovery assistant',
        icon: <Search className="w-5 h-5" />,
        color: 'from-orange-500 to-red-600',
        bgColor: 'from-orange-50 to-red-50',
        borderColor: 'border-orange-200'
      }
    default:
      return {
        title: 'AI Agent',
        description: 'Your intelligent assistant',
        icon: <Bot className="w-5 h-5" />,
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-50',
        borderColor: 'border-gray-200'
      }
  }
}

const getToolInfo = (tool: string) => {
  switch (tool) {
    case 'calendar':
      return {
        name: 'Calendar',
        icon: <Calendar className="w-4 h-4" />,
        description: 'Schedule management',
        color: 'bg-blue-500',
        borderColor: 'border-blue-200'
      }
    case 'notion':
      return {
        name: 'Notion',
        icon: <FileText className="w-4 h-4" />,
        description: 'Note taking & organization',
        color: 'bg-purple-500',
        borderColor: 'border-purple-200'
      }
    case 'search':
      return {
        name: 'Web Search',
        icon: <Globe className="w-4 h-4" />,
        description: 'Real-time information',
        color: 'bg-green-500',
        borderColor: 'border-green-200'
      }
    case 'email':
      return {
        name: 'Email',
        icon: <Mail className="w-4 h-4" />,
        description: 'Communication hub',
        color: 'bg-orange-500',
        borderColor: 'border-orange-200'
      }
    case 'database':
      return {
        name: 'Database',
        icon: <Database className="w-4 h-4" />,
        description: 'Data storage & retrieval',
        color: 'bg-pink-500',
        borderColor: 'border-pink-200'
      }
    default:
      return {
        name: tool,
        icon: <Zap className="w-4 h-4" />,
        description: 'Custom tool',
        color: 'bg-gray-500',
        borderColor: 'border-gray-200'
      }
  }
}

export function WizardWhimsicalDiagram({ config, className }: WizardWhimsicalDiagramProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [showToolDetails, setShowToolDetails] = useState<string | null>(null)

  const agentInfo = getAgentTypeInfo(config.type)
  const selectedTools = config.tools
  const toolCount = selectedTools.length

  const steps = [
    { name: 'User Input', icon: '👤', description: 'You ask for help' },
    { name: 'AI Processing', icon: '🤖', description: 'AI analyzes your request' },
    ...(toolCount > 0 ? [{ name: 'Tool Integration', icon: '🔧', description: 'Tools are activated' }] : []),
    { name: 'Response', icon: '✨', description: 'You get your answer' }
  ]

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= steps.length - 1) {
            setIsAnimating(false)
            return 0
          }
          return prev + 1
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isAnimating, steps.length])

  const startAnimation = () => {
    setIsAnimating(true)
    setActiveStep(0)
  }

  const stopAnimation = () => {
    setIsAnimating(false)
    setActiveStep(0)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Agent Type Header */}
      <Card className={`bg-gradient-to-r ${agentInfo.bgColor} ${agentInfo.borderColor} border-2`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${agentInfo.color} flex items-center justify-center text-white`}>
              {agentInfo.icon}
            </div>
            <CardTitle className="text-xl">{agentInfo.title}</CardTitle>
          </div>
          <CardDescription className="text-lg">{agentInfo.description}</CardDescription>
        </CardHeader>
      </Card>

      {/* Interactive Flow */}
      <Card className="bg-white border-2 border-gray-100 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <CardTitle>Interactive Flow</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={isAnimating ? stopAnimation : startAnimation}
                size="sm"
                variant="outline"
                className="bg-white"
              >
                {isAnimating ? 'Stop' : 'Start'} Animation
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[300px]">
            {/* Flow Steps */}
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => {
                const isActive = activeStep === index
                const isCompleted = activeStep > index
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    {/* Step Node */}
                    <div className={`
                      relative w-20 h-20 rounded-2xl border-4 shadow-lg transition-all duration-500
                      ${isActive ? 'border-yellow-400 shadow-yellow-200 animate-pulse' : ''}
                      ${isCompleted ? 'border-green-400 shadow-green-200' : 'border-gray-200'}
                      bg-white
                    `}>
                      <div className="flex items-center justify-center h-full">
                        <span className="text-2xl">{step.icon}</span>
                      </div>
                      {isActive && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                      )}
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Step Label */}
                    <div className="mt-3 text-center">
                      <p className="text-sm font-medium text-gray-900">{step.name}</p>
                      <p className="text-xs text-gray-600">{step.description}</p>
                    </div>
                    
                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-10 left-full w-8 h-0.5 bg-gray-300">
                        <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Tools */}
      {toolCount > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Connected Tools ({toolCount})
            </CardTitle>
            <CardDescription>
              Your agent can access these tools to help you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedTools.map((tool) => {
                const toolInfo = getToolInfo(tool)
                return (
                  <div
                    key={tool}
                    className={`
                      bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer transition-all duration-300
                      ${toolInfo.borderColor} hover:shadow-md hover:scale-105
                    `}
                    onClick={() => setShowToolDetails(showToolDetails === tool ? null : tool)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${toolInfo.color} flex items-center justify-center text-white`}>
                        {toolInfo.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{toolInfo.name}</h4>
                        <p className="text-sm text-gray-600">{toolInfo.description}</p>
                      </div>
                    </div>
                    
                    {/* Tool Details */}
                    {showToolDetails === tool && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Status:</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Connected
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Type:</span>
                            <span className="text-gray-600">API Integration</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Access:</span>
                            <span className="text-gray-600">Read & Write</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Capabilities */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            Agent Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Natural Language Processing</h4>
              <p className="text-sm text-gray-600">Understands and responds to natural language queries</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Context Awareness</h4>
              <p className="text-sm text-gray-600">Remembers conversation context and user preferences</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Tool Integration</h4>
              <p className="text-sm text-gray-600">Seamlessly connects with {toolCount} external tools</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Real-time Processing</h4>
              <p className="text-sm text-gray-600">Processes requests and provides instant responses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Prompt Preview */}
      {config.systemPrompt && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              System Prompt
            </CardTitle>
            <CardDescription>
              How your agent will behave and respond
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                {config.systemPrompt}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
