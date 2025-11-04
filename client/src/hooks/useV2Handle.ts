import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/providers/AuthProvider';

export function useV2Handle() {
  const { user } = useAuth();

  const { data: handle } = useQuery({
    queryKey: ['v2-handle', user?.id ?? 'none'],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get active profile from account_prefs
      const { data: prefs } = await supabase
        .from('account_prefs')
        .select('last_active_profile_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!prefs?.last_active_profile_id) {
        // Try to find any profile for this user
        const { data: profile } = await supabase
          .from('profiles_v2')
          .select('handle')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();
        
        return profile?.handle || null;
      }

      // Fetch the active profile's handle
      const { data: profile } = await supabase
        .from('profiles_v2')
        .select('handle')
        .eq('profile_id', prefs.last_active_profile_id)
        .maybeSingle();

      return profile?.handle || null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });

  return handle || null;
}
