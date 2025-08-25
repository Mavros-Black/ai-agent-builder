import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPaystackServiceInstance, PAYSTACK_PLANS, generateReference } from '@/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with service role key for API routes
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await request.json()
    
    if (!planId || !PAYSTACK_PLANS[planId as keyof typeof PAYSTACK_PLANS]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    const plan = PAYSTACK_PLANS[planId as keyof typeof PAYSTACK_PLANS]
    
    // Generate unique reference
    const reference = generateReference()
    
    // Initialize Paystack transaction
    const paystackService = getPaystackServiceInstance()
    const transactionData = await paystackService.initializeTransaction({
      email: user.email!,
      amount: plan.amount,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?reference=${reference}`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        plan_name: plan.name,
        max_usage: plan.max_usage,
      },
    })

    // Store transaction reference in database for verification (optional)
    try {
      const { error: dbError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          reference,
          plan_id: planId,
          amount: plan.amount,
          status: 'pending',
          metadata: {
            authorization_url: transactionData.authorization_url,
            access_code: transactionData.access_code,
          },
          created_at: new Date().toISOString(),
        })

      if (dbError) {
        console.warn('Warning: Could not store transaction in database:', dbError)
        // Continue anyway - the transaction will still work
      }
    } catch (error) {
      console.warn('Warning: Database error storing transaction:', error)
      // Continue anyway - the transaction will still work
    }

    return NextResponse.json({
      success: true,
      authorization_url: transactionData.authorization_url,
      reference: transactionData.reference,
      access_code: transactionData.access_code,
    })

  } catch (error) {
    console.error('Paystack initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
