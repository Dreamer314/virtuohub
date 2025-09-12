import { useAuth } from '@/providers/AuthProvider'

// Hook to check if user is signed in
export function isSignedIn(): boolean {
  const { user } = useAuth()
  return user !== null
}

// Function to require authentication for actions
export function requireAuth(actionLabel: string) {
  const { user } = useAuth()
  
  return function () {
    if (!user) {
      // This will be used to trigger the auth modal
      // The actual modal opening logic will be implemented in the components
      console.log(`Authentication required for: ${actionLabel}`)
      return false
    }
    return true
  }
}