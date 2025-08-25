import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Completely disable middleware for now to fix login loop
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/wizard/:path*',
    '/account/:path*',
    '/workflows/:path*',
    '/auth/:path*',
  ],
}
