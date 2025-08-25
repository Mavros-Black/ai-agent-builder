import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPaystackServiceInstance } from '@/lib/paystack'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not configured')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    // Verify webhook signature
    const paystackService = getPaystackServiceInstance()
    if (!paystackService.verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    console.log('Paystack webhook event:', event.event, event.data)

    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data)
        break
      
      case 'subscription.create':
        await handleSubscriptionCreate(event.data)
        break
      
      case 'subscription.disable':
        await handleSubscriptionDisable(event.data)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data)
        break
      
      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleChargeSuccess(data: any) {
  try {
    const { user_id, plan_id, plan_name, max_usage } = data.metadata
    const supabase = getSupabaseClient()
    
    // Update user subscription
    const { error } = await supabase
      .from('profiles')
      .update({
        role: plan_id,
        max_usage: max_usage || 1000,
        subscription_id: data.id,
        subscription_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user_id)

    if (error) {
      console.error('Error updating user subscription:', error)
      return
    }

    // Log successful payment
    await supabase
      .from('usage_logs')
      .insert({
        user_id,
        action: 'subscription_payment_success',
        metadata: {
          transaction_id: data.id,
          reference: data.reference,
          amount: data.amount,
          plan_name,
        },
        created_at: new Date().toISOString(),
      })

    console.log(`Subscription updated for user ${user_id} to plan ${plan_name}`)

  } catch (error) {
    console.error('Error handling charge success:', error)
  }
}

async function handleSubscriptionCreate(data: any) {
  try {
    const { user_id, plan_id, plan_name, max_usage } = data.metadata
    const supabase = getSupabaseClient()
    
    // Update user subscription
    const { error } = await supabase
      .from('profiles')
      .update({
        role: plan_id,
        max_usage: max_usage || 1000,
        subscription_id: data.subscription_code,
        subscription_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user_id)

    if (error) {
      console.error('Error updating user subscription:', error)
      return
    }

    console.log(`Subscription created for user ${user_id} to plan ${plan_name}`)

  } catch (error) {
    console.error('Error handling subscription create:', error)
  }
}

async function handleSubscriptionDisable(data: any) {
  try {
    const { user_id } = data.metadata
    const supabase = getSupabaseClient()
    
    // Update user subscription status
    const { error } = await supabase
      .from('profiles')
      .update({
        role: 'free',
        max_usage: 50,
        subscription_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user_id)

    if (error) {
      console.error('Error updating user subscription:', error)
      return
    }

    // Log subscription cancellation
    await supabase
      .from('usage_logs')
      .insert({
        user_id,
        action: 'subscription_cancelled',
        metadata: {
          subscription_id: data.subscription_code,
          reason: 'user_cancelled',
        },
        created_at: new Date().toISOString(),
      })

    console.log(`Subscription cancelled for user ${user_id}`)

  } catch (error) {
    console.error('Error handling subscription disable:', error)
  }
}

async function handlePaymentFailed(data: any) {
  try {
    const { user_id } = data.metadata
    const supabase = getSupabaseClient()
    
    // Update user subscription status
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'payment_failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user_id)

    if (error) {
      console.error('Error updating user subscription:', error)
      return
    }

    // Log payment failure
    await supabase
      .from('usage_logs')
      .insert({
        user_id,
        action: 'subscription_payment_failed',
        metadata: {
          invoice_id: data.id,
          amount: data.amount,
          reason: 'payment_failed',
        },
        created_at: new Date().toISOString(),
      })

    console.log(`Payment failed for user ${user_id}`)

  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}
