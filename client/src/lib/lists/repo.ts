import { FeaturedList, ListType, Voice, Platform } from './types';

// Temporary in-memory source (replace with Supabase later)
const seed: FeaturedList[] = [
  {
    id: '1',
    slug: 'top-vr-creators-2024',
    title: 'Top VR Creators of 2024',
    subtitle: 'The most influential VR creators shaping virtual worlds this year',
    coverUrl: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&h=450&fit=crop',
    type: 'charting',
    voice: 'editorial',
    platforms: ['vrchat', 'horizon-worlds', 'cross-platform'],
    updatedAt: '2024-01-15T10:00:00Z',
    metrics: {
      views: 15400,
      rating: 4.8
    }
  },
  {
    id: '2',
    slug: 'most-anticipated-vr-experiences',
    title: 'Most Anticipated VR Experiences',
    subtitle: 'Virtual experiences launching soon that will change everything',
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367feb3ab?w=800&h=450&fit=crop',
    type: 'upcoming',
    voice: 'editorial',
    platforms: ['vrchat', 'horizon-worlds', 'cross-platform'],
    updatedAt: '2024-01-10T09:30:00Z',
    metrics: {
      views: 12300,
      rating: 4.6
    }
  },
  {
    id: '3',
    slug: 'best-avatar-assets-creators',
    title: 'Best Avatar Assets for Creators',
    subtitle: 'Top-rated avatar assets chosen by the community',
    coverUrl: 'https://images.unsplash.com/photo-1535303311164-664fc9ec6532?w=800&h=450&fit=crop',
    type: 'best-of',
    voice: 'community',
    platforms: ['vrchat', 'roblox', 'imvu'],
    updatedAt: '2024-01-08T14:20:00Z',
    metrics: {
      views: 9800,
      rating: 4.9
    }
  },
  {
    id: '4',
    slug: 'funniest-vr-comedy-shows',
    title: 'Funniest VR Comedy Shows',
    subtitle: 'Virtual comedy shows that will make you laugh until you cry',
    coverUrl: 'https://images.unsplash.com/photo-1611996575749-79a3a250f79e?w=800&h=450&fit=crop',
    type: 'entertainment',
    voice: 'community',
    platforms: ['vrchat', 'horizon-worlds'],
    updatedAt: '2024-01-05T16:45:00Z',
    metrics: {
      views: 5700,
      rating: 4.4
    }
  }
];

export interface Query {
  types?: ListType[];       // if empty -> all
  platforms?: Platform[];
  voice?: Voice;            // 'editorial' | 'community' | undefined -> all
  sort?: 'recent' | 'views' | 'rating';
}

export async function fetchFeaturedLists(q: Query = {}): Promise<FeaturedList[]> {
  // mimic async for easy swap to Supabase
  const data = [...seed];

  // filter by type
  const byType = q.types?.length ? data.filter(d => q.types!.includes(d.type)) : data;

  // filter by platform
  const byPlat = q.platforms?.length
    ? byType.filter(d => d.platforms.some(p => q.platforms!.includes(p)))
    : byType;

  // filter by voice
  const byVoice = q.voice ? byPlat.filter(d => d.voice === q.voice) : byPlat;

  // sort
  const sorted = byVoice.sort((a, b) => {
    switch (q.sort) {
      case 'views':  return (b.metrics.views ?? 0) - (a.metrics.views ?? 0);
      case 'rating': return (b.metrics.rating ?? 0) - (a.metrics.rating ?? 0);
      default:       return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  return sorted;
}

// Supabase mapping note (for later):
// Create a table featured_lists with columns matching FeaturedList fields. 
// platforms can be a text[]. The adapter above becomes a SQL query with filters from query params.