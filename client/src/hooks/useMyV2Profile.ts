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
  isAdmin?: boolean;
}

export function useMyV2Profile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-v2-profile', user?.id ?? 'none'],
    queryFn: async (): Promise<MyV2Profile> => {
      if (!user?.id) {
        return {
          handle: null,
          displayName: null,
          profilePhotoUrl: null,
          visibility: null,
          kind: null,
          hasValidProfile: false,
          isAdmin: false,
        };
      }

      // Get active profile from account_prefs
      const { data: prefs } = await supabase
        .from('account_prefs')
        .select('last_active_profile_id')
        .eq('user_id', user.id)
        .maybeSingle();

      let profileId = prefs?.last_active_profile_id;

      // If no active profile set, find the first profile for this user
      if (!profileId) {
        const { data: firstProfile } = await supabase
          .from('profiles_v2')
          .select('profile_id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();
        
        profileId = firstProfile?.profile_id;
      }

      if (!profileId) {
        return {
          handle: null,
          displayName: null,
          profilePhotoUrl: null,
          visibility: null,
          kind: null,
          hasValidProfile: false,
          isAdmin: false,
        };
      }

      // Fetch the active profile
      const { data: profile } = await supabase
        .from('profiles_v2')
        .select('handle, display_name, profile_photo_url, visibility, kind')
        .eq('profile_id', profileId)
        .maybeSingle();

      if (!profile) {
        return {
          handle: null,
          displayName: null,
          profilePhotoUrl: null,
          visibility: null,
          kind: null,
          hasValidProfile: false,
          isAdmin: false,
        };
      }

      // Fetch ALL profiles for this user to check admin status
      const { data: allProfiles } = await supabase
        .from('profiles_v2')
        .select('kind')
        .eq('user_id', user.id);

      console.log('[useMyV2Profile] All user profiles:', {
        userId: user.id,
        profileCount: allProfiles?.length,
        kinds: allProfiles?.map(p => p.kind),
      });

      // Check if ANY profile has kind = 'ADMIN'
      const hasAdminProfile = Array.isArray(allProfiles)
        ? allProfiles.some((p) => p.kind === 'ADMIN')
        : false;

      const hasValidProfile = !!(profile.handle && profile.handle.trim() !== '');

      const result = {
        handle: profile.handle || null,
        displayName: profile.display_name || null,
        profilePhotoUrl: profile.profile_photo_url || null,
        visibility: profile.visibility || null,
        kind: profile.kind || null,
        hasValidProfile,
        isAdmin: hasAdminProfile,
      };
      
      console.log('[useMyV2Profile] Final result', {
        kind: result.kind,
        isAdmin: result.isAdmin,
      });
      
      return result;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
  });
}
