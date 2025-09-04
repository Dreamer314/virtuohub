export type PlatformKey = 
  | 'roblox' | 'vrchat' | 'secondlife' | 'unity' | 'unreal' | 'imvu' | 'horizon'
  | 'fortnite' | 'minecraft' | 'gtafivem' | 'elderscrolls' | 'fallout' 
  | 'counterstrike' | 'teamfortress' | 'dreams' | 'core' | 'simscc' | 'inzoi'
  | 'other';

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

// Helper function to get platform label
export function getPlatformLabel(key: PlatformKey): string {
  return PLATFORMS.find(p => p.key === key)?.label || key;
}

// Helper function to get category display name
export function getCategoryDisplayName(category: string): string {
  return CATEGORIES.find(c => c === category) || category;
}

// Categories
export const CATEGORIES = [
  'General',
  'Assets for Sale', 
  'Jobs & Gigs',
  'Collaboration & WIP',
  'Industry News',
  'Events & Meetups',
  'Tips & Tutorials'
] as const;

export const PLATFORMS: { key: PlatformKey; label: string }[] = [
  // Core Virtual Worlds
  { key: 'roblox', label: 'Roblox' },
  { key: 'vrchat', label: 'VRChat' },
  { key: 'secondlife', label: 'Second Life' },
  { key: 'imvu', label: 'IMVU' },
  { key: 'horizon', label: 'Meta Horizon Worlds' },
  
  // Game Development Engines
  { key: 'unity', label: 'Unity' },
  { key: 'unreal', label: 'Unreal Engine' },
  { key: 'core', label: 'Core' },
  { key: 'dreams', label: 'Dreams' },
  
  // Gaming Platforms
  { key: 'fortnite', label: 'Fortnite Creative' },
  { key: 'minecraft', label: 'Minecraft' },
  { key: 'gtafivem', label: 'GTA FiveM' },
  { key: 'simscc', label: 'The Sims' },
  { key: 'inzoi', label: 'inZOI' },
  
  // Game Mods & Communities
  { key: 'elderscrolls', label: 'Elder Scrolls Online' },
  { key: 'fallout', label: 'Fallout' },
  { key: 'counterstrike', label: 'Counter-Strike' },
  { key: 'teamfortress', label: 'Team Fortress 2' },
  
  { key: 'other', label: 'Other Platform' }
];