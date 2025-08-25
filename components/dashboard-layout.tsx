'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { AISupportChat } from '@/components/ai-support-chat'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Bot, 
  Settings, 
  Users, 
  Zap, 
  BarChart3, 
  CreditCard, 
  LogOut, 
  ChevronRight,
  Link as LinkIcon,
  Shield,
  Menu,
  X,
  Lightbulb,
  GraduationCap,
  Crown
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Agent Builder', href: '/wizard', icon: Bot },
    { name: 'Idea Development', href: '/idea-development', icon: Lightbulb },
    { name: 'Introduction & Learning', href: '/learning', icon: GraduationCap },
    { name: 'Team Workspace', href: '/team', icon: Users },
    { name: 'Integrations', href: '/integrations', icon: LinkIcon },
    { name: 'Analytics', href: '/dashboard/roi', icon: BarChart3 },
    { name: 'Security', href: '/settings/security', icon: Shield },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Enterprise', href: '/enterprise', icon: Crown },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI Builder</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {profile?.role || 'Free'} Plan
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full mt-3 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 flex-1 min-w-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-4 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">{title || 'Dashboard'}</h1>
                {description && (
                  <p className="text-sm text-gray-600 truncate">{description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6 max-w-full overflow-hidden">
          {children}
        </div>
      </div>
      
      {/* AI Support Chat */}
      <AISupportChat />
    </div>
  )
}
