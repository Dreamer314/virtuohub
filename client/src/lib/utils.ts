import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Platform color constants
export const PLATFORM_COLORS: Record<string, string> = {
  'VRChat': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  'Roblox': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
  'Second Life': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  'IMVU': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
  'GTA RP': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  'The Sims': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200',
  'Other': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
};

// Category color constants
export const CATEGORY_COLORS: Record<string, string> = {
  'Assets for Sale': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  'Jobs & Gigs': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
  'Collaboration & WIP': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  'General': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
};

// Time formatting utility
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

// Platform and category helper functions
export function getPlatformColor(platform: string): string {
  return PLATFORM_COLORS[platform] || PLATFORM_COLORS['Other'];
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['General'];
}
