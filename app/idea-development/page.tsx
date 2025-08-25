'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Lightbulb, 
  Sparkles, 
  Target, 
  Users, 
  Zap, 
  ArrowRight, 
  Copy, 
  Download,
  MessageSquare,
  Brain,
  TrendingUp,
  CheckCircle,
  Bot
} from 'lucide-react'

interface Idea {
  id: string
  title: string
  description: string
  category: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  potential: 'low' | 'medium' | 'high'
  status: 'draft' | 'refined' | 'ready'
  createdAt: Date
  aiSuggestions?: string[]
}

export default function IdeaDevelopmentPage() {
  const router = useRouter()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [currentIdea, setCurrentIdea] = useState<Partial<Idea>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  const handleGenerateIdeas = async () => {
    if (!currentIdea.description) return
    
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: currentIdea.description,
          category: currentIdea.category || 'general'
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setAiSuggestions(result.suggestions || [])
      }
    } catch (error) {
      console.error('Error generating ideas:', error)
      // Fallback suggestions
      setAiSuggestions([
        "Create a customer support chatbot that integrates with your existing CRM",
        "Build a content generation assistant for social media posts",
        "Develop a data analysis agent for business intelligence",
        "Design a workflow automation tool for repetitive tasks"
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRefineIdea = async (idea: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/refine-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      })
      
      if (response.ok) {
        const result = await response.json()
        const refinedIdea: Idea = {
          id: Date.now().toString(),
          title: result.title || 'Refined AI Agent Idea',
          description: result.description || idea,
          category: result.category || 'general',
          complexity: result.complexity || 'intermediate',
          potential: result.potential || 'medium',
          status: 'refined',
          createdAt: new Date(),
          aiSuggestions: result.suggestions || []
        }
        setIdeas(prev => [...prev, refinedIdea])
        setCurrentIdea({})
        setAiSuggestions([])
      }
    } catch (error) {
      console.error('Error refining idea:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveIdea = () => {
    if (!currentIdea.title || !currentIdea.description) return
    
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: currentIdea.title,
      description: currentIdea.description,
      category: currentIdea.category || 'general',
      complexity: currentIdea.complexity || 'beginner',
      potential: currentIdea.potential || 'medium',
      status: 'draft',
      createdAt: new Date()
    }
    
    setIdeas(prev => [...prev, newIdea])
    setCurrentIdea({})
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout 
      title="Idea Development with AI"
      description="Brainstorm and refine your AI agent ideas with AI assistance"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Idea Development</h1>
            <p className="text-gray-600 mt-2">Transform your ideas into powerful AI agents with AI assistance</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="brainstorm" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="brainstorm" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Brainstorm
            </TabsTrigger>
            <TabsTrigger value="refine" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Refine Ideas
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Idea Library
            </TabsTrigger>
          </TabsList>

          {/* Brainstorm Tab */}
          <TabsContent value="brainstorm" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Idea Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Describe Your Idea
                  </CardTitle>
                  <CardDescription>
                    Tell us about your AI agent idea and let AI help you develop it
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="idea-title">Idea Title</Label>
                    <Input
                      id="idea-title"
                      placeholder="e.g., Customer Support AI Assistant"
                      value={currentIdea.title || ''}
                      onChange={(e) => setCurrentIdea(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="idea-category">Category</Label>
                    <select
                      id="idea-category"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={currentIdea.category || ''}
                      onChange={(e) => setCurrentIdea(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="">Select a category</option>
                      <option value="customer-support">Customer Support</option>
                      <option value="content-creation">Content Creation</option>
                      <option value="data-analysis">Data Analysis</option>
                      <option value="automation">Workflow Automation</option>
                      <option value="research">Research & Analysis</option>
                      <option value="education">Education & Training</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="idea-description">Description</Label>
                    <Textarea
                      id="idea-description"
                      placeholder="Describe your AI agent idea in detail. What problem does it solve? What features should it have?"
                      rows={4}
                      value={currentIdea.description || ''}
                      onChange={(e) => setCurrentIdea(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleGenerateIdeas}
                      disabled={!currentIdea.description || isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Ideas
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleSaveIdea}
                      disabled={!currentIdea.title || !currentIdea.description}
                      variant="outline"
                    >
                      Save Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    AI Suggestions
                  </CardTitle>
                  <CardDescription>
                    AI-powered ideas and improvements for your concept
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {aiSuggestions.length > 0 ? (
                    <div className="space-y-3">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-900">{suggestion}</p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRefineIdea(suggestion)}
                              className="text-xs"
                            >
                              <Target className="w-3 h-3 mr-1" />
                              Refine
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigator.clipboard.writeText(suggestion)}
                              className="text-xs"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Describe your idea above and click "Generate Ideas" to get AI suggestions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Refine Ideas Tab */}
          <TabsContent value="refine" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Refine Your Ideas
                </CardTitle>
                <CardDescription>
                  Select an idea to refine and enhance with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ideas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ideas.map((idea) => (
                      <Card key={idea.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                            <Badge variant="outline" className={getComplexityColor(idea.complexity)}>
                              {idea.complexity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{idea.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={getPotentialColor(idea.potential)}>
                              {idea.potential} potential
                            </Badge>
                            <Button size="sm" variant="outline">
                              <ArrowRight className="w-3 h-3 mr-1" />
                              Refine
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No ideas yet. Start brainstorming to create your first idea!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Idea Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Popular Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Popular Templates
                  </CardTitle>
                  <CardDescription>
                    Pre-built AI agent templates to get you started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'Customer Support Bot', category: 'Support', complexity: 'beginner' },
                    { name: 'Content Creator', category: 'Marketing', complexity: 'intermediate' },
                    { name: 'Data Analyst', category: 'Analytics', complexity: 'advanced' },
                    { name: 'Email Assistant', category: 'Productivity', complexity: 'beginner' }
                  ].map((template, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-gray-500">{template.category}</p>
                        </div>
                        <Badge variant="outline" className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Industry Solutions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Industry Solutions
                  </CardTitle>
                  <CardDescription>
                    AI agents tailored for specific industries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'E-commerce Assistant', industry: 'Retail', features: 'Order tracking, recommendations' },
                    { name: 'Healthcare Triage', industry: 'Healthcare', features: 'Symptom assessment, scheduling' },
                    { name: 'Financial Advisor', industry: 'Finance', features: 'Portfolio analysis, budgeting' },
                    { name: 'Legal Research', industry: 'Legal', features: 'Case research, document review' }
                  ].map((solution, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <p className="font-medium text-sm">{solution.name}</p>
                      <p className="text-xs text-gray-500">{solution.industry}</p>
                      <p className="text-xs text-blue-600 mt-1">{solution.features}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Start Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Start Guide
                  </CardTitle>
                  <CardDescription>
                    Get started with AI agent development
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <p className="text-sm">Describe your idea</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">2</span>
                      </div>
                      <p className="text-sm">Get AI suggestions</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">3</span>
                      </div>
                      <p className="text-sm">Refine and build</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">4</span>
                      </div>
                      <p className="text-sm">Deploy your agent</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => router.push('/wizard')}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Start Building
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
