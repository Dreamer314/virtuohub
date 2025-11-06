import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/providers/AuthProvider';
import type { ProfileKind } from '@shared/schema.profilesV2';

export interface MyV2Profile {
  handle: string | null;
  displayName: string | null;
  profilePhotoUrl: string | null;
  visibility: string | null;
  kind: ProfileKind | null;
  hasValidProfile: boolean;
}

export function useMyV2Profile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-v2-profile', user?.id ?? 'none'],
    queryFn: async (): Promise<MyV2Profile> => {
      console.log('[useMyV2Profile] Starting query for user:', user?.id);
      
      if (!user?.id) {
        console.log('[useMyV2Profile] No user ID, returning empty profile');
        return {
          handle: null,
          displayName: null,
          profilePhotoUrl: null,
          visibility: null,
          kind: null,
          hasValidProfile: false,
        };
      }

      // Get active profile from account_prefs
      const { data: prefs, error: prefsError } = await supabase
        .from('account_prefs')
        .select('last_active_profile_id')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('[useMyV2Profile] account_prefs result:', { prefs, prefsError });

      let profileId = prefs?.last_active_profile_id;

      // If no active profile set, find the first profile for this user
      if (!profileId) {
        console.log('[useMyV2Profile] No active profile ID, looking for any profile...');
        const { data: firstProfile } = await supabase
          .from('profiles_v2')
          .select('profile_id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();
        
        profileId = firstProfile?.profile_id;
        console.log('[useMyV2Profile] Found profile ID:', profileId);
      }

      if (!profileId) {
        console.log('[useMyV2Profile] No profile exists for user');
        return {
          handle: null,
          displayName: null,
          profilePhotoUrl: null,
          visibility: null,
          kind: null,
          hasValidProfile: false,
        };
      }

      // Fetch the complete profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles_v2')
        .select('handle, display_name, profile_photo_url, visibility, kind')
        .eq('profile_id', profileId)
        .maybeSingle();

      console.log('[useMyV2Profile] Profile data:', { profile, profileError });

      if (!profile) {
        console.log('[useMyV2Profile] Profile not found');
        return {
          handle: null,
          displayName: null,
          profilePhotoUrl: null,
          visibility: null,
          kind: null,
          hasValidProfile: false,
        };
      }

      const hasValidProfile = !!(profile.handle && profile.handle.trim() !== '');
      
      console.log('[useMyV2Profile] Returning profile:', {
        handle: profile.handle,
        displayName: profile.display_name,
        hasPhoto: !!profile.profile_photo_url,
        visibility: profile.visibility,
        hasValidProfile,
      });

      return {
        handle: profile.handle || null,
        displayName: profile.display_name || null,
        profilePhotoUrl: profile.profile_photo_url || null,
        visibility: profile.visibility || null,
        kind: (profile as any).kind || null,
        hasValidProfile,
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
  });
}
