'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Crown, 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Phone, 
  Mail, 
  MessageSquare,
  CheckCircle,
  Star,
  Building,
  Lock,
  BarChart3,
  Settings,
  Cloud,
  Database,
  Code,
  Bot,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

export default function EnterprisePage() {
  const { profile } = useAuth()
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const isEnterpriseUser = profile?.role === 'enterprise'
  const isBusinessUser = profile?.role === 'business'

  const enterpriseFeatures = [
    {
      icon: Users,
      title: 'Unlimited Team Members',
      description: 'Add unlimited team members with role-based access control'
    },
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'SSO, 2FA, audit logs, and enterprise-grade security compliance'
    },
    {
      icon: Globe,
      title: 'Global Deployment',
      description: 'Deploy across multiple regions with automatic failover'
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: '24/7 dedicated support with SLA guarantees'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Custom dashboards, reporting, and business intelligence'
    },
    {
      icon: Settings,
      title: 'Custom Integrations',
      description: 'White-label solutions and custom API integrations'
    },
    {
      icon: Cloud,
      title: 'Cloud & On-Premise',
      description: 'Flexible deployment options for your infrastructure'
    },
    {
      icon: Database,
      title: 'Data Sovereignty',
      description: 'Keep your data in your preferred region or on-premise'
    }
  ]

  const enterpriseBenefits = [
    'Unlimited AI agents and workflow runs',
    'Custom model training and fine-tuning',
    'Advanced workflow orchestration',
    'Multi-tenant architecture support',
    'Custom branding and white-labeling',
    'Dedicated account manager',
    'Custom training and onboarding',
    'API rate limits and quotas',
    'Advanced monitoring and alerting',
    'Compliance certifications (SOC 2, GDPR, HIPAA)',
    'Custom SLA agreements',
    'Integration with enterprise systems'
  ]

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm)
    // You can integrate with your CRM or email service here
  }

  return (
    <DashboardLayout 
      title="Enterprise" 
      description="Enterprise-grade AI agent solutions for large organizations"
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
          <div className="flex items-center mb-4">
            <Crown className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">Enterprise Solutions</h1>
          </div>
          <p className="text-xl text-purple-100 mb-6 max-w-3xl">
            Scale your AI automation with enterprise-grade features, security, and support. 
            Built for large organizations that need reliability, compliance, and customization.
          </p>
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Shield className="w-4 h-4 mr-1" />
              Enterprise Security
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="w-4 h-4 mr-1" />
              Unlimited Teams
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Zap className="w-4 h-4 mr-1" />
              24/7 Support
            </Badge>
          </div>
        </div>

        {/* Current Plan Status */}
        {!isEnterpriseUser && (
          <Alert>
            <Crown className="h-4 w-4" />
            <AlertDescription>
              {isBusinessUser 
                ? "You're on the Business plan. Upgrade to Enterprise for advanced features and unlimited scalability."
                : "Upgrade to Enterprise for unlimited AI agents, advanced security, and dedicated support."
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Features Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterpriseFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits List */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Enterprise Benefits
              </CardTitle>
              <CardDescription>
                Everything you need to scale AI automation across your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {enterpriseBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Enterprise Pricing
              </CardTitle>
              <CardDescription>
                Custom pricing based on your organization's needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">Custom</div>
                <p className="text-gray-600 mb-4">Tailored to your requirements</p>
                <Button className="w-full" size="lg">
                  Contact Sales
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Unlimited Agents</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Unlimited Workflows</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dedicated Support</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Custom SLA</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              Get in Touch
            </CardTitle>
            <CardDescription>
              Ready to scale your AI automation? Our enterprise team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your AI automation needs..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                  <Mail className="w-4 h-4 ml-2" />
                </Button>
              </form>

              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium">Sales Team</div>
                        <div className="text-gray-600">+1 (555) 123-4567</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-gray-600">enterprise@aibuilder.com</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium">Live Chat</div>
                        <div className="text-gray-600">Available 24/7</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Response Time</h4>
                  <p className="text-sm text-gray-600">
                    We typically respond to enterprise inquiries within 2 hours during business hours.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Schedule a consultation call</li>
                    <li>• Review your requirements</li>
                    <li>• Provide custom proposal</li>
                    <li>• Begin implementation</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Lock className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold">Security Whitepaper</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Learn about our enterprise-grade security measures and compliance certifications.
                </p>
                <Button variant="outline" size="sm">
                  Download PDF
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Code className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold">API Documentation</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Comprehensive API documentation for enterprise integrations and custom development.
                </p>
                <Button variant="outline" size="sm">
                  View Docs
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Bot className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold">Case Studies</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  See how other enterprises are using AI agents to transform their operations.
                </p>
                <Button variant="outline" size="sm">
                  Read Stories
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
