'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  Lock, 
  Users, 
  BarChart3, 
  Zap, 
  Globe,
  CheckCircle,
  AlertTriangle,
  Building,
  Crown,
  Scale,
  Database
} from 'lucide-react'

interface EnterpriseFeature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: 'security' | 'compliance' | 'scalability' | 'analytics' | 'integration'
  priority: 'high' | 'medium' | 'low'
  implementation: 'ready' | 'planned' | 'future'
  businessValue: string
}

const enterpriseFeatures: EnterpriseFeature[] = [
  // Security Features
  {
    id: 'sso',
    title: 'Single Sign-On (SSO)',
    description: 'Enterprise-grade authentication with SAML, OAuth, and LDAP integration',
    icon: <Lock className="w-5 h-5" />,
    category: 'security',
    priority: 'high',
    implementation: 'planned',
    businessValue: 'Centralized user management, reduced security risks, seamless employee onboarding'
  },
  {
    id: 'audit-logs',
    title: 'Comprehensive Audit Logs',
    description: 'Detailed activity tracking with immutable logs for compliance',
    icon: <Database className="w-5 h-5" />,
    category: 'security',
    priority: 'high',
    implementation: 'planned',
    businessValue: 'Regulatory compliance, security monitoring, accountability tracking'
  },
  {
    id: 'data-encryption',
    title: 'End-to-End Encryption',
    description: 'Data encrypted at rest and in transit with customer-managed keys',
    icon: <Shield className="w-5 h-5" />,
    category: 'security',
    priority: 'high',
    implementation: 'planned',
    businessValue: 'Data protection, regulatory compliance, customer trust'
  },
  
  // Compliance Features
  {
    id: 'gdpr',
    title: 'GDPR Compliance',
    description: 'Full GDPR compliance with data portability and deletion rights',
    icon: <Scale className="w-5 h-5" />,
    category: 'compliance',
    priority: 'high',
    implementation: 'planned',
    businessValue: 'Legal compliance, international business expansion, customer trust'
  },
  {
    id: 'soc2',
    title: 'SOC 2 Type II Certification',
    description: 'Third-party security audit certification for enterprise customers',
    icon: <CheckCircle className="w-5 h-5" />,
    category: 'compliance',
    priority: 'medium',
    implementation: 'future',
    businessValue: 'Enterprise sales enablement, security validation, competitive advantage'
  },
  {
    id: 'hipaa',
    title: 'HIPAA Compliance',
    description: 'Healthcare data protection standards for medical organizations',
    icon: <Building className="w-5 h-5" />,
    category: 'compliance',
    priority: 'medium',
    implementation: 'future',
    businessValue: 'Healthcare market access, regulatory compliance, specialized industry support'
  },

  // Scalability Features
  {
    id: 'multi-tenant',
    title: 'Multi-Tenant Architecture',
    description: 'Isolated tenant environments with resource allocation controls',
    icon: <Users className="w-5 h-5" />,
    category: 'scalability',
    priority: 'high',
    implementation: 'planned',
    businessValue: 'Enterprise customer isolation, resource optimization, security separation'
  },
  {
    id: 'auto-scaling',
    title: 'Auto-Scaling Infrastructure',
    description: 'Automatic resource scaling based on usage patterns',
    icon: <Zap className="w-5 h-5" />,
    category: 'scalability',
    priority: 'medium',
    implementation: 'planned',
    businessValue: 'Cost optimization, performance guarantees, operational efficiency'
  },
  {
    id: 'global-cdn',
    title: 'Global CDN',
    description: 'Worldwide content delivery for low-latency access',
    icon: <Globe className="w-5 h-5" />,
    category: 'scalability',
    priority: 'medium',
    implementation: 'future',
    businessValue: 'Global performance, international expansion, user experience'
  },

  // Analytics Features
  {
    id: 'advanced-analytics',
    title: 'Advanced Business Analytics',
    description: 'Executive dashboards with ROI tracking and predictive insights',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'analytics',
    priority: 'high',
    implementation: 'ready',
    businessValue: 'Data-driven decisions, ROI justification, strategic planning'
  },
  {
    id: 'custom-reporting',
    title: 'Custom Reporting Engine',
    description: 'White-label reports with custom branding and scheduling',
    icon: <Crown className="w-5 h-5" />,
    category: 'analytics',
    priority: 'medium',
    implementation: 'planned',
    businessValue: 'Brand consistency, automated reporting, client deliverables'
  },

  // Integration Features
  {
    id: 'api-gateway',
    title: 'Enterprise API Gateway',
    description: 'RESTful APIs with rate limiting and authentication',
    icon: <Zap className="w-5 h-5" />,
    category: 'integration',
    priority: 'high',
    implementation: 'planned',
    businessValue: 'System integration, custom workflows, developer ecosystem'
  },
  {
    id: 'webhook-management',
    title: 'Advanced Webhook Management',
    description: 'Reliable webhook delivery with retry logic and monitoring',
    icon: <Globe className="w-5 h-5" />,
    category: 'integration',
    priority: 'medium',
    implementation: 'planned',
    businessValue: 'Reliable integrations, system reliability, operational efficiency'
  }
]

export function EnterpriseFeatures() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')

  const categories = ['all', 'security', 'compliance', 'scalability', 'analytics', 'integration']
  const priorities = ['all', 'high', 'medium', 'low']

  const filteredFeatures = enterpriseFeatures.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory
    const matchesPriority = selectedPriority === 'all' || feature.priority === selectedPriority
    return matchesCategory && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImplementationColor = (implementation: string) => {
    switch (implementation) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200'
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'future': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Enterprise-Grade Features
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Built for businesses that demand security, compliance, and scalability. 
          Transform your operations with enterprise-ready AI automation.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700 self-center">Category:</span>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700 self-center">Priority:</span>
          {priorities.map(priority => (
            <Button
              key={priority}
              variant={selectedPriority === priority ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPriority(priority)}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getPriorityColor(feature.priority)}>
                    {feature.priority}
                  </Badge>
                  <Badge className={getImplementationColor(feature.implementation)}>
                    {feature.implementation}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900">Business Value:</h4>
                <p className="text-sm text-gray-600">
                  {feature.businessValue}
                </p>
              </div>

              <div className="flex gap-2">
                {feature.implementation === 'ready' && (
                  <Button size="sm" className="w-full">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Available Now
                  </Button>
                )}
                {feature.implementation === 'planned' && (
                  <Button size="sm" variant="outline" className="w-full">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                )}
                {feature.implementation === 'future' && (
                  <Button size="sm" variant="outline" className="w-full" disabled>
                    <Crown className="w-4 h-4 mr-2" />
                    Roadmap
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enterprise CTA */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              Ready for Enterprise?
            </h3>
            <p className="text-purple-700 mb-6">
              Get dedicated support, custom integrations, and enterprise-grade security. 
              Our team will help you scale AI automation across your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Building className="w-5 h-5 mr-2" />
                Contact Sales
              </Button>
              <Button size="lg" variant="outline">
                <Globe className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
