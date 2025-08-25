'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { Profile } from './supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('Session error:', error)
          setLoading(false)
          return
        }
        
        setUser(session?.user ?? null)
        
        // Set loading to false immediately for better UX
        if (mounted) {
          setLoading(false)
        }
        
        // Fetch profile in background if user exists
        if (session?.user) {
          fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted) {
        setLoading(false)
      }
    }, 5000) // 5 seconds timeout

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      try {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Error in auth state change:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Profile fetch error:', error)
        // Set a default profile for demo purposes
        setProfile({
          id: userId,
          role: 'free',
          usage_count: 0,
          max_usage: 50,
          created_at: new Date().toISOString()
        })
        return
      }
      
      console.log('Profile fetched:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Set a default profile for demo purposes
      setProfile({
        id: userId,
        role: 'free',
        usage_count: 0,
        max_usage: 50,
        created_at: new Date().toISOString()
      })
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
