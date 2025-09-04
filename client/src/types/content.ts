export type PlatformKey = 'roblox' | 'vrchat' | 'secondlife' | 'unity' | 'unreal' | 'imvu' | 'horizon' | 'other';

export interface Post {
  id: string;
  type: 'post';
  title: string;
  body: string;
  links: string[];
  images: string[];          // base64 previews for now
  files: { name: string; b64: string }[];
  price?: string;            // "Free" | "$50" etc.
  category: string;          // "General" | "Jobs & Gigs" | ...
  platforms: PlatformKey[];
  createdAt: number;
  author: { id: string; name: string; avatar?: string };
  stats: { likes: number; saves: number; comments: number };
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  type: 'poll';
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  showResults: 'after-vote' | 'after-close';
  closesAt: number;          // epoch ms
  category?: string;
  platforms?: PlatformKey[];
  createdAt: number;
  author: { id: string; name: string; avatar?: string };
  // derived
  status: 'active' | 'completed';
}

export type FeedItem = Post | Poll;

// Categories
export const CATEGORIES = [
  'General',
  'Assets for Sale',
  'Jobs & Gigs',
  'Collaboration & WIP'
] as const;

export const PLATFORMS: { key: PlatformKey; label: string }[] = [
  { key: 'roblox', label: 'Roblox' },
  { key: 'vrchat', label: 'VRChat' },
  { key: 'secondlife', label: 'Second Life' },
  { key: 'unity', label: 'Unity' },
  { key: 'unreal', label: 'Unreal Engine' },
  { key: 'imvu', label: 'IMVU' },
  { key: 'horizon', label: 'Horizon Worlds' },
  { key: 'other', label: 'Other' }
];