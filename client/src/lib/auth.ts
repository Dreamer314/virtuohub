// Simple check to see if user is authenticated (without using hooks)
export function isUserAuthenticated(user: any): boolean {
  return user !== null
}

// Function to create a login gate handler
export function createLoginGate(actionLabel: string, openAuthModal: () => void) {
  return function (user: any) {
    if (!user) {
      console.log(`Authentication required for: ${actionLabel}`)
      openAuthModal()
      return false
    }
    return true
  }
}