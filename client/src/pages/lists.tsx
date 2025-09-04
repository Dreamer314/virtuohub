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
import { ChartsHero } from '@/components/charts/ChartsHero';
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
            
            {/* Charts Hero */}
            <ChartsHero 
              heroMedia={{
                type: "video",
                src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                poster: "/hero/vhub-charts-placeholder.jpg",
                caption: "Video / Slideshow Preview"
              }}
            />
            
            {/* Charts Section Header */}
            <section className="mt-10">
              <div className="relative mb-6">
                {/* CHARTS header banner */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 border border-purple-500/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
                  <div className="relative px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-1">CHARTS</h2>
                        <p className="text-purple-200 text-sm">TOP CHARTS</p>
                      </div>
                      <div className="text-purple-300/60 font-mono text-xs">
                        Updated weekly
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Framed charts block */}
              <div className="relative mt-6 rounded-2xl ring-1 ring-border/50 bg-surface/60 p-4 md:p-6">
                {/* Ambient overlay */}
                <div 
                  aria-hidden="true" 
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20% 10%, hsl(var(--accent) / 0.1), transparent 25%), linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)`,
                    backgroundSize: '160px 160px, 24px 24px, 24px 24px'
                  }}
                />
                
                <div id="charts-start" />
                
                {/* VHUB Charts Section */}
                <VHubChartsSection 
                  onFiltersChange={(params) => {
                    const newSearch = params.toString();
                    const newPath = `/community/lists${newSearch ? `?${newSearch}` : ''}`;
                    window.history.replaceState({}, '', newPath);
                  }}
                />
              </div>
            </section>
            
            {/* Section Separator */}
            <div className="my-16 border-t border-border/50"></div>
            
            
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
              
              {/* Filter Bar (for Lists) - moved below section heading */}
              <ListFilters
                selectedType={currentParams.type}
                selectedVoices={[]} // Remove non-functional voice chips
                selectedPlatforms={currentParams.platforms}
                selectedSort={currentParams.sort}
                onTypeChange={handleTypeChange}
                onVoicesChange={() => {}} // Disabled until wired
                onPlatformsChange={handlePlatformsChange}
                onSortChange={handleSortChange}
                onClearFilters={handleClearFilters}
              />
              
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
      
      {/* Modals are now handled by ChartsHero component */}
    </div>
  );
};

export default ListsPage;