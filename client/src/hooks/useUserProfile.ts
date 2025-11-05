import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
  user_id: string;
  display_name: string | null;
  handle: string | null;
  profile_photo_url: string | null;
  visibility: string | null;
  kind: string | null;
}

/**
 * Fetches a user's profile from profiles_v2 by user_id
 * Returns null if no profile exists (graceful degradation)
 */
export function useUserProfile(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['user-profile-v2', userId ?? 'none'],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!userId) {
        return null;
      }

      // Query profiles_v2 directly by user_id
      const { data: profile, error } = await supabase
        .from('profiles_v2')
        .select('user_id, display_name, handle, profile_photo_url, visibility, kind')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('[useUserProfile] Error fetching profile:', error);
        return null;
      }

      return profile;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

/**
 * Helper to get display name with fallback
 */
export function getProfileDisplayName(profile: UserProfile | null | undefined, fallback = 'User'): string {
  if (!profile) return fallback;
  
  // Prefer display_name, fall back to @handle, then fallback
  if (profile.display_name?.trim()) {
    return profile.display_name.trim();
  }
  
  if (profile.handle?.trim()) {
    return `@${profile.handle.trim()}`;
  }
  
  return fallback;
}

/**
 * Helper to get avatar URL with fallback
 */
export function getProfileAvatarUrl(profile: UserProfile | null | undefined): string | null {
  return profile?.profile_photo_url || null;
}
