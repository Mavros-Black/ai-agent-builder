const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please ensure you have:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin test user...')
    
         // Create user in Supabase Auth
     const { data: authData, error: authError } = await supabase.auth.admin.createUser({
       email: 'mavros.black@yahoo.com',
       password: 'Monster123',
       email_confirm: true,
       user_metadata: {
         name: 'Admin Test User'
       }
     })

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message)
      return
    }

    const userId = authData.user.id
    console.log('✅ Auth user created with ID:', userId)

    // Create profile with enterprise plan
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        role: 'enterprise',
        usage_count: 0,
        max_usage: -1, // unlimited
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('❌ Error creating profile:', profileError.message)
      return
    }

    console.log('✅ Profile created:', profileData)

    // Ensure enterprise plan exists
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .upsert({
        id: 4,
        name: 'Enterprise',
        price: 50000, // ₦50,000
        features: [
          'Unlimited AI agents',
          'Multi-agent supervisor', 
          'Advanced analytics',
          'Priority support',
          'Custom integrations',
          'White-label options',
          'Team collaboration',
          'Advanced security'
        ]
      }, { onConflict: 'id' })
      .select()
      .single()

    if (planError) {
      console.error('❌ Error creating enterprise plan:', planError.message)
    } else {
      console.log('✅ Enterprise plan ensured:', planData)
    }

    console.log('\n🎉 Admin user created successfully!')
         console.log('📧 Email: mavros.black@yahoo.com')
     console.log('🔑 Password: Monster123')
    console.log('👑 Plan: Enterprise (unlimited access)')
         console.log('\n🔗 You can now login at: http://localhost:3000/auth/login')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Alternative method using direct SQL if the above doesn't work
async function createAdminUserDirect() {
  try {
    console.log('🔧 Creating admin user using direct SQL...')
    
         const { data, error } = await supabase.rpc('create_admin_user', {
       admin_email: 'mavros.black@yahoo.com',
       admin_password: 'Monster123'
     })

    if (error) {
      console.error('❌ Error:', error.message)
      console.log('💡 Trying alternative method...')
      await createAdminUser()
    } else {
      console.log('✅ Admin user created via RPC:', data)
    }

  } catch (error) {
    console.error('❌ Error with direct method:', error.message)
    console.log('💡 Trying standard method...')
    await createAdminUser()
  }
}

// Run the script
if (require.main === module) {
  createAdminUserDirect()
}
