'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Star, Zap, Shield, Users, Crown } from 'lucide-react'

interface PricingTier {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  limitations: string[]
  recommended?: boolean
  icon: React.ReactNode
  color: string
  popular?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for individuals getting started with AI automation',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: [
      '50 workflow runs per month',
      'Personal assistant agents only',
      'Basic integrations (Gmail, Calendar)',
      'Community support',
      'Standard response time',
      'Basic analytics'
    ],
    limitations: [
      'No team collaboration',
      'No advanced integrations',
      'No priority support',
      'No custom branding'
    ],
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-gray-100 text-gray-800'
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals who want unlimited personal automation',
    price: {
      monthly: 29,
      yearly: 290
    },
    features: [
      'Unlimited workflow runs',
      'All agent types (Personal, Research, Business)',
      'Advanced integrations (Notion, Slack, HubSpot)',
      'Priority email support',
      'Advanced analytics & reporting',
      'Custom prompts library',
      'Export workflows to n8n',
      'API access'
    ],
    limitations: [
      'No team collaboration',
      'No white-label options',
      'No dedicated support'
    ],
    icon: <Star className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-800',
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For teams that need collaboration and advanced features',
    price: {
      monthly: 99,
      yearly: 990
    },
    features: [
      'Everything in Pro',
      'Team workspace & collaboration',
      'Role-based permissions',
      'Shared workflow library',
      'Advanced security (2FA, SSO)',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced reporting & analytics',
      'Team training sessions',
      'SLA guarantee'
    ],
    limitations: [
      'No white-label options',
      'No self-hosting'
    ],
    icon: <Users className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-800',
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom requirements',
    price: {
      monthly: 299,
      yearly: 2990
    },
    features: [
      'Everything in Business',
      'White-label solution',
      'Self-hosting option',
      'Custom AI model training',
      'Dedicated support team',
      'Custom SLA agreements',
      'Advanced security compliance',
      'Custom integrations development',
      'On-site training',
      '24/7 phone support'
    ],
    limitations: [],
    icon: <Crown className="w-6 h-6" />,
    color: 'bg-yellow-100 text-yellow-800'
  }
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getSavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0
    return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose the Perfect Plan for Your Needs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From individual automation to enterprise-scale solutions, 
            we have a plan that fits your requirements and budget.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg border shadow-sm">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <Badge className="absolute -top-2 -right-2 text-xs bg-green-600">
                  Save 17%
                </Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative ${
                tier.recommended 
                  ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                  : 'hover:shadow-lg transition-shadow'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    Recommended
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <div className={`p-3 rounded-full ${tier.color}`}>
                    {tier.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <CardDescription className="text-sm">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {formatPrice(tier.price[billingCycle])}
                  </div>
                  {tier.price[billingCycle] > 0 && (
                    <div className="text-gray-600">
                      per {billingCycle === 'monthly' ? 'month' : 'year'}
                      {billingCycle === 'yearly' && tier.price.monthly > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          Save {getSavings(tier.price.monthly, tier.price.yearly)}%
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">What's included:</h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {tier.limitations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Limitations:</h4>
                    <ul className="space-y-2">
                      {tier.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-4 h-4 text-gray-400 flex-shrink-0">×</div>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <Button 
                  className={`w-full ${
                    tier.recommended 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : tier.id === 'free'
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {tier.id === 'free' ? 'Get Started Free' : 
                   tier.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Feature Comparison</CardTitle>
            <CardDescription className="text-center">
              Compare all features across our pricing tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold">Free</th>
                    <th className="text-center py-3 px-4 font-semibold">Pro</th>
                    <th className="text-center py-3 px-4 font-semibold">Business</th>
                    <th className="text-center py-3 px-4 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Workflow Runs</td>
                    <td className="text-center py-3 px-4">50/month</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Agent Types</td>
                    <td className="text-center py-3 px-4">Personal Only</td>
                    <td className="text-center py-3 px-4">All Types</td>
                    <td className="text-center py-3 px-4">All Types</td>
                    <td className="text-center py-3 px-4">All Types</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Team Collaboration</td>
                    <td className="text-center py-3 px-4">×</td>
                    <td className="text-center py-3 px-4">×</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Advanced Integrations</td>
                    <td className="text-center py-3 px-4">×</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Priority Support</td>
                    <td className="text-center py-3 px-4">×</td>
                    <td className="text-center py-3 px-4">Email</td>
                    <td className="text-center py-3 px-4">Dedicated</td>
                    <td className="text-center py-3 px-4">24/7 Phone</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">White-label</td>
                    <td className="text-center py-3 px-4">×</td>
                    <td className="text-center py-3 px-4">×</td>
                    <td className="text-center py-3 px-4">×</td>
                    <td className="text-center py-3 px-4">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. 
                  Changes take effect immediately.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Is there a free trial?</h4>
                <p className="text-gray-600 text-sm">
                  Pro and Business plans come with a 14-day free trial. 
                  No credit card required to start.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards, PayPal, and bank transfers 
                  for Enterprise plans.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, you can cancel your subscription at any time. 
                  No long-term contracts or cancellation fees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of users who are already automating their workflows
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
