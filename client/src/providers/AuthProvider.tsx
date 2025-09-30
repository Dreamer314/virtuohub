import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { useIntentContext } from '@/contexts/IntentContext'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  showWelcome: boolean
  setShowWelcome: (show: boolean) => void
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
  const [showWelcome, setShowWelcome] = useState(false)
  const { replayIntent } = useIntentContext()

  useEffect(() => {
    let previousUser: User | null = null

    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user || null)
        previousUser = session?.user || null
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null
        setSession(session)
        setUser(currentUser)
        setLoading(false)

        // Ensure profile row exists after successful sign in
        // Only trigger welcome on FRESH SIGNED_IN (event indicates fresh auth, localStorage prevents re-show)
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Check localStorage FIRST to prevent showing modal on refresh
            const welcomed = localStorage.getItem(`welcomed_${session.user.id}`)
            
            const response = await fetch('/api/profile-upsert', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: session.user.id,
              }),
            })
            
            if (!response.ok) {
              throw new Error(`Profile upsert failed: ${response.statusText}`)
            }

            // Only show welcome if not welcomed before (SIGNED_IN event = fresh auth action)
            if (!welcomed) {
              setShowWelcome(true)
            }
            
            // Replay any pending intent after successful sign-in
            // This happens for both new and returning users
            replayIntent()
          } catch (error) {
            console.warn('Profile upsert attempt failed (this is expected if profiles table does not exist):', error)
          }
        }

        // Update previousUser for next event
        previousUser = currentUser
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    session,
    loading,
    showWelcome,
    setShowWelcome
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}