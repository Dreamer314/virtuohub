import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/providers/AuthProvider';

export function useV2Avatar() {
  const { user } = useAuth();

  const { data: avatarUrl } = useQuery({
    queryKey: ['v2-avatar', user?.id ?? 'none'],
    queryFn: async () => {
      console.log('[useV2Avatar] Starting query for user:', user?.id);
      
      if (!user?.id) {
        console.log('[useV2Avatar] No user ID, returning null');
        return null;
      }

      // Get active profile from account_prefs
      const { data: prefs, error: prefsError } = await supabase
        .from('account_prefs')
        .select('last_active_profile_id')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('[useV2Avatar] account_prefs result:', { prefs, prefsError });

      if (!prefs?.last_active_profile_id) {
        // Try to find any profile for this user
        const { data: profile, error: profileError } = await supabase
          .from('profiles_v2')
          .select('profile_photo_url')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();
        
        console.log('[useV2Avatar] Fallback profile result:', { profile, profileError });
        console.log('[useV2Avatar] Returning avatar URL:', profile?.profile_photo_url || null);
        return profile?.profile_photo_url || null;
      }

      // Fetch the active profile's avatar
      const { data: profile, error: profileError } = await supabase
        .from('profiles_v2')
        .select('profile_photo_url')
        .eq('profile_id', prefs.last_active_profile_id)
        .maybeSingle();

      console.log('[useV2Avatar] Active profile result:', { profile, profileError });
      console.log('[useV2Avatar] Returning avatar URL:', profile?.profile_photo_url || null);
      return profile?.profile_photo_url || null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });

  console.log('[useV2Avatar] Current avatarUrl:', avatarUrl);
  return avatarUrl || null;
}
