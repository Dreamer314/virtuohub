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
export const CATEGORY_COLORS: Record<string, string> = {
  'Assets for Sale': 'bg-primary/20 text-primary border-primary/30',
  'Jobs & Gigs': 'bg-accent/20 text-accent border-accent/30',
  'Collaboration & WIP': 'bg-primary/15 text-primary border-primary/25',
  'General': 'bg-muted/20 text-muted-foreground border-muted/30',
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
 * @param category - The category name
 * @returns CSS class string for styling the category badge
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['General'];
}
