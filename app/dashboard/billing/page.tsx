'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import { PaystackPayment } from '@/components/paystack-payment'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  Receipt, 
  Download, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Zap,
  Users,
  Shield,
  BarChart3,
  ArrowUpRight,
  Crown,
  Star,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { PAYSTACK_PLANS, parseAmount } from '@/lib/paystack'

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  description: string
  invoiceNumber: string
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    date: '2024-01-15',
    amount: 29.99,
    status: 'paid',
    description: 'Pro Plan - January 2024',
    invoiceNumber: 'INV-2024-001'
  },
  {
    id: '2',
    date: '2023-12-15',
    amount: 29.99,
    status: 'paid',
    description: 'Pro Plan - December 2023',
    invoiceNumber: 'INV-2023-012'
  },
  {
    id: '3',
    date: '2023-11-15',
    amount: 29.99,
    status: 'paid',
    description: 'Pro Plan - November 2023',
    invoiceNumber: 'INV-2023-011'
  }
]

export default function DashboardBillingPage() {
  const { user, profile } = useAuth()
  const searchParams = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const paymentStatus = searchParams.get('payment')

  useEffect(() => {
    if (paymentStatus === 'success') {
      setPaymentSuccess(true)
      setShowPayment(false)
    }
  }, [paymentStatus])

  if (!user) {
    return null
  }

  const currentPlan = PAYSTACK_PLANS[profile?.role as keyof typeof PAYSTACK_PLANS] || PAYSTACK_PLANS.free
  const usagePercentage = ((profile?.usage_count || 0) / (profile?.max_usage || 50)) * 100

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    setShowPayment(false)
    // Refresh the page to update user data
    window.location.reload()
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    // Handle payment error (show toast, etc.)
  }

  if (showPayment) {
    return (
      <DashboardLayout 
        title="Complete Payment"
        description="Upgrade your subscription with secure payment"
      >
        <div className="max-w-2xl mx-auto">
          <PaystackPayment
            selectedPlan={selectedPlan}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title="Billing & Subscription"
      description="Manage your subscription, view invoices, and upgrade your plan"
    >
      {/* Payment Success Alert */}
      {paymentSuccess && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Payment successful! Your subscription has been upgraded. Welcome to your new plan!
          </AlertDescription>
        </Alert>
      )}

      {/* Current Plan Overview */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-blue-600" />
                  Current Plan: {currentPlan.name}
                </CardTitle>
                <CardDescription>
                  {currentPlan.amount === 0 ? 'Free plan' : `$${parseAmount(currentPlan.amount).toFixed(2)}/month`}
                </CardDescription>
              </div>
              <Badge className={`text-sm ${
                profile?.role === 'free' ? 'bg-gray-100 text-gray-800' :
                profile?.role === 'pro' ? 'bg-blue-100 text-blue-800' :
                profile?.role === 'business' ? 'bg-purple-100 text-purple-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {profile?.role === 'free' ? 'Free Plan' : 
                 profile?.role === 'pro' ? 'Pro Plan' : 
                 profile?.role === 'business' ? 'Business Plan' : 'Enterprise Plan'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Usage This Month</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Workflow Executions</span>
                    <span className="font-medium">
                      {profile?.usage_count || 0} / {profile?.max_usage || 50}
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {profile?.role === 'free' ? 'Resets monthly' : 'Unlimited usage'}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Next Billing</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    {currentPlan.amount === 0 ? 'No billing' : `$${parseAmount(currentPlan.amount).toFixed(2)}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentPlan.amount === 0 ? 'Free forever' : 'February 15, 2024'}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Plan Status</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {currentPlan.amount === 0 ? 'No payment required' : 'Auto-renewal enabled'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Plan Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="upgrade">Upgrade Plan</TabsTrigger>
        </TabsList>

        {/* Plan Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Plan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  Your Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">{currentPlan.name}</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    {currentPlan.amount === 0 ? 'Free' : `$${parseAmount(currentPlan.amount).toFixed(2)}/month`}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900 text-sm">Included Features:</h4>
                    <ul className="space-y-1">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-blue-700">
                          <CheckCircle className="w-3 h-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Usage Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {profile?.usage_count || 0}
                    </div>
                    <div className="text-sm text-green-700">Executions</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(usagePercentage)}%
                    </div>
                    <div className="text-sm text-blue-700">Used</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Monthly Limit</span>
                    <span className="font-medium">
                      {profile?.role === 'free' ? '50' : 'Unlimited'}
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                </div>

                {profile?.role === 'free' && usagePercentage > 80 && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-800">
                        You're approaching your monthly limit. Consider upgrading to Pro for unlimited usage.
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.description}</p>
                        <p className="text-sm text-gray-600">
                          {invoice.invoiceNumber} • {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">${invoice.amount}</p>
                        <Badge className={`text-xs ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upgrade Plan Tab */}
        <TabsContent value="upgrade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Upgrade Your Plan
              </CardTitle>
              <CardDescription>
                Choose the perfect plan for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(PAYSTACK_PLANS).map(([planId, plan]) => (
                  <Card 
                    key={planId}
                    className={`cursor-pointer transition-all ${
                      profile?.role === planId
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => {
                      if (profile?.role !== planId) {
                        setSelectedPlan(planId)
                        setShowPayment(true)
                      }
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {profile?.role === planId && (
                          <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                        )}
                      </div>
                      <div className="text-3xl font-bold">
                        {plan.amount === 0 ? 'Free' : `$${parseAmount(plan.amount).toFixed(2)}`}
                        {plan.amount > 0 && <span className="text-sm font-normal text-gray-600">/month</span>}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Features:</h4>
                          <ul className="space-y-1">
                            {plan.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                            {plan.features.length > 3 && (
                              <li className="text-xs text-gray-500">
                                +{plan.features.length - 3} more features
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        {profile?.role === planId ? (
                          <Button disabled className="w-full">
                            Current Plan
                          </Button>
                        ) : (
                          <Button className="w-full">
                            {plan.amount === 0 ? 'Downgrade' : 'Upgrade'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
