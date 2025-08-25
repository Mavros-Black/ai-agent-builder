import { getSupabase } from './supabase'

const supabase = getSupabase()

export interface PaystackConfig {
  secretKey: string
  publicKey: string
  webhookSecret: string
}

export interface PaystackCustomer {
  id: string
  email: string
  customer_code: string
  first_name?: string
  last_name?: string
  phone?: string
  metadata?: any
}

export interface PaystackTransaction {
  id: string
  reference: string
  amount: number
  currency: string
  status: 'success' | 'failed' | 'abandoned' | 'pending'
  customer: PaystackCustomer
  metadata?: any
  created_at: string
  paid_at?: string
}

export interface PaystackSubscription {
  id: string
  customer: string
  plan: string
  status: 'active' | 'cancelled' | 'expired'
  start: string
  end?: string
  next_payment_date?: string
}

export interface PaystackPlan {
  id: string
  name: string
  amount: number
  currency: string
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly'
  description?: string
}

export class PaystackService {
  private config: PaystackConfig
  private baseUrl = 'https://api.paystack.co'

  constructor(config: PaystackConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.secretKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Paystack API Error: ${error.message || response.statusText}`)
    }

    return response.json()
  }

  // Customer Management
  async createCustomer(email: string, metadata?: any): Promise<PaystackCustomer> {
    const response = await this.makeRequest('/customer', {
      method: 'POST',
      body: JSON.stringify({
        email,
        metadata,
      }),
    })
    return response.data
  }

  async getCustomer(customerId: string): Promise<PaystackCustomer> {
    const response = await this.makeRequest(`/customer/${customerId}`)
    return response.data
  }

  async updateCustomer(customerId: string, data: any): Promise<PaystackCustomer> {
    const response = await this.makeRequest(`/customer/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.data
  }

  // Transaction Management
  async initializeTransaction(data: {
    email: string
    amount: number
    reference: string
    callback_url?: string
    metadata?: any
  }): Promise<{ authorization_url: string; reference: string; access_code: string }> {
    const response = await this.makeRequest('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async verifyTransaction(reference: string): Promise<PaystackTransaction> {
    const response = await this.makeRequest(`/transaction/verify/${reference}`)
    return response.data
  }

  async getTransaction(transactionId: string): Promise<PaystackTransaction> {
    const response = await this.makeRequest(`/transaction/${transactionId}`)
    return response.data
  }

  // Plan Management
  async createPlan(data: {
    name: string
    amount: number
    currency: string
    interval: string
    description?: string
  }): Promise<PaystackPlan> {
    const response = await this.makeRequest('/plan', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async getPlans(): Promise<PaystackPlan[]> {
    const response = await this.makeRequest('/plan')
    return response.data
  }

  // Subscription Management
  async createSubscription(data: {
    customer: string
    plan: string
    start_date?: string
  }): Promise<PaystackSubscription> {
    const response = await this.makeRequest('/subscription', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async getSubscription(subscriptionId: string): Promise<PaystackSubscription> {
    const response = await this.makeRequest(`/subscription/${subscriptionId}`)
    return response.data
  }

  async disableSubscription(subscriptionId: string): Promise<PaystackSubscription> {
    const response = await this.makeRequest(`/subscription/disable`, {
      method: 'POST',
      body: JSON.stringify({
        code: subscriptionId,
        token: 'disable_token', // You'll need to get this from the subscription
      }),
    })
    return response.data
  }

  // Webhook Verification
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto')
    const hash = crypto
      .createHmac('sha512', this.config.webhookSecret)
      .update(payload)
      .digest('hex')
    
    return hash === signature
  }

  // Database Integration
  async updateUserSubscription(userId: string, subscriptionData: any) {
    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        role: subscriptionData.plan_name.toLowerCase(),
        max_usage: subscriptionData.max_usage || 1000,
        subscription_id: subscriptionData.subscription_id,
        subscription_status: subscriptionData.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user subscription:', error)
      throw error
    }
  }

  async logPayment(userId: string, transactionData: any) {
    const { error } = await (supabase as any)
      .from('usage_logs')
      .insert({
        user_id: userId,
        action: 'subscription_payment',
        metadata: {
          transaction_id: transactionData.id,
          reference: transactionData.reference,
          amount: transactionData.amount,
          currency: transactionData.currency,
          status: transactionData.status,
        },
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error logging payment:', error)
      throw error
    }
  }
}

// Initialize Paystack service (lazy initialization)
let paystackServiceInstance: PaystackService | null = null

export function getPaystackService(): PaystackService {
  if (!paystackServiceInstance) {
    paystackServiceInstance = new PaystackService({
      secretKey: process.env.PAYSTACK_SECRET_KEY || '',
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || '',
    })
  }
  return paystackServiceInstance
}

// Export a function to get the service instead of the instance
export function getPaystackServiceInstance(): PaystackService {
  return getPaystackService()
}

// Plan configurations
export const PAYSTACK_PLANS = {
  free: {
    name: 'Free Plan',
    amount: 0,
    max_usage: 50,
    features: ['Basic AI agents', 'Email support', 'Community forum access'],
  },
  pro: {
    name: 'Pro Plan',
    amount: 2999, // $29.99 in kobo (smallest currency unit)
    max_usage: 1000,
    features: ['Unlimited workflow executions', 'Advanced AI agents', 'Priority support', 'All integrations'],
  },
  business: {
    name: 'Business Plan',
    amount: 9999, // $99.99 in kobo
    max_usage: 10000,
    features: ['Team collaboration', 'Advanced analytics', 'Dedicated support', 'Custom branding'],
  },
  enterprise: {
    name: 'Enterprise Plan',
    amount: 29999, // $299.99 in kobo
    max_usage: -1, // Unlimited
    features: ['Unlimited team members', 'Custom integrations', 'Dedicated account manager', 'SLA guarantees'],
  },
}

// Helper functions
export function formatAmount(amount: number): number {
  // Convert dollars to kobo (smallest currency unit)
  return Math.round(amount * 100)
}

export function parseAmount(amount: number): number {
  // Convert kobo to dollars
  return amount / 100
}

export function generateReference(): string {
  return `REF_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}
