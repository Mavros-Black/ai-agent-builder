'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Zap, 
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  date: string
  tasksAutomated: number
  hoursSaved: number
  costSavings: number
  activeAgents: number
}

const mockData: AnalyticsData[] = [
  { date: 'Jan 15', tasksAutomated: 45, hoursSaved: 12, costSavings: 240, activeAgents: 3 },
  { date: 'Jan 16', tasksAutomated: 52, hoursSaved: 14, costSavings: 280, activeAgents: 3 },
  { date: 'Jan 17', tasksAutomated: 38, hoursSaved: 10, costSavings: 200, activeAgents: 2 },
  { date: 'Jan 18', tasksAutomated: 67, hoursSaved: 18, costSavings: 360, activeAgents: 4 },
  { date: 'Jan 19', tasksAutomated: 73, hoursSaved: 20, costSavings: 400, activeAgents: 4 },
  { date: 'Jan 20', tasksAutomated: 58, hoursSaved: 16, costSavings: 320, activeAgents: 3 },
  { date: 'Jan 21', tasksAutomated: 82, hoursSaved: 22, costSavings: 440, activeAgents: 5 }
]

const agentPerformanceData = [
  { name: 'Customer Support Bot', value: 35, color: '#3B82F6' },
  { name: 'Sales Outreach Agent', value: 28, color: '#10B981' },
  { name: 'Research Assistant', value: 22, color: '#F59E0B' },
  { name: 'Knowledge Base Agent', value: 15, color: '#EF4444' }
]

const timeSavingsData = [
  { name: 'Email Automation', hours: 8, percentage: 40 },
  { name: 'Data Processing', hours: 6, percentage: 30 },
  { name: 'Research Tasks', hours: 4, percentage: 20 },
  { name: 'Documentation', hours: 2, percentage: 10 }
]

export function ROIDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedTeamMember, setSelectedTeamMember] = useState('all')

  const totalTasksAutomated = mockData.reduce((sum, day) => sum + day.tasksAutomated, 0)
  const totalHoursSaved = mockData.reduce((sum, day) => sum + day.hoursSaved, 0)
  const totalCostSavings = mockData.reduce((sum, day) => sum + day.costSavings, 0)
  const averageActiveAgents = Math.round(mockData.reduce((sum, day) => sum + day.activeAgents, 0) / mockData.length)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ROI & Analytics</h2>
          <p className="text-gray-600">Track your automation impact and cost savings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="customer-support">Customer Support Bot</SelectItem>
                <SelectItem value="sales-outreach">Sales Outreach Agent</SelectItem>
                <SelectItem value="research">Research Assistant</SelectItem>
                <SelectItem value="knowledge">Knowledge Base Agent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Team Members</SelectItem>
                <SelectItem value="john">John Smith</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="mike">Mike Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Automated</p>
                <p className="text-2xl font-bold">{totalTasksAutomated}</p>
                <p className="text-xs text-green-600">+12% vs last week</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hours Saved</p>
                <p className="text-2xl font-bold">{totalHoursSaved}h</p>
                <p className="text-xs text-green-600">+8% vs last week</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost Savings</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCostSavings)}</p>
                <p className="text-xs text-green-600">+15% vs last week</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold">{averageActiveAgents}</p>
                <p className="text-xs text-blue-600">Average this week</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Over Time</CardTitle>
            <CardDescription>Tasks automated and hours saved</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="tasksAutomated" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="hoursSaved" 
                  stackId="2" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Savings Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Savings Trend</CardTitle>
            <CardDescription>Daily cost savings in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line 
                  type="monotone" 
                  dataKey="costSavings" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Tasks automated by agent type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agentPerformanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {agentPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {agentPerformanceData.map((agent, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: agent.color }}
                    />
                    <span>{agent.name}</span>
                  </div>
                  <span className="font-medium">{agent.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Savings Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Time Savings Breakdown</CardTitle>
            <CardDescription>Hours saved by task type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSavingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {timeSavingsData.map((task, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{task.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{task.hours}h</span>
                    <Badge variant="outline" className="text-xs">
                      {task.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">🚀 Performance Boost</h4>
              <p className="text-sm text-green-700">
                Your Customer Support Bot is performing 35% better than average, 
                handling 45+ inquiries daily.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">💰 Cost Efficiency</h4>
              <p className="text-sm text-blue-700">
                You're saving an average of $320 per week, which translates to 
                $16,640 annually.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">⏰ Time Optimization</h4>
              <p className="text-sm text-purple-700">
                Email automation is saving you 8 hours per week, 
                allowing focus on high-value tasks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
