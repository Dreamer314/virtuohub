import { Button } from "@/components/ui/button";
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
  Shield
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { AuthModal } from "@/components/auth/AuthModal";
import { supabase } from "@/lib/supabaseClient";

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
  const [session, setSession] = useState<Session | null>(null);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchSessionAndProfile = async () => {
      try {
        // Fetch current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          if (!cancelled) {
            setSession(null);
            setProfileRole(null);
            setLoading(false);
          }
          return;
        }

        if (!cancelled) setSession(session);

        // If session exists, fetch user's profile role from DB
        if (session?.user?.id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            if (!cancelled) setProfileRole(null);
          } else {
            if (!cancelled) setProfileRole(profileData?.role || null);
          }
        } else {
          if (!cancelled) setProfileRole(null);
        }
      } catch (error) {
        console.error('Error in fetchSessionAndProfile:', error);
        if (!cancelled) {
          setSession(null);
          setProfileRole(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSessionAndProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      await fetchSessionAndProfile();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    // Single-theme mode: charcoal only
    setTheme?.("charcoal");
  };

  const handleSignOut = async () => {
    try {
      console.log("Sign out button clicked - attempting to sign out...");
      
      // Add timeout to catch hanging signOut calls
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout after 5 seconds')), 5000)
      );
      
      const result = await Promise.race([signOutPromise, timeoutPromise]);
      const { error } = result as { error: any };
      
      console.log("Supabase signOut result:", { error });
      
      if (error) {
        console.error("Supabase signOut error:", error);
        throw error;
      }
      
      console.log("Sign out successful, reloading page...");
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
      // Force reload anyway since the function was called
      console.log("Forcing page reload after error...");
      window.location.reload();
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

            {/* Admin link only when session exists AND profile.role === 'admin' */}
            {session && profileRole === 'admin' && (
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

          {/* Desktop Actions - ALWAYS VISIBLE */}
          <div className="flex items-center space-x-3">
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
                {session ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-sm font-medium px-3"
                    data-testid="signout-button"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="text-sm font-medium px-3"
                    onClick={() => openAuthModal("signin")}
                    data-testid="signin-button"
                  >
                    Sign In
                  </Button>
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
              {session && profileRole === 'admin' && (
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
                    {session ? (
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={handleSignOut}
                        data-testid="mobile-signout-button"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => openAuthModal("signin")}
                        data-testid="mobile-signin-button"
                      >
                        Sign In
                      </Button>
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
    </header>
  );
}
