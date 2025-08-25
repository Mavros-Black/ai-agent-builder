'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Zap, 
  Target, 
  ArrowUpRight,
  Clock,
  DollarSign,
  Users,
  Activity
} from 'lucide-react'
import { AIService, AIInsight } from '@/lib/ai-service'

interface AIInsightsProps {
  usageData?: any
  userProfile?: any
}

export function AIInsights({ usageData, userProfile }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const mockUsageData = {
    currentUsage: userProfile?.usage_count || 0,
    maxUsage: userProfile?.max_usage || 50,
    plan: userProfile?.role || 'free',
    workflowsCreated: 3,
    averageExecutionTime: 2.5,
    mostUsedTools: ['search', 'calendar'],
    recentActivity: [
      { date: '2024-01-20', action: 'Workflow executed', tool: 'search' },
      { date: '2024-01-19', action: 'Workflow created', tool: 'calendar' },
      { date: '2024-01-18', action: 'Workflow executed', tool: 'email' }
    ]
  }

  const generateInsights = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Calling AI insights API with data:', mockUsageData);
      
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usageData: mockUsageData }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('🔍 AI insights API response:', data);
      
      if (data.success && data.insights) {
        setInsights(data.insights)
        setLastUpdated(new Date())
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error)
      // Fallback insights
      setInsights([
        {
          type: 'usage',
          title: 'Usage Optimization Opportunity',
          description: 'You\'re using 60% of your monthly limit. Consider upgrading to Pro for unlimited usage.',
          action: 'Upgrade to Pro Plan',
          priority: 'medium'
        },
        {
          type: 'performance',
          title: 'Workflow Performance',
          description: 'Your workflows are performing well with an average execution time of 2.5 seconds.',
          action: 'Monitor performance trends',
          priority: 'low'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (usageData || userProfile) {
      generateInsights()
    }
  }, [usageData, userProfile])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'usage': return <Activity className="w-4 h-4" />
      case 'performance': return <TrendingUp className="w-4 h-4" />
      case 'upgrade': return <ArrowUpRight className="w-4 h-4" />
      case 'optimization': return <Zap className="w-4 h-4" />
      default: return <Lightbulb className="w-4 h-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'usage': return 'text-blue-600'
      case 'performance': return 'text-green-600'
      case 'upgrade': return 'text-purple-600'
      case 'optimization': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <CardTitle>🤖 AI-Powered Insights</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateInsights}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Analyzing...' : 'Refresh Insights'}
            </Button>
          </div>
          <CardDescription>
            Intelligent recommendations based on your usage patterns and performance
          </CardDescription>
          {lastUpdated && (
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`${getInsightColor(insight.type)} flex-shrink-0`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <CardTitle className="text-base truncate">{insight.title}</CardTitle>
                </div>
                <Badge className={`${getPriorityColor(insight.priority)} w-fit flex-shrink-0`}>
                  {insight.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                {insight.description}
              </p>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">
                  Recommended Action:
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs h-8 px-3"
                >
                  {insight.action.length > 30 ? `${insight.action.substring(0, 30)}...` : insight.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Performance Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            <CardTitle>AI Performance Summary</CardTitle>
          </div>
          <CardDescription>
            Key metrics and AI-generated recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="text-center p-3 lg:p-4 bg-white rounded-lg border border-green-200">
              <div className="text-xl lg:text-2xl font-bold text-green-600">
                {mockUsageData.currentUsage}
              </div>
              <div className="text-xs lg:text-sm text-green-700">Executions</div>
              <div className="text-xs text-gray-500">This month</div>
            </div>
            <div className="text-center p-3 lg:p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-xl lg:text-2xl font-bold text-blue-600">
                {mockUsageData.workflowsCreated}
              </div>
              <div className="text-xs lg:text-sm text-blue-700">Workflows</div>
              <div className="text-xs text-gray-500">Created</div>
            </div>
            <div className="text-center p-3 lg:p-4 bg-white rounded-lg border border-purple-200">
              <div className="text-xl lg:text-2xl font-bold text-purple-600">
                {mockUsageData.averageExecutionTime}s
              </div>
              <div className="text-xs lg:text-sm text-purple-700">Avg Time</div>
              <div className="text-xs text-gray-500">Per execution</div>
            </div>
            <div className="text-center p-3 lg:p-4 bg-white rounded-lg border border-orange-200">
              <div className="text-xl lg:text-2xl font-bold text-orange-600">
                {Math.round((mockUsageData.currentUsage / mockUsageData.maxUsage) * 100)}%
              </div>
              <div className="text-xs lg:text-sm text-orange-700">Usage</div>
              <div className="text-xs text-gray-500">Of limit</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-600" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <CardDescription>
            Personalized suggestions to improve your workflow efficiency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <div className="p-3 lg:p-4 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                <h4 className="font-semibold text-green-900 text-sm">Performance Tip</h4>
              </div>
              <p className="text-xs lg:text-sm text-gray-700">
                Your workflows are performing well! Consider adding error handling to improve reliability.
              </p>
            </div>
            <div className="p-3 lg:p-4 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <h4 className="font-semibold text-blue-900 text-sm">Team Collaboration</h4>
              </div>
              <p className="text-xs lg:text-sm text-gray-700">
                Upgrade to Business plan to enable team collaboration and shared workflows.
              </p>
            </div>
            <div className="p-3 lg:p-4 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <h4 className="font-semibold text-purple-900 text-sm">Time Savings</h4>
              </div>
              <p className="text-xs lg:text-sm text-gray-700">
                You've saved approximately 12 hours this month through workflow automation.
              </p>
            </div>
            <div className="p-3 lg:p-4 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                <h4 className="font-semibold text-green-900 text-sm">ROI Opportunity</h4>
              </div>
              <p className="text-xs lg:text-sm text-gray-700">
                Estimated $500/month savings potential with advanced automation features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
