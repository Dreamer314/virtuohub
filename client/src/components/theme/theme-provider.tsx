import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "charcoal"

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
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function VHThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vh-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "charcoal")
    
    // Set the new theme attribute and class
    root.setAttribute("data-theme", theme)
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
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

// Theme toggle component
export function ThemeToggle() {
  const { theme, setTheme } = useVHTheme()

  return (
    <div className="flex items-center gap-2 p-2 bg-vh-surface rounded-lg border border-vh-border">
      <button
        onClick={() => setTheme("light")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          theme === "light"
            ? "bg-vh-accent1 text-white"
            : "text-vh-text-muted hover:text-vh-accent1"
        }`}
        aria-label="Switch to light theme"
      >
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          theme === "dark"
            ? "bg-vh-accent1 text-white"
            : "text-vh-text-muted hover:text-vh-accent1"
        }`}
        aria-label="Switch to dark theme"
      >
        Dark
      </button>
      <button
        onClick={() => setTheme("charcoal")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          theme === "charcoal"
            ? "bg-vh-accent1 text-white"
            : "text-vh-text-muted hover:text-vh-accent1"
        }`}
        aria-label="Switch to charcoal theme"
      >
        Charcoal
      </button>
    </div>
  )
}