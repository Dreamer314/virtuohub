import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Box, MessageCircle, Bell, Plus, Menu, X } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useState } from "react";

interface HeaderProps {
  onCreatePost?: () => void;
}

export function Header({ onCreatePost }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    // Handle theme cycling including system theme
    let nextTheme: "light" | "dark" | "charcoal";
    
    if (theme === "system" || theme === "light") {
      nextTheme = "dark";
    } else if (theme === "dark") {
      nextTheme = "charcoal";
    } else {
      nextTheme = "light"; // charcoal → light
    }
    
    setTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="w-full px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <div className="flex items-center" data-testid="logo">
            <div className="relative header-glow">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Box className="text-white text-sm" size={16} />
              </div>
            </div>
            <span className="text-xl font-display font-bold text-foreground ml-2 hidden sm:block">VirtuoHub</span>
            <span className="text-lg font-display font-bold text-foreground ml-2 sm:hidden">VHub</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center space-x-8">
            <Link href="/home" className={`vh-nav-item px-3 py-2 rounded-lg font-medium text-base ${
              location === '/home' ? 'active' : ''
            }`} data-testid="nav-home">Home</Link>
            <a href="#" className="vh-nav-item px-3 py-2 rounded-lg font-medium text-base" data-testid="nav-learn">Learn</a>
            <a href="#" className="vh-nav-item px-3 py-2 rounded-lg font-medium text-base" data-testid="nav-earn">Earn</a>
            <a href="#" className="vh-nav-item px-3 py-2 rounded-lg font-medium text-base" data-testid="nav-connect">Connect</a>
            <Link href="/" className={`vh-nav-item px-3 py-2 rounded-lg font-medium text-base ${
              location === '/' ? 'active' : ''
            }`} data-testid="nav-community">Community</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Community Page Actions */}
            {location === '/' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full vh-button-ghost"
                  data-testid="messaging-button"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full vh-button-ghost relative"
                  data-testid="notification-button"
                  aria-label="Notifications (1 unread)"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    1
                  </span>
                </Button>
                
                <Button
                  onClick={onCreatePost}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition-all flex items-center gap-2"
                  data-testid="create-post-button"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden lg:inline">Create</span>
                </Button>
              </>
            )}
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full vh-button-ghost"
              data-testid="theme-toggle"
              aria-label={
                theme === "light" ? "Switch to dark mode" : 
                theme === "dark" ? "Switch to charcoal mode" : 
                "Switch to light mode"
              }
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : theme === "dark" ? (
                <div className="h-4 w-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-sm border border-gray-500" />
              ) : theme === "charcoal" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            {/* Auth Buttons */}
            <Button variant="ghost" className="text-sm font-medium px-3 hidden lg:inline-flex" data-testid="login-button">
              Log In
            </Button>
            <Button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all hidden lg:inline-flex" data-testid="signup-button">
              Sign Up
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Create Button */}
            {location === '/' && (
              <Button
                onClick={onCreatePost}
                size="icon"
                className="w-9 h-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all"
                data-testid="mobile-create-button"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full vh-button-ghost"
              data-testid="mobile-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : theme === "dark" ? (
                <div className="h-4 w-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-sm border border-gray-500" />
              ) : theme === "charcoal" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors lg:hidden"
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Menu className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-1 py-4">
              <a href="#" className="vh-nav-item px-4 py-3 font-medium rounded-lg mx-2" data-testid="mobile-nav-home">Home</a>
              <a href="#" className="vh-nav-item px-4 py-3 font-medium rounded-lg mx-2" data-testid="mobile-nav-learn">Learn</a>
              <a href="#" className="vh-nav-item px-4 py-3 font-medium rounded-lg mx-2" data-testid="mobile-nav-earn">Earn</a>
              <a href="#" className="vh-nav-item px-4 py-3 font-medium rounded-lg mx-2" data-testid="mobile-nav-connect">Connect</a>
              <a href="#" className="vh-nav-item active px-4 py-3 font-medium rounded-lg mx-2" data-testid="mobile-nav-community">Community</a>
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-2 pt-4 px-2">
                <Button variant="ghost" className="justify-start" data-testid="mobile-login-button">
                  Log In
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all" data-testid="mobile-signup-button">
                  Sign Up
                </Button>
              </div>

              {/* Mobile Community Actions */}
              {location === '/' && (
                <div className="flex items-center justify-center space-x-4 pt-4 border-t border-border mt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-full vh-button-ghost"
                    data-testid="mobile-messaging-button"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-full vh-button-ghost relative"
                    data-testid="mobile-notification-button"
                    aria-label="Notifications (1 unread)"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      1
                    </span>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}