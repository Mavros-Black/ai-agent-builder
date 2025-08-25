import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user has reached usage limit
    const { data: profile, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('role, usage_count, max_usage')
      .eq('id', userId)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check usage limit for free users
    if ((profile as any).role === 'free' && (profile as any).usage_count >= (profile as any).max_usage) {
      return NextResponse.json(
        { error: 'Usage limit exceeded. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Insert usage log
    const { error: logError } = await (supabase as any)
      .from('usage_logs')
      .insert({
        user_id: userId,
        action: action,
      })

    if (logError) {
      return NextResponse.json(
        { error: 'Failed to log usage' },
        { status: 500 }
      )
    }

    // Increment usage count (only for free users)
    if ((profile as any).role === 'free') {
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({
          usage_count: (profile as any).usage_count + 1,
        })
        .eq('id', userId)

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update usage count' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Usage tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
