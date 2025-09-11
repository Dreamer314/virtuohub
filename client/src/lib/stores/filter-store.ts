import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlatformKey } from '@/types/content';

// Content filtering and search state
export interface FilterState {
  // Platform Filtering
  selectedPlatforms: PlatformKey[];
  platformFilterMode: 'any' | 'all'; // Match any platform or all platforms
  
  // Content Type Filtering  
  selectedSubtypes: string[];
  subtypeFilterMode: 'any' | 'all';
  
  // Category Filtering
  selectedCategories: string[];
  
  // Search & Sorting
  searchQuery: string;
  sortBy: 'recent' | 'popular' | 'trending' | 'alphabetical';
  sortDirection: 'asc' | 'desc';
  
  // Content Preferences
  showPulsePolls: boolean;
  showSpotlights: boolean;
  showEvents: boolean;
  hideReadPosts: boolean;
  onlyShowSavedPosts: boolean;
  
  // Time Filtering
  timeRange: 'all' | '24h' | '7d' | '30d' | '90d';
  
  // View Options
  viewMode: 'card' | 'compact' | 'list';
  postsPerPage: number;
  
  // Actions - Platform Management
  addPlatform: (platform: PlatformKey) => void;
  removePlatform: (platform: PlatformKey) => void;
  togglePlatform: (platform: PlatformKey) => void;
  clearPlatforms: () => void;
  setPlatformFilterMode: (mode: 'any' | 'all') => void;
  
  // Actions - Content Type Management
  addSubtype: (subtype: string) => void;
  removeSubtype: (subtype: string) => void;
  toggleSubtype: (subtype: string) => void;
  clearSubtypes: () => void;
  setSubtypeFilterMode: (mode: 'any' | 'all') => void;
  
  // Actions - Category Management
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  toggleCategory: (category: string) => void;
  clearCategories: () => void;
  
  // Actions - Search & Sort
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'recent' | 'popular' | 'trending' | 'alphabetical') => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  
  // Actions - Content Preferences  
  togglePulsePolls: () => void;
  toggleSpotlights: () => void;
  toggleEvents: () => void;
  toggleHideReadPosts: () => void;
  toggleOnlyShowSavedPosts: () => void;
  
  // Actions - Time & View
  setTimeRange: (range: 'all' | '24h' | '7d' | '30d' | '90d') => void;
  setViewMode: (mode: 'card' | 'compact' | 'list') => void;
  setPostsPerPage: (count: number) => void;
  
  // Actions - Reset & Presets
  resetFilters: () => void;
  resetSearch: () => void;
  applyPreset: (preset: 'all' | 'trending' | 'following' | 'saved') => void;
  
  // Computed helpers
  hasActiveFilters: () => boolean;
  getFilterSummary: () => string;
}

const defaultState = {
  selectedPlatforms: [] as PlatformKey[],
  platformFilterMode: 'any' as const,
  selectedSubtypes: [],
  subtypeFilterMode: 'any' as const,
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
  postsPerPage: 20,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // Platform Management
      addPlatform: (platform) => set((state) => ({
        selectedPlatforms: Array.from(new Set([...state.selectedPlatforms, platform]))
      })),
      
      removePlatform: (platform) => set((state) => ({
        selectedPlatforms: state.selectedPlatforms.filter(p => p !== platform)
      })),
      
      togglePlatform: (platform) => {
        const { selectedPlatforms } = get();
        if (selectedPlatforms.includes(platform)) {
          get().removePlatform(platform);
        } else {
          get().addPlatform(platform);
        }
      },
      
      clearPlatforms: () => set({ selectedPlatforms: [] }),
      
      setPlatformFilterMode: (mode) => set({ platformFilterMode: mode }),

      // Content Type Management
      addSubtype: (subtype) => set((state) => ({
        selectedSubtypes: Array.from(new Set([...state.selectedSubtypes, subtype]))
      })),
      
      removeSubtype: (subtype) => set((state) => ({
        selectedSubtypes: state.selectedSubtypes.filter(s => s !== subtype)
      })),
      
      toggleSubtype: (subtype) => {
        const { selectedSubtypes } = get();
        if (selectedSubtypes.includes(subtype)) {
          get().removeSubtype(subtype);
        } else {
          get().addSubtype(subtype);
        }
      },
      
      clearSubtypes: () => set({ selectedSubtypes: [] }),
      
      setSubtypeFilterMode: (mode) => set({ subtypeFilterMode: mode }),

      // Category Management
      addCategory: (category) => set((state) => ({
        selectedCategories: Array.from(new Set([...state.selectedCategories, category]))
      })),
      
      removeCategory: (category) => set((state) => ({
        selectedCategories: state.selectedCategories.filter(c => c !== category)
      })),
      
      toggleCategory: (category) => {
        const { selectedCategories } = get();
        if (selectedCategories.includes(category)) {
          get().removeCategory(category);
        } else {
          get().addCategory(category);
        }
      },
      
      clearCategories: () => set({ selectedCategories: [] }),

      // Search & Sort
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortDirection: (direction) => set({ sortDirection: direction }),

      // Content Preferences
      togglePulsePolls: () => set((state) => ({ showPulsePolls: !state.showPulsePolls })),
      toggleSpotlights: () => set((state) => ({ showSpotlights: !state.showSpotlights })),
      toggleEvents: () => set((state) => ({ showEvents: !state.showEvents })),
      toggleHideReadPosts: () => set((state) => ({ hideReadPosts: !state.hideReadPosts })),
      toggleOnlyShowSavedPosts: () => set((state) => ({ onlyShowSavedPosts: !state.onlyShowSavedPosts })),

      // Time & View
      setTimeRange: (range) => set({ timeRange: range }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setPostsPerPage: (count) => set({ postsPerPage: count }),

      // Reset & Presets
      resetFilters: () => set({
        selectedPlatforms: [],
        selectedSubtypes: [],
        selectedCategories: [],
        platformFilterMode: 'any',
        subtypeFilterMode: 'any',
        timeRange: 'all',
        showPulsePolls: true,
        showSpotlights: true,
        showEvents: true,
        hideReadPosts: false,
        onlyShowSavedPosts: false,
      }),
      
      resetSearch: () => set({
        searchQuery: '',
        sortBy: 'recent',
        sortDirection: 'desc',
      }),
      
      applyPreset: (preset) => {
        switch (preset) {
          case 'all':
            get().resetFilters();
            break;
          case 'trending':
            set({
              ...defaultState,
              sortBy: 'trending',
              timeRange: '7d',
            });
            break;
          case 'following':
            set({
              ...defaultState,
              // Would filter by followed creators in real implementation
            });
            break;
          case 'saved':
            set({
              ...defaultState,
              onlyShowSavedPosts: true,
            });
            break;
        }
      },

      // Computed helpers
      hasActiveFilters: () => {
        const state = get();
        return (
          state.selectedPlatforms.length > 0 ||
          state.selectedSubtypes.length > 0 ||
          state.selectedCategories.length > 0 ||
          state.searchQuery.length > 0 ||
          state.timeRange !== 'all' ||
          state.hideReadPosts ||
          state.onlyShowSavedPosts ||
          !state.showPulsePolls ||
          !state.showSpotlights ||
          !state.showEvents
        );
      },
      
      getFilterSummary: () => {
        const state = get();
        const parts = [];
        
        if (state.selectedPlatforms.length > 0) {
          parts.push(`${state.selectedPlatforms.length} platform${state.selectedPlatforms.length > 1 ? 's' : ''}`);
        }
        if (state.selectedSubtypes.length > 0) {
          parts.push(`${state.selectedSubtypes.length} type${state.selectedSubtypes.length > 1 ? 's' : ''}`);
        }
        if (state.selectedCategories.length > 0) {
          parts.push(`${state.selectedCategories.length} categor${state.selectedCategories.length > 1 ? 'ies' : 'y'}`);
        }
        if (state.searchQuery) {
          parts.push(`search: "${state.searchQuery}"`);
        }
        if (state.timeRange !== 'all') {
          parts.push(`last ${state.timeRange}`);
        }
        
        return parts.length > 0 ? parts.join(', ') : 'No filters active';
      },
    }),
    {
      name: 'vh-filter-state',
      partialize: (state) => ({
        selectedPlatforms: state.selectedPlatforms,
        platformFilterMode: state.platformFilterMode,
        selectedSubtypes: state.selectedSubtypes,
        subtypeFilterMode: state.subtypeFilterMode,
        selectedCategories: state.selectedCategories,
        sortBy: state.sortBy,
        sortDirection: state.sortDirection,
        showPulsePolls: state.showPulsePolls,
        showSpotlights: state.showSpotlights,
        showEvents: state.showEvents,
        hideReadPosts: state.hideReadPosts,
        timeRange: state.timeRange,
        viewMode: state.viewMode,
        postsPerPage: state.postsPerPage,
      }),
    }
  )
);