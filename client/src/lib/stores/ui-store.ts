import { create } from 'zustand';

// UI state for modals, sidebars, and ephemeral interface state
export interface UIState {
  // Modal Management
  modals: {
    createPost: {
      isOpen: boolean;
      category?: string;
      platforms?: string[];
    };
    createPoll: {
      isOpen: boolean;
      category?: string;
    };
    imageViewer: {
      isOpen: boolean;
      imageUrl?: string;
      imageAlt?: string;
    };
    methodology: {
      isOpen: boolean;
    };
    signupPrompt: {
      isOpen: boolean;
      trigger?: string;
    };
  };
  
  // Sidebar State
  sidebars: {
    leftCollapsed: boolean;
    rightCollapsed: boolean;
    platformFiltersCollapsed: boolean;
  };
  
  // Toast Notifications
  toasts: Array<{
    id: string;
    title: string;
    description?: string;
    variant: 'default' | 'destructive' | 'success';
    duration?: number;
  }>;
  
  // Loading States
  loading: {
    feed: boolean;
    posts: boolean;
    polls: boolean;
    saves: boolean;
    compose: boolean;
  };
  
  // Navigation State
  navigation: {
    currentSection: 'community' | 'trending' | 'spotlights' | 'interviews' | 'guides' | 'news' | 'lists';
    breadcrumbs: Array<{ label: string; href: string }>;
    activeTab: string;
  };
  
  // Actions - Modal Management
  openCreatePost: (category?: string, platforms?: string[]) => void;
  closeCreatePost: () => void;
  openCreatePoll: (category?: string) => void;
  closeCreatePoll: () => void;
  openImageViewer: (imageUrl: string, imageAlt?: string) => void;
  closeImageViewer: () => void;
  openMethodologyModal: () => void;
  closeMethodologyModal: () => void;
  openSignupPrompt: (trigger?: string) => void;
  closeSignupPrompt: () => void;
  closeAllModals: () => void;
  
  // Actions - Sidebar Management
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  togglePlatformFilters: () => void;
  setLeftSidebarCollapsed: (collapsed: boolean) => void;
  setRightSidebarCollapsed: (collapsed: boolean) => void;
  setPlatformFiltersCollapsed: (collapsed: boolean) => void;
  
  // Actions - Toast Management
  addToast: (toast: Omit<UIState['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Actions - Loading States
  setFeedLoading: (loading: boolean) => void;
  setPostsLoading: (loading: boolean) => void;
  setPollsLoading: (loading: boolean) => void;
  setSavesLoading: (loading: boolean) => void;
  setComposeLoading: (loading: boolean) => void;
  clearAllLoading: () => void;
  
  // Actions - Navigation
  setCurrentSection: (section: UIState['navigation']['currentSection']) => void;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href: string }>) => void;
  addBreadcrumb: (breadcrumb: { label: string; href: string }) => void;
  setActiveTab: (tab: string) => void;
  
  // Computed helpers
  hasOpenModals: () => boolean;
  getActiveToasts: () => UIState['toasts'];
  isLoading: () => boolean;
}

const defaultModals = {
  createPost: { isOpen: false },
  createPoll: { isOpen: false },
  imageViewer: { isOpen: false },
  methodology: { isOpen: false },
  signupPrompt: { isOpen: false },
};

const defaultSidebars = {
  leftCollapsed: false,
  rightCollapsed: false,
  platformFiltersCollapsed: false,
};

const defaultLoading = {
  feed: false,
  posts: false,
  polls: false,
  saves: false,
  compose: false,
};

const defaultNavigation = {
  currentSection: 'community' as const,
  breadcrumbs: [],
  activeTab: 'all',
};

export const useUIStore = create<UIState>((set, get) => ({
  modals: defaultModals,
  sidebars: defaultSidebars,
  toasts: [],
  loading: defaultLoading,
  navigation: defaultNavigation,

  // Modal Management
  openCreatePost: (category, platforms) => set((state) => ({
    modals: {
      ...state.modals,
      createPost: { isOpen: true, category, platforms }
    }
  })),
  
  closeCreatePost: () => set((state) => ({
    modals: {
      ...state.modals,
      createPost: { isOpen: false }
    }
  })),
  
  openCreatePoll: (category) => set((state) => ({
    modals: {
      ...state.modals,
      createPoll: { isOpen: true, category }
    }
  })),
  
  closeCreatePoll: () => set((state) => ({
    modals: {
      ...state.modals,
      createPoll: { isOpen: false }
    }
  })),
  
  openImageViewer: (imageUrl, imageAlt) => set((state) => ({
    modals: {
      ...state.modals,
      imageViewer: { isOpen: true, imageUrl, imageAlt }
    }
  })),
  
  closeImageViewer: () => set((state) => ({
    modals: {
      ...state.modals,
      imageViewer: { isOpen: false }
    }
  })),
  
  openMethodologyModal: () => set((state) => ({
    modals: {
      ...state.modals,
      methodology: { isOpen: true }
    }
  })),
  
  closeMethodologyModal: () => set((state) => ({
    modals: {
      ...state.modals,
      methodology: { isOpen: false }
    }
  })),
  
  openSignupPrompt: (trigger) => set((state) => ({
    modals: {
      ...state.modals,
      signupPrompt: { isOpen: true, trigger }
    }
  })),
  
  closeSignupPrompt: () => set((state) => ({
    modals: {
      ...state.modals,
      signupPrompt: { isOpen: false }
    }
  })),
  
  closeAllModals: () => set({ modals: defaultModals }),

  // Sidebar Management
  toggleLeftSidebar: () => set((state) => ({
    sidebars: {
      ...state.sidebars,
      leftCollapsed: !state.sidebars.leftCollapsed
    }
  })),
  
  toggleRightSidebar: () => set((state) => ({
    sidebars: {
      ...state.sidebars,
      rightCollapsed: !state.sidebars.rightCollapsed
    }
  })),
  
  togglePlatformFilters: () => set((state) => ({
    sidebars: {
      ...state.sidebars,
      platformFiltersCollapsed: !state.sidebars.platformFiltersCollapsed
    }
  })),
  
  setLeftSidebarCollapsed: (collapsed) => set((state) => ({
    sidebars: {
      ...state.sidebars,
      leftCollapsed: collapsed
    }
  })),
  
  setRightSidebarCollapsed: (collapsed) => set((state) => ({
    sidebars: {
      ...state.sidebars,
      rightCollapsed: collapsed
    }
  })),
  
  setPlatformFiltersCollapsed: (collapsed) => set((state) => ({
    sidebars: {
      ...state.sidebars,
      platformFiltersCollapsed: collapsed
    }
  })),

  // Toast Management
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }));
    
    // Auto-remove toast after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(toast => toast.id !== id)
  })),
  
  clearToasts: () => set({ toasts: [] }),

  // Loading States
  setFeedLoading: (loading) => set((state) => ({
    loading: { ...state.loading, feed: loading }
  })),
  
  setPostsLoading: (loading) => set((state) => ({
    loading: { ...state.loading, posts: loading }
  })),
  
  setPollsLoading: (loading) => set((state) => ({
    loading: { ...state.loading, polls: loading }
  })),
  
  setSavesLoading: (loading) => set((state) => ({
    loading: { ...state.loading, saves: loading }
  })),
  
  setComposeLoading: (loading) => set((state) => ({
    loading: { ...state.loading, compose: loading }
  })),
  
  clearAllLoading: () => set({ loading: defaultLoading }),

  // Navigation
  setCurrentSection: (section) => set((state) => ({
    navigation: { ...state.navigation, currentSection: section }
  })),
  
  setBreadcrumbs: (breadcrumbs) => set((state) => ({
    navigation: { ...state.navigation, breadcrumbs }
  })),
  
  addBreadcrumb: (breadcrumb) => set((state) => ({
    navigation: {
      ...state.navigation,
      breadcrumbs: [...state.navigation.breadcrumbs, breadcrumb]
    }
  })),
  
  setActiveTab: (tab) => set((state) => ({
    navigation: { ...state.navigation, activeTab: tab }
  })),

  // Computed helpers
  hasOpenModals: () => {
    const { modals } = get();
    return Object.values(modals).some(modal => modal.isOpen);
  },
  
  getActiveToasts: () => {
    return get().toasts;
  },
  
  isLoading: () => {
    const { loading } = get();
    return Object.values(loading).some(state => state === true);
  },
}));