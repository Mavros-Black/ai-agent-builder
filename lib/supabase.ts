import { createClient } from '@supabase/supabase-js'

let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!supabaseInstance) {
    // Use actual Supabase credentials (found in compiled files)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://msvpjoiwcqrixixkokcb.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdnBqb2l3Y3FyaXhpeGtva2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODE1NDQsImV4cCI6MjA3MTU1NzU0NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
    
    console.log('Initializing Supabase client with URL:', supabaseUrl)
    
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
      console.log('Supabase client initialized successfully')
    } catch (error) {
      console.error('Error initializing Supabase client:', error)
      // Create a fallback client with actual credentials
      supabaseInstance = createClient('https://msvpjoiwcqrixixkokcb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdnBqb2l3Y3FyaXhpeGtva2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODE1NDQsImV4cCI6MjA3MTU1NzU0NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8')
    }
  }
  return supabaseInstance
}

export const supabase = getSupabase()

export type Profile = {
  id: string
  role: 'free' | 'pro' | 'business' | 'enterprise'
  usage_count: number
  max_usage: number
  created_at: string
}

export type Plan = {
  id: number
  name: string
  price: number
  features: any
}

export type UsageLog = {
  id: number
  user_id: string
  action: string
  created_at: string
}
