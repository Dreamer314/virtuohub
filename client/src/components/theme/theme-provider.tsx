import { createContext, useContext, useEffect, useState } from "react"

type Theme = "charcoal"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "charcoal",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function VHThemeProvider({
  children,
  defaultTheme = "charcoal",
  storageKey = "vh-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("charcoal")

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("dark", "light")
    root.classList.add("charcoal")
    root.removeAttribute("data-theme")
    root.setAttribute("data-theme", "charcoal")
    localStorage.setItem(storageKey, "charcoal")
  }, [])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      // No-op: always charcoal
      localStorage.setItem(storageKey, "charcoal")
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useVHTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useVHTheme must be used within a VHThemeProvider")

  return context
}

// Theme toggle component (disabled in single-theme mode)
export function ThemeToggle() {
  const { theme, setTheme } = useVHTheme()

  return (
    <div className="flex items-center gap-2 p-2 bg-vh-surface rounded-lg border border-vh-border">
      <button
        onClick={() => {}}
        className="px-3 py-1.5 text-sm font-medium rounded-md bg-vh-accent1 text-white"
        aria-label="Charcoal theme (locked)"
        disabled
      >
        Charcoal
      </button>
    </div>
  )
}