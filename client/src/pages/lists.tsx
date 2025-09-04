import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { type ListType, type VoiceTag, type Platform, type ListMeta } from '@/types/lists';
import { getLists } from '@/lib/data/lists';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { ListFilters } from '@/components/lists/ListFilters';
import { ListGrid } from '@/components/lists/ListGrid';
import { VHubChartsSection } from '@/components/charts/VHubChartsSection';
import { Button } from '@/components/ui/button';

// URL param utilities
const useURLParams = () => {
  const [location, navigate] = useLocation();
  
  const updateParams = useCallback((updates: Record<string, string | string[] | undefined>) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });
    
    const newSearch = params.toString();
    const newPath = `/community/lists${newSearch ? `?${newSearch}` : ''}`;
    navigate(newPath);
  }, [navigate]);
  
  const getParams = useCallback(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    return {
      type: params.get('type') as ListType | undefined,
      voices: params.getAll('voices') as VoiceTag[],
      platforms: params.getAll('platforms') as Platform[],
      sort: params.get('sort') || 'recent',
      page: parseInt(params.get('page') || '1')
    };
  }, [location]);
  
  return { updateParams, getParams };
};

const ListsPage: React.FC = () => {
  const { updateParams, getParams } = useURLParams();
  const [showMethodology, setShowMethodology] = useState(false);
  const [showSuggestUpdate, setShowSuggestUpdate] = useState(false);
  
  // Get current filters from URL
  const currentParams = getParams();
  
  
  // Fetch lists with current filters
  const { data: listsData, isLoading: listsLoading, error } = useQuery({
    queryKey: ['lists', currentParams],
    queryFn: () => getLists({
      type: currentParams.type,
      voices: currentParams.voices.length > 0 ? currentParams.voices : undefined,
      platforms: currentParams.platforms.length > 0 ? currentParams.platforms : undefined,
      sort: currentParams.sort as 'recent' | 'viewed' | 'rated',
      page: currentParams.page,
      limit: 20
    })
  });
  
  const lists = listsData?.lists || [];
  
  // Filter handlers
  const handleTypeChange = (type?: ListType) => {
    updateParams({ type, page: undefined });
  };
  
  const handleVoicesChange = (voices: VoiceTag[]) => {
    updateParams({ voices, page: undefined });
  };
  
  const handlePlatformsChange = (platforms: Platform[]) => {
    updateParams({ platforms, page: undefined });
  };
  
  const handleSortChange = (sort: string) => {
    updateParams({ sort, page: undefined });
  };
  
  const handleClearFilters = () => {
    updateParams({ 
      type: undefined, 
      voices: undefined, 
      platforms: undefined, 
      sort: 'recent',
      page: undefined 
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header onCreatePost={() => {}} />
      
      <div className="community-grid">
        {/* Left Sidebar */}
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar
              currentTab="all"
              onTabChange={() => {}}
              selectedPlatforms={[]}
              onPlatformChange={() => {}}
              currentSection="feed"
            />
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="grid-right hidden lg:block bg-background/95 backdrop-blur-sm border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <RightSidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid-main relative z-0">
          <div className="py-8 relative z-10 px-4 lg:px-8 max-w-7xl mx-auto">
            
            {/* VHUB Charts Section */}
            <VHubChartsSection 
              onFiltersChange={(params) => {
                const newSearch = params.toString();
                const newPath = `/community/lists${newSearch ? `?${newSearch}` : ''}`;
                window.history.replaceState({}, '', newPath);
              }}
            />
            
            {/* Section Separator */}
            <div className="my-16 border-t border-border/50"></div>
            
            
            {/* Filter Bar (for Lists) */}
            <ListFilters
              selectedType={currentParams.type}
              selectedVoices={currentParams.voices}
              selectedPlatforms={currentParams.platforms}
              selectedSort={currentParams.sort}
              onTypeChange={handleTypeChange}
              onVoicesChange={handleVoicesChange}
              onPlatformsChange={handlePlatformsChange}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
            />
            
            {/* Community Lists Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="vh-eyebrow mb-2">Community Lists</p>
                  <h1 className="vh-title">
                    Featured Industry Lists
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Editor-led and data-driven rankings, roundups, and best-of lists.
                  </p>
                  <p className="vh-meta mt-1">
                    {listsData?.total ? `${listsData.total} lists found` : 'Discovering lists...'}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/community'}
                  data-testid="back-to-community"
                >
                  Back to Community
                </Button>
              </div>
              
              {/* Error State */}
              {error && (
                <div className="text-center py-12" data-testid="lists-error">
                  <p className="text-red-500 mb-4">Failed to load lists</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              )}
              
              {/* Lists Grid */}
              <ListGrid lists={lists} isLoading={listsLoading} />
              
              {/* Pagination would go here */}
              {listsData && listsData.total > lists.length && (
                <div className="text-center mt-12">
                  <Button 
                    variant="outline" 
                    onClick={() => updateParams({ page: (currentParams.page + 1).toString() })}
                    data-testid="load-more-lists"
                  >
                    Load More Lists
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals would be rendered here */}
      {showMethodology && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMethodology(false)}>
          <div className="bg-background p-6 rounded-lg max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Methodology</h3>
            <p className="text-muted-foreground mb-4">
              Our rankings are calculated using a combination of metrics including engagement, 
              growth rate, community impact, and platform-specific data points.
            </p>
            <Button onClick={() => setShowMethodology(false)}>Close</Button>
          </div>
        </div>
      )}
      
      {showSuggestUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSuggestUpdate(false)}>
          <div className="bg-background p-6 rounded-lg max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Suggest an Update</h3>
            <p className="text-muted-foreground mb-4">
              Have feedback on our rankings? Send us your suggestions and we'll review them 
              for future updates.
            </p>
            <Button onClick={() => setShowSuggestUpdate(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListsPage;