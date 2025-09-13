import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';

// Profile type matching the database schema
export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string | null;
}

// In-memory cache for profiles to avoid repeat queries
const profileCache = new Map<string, Profile>();

/**
 * Get a single profile by ID
 * @param id - User ID to fetch profile for
 * @returns Profile object or null if not found
 */
export async function getProfile(id: string): Promise<Profile | null> {
  // Check cache first
  if (profileCache.has(id)) {
    return profileCache.get(id)!;
  }

  try {
    const response = await fetch(`/api/profiles/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    const profile: Profile = await response.json();
    
    // Cache the result
    profileCache.set(id, profile);
    
    return profile;
  } catch (error) {
    console.warn('Failed to fetch profile:', error);
    return null;
  }
}

/**
 * Batch lookup profiles using IN query
 * @param ids - Array of user IDs to fetch profiles for
 * @returns Map of id -> profile for found profiles
 */
export async function getProfiles(ids: string[]): Promise<Map<string, Profile>> {
  const result = new Map<string, Profile>();
  const uncachedIds: string[] = [];

  // Check cache for each ID
  for (const id of ids) {
    if (profileCache.has(id)) {
      result.set(id, profileCache.get(id)!);
    } else {
      uncachedIds.push(id);
    }
  }

  // Fetch uncached profiles
  if (uncachedIds.length > 0) {
    try {
      const response = await fetch('/api/profiles/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ids: uncachedIds }),
      });

      if (response.ok) {
        const profiles: Profile[] = await response.json();
        
        // Add to cache and result map
        for (const profile of profiles) {
          profileCache.set(profile.id, profile);
          result.set(profile.id, profile);
        }
      }
    } catch (error) {
      console.warn('Failed to batch fetch profiles:', error);
    }
  }

  return result;
}

/**
 * Best-effort upsert of the current user's profile
 * @param user - Supabase User object
 * @returns Promise that resolves when upsert is complete (errors are logged but not thrown)
 */
export async function upsertSelf(user: User): Promise<void> {
  try {
    // Extract display_name from user metadata or fall back to email
    const display_name = user.user_metadata?.full_name || user.email;
    const avatar_url = user.user_metadata?.avatar_url || null;

    const response = await fetch('/api/profile-upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        id: user.id,
        display_name,
        avatar_url,
      }),
    });

    if (response.ok) {
      const profile: Profile = await response.json();
      
      // Update cache with the upserted profile
      profileCache.set(user.id, {
        id: profile.id,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
      });
    }
  } catch (error) {
    // Log but don't throw - this is best-effort
    console.warn('Profile upsert failed (this may be expected during development):', error);
  }
}

/**
 * React hook for fetching and caching a profile
 * @param id - User ID to fetch profile for
 * @returns Object with profile data, loading state, and error
 */
export function useProfile(id: string | null | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Check cache first
    if (profileCache.has(id)) {
      setProfile(profileCache.get(id)!);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch from API
    setLoading(true);
    setError(null);

    getProfile(id)
      .then((fetchedProfile) => {
        setProfile(fetchedProfile);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch profile');
        setProfile(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return { profile, loading, error };
}

/**
 * Clear the profile cache (useful for testing or when profiles are updated)
 */
export function clearProfileCache(): void {
  profileCache.clear();
}

/**
 * Get display name from profile with email fallback
 * @param profile - Profile object or null
 * @param email - Fallback email to extract prefix from
 * @returns Display name or email prefix fallback
 */
export function getDisplayName(profile: Profile | null, email?: string): string {
  if (profile?.display_name?.trim()) {
    return profile.display_name.trim();
  }
  
  if (email) {
    // Extract prefix from email as fallback
    const emailPrefix = email.split('@')[0];
    return emailPrefix || 'User';
  }
  
  return 'User';
}

/**
 * Get avatar URL from profile with fallback
 * @param profile - Profile object or null
 * @returns Avatar URL or default fallback
 */
export function getAvatarUrl(profile: Profile | null): string {
  return profile?.avatar_url || '/images/vr-creator.png';
}