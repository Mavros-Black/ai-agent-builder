import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      )
    }

         const { email = 'mavros.black@yahoo.com', password = 'Monster123', role = 'enterprise' } = await request.json()

    console.log('🔧 Creating admin user:', { email, role })

    // Call the Supabase function to create admin user
    const { data, error } = await supabase.rpc('create_admin_user', {
      admin_email: email,
      admin_password: password,
      admin_role: role
    } as any)

    if (error) {
      console.error('❌ Error creating admin user:', error)
      return NextResponse.json(
        { error: 'Failed to create admin user', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Admin user created:', data)

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        email,
        role,
        status: (data as any).status,
        user_id: (data as any).user_id
      }
    })

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Admin user creation endpoint',
    usage: {
      method: 'POST',
             body: {
         email: 'mavros.black@yahoo.com (optional)',
         password: 'Monster123 (optional)',
         role: 'enterprise (optional)'
       }
    },
    example: {
             curl: 'curl -X POST http://localhost:3000/api/admin/create-user -H "Content-Type: application/json" -d \'{"email": "mavros.black@yahoo.com", "password": "Monster123", "role": "enterprise"}\''
    }
  })
}
