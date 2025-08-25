'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowRight,
  Shield,
  Zap,
  Crown,
  Building
} from 'lucide-react'
import { PAYSTACK_PLANS, parseAmount } from '@/lib/paystack'
import { supabase } from '@/lib/supabase'

interface PaystackPaymentProps {
  selectedPlan: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaystackPayment({ selectedPlan, onSuccess, onError }: PaystackPaymentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const plan = PAYSTACK_PLANS[selectedPlan as keyof typeof PAYSTACK_PLANS]
  const reference = searchParams.get('reference')

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'pro':
        return <Zap className="w-5 h-5" />
      case 'business':
        return <Building className="w-5 h-5" />
      case 'enterprise':
        return <Crown className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'pro':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'business':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'enterprise':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const initializePayment = async () => {
    setIsLoading(true)
    setErrorMessage('')
    setPaymentStatus('processing')

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No active session found')
      }

      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planId: selectedPlan }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment')
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url

    } catch (error) {
      console.error('Payment initialization error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Payment initialization failed')
      setPaymentStatus('failed')
      onError?.(error instanceof Error ? error.message : 'Payment initialization failed')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyPayment = async () => {
    if (!reference) return

    setIsLoading(true)
    setErrorMessage('')
    setPaymentStatus('processing')

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No active session found')
      }

      const response = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ reference }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed')
      }

      setPaymentStatus('success')
      onSuccess?.()

      // Redirect to dashboard after successful payment
      setTimeout(() => {
        router.push('/dashboard?payment=success')
      }, 2000)

    } catch (error) {
      console.error('Payment verification error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Payment verification failed')
      setPaymentStatus('failed')
      onError?.(error instanceof Error ? error.message : 'Payment verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-verify payment if reference is present
  useEffect(() => {
    if (reference && paymentStatus === 'idle') {
      verifyPayment()
    }
  }, [reference])

  if (paymentStatus === 'success') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Payment Successful!
          </h3>
          <p className="text-green-700 mb-4">
            Your subscription to {plan.name} has been activated successfully.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-green-600">Redirecting to dashboard...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-900 mb-2">
            Payment Failed
          </h3>
          <p className="text-red-700 mb-4">
            {errorMessage || 'There was an issue processing your payment. Please try again.'}
          </p>
          <Button onClick={() => {
            setPaymentStatus('idle')
            setErrorMessage('')
          }}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getPlanIcon(selectedPlan)}
          Upgrade to {plan.name}
        </CardTitle>
        <CardDescription>
          Complete your payment to unlock premium features and increase your usage limits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Plan Summary</h4>
            <Badge className={getPlanColor(selectedPlan)}>
              {plan.name}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Monthly Price:</span>
              <span className="font-semibold">
                ${parseAmount(plan.amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Usage Limit:</span>
              <span className="font-semibold">
                {plan.max_usage === -1 ? 'Unlimited' : `${plan.max_usage.toLocaleString()} executions`}
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-semibold mb-3">Included Features:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your payment is secured by Paystack. We use industry-standard encryption to protect your data.
          </AlertDescription>
        </Alert>

        {/* Payment Button */}
        <Button 
          onClick={initializePayment}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${parseAmount(plan.amount).toFixed(2)} / Month
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By proceeding, you agree to our Terms of Service and Privacy Policy. 
          You can cancel your subscription at any time.
        </p>
      </CardContent>
    </Card>
  )
}
