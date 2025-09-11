// VirtuoHub - URL Filters Hook
// React hook that provides easy access to URL-synchronized filtering functionality

import { useURLSync } from '@/lib/url-sync';
import { useFilterStore } from '@/lib/stores/filter-store';
import { urlUtils } from '@/lib/url-sync';
import type { PlatformKey } from '@/types/content';

export interface URLFiltersReturn {
  // Current filter state
  filters: {
    selectedPlatforms: PlatformKey[];
    selectedSubtypes: string[];
    selectedCategories: string[];
    searchQuery: string;
    sortBy: string;
    timeRange: string;
    viewMode: string;
    hasActiveFilters: boolean;
    filterSummary: string;
  };
  
  // Filter actions
  actions: {
    // Platform management
    addPlatform: (platform: PlatformKey) => void;
    removePlatform: (platform: PlatformKey) => void;
    togglePlatform: (platform: PlatformKey) => void;
    clearPlatforms: () => void;
    
    // Content type management
    addSubtype: (subtype: string) => void;
    removeSubtype: (subtype: string) => void;
    toggleSubtype: (subtype: string) => void;
    clearSubtypes: () => void;
    
    // Category management
    addCategory: (category: string) => void;
    removeCategory: (category: string) => void;
    toggleCategory: (category: string) => void;
    clearCategories: () => void;
    
    // Search and sorting
    setSearchQuery: (query: string) => void;
    setSortBy: (sortBy: 'recent' | 'popular' | 'trending' | 'alphabetical') => void;
    setTimeRange: (range: 'all' | '24h' | '7d' | '30d' | '90d') => void;
    setViewMode: (mode: 'card' | 'compact' | 'list') => void;
    
    // Bulk operations
    clearFilters: () => void;
    resetSearch: () => void;
    applyPreset: (preset: 'all' | 'trending' | 'following' | 'saved') => void;
  };
  
  // URL utilities
  url: {
    shareURL: string;
    createPlatformURL: (platform: PlatformKey) => string;
    createSubtypeURL: (subtype: string) => string;
    createSearchURL: (query: string) => string;
  };
  
  // Loading and UI state
  ui: {
    isLoading: boolean;
    loadingStates: {
      feed: boolean;
      posts: boolean;
      polls: boolean;
      saves: boolean;
    };
  };
}

/**
 * Hook that provides URL-synchronized filtering functionality
 * Automatically syncs filter state with URL query parameters
 * @param basePath - Base path for URL generation (defaults to current path)
 */
export function useURLFilters(basePath?: string): URLFiltersReturn {
  // Initialize URL synchronization
  const urlSync = useURLSync();
  
  // Get store functions
  const filterStore = useFilterStore();
  
  // Determine base path for URL generation
  const currentPath = basePath || window.location.pathname;
  
  return {
    // Current filter state
    filters: {
      selectedPlatforms: filterStore.selectedPlatforms,
      selectedSubtypes: filterStore.selectedSubtypes,
      selectedCategories: filterStore.selectedCategories,
      searchQuery: filterStore.searchQuery,
      sortBy: filterStore.sortBy,
      timeRange: filterStore.timeRange,
      viewMode: filterStore.viewMode,
      hasActiveFilters: filterStore.hasActiveFilters(),
      filterSummary: filterStore.getFilterSummary(),
    },
    
    // Filter actions (directly from store)
    actions: {
      // Platform management
      addPlatform: filterStore.addPlatform,
      removePlatform: filterStore.removePlatform,
      togglePlatform: filterStore.togglePlatform,
      clearPlatforms: filterStore.clearPlatforms,
      
      // Content type management
      addSubtype: filterStore.addSubtype,
      removeSubtype: filterStore.removeSubtype,
      toggleSubtype: filterStore.toggleSubtype,
      clearSubtypes: filterStore.clearSubtypes,
      
      // Category management
      addCategory: filterStore.addCategory,
      removeCategory: filterStore.removeCategory,
      toggleCategory: filterStore.toggleCategory,
      clearCategories: filterStore.clearCategories,
      
      // Search and sorting
      setSearchQuery: filterStore.setSearchQuery,
      setSortBy: filterStore.setSortBy,
      setTimeRange: filterStore.setTimeRange,
      setViewMode: filterStore.setViewMode,
      
      // Bulk operations
      clearFilters: urlSync.clearFilters,
      resetSearch: filterStore.resetSearch,
      applyPreset: filterStore.applyPreset,
    },
    
    // URL utilities
    url: {
      shareURL: urlSync.shareURL(),
      createPlatformURL: (platform: PlatformKey) => urlUtils.createPlatformURL(platform, currentPath),
      createSubtypeURL: (subtype: string) => urlUtils.createSubtypeURL(subtype, currentPath),
      createSearchURL: (query: string) => urlUtils.createSearchURL(query, currentPath),
    },
    
    // Loading and UI state (placeholder for now - can be connected to UI store later)
    ui: {
      isLoading: false,
      loadingStates: {
        feed: false,
        posts: false,
        polls: false,
        saves: false,
      },
    },
  };
}

// Convenience hook for platform-specific filtering
export function usePlatformFilter(initialPlatform?: PlatformKey) {
  const { filters, actions, url } = useURLFilters();
  
  return {
    selectedPlatforms: filters.selectedPlatforms,
    isSelected: (platform: PlatformKey) => filters.selectedPlatforms.includes(platform),
    toggle: actions.togglePlatform,
    select: actions.addPlatform,
    deselect: actions.removePlatform,
    clear: actions.clearPlatforms,
    createURL: url.createPlatformURL,
    hasSelection: filters.selectedPlatforms.length > 0,
  };
}

// Convenience hook for content type filtering
export function useSubtypeFilter(initialSubtype?: string) {
  const { filters, actions, url } = useURLFilters();
  
  return {
    selectedSubtypes: filters.selectedSubtypes,
    isSelected: (subtype: string) => filters.selectedSubtypes.includes(subtype),
    toggle: actions.toggleSubtype,
    select: actions.addSubtype,
    deselect: actions.removeSubtype,
    clear: actions.clearSubtypes,
    createURL: url.createSubtypeURL,
    hasSelection: filters.selectedSubtypes.length > 0,
  };
}