import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import {
  Moon,
  Sun,
  Box,
  MessageCircle,
  Bell,
  Plus,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  UserCircle,
  Settings as SettingsIcon,
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { supabase } from "@/lib/supabaseClient";
import { useDisplayIdentity } from "@/hooks/useDisplayIdentity";
import { useV2Avatar } from "@/hooks/useV2Avatar";
import { useV2Handle } from "@/hooks/useV2Handle";
import { WelcomeModal } from "@/components/welcome/WelcomeModal";

interface HeaderProps {
  onCreatePost?: () => void;
}

export function Header({ onCreatePost }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">(
    "signin"
  );
  const { user, loading, showWelcome, setShowWelcome } = useAuth();
  const { displayName, isTemporary } = useDisplayIdentity();
  const avatarUrl = useV2Avatar();
  const userHandle = useV2Handle();
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  // Admin flag
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (user?.id) {
        const { data, error } = await supabase.rpc("is_admin", { uid: user.id });
        if (!cancelled) setIsAdmin(Boolean(data) && !error);
      } else {
        if (!cancelled) setIsAdmin(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const toggleTheme = () => {
    // Single-theme mode: charcoal only
    setTheme?.("charcoal");
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
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
            <span className="text-xl font-display font-bold text-foreground ml-2 hidden sm:block">
              VirtuoHub
            </span>
            <span className="text-lg font-display font-bold text-foreground ml-2 sm:hidden">
              VHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center space-x-8">
            <Link
              href="/home"
              className={`vh-nav-item px-3 py-2 rounded-lg font-medium text-base ${
                location === "/home" ? "active" : ""
              }`}
              data-testid="nav-home"
            >
              Home
            </Link>
            <a
              href="#"
              className="vh-nav-item px-3 py-2 rounded-lg font-medium text-base"
              data-testid="nav-learn"
            >
              Learn
            </a>
            <a
              href="#"
              className="vh-nav-item px-3 py-2 rounded-lg font-medium text-base"
              data-testid="nav-earn"
            >
              Earn
            </a>
            <a
              href="#"
              className="vh-nav-item px-3 py-2 rounded-lg font-medium text-base"
              data-testid="nav-connect"
            >
              Connect
            </a>
            <Link
              href="/"
              className={`vh-nav-item px-3 py-2 rounded-lg font-medium text-base ${
                location === "/" ? "active" : ""
              }`}
              data-testid="nav-community"
            >
              Community
            </Link>

            {/* Admin link for real admins */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`vh-nav-item px-3 py-2 rounded-lg font-medium text-base ${
                  location === "/admin" ? "active" : ""
                }`}
                data-testid="nav-admin"
              >
                <span className="inline-flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Admin
                </span>
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Community Page Actions */}
            {location === "/" && (
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
              aria-label="Charcoal theme (locked)"
            >
              <Sun className="h-4 w-4 text-yellow-500" />
            </Button>

            {/* Auth Buttons */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    {/* User Menu Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-primary"
                          data-testid="user-menu-trigger"
                        >
                          {avatarUrl ? (
                            <img 
                              src={avatarUrl} 
                              alt={displayName}
                              className="w-6 h-6 rounded-full object-cover"
                              data-testid="user-avatar"
                            />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span
                            className="text-sm font-medium"
                            data-testid="user-display-name"
                          >
                            {displayName}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          asChild={!!userHandle}
                          disabled={!userHandle}
                          className="cursor-pointer"
                        >
                          {userHandle ? (
                            <Link href={`/u/${userHandle}`}>
                              <User className="w-4 h-4 mr-2" />
                              View public profile
                            </Link>
                          ) : (
                            <div className="flex items-center opacity-50">
                              <User className="w-4 h-4 mr-2" />
                              View public profile
                            </div>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings/profile" className="cursor-pointer">
                            <SettingsIcon className="w-4 h-4 mr-2" />
                            Profile settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                          <LogOut className="w-4 h-4 mr-2" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {isTemporary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setWelcomeModalOpen(true)}
                        className="text-sm font-medium px-3"
                        data-testid="complete-profile-button"
                      >
                        <UserCircle className="w-4 h-4 mr-1" />
                        Complete your profile
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="text-sm font-medium px-3 hidden lg:inline-flex"
                      onClick={() => openAuthModal("signin")}
                      data-testid="login-button"
                    >
                      Log In
                    </Button>
                    <Button
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all hidden lg:inline-flex"
                      onClick={() => openAuthModal("signup")}
                      data-testid="signup-button"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Create Button */}
            {location === "/" && (
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
              <Sun className="h-4 w-4 text-yellow-500" />
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
              <a
                href="#"
                className="vh-nav-item px-4 py-3 font-medium rounded-lg mx-2"
                data-testid="mobile-nav-home"
              >
                Home
              </a>
              <a
                href="#"
                className="vh-nav-item px-4 py-3 font-medium rounded-lg mx-2"
                data-testid="mobile-nav-learn"
              >
                Learn
              </a>
              <a
                href="#"
                className="vh-nav-item px-4 py-3 font-medium rounded-lg mx-2"
                data-testid="mobile-nav-earn"
              >
                Earn
              </a>
              <a
                href="#"
                className="vh-nav-item px-4 py-3 font-medium rounded-lg mx-2"
                data-testid="mobile-nav-connect"
              >
                Connect
              </a>
              <a
                href="#"
                className="vh-nav-item active px-4 py-3 font-medium rounded-lg mx-2"
                data-testid="mobile-nav-community"
              >
                Community
              </a>

              {/* Admin (mobile) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="vh-nav-item px-4 py-3 font-medium rounded-lg mx-2"
                  data-testid="mobile-nav-admin"
                >
                  <span className="inline-flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </span>
                </Link>
              )}

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-2 pt-4 px-2">
                {!loading && (
                  <>
                    {user ? (
                      <div className="space-y-2">
                        {/* User info header */}
                        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted/50">
                          {avatarUrl ? (
                            <img 
                              src={avatarUrl} 
                              alt={displayName}
                              className="w-6 h-6 rounded-full object-cover"
                              data-testid="mobile-user-avatar"
                            />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span 
                            className="text-sm font-medium" 
                            data-testid="mobile-user-display-name"
                          >
                            {displayName}
                          </span>
                        </div>
                        
                        {/* Menu items */}
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          asChild={!!userHandle}
                          disabled={!userHandle}
                        >
                          {userHandle ? (
                            <Link href={`/u/${userHandle}`} onClick={() => setIsMobileMenuOpen(false)}>
                              <User className="w-4 h-4 mr-2" />
                              View public profile
                            </Link>
                          ) : (
                            <div className="flex items-center opacity-50 px-3 py-2">
                              <User className="w-4 h-4 mr-2" />
                              View public profile
                            </div>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          asChild
                        >
                          <Link href="/settings/profile" onClick={() => setIsMobileMenuOpen(false)}>
                            <SettingsIcon className="w-4 h-4 mr-2" />
                            Profile settings
                          </Link>
                        </Button>
                        {isTemporary && (
                          <Button
                            variant="ghost"
                            className="justify-start w-full"
                            onClick={() => {
                              setWelcomeModalOpen(true);
                              setIsMobileMenuOpen(false);
                            }}
                            data-testid="mobile-complete-profile-button"
                          >
                            <UserCircle className="w-4 h-4 mr-2" />
                            Complete your profile
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={handleSignOut}
                          data-testid="mobile-logout-button"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={() => openAuthModal("signin")}
                          data-testid="mobile-login-button"
                        >
                          Log In
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all"
                          onClick={() => openAuthModal("signup")}
                          data-testid="mobile-signup-button"
                        >
                          Sign Up
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Mobile Community Actions */}
              {location === "/" && (
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

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultMode={authModalMode}
      />
      <WelcomeModal 
        open={showWelcome || welcomeModalOpen} 
        onOpenChange={(open) => {
          setShowWelcome(open);
          setWelcomeModalOpen(open);
        }} 
      />
    </header>
  );
}
