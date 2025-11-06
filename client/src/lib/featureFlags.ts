/**
 * Feature flags for progressive rollout
 * 
 * Flags are controlled via environment variables
 */

export const FEATURES = {
  PROFILES_V2_ENABLED: import.meta.env.VITE_PROFILES_V2_ENABLED === 'true',
} as const;
