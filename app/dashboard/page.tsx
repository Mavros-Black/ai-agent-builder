'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import DashboardLayout from '@/components/dashboard-layout'
import { AIInsights } from '@/components/ai-insights'
import { EnterpriseFeatures } from '@/components/enterprise-features'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Bot, 
  Zap, 
  BarChart3, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  Link,
  Users,
  Building,
  Crown,
  Shield
} from 'lucide-react'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const router = useRouter()

  if (!user) {
    return null
  }

  const stats = [
    {
      name: 'Active Agents',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Bot,
      color: 'bg-blue-500'
    },
    {
      name: 'Tasks Automated',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      name: 'Hours Saved',
      value: '89',
      change: '+8',
      changeType: 'positive',
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      name: 'Cost Savings',
      value: '$2,450',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ]

  const recentActivity = [
    { id: 1, type: 'agent_created', title: 'Customer Support Bot created', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'workflow_run', title: 'Sales Outreach workflow completed', time: '4 hours ago', status: 'success' },
    { id: 3, type: 'integration', title: 'Slack integration connected', time: '1 day ago', status: 'success' },
    { id: 4, type: 'upgrade', title: 'Upgraded to Business Plan', time: '2 days ago', status: 'success' },
  ]

  const quickActions = [
    {
      title: 'Create New Agent',
      description: 'Build a custom AI agent',
      icon: Plus,
      href: '/wizard',
      color: 'bg-gradient-to-r from-blue-500 to-purple-600'
    },
    {
      title: 'View Analytics',
      description: 'Check your ROI and performance',
      icon: BarChart3,
      href: '/dashboard/roi',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600'
    },
    {
      title: 'Manage Team',
      description: 'Invite and manage team members',
      icon: Users,
      href: '/team',
      color: 'bg-gradient-to-r from-purple-500 to-pink-600'
    },
    {
      title: 'Connect Integrations',
      description: 'Add new tools and services',
      icon: Link,
      href: '/integrations',
      color: 'bg-gradient-to-r from-orange-500 to-red-600'
    }
  ]

  return (
    <DashboardLayout 
      title="Dashboard"
      description="Manage your AI agents and track performance"
    >
      <div className="max-w-full space-y-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user.email?.split('@')[0]}! 👋
                </h2>
                <p className="text-blue-100 mb-4">
                  Your AI agents have been working hard. Here's what's happening today.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 w-fit">
                    {profile?.role || 'Free'} Plan
                  </Badge>
                  <span className="text-blue-100 text-sm">
                    {profile?.usage_count || 0} / {profile?.max_usage || 50} workflows used
                  </span>
                </div>
              </div>
              <div className="hidden lg:block flex-shrink-0">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                  <Bot className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0 ml-3`}>
                  <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3 lg:mt-4">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-xs lg:text-sm text-gray-500 ml-1 truncate">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Progress */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>Monthly Usage</span>
              <Badge variant="outline" className="w-fit">
                {Math.round(((profile?.usage_count || 0) / (profile?.max_usage || 50)) * 100)}% Used
              </Badge>
            </CardTitle>
            <CardDescription>
              Track your workflow usage and plan limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Workflow Executions</span>
                <span className="font-medium">
                  {profile?.usage_count || 0} / {profile?.max_usage || 50}
                </span>
              </div>
              <Progress 
                value={((profile?.usage_count || 0) / (profile?.max_usage || 50)) * 100} 
                className="h-3"
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm text-gray-600">
                  Resets on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
                {(profile?.role === 'free' && (profile?.usage_count || 0) >= (profile?.max_usage || 50)) && (
                  <Button size="sm" onClick={() => router.push('/pricing')} className="w-full sm:w-auto">
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {quickActions.map((action) => (
                <a
                  key={action.title}
                  href={action.href}
                  className="group block"
                >
                  <div className={`${action.color} rounded-xl p-3 lg:p-4 text-white hover:shadow-lg transition-all duration-200 group-hover:scale-105`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{action.title}</h3>
                        <p className="text-white/80 text-xs mt-1 line-clamp-2">{action.description}</p>
                      </div>
                      <action.icon className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 ml-2" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Plan Upgrade CTA */}
      {profile?.role === 'free' && (
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    🚀 Ready to scale up?
                  </h3>
                  <p className="text-purple-700 mb-4">
                    Upgrade to Pro or Business to unlock unlimited workflows, team collaboration, and advanced features.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button onClick={() => router.push('/pricing')} className="w-full sm:w-auto">
                      View Plans
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/team')} className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Insights */}
      <div className="mt-8">
        <AIInsights userProfile={profile} />
      </div>

      {/* Enterprise Features Showcase */}
      {profile?.role === 'free' && (
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Crown className="w-5 h-5" />
                    Unlock Enterprise Features
                  </CardTitle>
                  <CardDescription className="text-purple-700">
                    Scale your AI automation with enterprise-grade security, compliance, and collaboration tools
                  </CardDescription>
                </div>
                <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                  <Building className="w-3 h-3 mr-1" />
                  Enterprise Ready
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900">Enterprise Security</h4>
                  <p className="text-sm text-purple-700">SSO, audit logs, encryption</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900">Team Collaboration</h4>
                  <p className="text-sm text-purple-700">RBAC, governance, workflows</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900">Advanced Analytics</h4>
                  <p className="text-sm text-purple-700">ROI tracking, insights</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Enterprise
                </Button>
                <Button variant="outline" onClick={() => router.push('/learning')}>
                  <Building className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Enterprise Features for Business/Enterprise Users */}
      {(profile?.role === 'business' || profile?.role === 'enterprise') && (
        <div className="mt-8">
          <EnterpriseFeatures />
        </div>
      )}
    </div>
    </DashboardLayout>
  )
}
