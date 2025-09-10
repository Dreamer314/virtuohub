import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Platform color constants - using VirtuoHub brand colors for consistency
export const PLATFORM_COLORS: Record<string, string> = {
  'VRChat': 'bg-primary/20 text-primary border-primary/30',
  'Roblox': 'bg-accent/20 text-accent border-accent/30',
  'Second Life': 'bg-primary/15 text-primary border-primary/25',
  'IMVU': 'bg-accent/15 text-accent border-accent/25',
  'GTA RP': 'bg-primary/25 text-primary border-primary/35',
  'The Sims': 'bg-accent/25 text-accent border-accent/35',
  'Unity': 'bg-primary/20 text-primary border-primary/30',
  'Blender': 'bg-accent/20 text-accent border-accent/30',
  'Unreal Engine': 'bg-primary/15 text-primary border-primary/25',
  'Other': 'bg-muted/20 text-muted-foreground border-muted/30',
};

// Category color constants - using VirtuoHub brand colors for consistency
// POST CATEGORIES MVP - Updated category colors to use slugs
export const CATEGORY_COLORS: Record<string, string> = {
  'wip': 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600',
  'feedback': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600',
  'tutorials': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600',
  'hire-collab': 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600',
  'sell': 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600',
  'teams': 'bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-600',
  'events': 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-600',
  'platform-qa': 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-600',
  'general': 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
  // POST CATEGORIES MVP - Legacy category mappings for backwards compatibility
  'Assets for Sale': 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600',
  'Jobs & Gigs': 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600',
  'Collaboration & WIP': 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600',
  'General': 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
  'Help & Feedback': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600',
  'WIP (Work in Progress)': 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600',
  'Tutorials & Guides': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600',
  'Collabs & Teams': 'bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-600',
  'Events & Workshops': 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-600',
  'Platform Q&A': 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-600',
};

/**
 * Formats a date into a human-readable time ago string
 * @param date - The date to format
 * @returns A string like "Just now", "2 hours ago", "3 days ago", etc.
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return new Date(date).toLocaleDateString();
}

/**
 * Gets the CSS classes for styling platform badges
 * @param platform - The platform name
 * @returns CSS class string for styling the platform badge
 */
export function getPlatformColor(platform: string): string {
  return PLATFORM_COLORS[platform] || PLATFORM_COLORS['Other'];
}

/**
 * Gets the CSS classes for styling category badges
 * POST CATEGORIES MVP - Enhanced with backwards compatibility mapping
 * @param category - The category name or slug
 * @returns CSS class string for styling the category badge
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['general'];
}
