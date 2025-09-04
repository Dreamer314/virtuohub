export type ListType = 'charting' | 'upcoming' | 'best-of' | 'entertainment';
export type Voice = 'editorial' | 'community';
export type Platform =
  | 'vrchat' | 'horizon-worlds' | 'roblox' | 'imvu'
  | 'unity' | 'unreal' | 'cross-platform';

export interface FeaturedList {
  id: string;                 // uuid
  slug: string;               // route slug
  title: string;
  subtitle?: string;
  coverUrl?: string;
  type: ListType;
  voice: Voice;               // 'editorial' = VHub Picks, 'community' = User Choice
  platforms: Platform[];
  updatedAt: string;          // ISO date
  metrics: {
    views?: number;
    rating?: number;          // 0..5 average if you add later
  };
}