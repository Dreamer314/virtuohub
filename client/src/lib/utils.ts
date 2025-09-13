import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Platform color constants - comprehensive platform support with consistent styling
export const PLATFORM_COLORS: Record<string, string> = {
  'Roblox': 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20',
  'VRChat': 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20',
  'Second Life': 'bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20',
  'IMVU': 'bg-pink-500/10 text-pink-600 border-pink-500/20 hover:bg-pink-500/20',
  'Meta Horizon Worlds': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:bg-cyan-500/20',
  'Unity': 'bg-gray-500/10 text-gray-600 border-gray-500/20 hover:bg-gray-500/20',
  'Unreal Engine': 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20',
  'Core': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20',
  'Dreams': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20',
  'Fortnite Creative': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20',
  'Minecraft': 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
  'GTA FiveM': 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20',
  'GTA RP': 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20',
  'The Sims': 'bg-teal-500/10 text-teal-600 border-teal-500/20 hover:bg-teal-500/20',
  'inZOI': 'bg-violet-500/10 text-violet-600 border-violet-500/20 hover:bg-violet-500/20',
  'Elder Scrolls Online': 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20',
  'Fallout': 'bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20',
  'Counter-Strike': 'bg-red-600/10 text-red-700 border-red-600/20 hover:bg-red-600/20',
  'Team Fortress 2': 'bg-orange-600/10 text-orange-700 border-orange-600/20 hover:bg-orange-600/20',
  'Blender': 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20',
  'Other': 'bg-vh-accent1-light text-vh-accent1 border-vh-accent1/20 hover:bg-vh-accent1/10',
};

/**
 * Get a display name for a user profile with safe fallbacks
 * The backend already handles email fallback in profile creation, so missing displayName is rare
 */
export function getDisplayName(profile?: { id?: string; displayName?: string | null } | null, fallbackName = 'User'): string {
  if (!profile) {
    return fallbackName;
  }
  
  if (profile.displayName?.trim()) {
    return profile.displayName.trim();
  }
  
  // Backend should have set displayName to email during profile creation,
  // but if somehow it's missing, return fallback
  return fallbackName;
}

/**
 * Get avatar URL with fallback
 */
export function getAvatarUrl(profile?: { avatarUrl?: string | null } | null, defaultUrl = '/images/vr-creator.png'): string {
  return profile?.avatarUrl || defaultUrl;
}

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
 * Formats a date string into a localized absolute date
 * @param dateISO - The ISO date string to format
 * @param options - Optional formatting options
 * @returns A formatted date string like "January 15, 2024"
 */
export function formatAbsoluteDate(dateISO: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateISO);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options || defaultOptions);
}

/**
 * Formats a date for short display (e.g., "Jan 15, 2024")
 * @param dateISO - The ISO date string to format
 * @returns A short formatted date string
 */
export function formatShortDate(dateISO: string): string {
  const date = new Date(dateISO);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats a view count number into a human-readable string
 * @param views - The number of views
 * @returns A formatted string like "1.2K views" or "3.4M views"
 */
export function formatViews(views: number): string {
  if (!views || views === 0) return '0 views';
  if (views === 1) return '1 view';
  if (views < 1000) return `${views} views`;
  if (views < 1000000) return `${(views / 1000).toFixed(1)}K views`;
  return `${(views / 1000000).toFixed(1)}M views`;
}

/**
 * Formats a number for display (without the "views" suffix)
 * @param num - The number to format
 * @returns A formatted string like "1.2K" or "3.4M"
 */
export function formatNumber(num: number): string {
  if (!num || num === 0) return '0';
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
}

/**
 * Prevents widow words by replacing the last space with a non-breaking space
 * @param text - The text to process
 * @returns Text with non-breaking space before the last word
 */
export function noWidow(text: string): string {
  return text.replace(/\s+(\S+)$/, '\u00A0$1');
}

/**
 * Creates a generic chip/pill styling function for consistent UI components
 * @param isActive - Whether the chip is in active state
 * @param variant - The visual variant ('default' | 'accent' | 'muted')
 * @returns CSS class string for chip styling
 */
export function getChipClasses(isActive: boolean, variant: 'default' | 'accent' | 'muted' = 'default'): string {
  const baseClasses = 'px-3 py-1.5 rounded-full text-sm transition-colors ring-1 ring-border/50';
  
  if (isActive) {
    const activeVariants = {
      default: 'bg-accent/15 text-accent ring-accent/40',
      accent: 'bg-primary/15 text-primary ring-primary/40',
      muted: 'bg-muted text-muted-foreground ring-muted-foreground/40'
    };
    return `${baseClasses} ${activeVariants[variant]}`;
  }
  
  return `${baseClasses} bg-surface/80 text-foreground/80 hover:bg-surface/90`;
}

/**
 * Gets the CSS classes for styling platform badges
 * @param platform - The platform name
 * @returns CSS class string for styling the platform badge
 */
export function getPlatformColor(platform: string): string {
  return PLATFORM_COLORS[platform] || PLATFORM_COLORS['Other'];
}

// Content type colors for featured content, articles, and editorial content
export const CONTENT_TYPE_COLORS: Record<string, string> = {
  'Interview': 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Industry News': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Tips & Guides': 'bg-green-500/20 text-green-300 border border-green-500/30',
  'Spotlight': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  'Pulse Report': 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  'Event': 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
  'Tutorial': 'bg-green-500/20 text-green-300 border border-green-500/30',
  'News': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Report': 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  'Article': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  'default': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
};

/**
 * Gets the CSS classes for styling category badges
 * POST CATEGORIES MVP - Enhanced with backwards compatibility mapping
 * @param category - The category name or slug
 * @returns CSS class string for styling the category badge
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['general'];
}

/**
 * Gets the CSS classes for styling content type chips (Interview, News, etc.)
 * @param contentType - The content type name
 * @returns CSS class string for styling the content type chip
 */
export function getContentTypeColor(contentType: string): string {
  return CONTENT_TYPE_COLORS[contentType] || CONTENT_TYPE_COLORS['default'];
}
