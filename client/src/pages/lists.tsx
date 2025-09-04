import React from 'react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { VHubChartsSection } from '@/components/charts/VHubChartsSection';
import { ChartsHero } from '@/components/charts/ChartsHero';
import FeaturedLists from '@/components/lists/FeaturedLists';
import { Button } from '@/components/ui/button';

const ListsPage: React.FC = () => {

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