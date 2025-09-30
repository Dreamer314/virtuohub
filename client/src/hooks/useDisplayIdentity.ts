import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import type { Profile } from '@shared/schema';

interface DisplayIdentity {
  displayName: string;
  isTemporary: boolean;
  handle: string | null;
}

export function useDisplayIdentity(): DisplayIdentity {
  const { user, loading: authLoading } = useAuth();

  // If no session, return empty state
  const { data: profile } = useQuery<Profile>({
    queryKey: ['/api/profile'],
    enabled: !!user,
  });

  // Anonymous user
  if (!user) {
    return {
      displayName: '',
      isTemporary: false,
      handle: null,
    };
  }

  // Authenticated user with handle
  if (profile?.handle) {
    return {
      displayName: `@${profile.handle}`,
      isTemporary: false,
      handle: profile.handle,
    };
  }

  // Authenticated user without handle - temporary identity
  const shortId = user.id.slice(-5);
  return {
    displayName: `user_${shortId}`,
    isTemporary: true,
    handle: null,
  };
}
