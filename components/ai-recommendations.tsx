'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Sparkles, 
  Lightbulb, 
  Target, 
  Zap, 
  CheckCircle, 
  Loader2,
  ArrowRight,
  Brain
} from 'lucide-react'
import { AIService, AIRecommendation } from '@/lib/ai-service'

interface AIRecommendationsProps {
  onApplyRecommendation: (recommendation: AIRecommendation) => void
  currentConfig?: any
}

export function AIRecommendations({ onApplyRecommendation, currentConfig }: AIRecommendationsProps) {
  const [userInput, setUserInput] = useState('')
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showInput, setShowInput] = useState(false)

  const handleGetRecommendation = async () => {
    if (!userInput.trim()) return
    
    setIsLoading(true)
    try {
      console.log('🔍 Calling AI recommendations API with input:', userInput);
      
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('🔍 AI recommendations API response:', data);
      
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Failed to get AI recommendation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyRecommendation = () => {
    if (recommendation) {
      onApplyRecommendation(recommendation)
      setShowInput(false)
      setUserInput('')
      setRecommendation(null)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence'
    if (confidence >= 0.6) return 'Medium Confidence'
    return 'Low Confidence'
  }

  return (
    <div className="space-y-4">
      {/* AI Recommendations Trigger */}
      {!showInput && !recommendation && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">🤖 AI Agent Recommendations</CardTitle>
            </div>
            <CardDescription>
              Let AI analyze your needs and suggest the perfect agent configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowInput(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              Get AI Recommendations
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Input Form */}
      {showInput && !recommendation && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <CardTitle>Tell us about your needs</CardTitle>
            </div>
            <CardDescription>
              Describe what you want your AI agent to help you with
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ai-input">What do you need help with?</Label>
              <Textarea
                id="ai-input"
                placeholder="e.g., I need help managing my daily tasks, scheduling meetings, and organizing my notes. I work in sales and need to track leads and follow-ups."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleGetRecommendation}
                disabled={isLoading || !userInput.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Recommendations
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowInput(false)
                  setUserInput('')
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendation Results */}
      {recommendation && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-green-600" />
                <CardTitle>AI Recommendation</CardTitle>
              </div>
              <Badge className={getConfidenceColor(recommendation.confidence)}>
                {getConfidenceText(recommendation.confidence)}
              </Badge>
            </div>
            <CardDescription>
              Based on your needs, here's what AI recommends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Agent Type Recommendation */}
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Recommended Agent Type</h4>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium capitalize">
                  {recommendation.agentType.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Tools Recommendation */}
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Recommended Tools</h4>
              <div className="grid grid-cols-2 gap-2">
                {recommendation.tools.map((tool) => (
                  <div key={tool} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm capitalize">{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Prompt */}
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Optimized System Prompt</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                {recommendation.systemPrompt}
              </p>
            </div>

            {/* Reasoning */}
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Why this recommendation?</h4>
              <p className="text-sm text-gray-700">
                {recommendation.reasoning}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleApplyRecommendation}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Apply Recommendation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setRecommendation(null)
                  setShowInput(false)
                  setUserInput('')
                }}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Examples */}
      {!showInput && !recommendation && (
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-700">💡 Quick Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-left h-auto p-2"
                onClick={() => {
                  setUserInput("I need help managing my daily tasks, scheduling meetings, and organizing my notes. I work in sales and need to track leads and follow-ups.")
                  setShowInput(true)
                }}
              >
                <ArrowRight className="w-3 h-3 mr-2" />
                "I need help managing my daily tasks, scheduling meetings, and organizing my notes. I work in sales and need to track leads and follow-ups."
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-left h-auto p-2"
                onClick={() => {
                  setUserInput("I'm a student and need help with research, summarizing articles, and creating study guides for my courses.")
                  setShowInput(true)
                }}
              >
                <ArrowRight className="w-3 h-3 mr-2" />
                "I'm a student and need help with research, summarizing articles, and creating study guides for my courses."
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-left h-auto p-2"
                onClick={() => {
                  setUserInput("I need to automate customer support responses, track customer inquiries, and generate reports for my business.")
                  setShowInput(true)
                }}
              >
                <ArrowRight className="w-3 h-3 mr-2" />
                "I need to automate customer support responses, track customer inquiries, and generate reports for my business."
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
