import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPaystackServiceInstance } from '@/lib/paystack'

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

    const { reference } = await request.json()
    
    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
    }

    // Verify transaction with Paystack
    const paystackService = getPaystackServiceInstance()
    const transaction = await paystackService.verifyTransaction(reference)
    
    if (transaction.status !== 'success') {
      return NextResponse.json({ 
        error: 'Payment failed',
        status: transaction.status 
      }, { status: 400 })
    }

    // Get transaction from database (optional)
    let dbTransaction = null
    try {
      const { data, error: dbError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('reference', reference)
        .eq('user_id', user.id)
        .single()

      if (!dbError && data) {
        dbTransaction = data
        
        // Update transaction status
        await supabase
          .from('payment_transactions')
          .update({
            status: 'completed',
            paystack_transaction_id: transaction.id,
            completed_at: new Date().toISOString(),
          })
          .eq('reference', reference)
      }
    } catch (error) {
      console.warn('Warning: Could not access payment_transactions table:', error)
      // Continue anyway - we can still process the payment
    }

    // Update user subscription
    const planId = dbTransaction?.plan_id || transaction.metadata?.plan_id || 'pro'
    const planName = transaction.metadata?.plan_name || planId
    
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: planId,
        max_usage: transaction.metadata?.max_usage || 1000,
        subscription_id: transaction.id,
        subscription_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Error updating user profile:', profileError)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    // Log payment
    await paystackService.logPayment(user.id, transaction)

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      plan: planName,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
      },
    })

  } catch (error) {
    console.error('Paystack verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
