import React, { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/cards/PostCard';
import { VHubChartsSection } from '@/components/charts/VHubChartsSection';
import { ChartsHero } from '@/components/charts/ChartsHero';
import FeaturedLists from '@/components/lists/FeaturedLists';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useFilterStore } from '@/lib/stores/filter-store';
import { List, BarChart3 } from 'lucide-react';

const ListsPage: React.FC = () => {
  const { actions } = useURLFilters();
  const filterStore = useFilterStore();

  // Initialize page-specific filtering on mount
  useEffect(() => {
    // Set subtype filter to 'list' for this page (but don't override existing filters)
    if (!filterStore.selectedSubtypes.includes('list')) {
      actions.addSubtype('list');
    }
  }, [actions, filterStore.selectedSubtypes]);

  // Fetch all posts and filter for list posts using unified schema
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  // Filter posts by list subtype and apply other active filters
  const listPosts = posts
    .filter(post => {
      // Include list subtype
      if (post.subtype !== 'list') return false;
      
      // Apply platform filtering if active
      if (filterStore.selectedPlatforms.length > 0) {
        const hasMatchingPlatform = post.platforms?.some((platform: any) => 
          filterStore.selectedPlatforms.includes(platform)
        );
        if (!hasMatchingPlatform) return false;
      }
      
      // Apply search query if active
      if (filterStore.searchQuery.trim()) {
        const query = filterStore.searchQuery.toLowerCase();
        const matchesSearch = 
          post.title.toLowerCase().includes(query) ||
          post.body?.toLowerCase().includes(query) ||
          post.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting based on filter store settings
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      if (filterStore.sortBy === 'recent') {
        return filterStore.sortDirection === 'desc' ? bTime - aTime : aTime - bTime;
      } else if (filterStore.sortBy === 'popular') {
        const aPopularity = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
        const bPopularity = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
        return filterStore.sortDirection === 'desc' ? bPopularity - aPopularity : aPopularity - bPopularity;
      }
      return bTime - aTime; // Default to recent desc
    });

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
            
            {/* Dynamic List Posts Section */}
            <div className="mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                  <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                  <div className="flex items-center space-x-4">
                    <List className="w-8 h-8 text-transparent bg-gradient-cosmic bg-clip-text" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">Latest Lists</h2>
                  </div>
                  <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                </div>
              </div>
              
              {/* Search and Filter Integration */}
              <div className="mb-6">
                <div className="text-center text-sm text-muted-foreground">
                  {listPosts.length === 0 
                    ? 'No lists match your current filters'
                    : `Showing ${listPosts.length} list${listPosts.length !== 1 ? 's' : ''}`
                  }
                  {filterStore.hasActiveFilters() && (
                    <button 
                      onClick={() => {
                        actions.clearFilters();
                        actions.addSubtype('list'); // Keep list subtype active
                      }}
                      className="ml-2 text-primary hover:text-primary/80 underline"
                    >
                      Clear other filters
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic List Posts */}
              <div className="space-y-6 mb-12">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">Loading lists...</div>
                  </div>
                ) : listPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      No lists found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {filterStore.hasActiveFilters() 
                        ? 'Try adjusting your filters to see more lists.'
                        : 'No community lists are available yet.'}
                    </p>
                  </div>
                ) : (
                  listPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      className="list-card"
                    />
                  ))
                )}
              </div>
            </div>
            
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
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-purple-600/20 border border-purple-500/30 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
                  <div className="relative px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-purple-900 dark:text-white mb-1">CHARTS</h2>
                        <p className="text-purple-700 dark:text-purple-200 text-sm">TOP CHARTS</p>
                      </div>
                      <div className="text-purple-600/80 dark:text-purple-300/60 font-mono text-xs">
                        Updated weekly
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Framed charts block */}
              <div className="relative mt-6 rounded-2xl ring-1 ring-border/50 bg-surface/60 p-4 md:p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
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
            
            
            {/* Featured Industry Lists Section */}
            <FeaturedLists />
          </div>
        </div>
      </div>
      
      {/* Modals are now handled by ChartsHero component */}
    </div>
  );
};

export default ListsPage;