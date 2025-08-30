import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Box, MessageCircle, Bell, Plus } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  onCreatePost?: () => void;
}

export function Header({ onCreatePost }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2" data-testid="logo">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Box className="text-white text-sm" size={16} />
            </div>
            <span className="text-xl font-display font-bold gradient-text">VirtuoHub</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="nav-home">Home</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="nav-learn">Learn</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="nav-earn">Earn</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="nav-connect">Connect</a>
            <a href="#" className="text-primary font-semibold border-b-2 border-primary" data-testid="nav-community">Community</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Community Page Actions */}
            {location === '/' && (
              <div className="flex items-center gap-2 mr-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full hover:bg-accent/20"
                  data-testid="messaging-button"
                >
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                </Button>
                
                <Button
                  onClick={onCreatePost}
                  variant="default"
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium flex items-center gap-2"
                  data-testid="create-post-button"
                >
                  <Plus className="w-4 h-4" />
                  Create
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full hover:bg-accent/20 relative"
                  data-testid="notification-button"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    1
                  </span>
                </Button>
              </div>
            )}
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="transition-all duration-300 hover:border-2 hover:border-primary border border-transparent"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            
            {/* Auth Buttons */}
            <Button variant="ghost" className="text-sm font-medium" data-testid="login-button">
              Log In
            </Button>
            <Button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all" data-testid="signup-button">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
