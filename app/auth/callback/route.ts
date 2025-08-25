import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const returnTo = requestUrl.searchParams.get('return_to') || '/dashboard'

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL(`/auth/login?error=auth_callback_failed&return_to=${encodeURIComponent(returnTo)}`, request.url))
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(returnTo, request.url))
}
