import React from 'react';
import { Star } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const CreatorSpotlightsPage: React.FC = () => {
  // Fetch all posts and filter for creator spotlights (insight posts)
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  const spotlightPosts = posts
    .filter(post => post.type === 'insight')
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
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
              currentSection="spotlights"
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
          <div className="py-8 relative z-10 px-4 lg:px-8">
            <div className="w-full">
              <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
                {/* Mobile Left Sidebar */}
                <div className="xl:hidden">
                  <LeftSidebar
                    currentTab="all"
                    onTabChange={() => {}}
                    currentSection="spotlights"
                  />
                </div>

                {/* Main Content */}
                <main>
                  {/* Page Header */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-8">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent flex-1"></div>
                      <div className="flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-yellow-500/10 via-yellow-500/20 to-yellow-500/10 rounded-full border border-yellow-500/30">
                        <Star className="w-8 h-8 text-yellow-500" />
                        <h1 className="text-5xl font-bold text-foreground tracking-tight">
                          Creator Spotlights
                        </h1>
                      </div>
                      <div className="h-0.5 bg-gradient-to-r from-yellow-500 via-transparent to-transparent flex-1"></div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      Featuring talented creators and their inspiring stories from the virtual world community
                    </p>
                  </div>

                  {/* Posts */}
                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">Loading creator spotlights...</div>
                      </div>
                    ) : spotlightPosts.length > 0 ? (
                      spotlightPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))
                    ) : (
                      <div className="glass-card rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">⭐</div>
                        <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                          No creator spotlights yet
                        </h3>
                        <p className="text-muted-foreground">
                          Creator interviews and spotlights will be featured here!
                        </p>
                      </div>
                    )}
                  </div>
                </main>

                {/* Mobile Right Sidebar */}
                <div className="lg:hidden mt-8">
                  <RightSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorSpotlightsPage;