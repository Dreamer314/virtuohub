import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Central application state for user preferences and global settings
export interface AppState {
  // User Preferences
  currentUser: string;
  preferredPlatforms: string[];
  
  // Content Preferences  
  showNSFWContent: boolean;
  preferredContentLanguage: string;
  autoplayVideos: boolean;
  compactMode: boolean;
  
  // Engagement Settings
  engagementNotifications: boolean;
  emailNotifications: boolean;
  
  // Pro/Premium Features
  isProUser: boolean;
  proFeatures: string[];
  
  // Actions
  setCurrentUser: (userId: string) => void;
  setPreferredPlatforms: (platforms: string[]) => void;
  toggleNSFWContent: () => void;
  setContentLanguage: (language: string) => void;
  toggleAutoplayVideos: () => void;
  toggleCompactMode: () => void;
  toggleEngagementNotifications: () => void;
  toggleEmailNotifications: () => void;
  setProStatus: (isProUser: boolean, features?: string[]) => void;
  resetPreferences: () => void;
}

const defaultState = {
  currentUser: 'user1',
  preferredPlatforms: [],
  showNSFWContent: false,
  preferredContentLanguage: 'en',
  autoplayVideos: true,
  compactMode: false,
  engagementNotifications: true,
  emailNotifications: true,
  isProUser: false,
  proFeatures: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setCurrentUser: (userId) => set({ currentUser: userId }),
      
      setPreferredPlatforms: (platforms) => set({ preferredPlatforms: platforms }),
      
      toggleNSFWContent: () => set((state) => ({ showNSFWContent: !state.showNSFWContent })),
      
      setContentLanguage: (language) => set({ preferredContentLanguage: language }),
      
      toggleAutoplayVideos: () => set((state) => ({ autoplayVideos: !state.autoplayVideos })),
      
      toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
      
      toggleEngagementNotifications: () => set((state) => ({ 
        engagementNotifications: !state.engagementNotifications 
      })),
      
      toggleEmailNotifications: () => set((state) => ({ 
        emailNotifications: !state.emailNotifications 
      })),
      
      setProStatus: (isProUser, features = []) => set({ 
        isProUser, 
        proFeatures: features 
      }),
      
      resetPreferences: () => set(defaultState),
    }),
    {
      name: 'vh-app-state',
      partialize: (state) => ({
        currentUser: state.currentUser,
        preferredPlatforms: state.preferredPlatforms,
        showNSFWContent: state.showNSFWContent,
        preferredContentLanguage: state.preferredContentLanguage,
        autoplayVideos: state.autoplayVideos,
        compactMode: state.compactMode,
        engagementNotifications: state.engagementNotifications,
        emailNotifications: state.emailNotifications,
        isProUser: state.isProUser,
        proFeatures: state.proFeatures,
      }),
    }
  )
);