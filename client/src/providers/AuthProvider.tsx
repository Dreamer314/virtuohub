import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { useLocation } from 'wouter'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [, setLocation] = useLocation()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user || null)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user || null)
        setLoading(false)

        // Handle new user onboarding after successful sign in
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Check if user has completed onboarding
            const { data: profileData } = await supabase
              .from('profiles')
              .select('onboarding_complete')
              .eq('id', session.user.id)
              .single();

            // If no profile exists or onboarding is incomplete, redirect to onboarding
            if (!profileData || !profileData.onboarding_complete) {
              setLocation('/onboarding');
            }

            // Attempt profile upsert for basic data
            const response = await fetch('/api/profile-upsert', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: session.user.id,
                display_name: session.user.user_metadata?.full_name || session.user.email,
              }),
            })
            
            if (!response.ok) {
              throw new Error(`Profile upsert failed: ${response.statusText}`)
            }
          } catch (error) {
            console.warn('Profile upsert attempt failed (this is expected if profiles table does not exist):', error)
            // On error, redirect to onboarding to be safe
            setLocation('/onboarding');
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    session,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}