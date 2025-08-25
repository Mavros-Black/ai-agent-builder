'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Code, 
  Database, 
  Globe, 
  Mail, 
  Calendar,
  FileText,
  Search,
  Settings,
  ArrowRight,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Copy,
  Download,
  Lightbulb,
  GraduationCap,
  BookOpen,
  Video,
  Terminal,
  Cpu,
  Brain,
  Workflow,
  Sparkles
} from 'lucide-react'

export default function N8nAITutorialPage() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      id: 1,
      title: "Understanding AI Concepts",
      icon: <Brain className="w-6 h-6" />,
      description: "Learn the fundamentals of AI agents vs LLMs"
    },
    {
      id: 2,
      title: "Create Your First Workflow",
      icon: <Workflow className="w-6 h-6" />,
      description: "Set up a new n8n workflow"
    },
    {
      id: 3,
      title: "Add Chat Trigger",
      icon: <MessageSquare className="w-6 h-6" />,
      description: "Create the entry point for conversations"
    },
    {
      id: 4,
      title: "Configure AI Agent",
      icon: <Bot className="w-6 h-6" />,
      description: "Add and configure the AI Agent node"
    },
    {
      id: 5,
      title: "Connect Chat Model",
      icon: <Cpu className="w-6 h-6" />,
      description: "Link OpenAI or other LLM providers"
    },
    {
      id: 6,
      title: "Add Credentials",
      icon: <Settings className="w-6 h-6" />,
      description: "Set up API keys and authentication"
    },
    {
      id: 7,
      title: "Test Your Agent",
      icon: <Play className="w-6 h-6" />,
      description: "Test the conversation flow"
    },
    {
      id: 8,
      title: "Customize Prompts",
      icon: <Sparkles className="w-6 h-6" />,
      description: "Modify system messages and behavior"
    },
    {
      id: 9,
      title: "Add Memory",
      icon: <Database className="w-6 h-6" />,
      description: "Enable conversation persistence"
    },
    {
      id: 10,
      title: "Save & Deploy",
      icon: <CheckCircle className="w-6 h-6" />,
      description: "Save your workflow and go live"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">n8n AI Agent Tutorial</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the art of building intelligent AI agents with n8n. Learn step-by-step how to create conversational AI workflows that can understand, process, and respond to user requests.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Badge variant="secondary" className="text-sm">
                <BookOpen className="w-4 h-4 mr-1" />
                Beginner Friendly
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Video className="w-4 h-4 mr-1" />
                Interactive Guide
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Terminal className="w-4 h-4 mr-1" />
                Hands-on Practice
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="concepts" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Concepts
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Step-by-Step
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Examples
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Core Skills</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Understanding AI agents vs LLMs
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Creating n8n workflows with AI
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Configuring chat models and credentials
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Adding memory and persistence
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Customizing AI behavior with prompts
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Prerequisites</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        Basic n8n knowledge
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        OpenAI API key (or alternative)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        n8n instance (Cloud or Self-hosted)
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Concepts Tab */}
          <TabsContent value="concepts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Concepts in n8n
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-2 border-gray-100">
                    <CardHeader>
                      <CardTitle className="text-lg">Large Language Models (LLMs)</CardTitle>
                      <p className="text-gray-600">Text generation based on input prediction</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Single-step processing
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            No decision-making
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            No tool usage
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Language generation only
                          </li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Example:</p>
                        <p className="text-sm text-blue-700">GPT-4 generating a paragraph about AI</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-gray-100">
                    <CardHeader>
                      <CardTitle className="text-lg">AI Agents</CardTitle>
                      <p className="text-gray-600">Goal-oriented task completion with tools</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Multi-step workflows
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Decision-making
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Tool/API integration
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Real-world task execution
                          </li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Example:</p>
                        <p className="text-sm text-green-700">Agent scheduling appointments and sending confirmations</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step-by-Step Tutorial */}
          <TabsContent value="tutorial" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Step Navigation */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {steps.map((step) => (
                        <button
                          key={step.id}
                          onClick={() => setActiveStep(step.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            activeStep === step.id
                              ? 'bg-blue-50 border-blue-200 border-2'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activeStep === step.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {step.icon}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{step.title}</p>
                              <p className="text-xs text-gray-500">{step.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step Content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {steps[activeStep - 1]?.icon}
                      Step {activeStep}: {steps[activeStep - 1]?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeStep === 1 && (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Before diving into building AI agents, it's important to understand the fundamental differences between Large Language Models (LLMs) and AI Agents.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Key Takeaway:</h4>
                          <p className="text-sm">
                            LLMs generate text based on input prediction, while AI agents add goal-oriented functionality, 
                            decision-making, and tool usage to complete complex tasks.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeStep === 2 && (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Start by creating a new workflow in n8n. You can either use an empty workflow (if you're new) 
                          or create one from the Workflows list.
                        </p>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Instructions:</h4>
                          <ol className="text-sm space-y-1">
                            <li>1. Open n8n and look for an empty workflow or the Workflows list</li>
                            <li>2. Click the universal create resource button (➕) to create a new workflow</li>
                            <li>3. Give your workflow a descriptive name like "AI Chat Assistant"</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {activeStep === 3 && (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Every workflow needs a trigger node to start. For AI conversations, we'll use the Chat Trigger node.
                        </p>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">How to Add Chat Trigger:</h4>
                          <ol className="text-sm space-y-1">
                            <li>1. Select "Add first step" or press Tab to open the node menu</li>
                            <li>2. Search for "Chat Trigger" in the search bar</li>
                            <li>3. Select "Chat Trigger" to add it to your canvas</li>
                            <li>4. Close the node details view to return to the canvas</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {activeStep === 4 && (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          The AI Agent node is the core component that adds intelligence to your workflow. 
                          It processes input and makes decisions about how to respond.
                        </p>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Adding AI Agent:</h4>
                          <ol className="text-sm space-y-1">
                            <li>1. Click the "Add node" connector on the Chat Trigger node</li>
                            <li>2. Search for "AI" and select "AI Agent"</li>
                            <li>3. The AI Agent editing view will open</li>
                            <li>4. Default settings work with Chat Trigger - no changes needed initially</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {activeStep === 5 && (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          AI agents need a chat model to process and generate responses. 
                          n8n supports multiple providers including OpenAI, Google Gemini, and others.
                        </p>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Connecting Chat Model:</h4>
                          <ol className="text-sm space-y-1">
                            <li>1. Click the plus button under "Chat Model" connection on AI Agent</li>
                            <li>2. Search dialog will appear filtered on 'Language Models'</li>
                            <li>3. Select "OpenAI Chat Model" (or your preferred provider)</li>
                            <li>4. The model will attach to the AI Agent node</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {activeStep === 6 && (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Credentials are required for n8n to communicate with external services like OpenAI. 
                          These contain your API keys and authentication information.
                        </p>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Adding Credentials:</h4>
                          <ol className="text-sm space-y-1">
                            <li>1. Click "Select credential" in the chat model node</li>
                            <li>2. Choose "Add new credential" option</li>
                            <li>3. Select your provider (e.g., OpenAI)</li>
                            <li>4. Enter your API key (found in your provider dashboard)</li>
                            <li>5. Save the credential</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {activeStep === 7 && (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Now it's time to test your AI agent! Use the built-in chat interface to see how your agent responds.
                        </p>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Testing Steps:</h4>
                          <ol className="text-sm space-y-1">
                            <li>1. Click the 'Chat' button near the bottom of the canvas</li>
                            <li>2. A local chat window will open on the left</li>
                            <li>3. AI agent logs will appear on the right</li>
                            <li>4. Type a message and press Enter</li>
                            <li>5. Watch the response from your AI agent</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {activeStep === 8 && (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Customize your AI agent's behavior by modifying the system prompt. 
                          This controls how the AI responds and what personality it adopts.
                        </p>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Changing the Prompt:</h4>
                          <ol className="text-sm space-y-1">
                            <li>1. Open the AI Agent node</li>
                            <li>2. Go to 'Options' section and select 'Add Option'</li>
                            <li>3. Choose 'System message' from the dropdown</li>
                            <li>4. Modify the default prompt to your desired behavior</li>
                            <li>5. Close the node and test in chat window</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {activeStep === 9 && (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Add memory to your AI agent so it can remember previous conversations and maintain context.
                        </p>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Adding Memory:</h4>
                          <ol className="text-sm space-y-1">
                            <li>1. Click the "Add node" icon on the bottom of AI Agent</li>
                            <li>2. Look for the "Memory" connection</li>
                            <li>3. Select "Simple Memory" from the options</li>
                            <li>4. Default 5 interactions should be sufficient</li>
                            <li>5. Test by having a conversation and asking follow-up questions</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {activeStep === 10 && (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Save your workflow and deploy it for production use. 
                          Remember to save regularly to avoid losing your work!
                        </p>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Saving Your Workflow:</h4>
                          <ol className="text-sm space-y-1">
                            <li>1. Click the "Save" button in the top right of the editor</li>
                            <li>2. Your workflow will be saved and accessible later</li>
                            <li>3. You can return to chat or add new features anytime</li>
                            <li>4. Consider versioning your workflows for production</li>
                          </ol>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Congratulations! 🎉</h4>
                          <p className="text-sm">
                            You've successfully created your first AI agent with n8n! 
                            You now have a working conversational AI that can be extended with tools, 
                            connected to external services, and customized for specific use cases.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Real-World AI Agent Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-600" />
                        Customer Support Agent
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        AI agent that handles customer inquiries, looks up order information, and creates support tickets.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Email integration for ticket creation
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Database lookup for order history
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Escalation to human agents
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        Meeting Scheduler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        AI agent that schedules meetings, checks availability, and sends calendar invitations.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Calendar API integration
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Email notifications
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Conflict resolution
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
