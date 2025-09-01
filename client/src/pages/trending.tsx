import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const TrendingPage: React.FC = () => {
  // Fetch all posts and sort by engagement
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  // Sort by engagement (likes + comments + shares)
  const trendingPosts = posts
    .filter(post => post.type === 'regular')
    .sort((a, b) => {
      const aEngagement = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
      const bEngagement = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
      return bEngagement - aEngagement;
    });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      
      <div className="community-grid">
        {/* Left Sidebar */}
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar
              currentTab="all"
              onTabChange={() => {}}
              currentSection="trending"
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
                    currentSection="trending"
                  />
                </div>

                {/* Main Content */}
                <main>
                  {/* Page Header */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-8">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                      <div className="flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-full border border-primary/30">
                        <TrendingUp className="w-8 h-8 text-primary" />
                        <h1 className="text-5xl font-bold text-foreground tracking-tight">
                          Trending
                        </h1>
                      </div>
                      <div className="h-0.5 bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      The most popular posts in the VirtuoHub community right now
                    </p>
                  </div>

                  {/* Posts */}
                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">Loading trending posts...</div>
                      </div>
                    ) : trendingPosts.length > 0 ? (
                      trendingPosts.map((post, index) => (
                        <div key={post.id} className="relative">
                          {index < 3 && (
                            <div className="absolute -top-2 -left-2 z-10">
                              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {index + 1}
                              </div>
                            </div>
                          )}
                          <PostCard post={post} />
                        </div>
                      ))
                    ) : (
                      <div className="glass-card rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">📈</div>
                        <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                          No trending posts yet
                        </h3>
                        <p className="text-muted-foreground">
                          Posts will appear here as they gain popularity through likes, comments, and shares!
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

export default TrendingPage;