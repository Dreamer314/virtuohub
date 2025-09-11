// VirtuoHub - URL Query Parameter Synchronization
// Sync Zustand filter state with URL query parameters for shareable and persistent filtering

import { useFilterStore } from './stores/filter-store';
import { useLocation } from 'wouter';
import { useEffect, useCallback } from 'react';
import type { PlatformKey } from '@/types/content';

// URL Query Parameter Keys
const URL_KEYS = {
  platforms: 'platform',
  subtypes: 'subtype', 
  categories: 'category',
  search: 'q',
  sortBy: 'sort',
  sortDirection: 'dir',
  timeRange: 'time',
  viewMode: 'view',
  showPulsePolls: 'polls',
  showSpotlights: 'spotlights',
  showEvents: 'events',
  hideReadPosts: 'hideRead',
  onlyShowSavedPosts: 'saved',
  platformFilterMode: 'platformMode',
  subtypeFilterMode: 'subtypeMode',
} as const;

// URL Value Mappings for boolean and enum values
const URL_VALUE_MAPPINGS = {
  boolean: {
    true: '1',
    false: '0',
  },
  sortBy: {
    recent: 'recent',
    popular: 'popular', 
    trending: 'trending',
    alphabetical: 'alpha',
  },
  sortDirection: {
    asc: 'asc',
    desc: 'desc',
  },
  viewMode: {
    card: 'card',
    compact: 'compact',
    list: 'list',
  },
  timeRange: {
    all: 'all',
    '24h': '24h',
    '7d': '7d',
    '30d': '30d',
    '90d': '90d',
  },
  filterMode: {
    any: 'any',
    all: 'all',
  },
} as const;

// Serialize state to URL query parameters
export function serializeStateToURL(state: ReturnType<typeof useFilterStore.getState>): URLSearchParams {
  const params = new URLSearchParams();
  
  // Platform filtering - support multiple platforms
  if (state.selectedPlatforms.length > 0) {
    state.selectedPlatforms.forEach(platform => {
      params.append(URL_KEYS.platforms, platform);
    });
    if (state.platformFilterMode !== 'any') {
      params.set(URL_KEYS.platformFilterMode, URL_VALUE_MAPPINGS.filterMode[state.platformFilterMode]);
    }
  }
  
  // Content type filtering - support multiple subtypes
  if (state.selectedSubtypes.length > 0) {
    state.selectedSubtypes.forEach(subtype => {
      params.append(URL_KEYS.subtypes, subtype);
    });
    if (state.subtypeFilterMode !== 'any') {
      params.set(URL_KEYS.subtypeFilterMode, URL_VALUE_MAPPINGS.filterMode[state.subtypeFilterMode]);
    }
  }
  
  // Category filtering - support multiple categories
  if (state.selectedCategories.length > 0) {
    state.selectedCategories.forEach(category => {
      params.append(URL_KEYS.categories, category);
    });
  }
  
  // Search query
  if (state.searchQuery.trim()) {
    params.set(URL_KEYS.search, state.searchQuery.trim());
  }
  
  // Sorting
  if (state.sortBy !== 'recent') {
    params.set(URL_KEYS.sortBy, URL_VALUE_MAPPINGS.sortBy[state.sortBy]);
  }
  if (state.sortDirection !== 'desc') {
    params.set(URL_KEYS.sortDirection, URL_VALUE_MAPPINGS.sortDirection[state.sortDirection]);
  }
  
  // Time range
  if (state.timeRange !== 'all') {
    params.set(URL_KEYS.timeRange, URL_VALUE_MAPPINGS.timeRange[state.timeRange]);
  }
  
  // View mode
  if (state.viewMode !== 'card') {
    params.set(URL_KEYS.viewMode, URL_VALUE_MAPPINGS.viewMode[state.viewMode]);
  }
  
  // Content preferences (only set if different from defaults)
  if (!state.showPulsePolls) {
    params.set(URL_KEYS.showPulsePolls, URL_VALUE_MAPPINGS.boolean.false);
  }
  if (!state.showSpotlights) {
    params.set(URL_KEYS.showSpotlights, URL_VALUE_MAPPINGS.boolean.false);
  }
  if (!state.showEvents) {
    params.set(URL_KEYS.showEvents, URL_VALUE_MAPPINGS.boolean.false);
  }
  if (state.hideReadPosts) {
    params.set(URL_KEYS.hideReadPosts, URL_VALUE_MAPPINGS.boolean.true);
  }
  if (state.onlyShowSavedPosts) {
    params.set(URL_KEYS.onlyShowSavedPosts, URL_VALUE_MAPPINGS.boolean.true);
  }
  
  return params;
}

// Parse URL query parameters to state
export function parseURLToState(searchParams: URLSearchParams) {
  const state: Partial<ReturnType<typeof useFilterStore.getState>> = {};
  
  // Platform filtering
  const platforms = searchParams.getAll(URL_KEYS.platforms) as PlatformKey[];
  if (platforms.length > 0) {
    state.selectedPlatforms = platforms;
  }
  
  const platformMode = searchParams.get(URL_KEYS.platformFilterMode);
  if (platformMode === 'all') {
    state.platformFilterMode = 'all';
  }
  
  // Content type filtering
  const subtypes = searchParams.getAll(URL_KEYS.subtypes);
  if (subtypes.length > 0) {
    state.selectedSubtypes = subtypes;
  }
  
  const subtypeMode = searchParams.get(URL_KEYS.subtypeFilterMode);
  if (subtypeMode === 'all') {
    state.subtypeFilterMode = 'all';
  }
  
  // Category filtering
  const categories = searchParams.getAll(URL_KEYS.categories);
  if (categories.length > 0) {
    state.selectedCategories = categories;
  }
  
  // Search query
  const searchQuery = searchParams.get(URL_KEYS.search);
  if (searchQuery) {
    state.searchQuery = searchQuery;
  }
  
  // Sorting
  const sortBy = searchParams.get(URL_KEYS.sortBy);
  if (sortBy) {
    const sortByKey = Object.keys(URL_VALUE_MAPPINGS.sortBy).find(
      key => URL_VALUE_MAPPINGS.sortBy[key as keyof typeof URL_VALUE_MAPPINGS.sortBy] === sortBy
    ) as keyof typeof URL_VALUE_MAPPINGS.sortBy;
    if (sortByKey) {
      state.sortBy = sortByKey;
    }
  }
  
  const sortDirection = searchParams.get(URL_KEYS.sortDirection);
  if (sortDirection && (sortDirection === 'asc' || sortDirection === 'desc')) {
    state.sortDirection = sortDirection;
  }
  
  // Time range
  const timeRange = searchParams.get(URL_KEYS.timeRange);
  if (timeRange) {
    const timeRangeKey = Object.keys(URL_VALUE_MAPPINGS.timeRange).find(
      key => URL_VALUE_MAPPINGS.timeRange[key as keyof typeof URL_VALUE_MAPPINGS.timeRange] === timeRange
    ) as keyof typeof URL_VALUE_MAPPINGS.timeRange;
    if (timeRangeKey) {
      state.timeRange = timeRangeKey;
    }
  }
  
  // View mode
  const viewMode = searchParams.get(URL_KEYS.viewMode);
  if (viewMode) {
    const viewModeKey = Object.keys(URL_VALUE_MAPPINGS.viewMode).find(
      key => URL_VALUE_MAPPINGS.viewMode[key as keyof typeof URL_VALUE_MAPPINGS.viewMode] === viewMode
    ) as keyof typeof URL_VALUE_MAPPINGS.viewMode;
    if (viewModeKey) {
      state.viewMode = viewModeKey;
    }
  }
  
  // Content preferences
  const parseBooleanParam = (value: string | null): boolean | undefined => {
    if (value === URL_VALUE_MAPPINGS.boolean.true) return true;
    if (value === URL_VALUE_MAPPINGS.boolean.false) return false;
    return undefined;
  };
  
  const showPulsePolls = parseBooleanParam(searchParams.get(URL_KEYS.showPulsePolls));
  if (showPulsePolls !== undefined) state.showPulsePolls = showPulsePolls;
  
  const showSpotlights = parseBooleanParam(searchParams.get(URL_KEYS.showSpotlights));
  if (showSpotlights !== undefined) state.showSpotlights = showSpotlights;
  
  const showEvents = parseBooleanParam(searchParams.get(URL_KEYS.showEvents));
  if (showEvents !== undefined) state.showEvents = showEvents;
  
  const hideReadPosts = parseBooleanParam(searchParams.get(URL_KEYS.hideReadPosts));
  if (hideReadPosts !== undefined) state.hideReadPosts = hideReadPosts;
  
  const onlyShowSavedPosts = parseBooleanParam(searchParams.get(URL_KEYS.onlyShowSavedPosts));
  if (onlyShowSavedPosts !== undefined) state.onlyShowSavedPosts = onlyShowSavedPosts;
  
  return state;
}

// Hook for URL synchronization
export function useURLSync() {
  const [location, setLocation] = useLocation();
  const filterState = useFilterStore();
  
  // Initialize state from URL on mount and location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.includes('?') ? location.split('?')[1] : '');
    const urlState = parseURLToState(searchParams);
    
    // Apply URL state to store using proper Zustand setState
    if (Object.keys(urlState).length > 0) {
      // Reset to defaults first, then apply URL state using Zustand's setState
      useFilterStore.setState((state) => ({
        ...state,
        // Reset to defaults first
        selectedPlatforms: [],
        selectedSubtypes: [],
        selectedCategories: [],
        searchQuery: '',
        sortBy: 'recent' as const,
        sortDirection: 'desc' as const,
        showPulsePolls: true,
        showSpotlights: true,
        showEvents: true,
        hideReadPosts: false,
        onlyShowSavedPosts: false,
        timeRange: 'all' as const,
        viewMode: 'card' as const,
        platformFilterMode: 'any' as const,
        subtypeFilterMode: 'any' as const,
        // Then apply URL state
        ...urlState,
      }), true); // Replace entire state to trigger subscribers
    }
  }, [location]); // React to location changes for back/forward navigation
  
  // Update URL when state changes
  const updateURL = useCallback(() => {
    const currentState = useFilterStore.getState();
    const params = serializeStateToURL(currentState);
    const queryString = params.toString();
    
    const basePath = location.split('?')[0];
    const newURL = queryString ? `${basePath}?${queryString}` : basePath;
    const currentURL = location;
    
    // Only update if URL has actually changed to prevent loops
    if (newURL !== currentURL) {
      // Use replace to avoid spamming browser history
      setLocation(newURL, { replace: true });
    }
  }, [location, setLocation]);
  
  // Subscribe to filter store changes
  useEffect(() => {
    const unsubscribe = useFilterStore.subscribe((state, prevState) => {
      // Check if relevant filtering state has changed
      const relevantKeys = [
        'selectedPlatforms', 'selectedSubtypes', 'selectedCategories',
        'searchQuery', 'sortBy', 'sortDirection', 'timeRange', 'viewMode',
        'showPulsePolls', 'showSpotlights', 'showEvents', 
        'hideReadPosts', 'onlyShowSavedPosts',
        'platformFilterMode', 'subtypeFilterMode'
      ];
      
      const hasChanged = relevantKeys.some(key => 
        JSON.stringify(state[key as keyof typeof state]) !== 
        JSON.stringify(prevState[key as keyof typeof prevState])
      );
      
      if (hasChanged) {
        updateURL();
      }
    });
    
    return unsubscribe;
  }, [updateURL]);
  
  return {
    // Utility functions for components
    clearFilters: () => {
      useFilterStore.getState().resetFilters();
      setLocation(location.split('?')[0], { replace: true });
    },
    
    shareURL: () => {
      const currentState = useFilterStore.getState();
      const params = serializeStateToURL(currentState);
      const queryString = params.toString();
      const basePath = window.location.origin + location.split('?')[0];
      return queryString ? `${basePath}?${queryString}` : basePath;
    },
    
    hasFilters: useFilterStore.getState().hasActiveFilters(),
    filterSummary: useFilterStore.getState().getFilterSummary(),
  };
}

// Quick access functions for common URL operations
export const urlUtils = {
  // Create a URL for specific platform filtering
  createPlatformURL: (platform: PlatformKey, basePath = '/community') => {
    const params = new URLSearchParams();
    params.set(URL_KEYS.platforms, platform);
    return `${basePath}?${params.toString()}`;
  },
  
  // Create a URL for specific content type filtering
  createSubtypeURL: (subtype: string, basePath = '/community') => {
    const params = new URLSearchParams();
    params.set(URL_KEYS.subtypes, subtype);
    return `${basePath}?${params.toString()}`;
  },
  
  // Create a URL for search
  createSearchURL: (query: string, basePath = '/community') => {
    const params = new URLSearchParams();
    params.set(URL_KEYS.search, query);
    return `${basePath}?${params.toString()}`;
  },
  
  // Parse current filters from any URL
  parseFiltersFromURL: (url: string) => {
    const urlObj = new URL(url, window.location.origin);
    return parseURLToState(urlObj.searchParams);
  },
};