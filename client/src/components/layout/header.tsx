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
      <div className="w-full px-6">
        <div className="grid grid-cols-3 items-center h-16 w-full">
          {/* Logo - Far Left */}
          <div className="flex items-center space-x-2 justify-start" data-testid="logo">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Box className="text-white text-sm" size={16} />
            </div>
            <span className="text-xl font-display font-bold gradient-text">VirtuoHub</span>
          </div>

          {/* Navigation - Perfect Center */}
          <nav className="flex items-center justify-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium text-base" data-testid="nav-home">Home</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium text-base" data-testid="nav-learn">Learn</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium text-base" data-testid="nav-earn">Earn</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium text-base" data-testid="nav-connect">Connect</a>
            <a href="#" className="text-primary font-semibold text-base" data-testid="nav-community">Community</a>
          </nav>

          {/* Actions - Far Right */}
          <div className="flex items-center space-x-3 justify-end">
            {/* Community Page Actions */}
            {location === '/' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors"
                  data-testid="messaging-button"
                >
                  <MessageCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors relative"
                  data-testid="notification-button"
                >
                  <Bell className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
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
                  Create
                </Button>
              </>
            )}
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            
            {/* Auth Buttons */}
            <Button variant="ghost" className="text-sm font-medium px-3" data-testid="login-button">
              Log In
            </Button>
            <Button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all" data-testid="signup-button">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}