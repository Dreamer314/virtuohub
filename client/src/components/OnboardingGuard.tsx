import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabaseClient';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

interface Profile {
  id: string;
  handle: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: string | null;
  onboardingComplete: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Skip check if auth is still loading or user is not authenticated
      if (authLoading || !user) {
        return;
      }

      setProfileLoading(true);
      setProfileError(null);

      try {
        // Fetch profile directly from Supabase for consistency with onboarding submission
        const { data: profileData, error: profileFetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileFetchError && profileFetchError.code !== 'PGRST116') {
          throw new Error(`Failed to fetch profile: ${profileFetchError.message}`);
        }

        if (profileData) {
          setProfile(profileData);

          // Handle onboarding logic based on current location and completion status
          if (location === '/onboarding') {
            // If user is on onboarding page and has completed onboarding, redirect to community
            if (profileData.onboarding_complete) {
              setLocation('/community');
              return;
            }
            // Otherwise, allow access to onboarding page (user has incomplete onboarding)
          } else {
            // If user is NOT on onboarding page and has incomplete onboarding, redirect to onboarding
            if (!profileData.onboarding_complete) {
              setLocation('/onboarding');
              return;
            }
            // Otherwise, allow access to regular pages (user has completed onboarding)
          }
        } else {
          // Profile doesn't exist, redirect to onboarding
          setLocation('/onboarding');
        }
      } catch (error: any) {
        console.error('Onboarding check error:', error);
        setProfileError(error.message);
        
        // On error, redirect to onboarding to be safe
        setLocation('/onboarding');
      } finally {
        setProfileLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, authLoading, location, setLocation]);

  // Additional check: if user is not authenticated and trying to access /onboarding, redirect to home
  useEffect(() => {
    if (!authLoading && !user && location === '/onboarding') {
      setLocation('/');
    }
  }, [user, authLoading, location, setLocation]);

  // Show loading state while checking
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if there was an error checking profile
  if (profileError && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="text-destructive mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Profile Check Failed</h2>
          <p className="text-muted-foreground mb-4">{profileError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default OnboardingGuard;