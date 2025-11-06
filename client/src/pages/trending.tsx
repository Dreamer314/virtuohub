import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/cards/PostCard';
import { Footer } from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import type { PostWithAuthor } from '@shared/schema';

const TrendingPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'user1';

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeTab, setActiveTab] = useState<'industry' | 'hub' | 'threads'>('industry');
  const [timeWindow, setTimeWindow] = useState<'24h' | '7d' | '30d'>('24h');

  // Fetch all posts
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    let filtered = posts;
    
    switch (activeTab) {
      case 'industry':
        filtered = posts.filter(post => 
          post.subtype === 'news' || 
          (post.title.toLowerCase().includes('industry') || 
           post.title.toLowerCase().includes('platform') ||
           post.title.toLowerCase().includes('tool') ||
           post.title.toLowerCase().includes('release'))
        );
        break;
      case 'hub':
        filtered = posts.filter(post => post.subtype === 'thread');
        break;
      case 'threads':
        filtered = posts.filter(post => post.comments && post.comments > 2);
        break;
    }
    
    // Sort by engagement (likes + comments + shares)
    return filtered.sort((a, b) => {
      const aEngagement = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
      const bEngagement = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
      return bEngagement - aEngagement;
    });
  };

  const trendingPosts = getFilteredPosts();

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
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4">
                          <TrendingUp className="w-8 h-8 text-transparent bg-gradient-dawn bg-clip-text" style={{backgroundImage: 'var(--gradient-dawn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Trending
                          </h1>
                        </div>
                        <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      What the ecosystem is talking about
                    </p>
                  </div>

                  {/* Tabs and Time Selector */}
                  <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      {/* Tabs */}
                      <div className="flex gap-2">
                        <Button
                          variant={activeTab === 'industry' ? 'default' : 'outline'}
                          onClick={() => setActiveTab('industry')}
                          size="sm"
                        >
                          Industry
                        </Button>
                        <Button
                          variant={activeTab === 'hub' ? 'default' : 'outline'}
                          onClick={() => setActiveTab('hub')}
                          size="sm"
                        >
                          On VirtuoHub
                        </Button>
                        <Button
                          variant={activeTab === 'threads' ? 'default' : 'outline'}
                          onClick={() => setActiveTab('threads')}
                          size="sm"
                        >
                          In Threads
                        </Button>
                      </div>
                      
                      {/* Time Window Selector */}
                      <div className="flex gap-2">
                        <Button
                          variant={timeWindow === '24h' ? 'default' : 'outline'}
                          onClick={() => setTimeWindow('24h')}
                          size="sm"
                        >
                          24h
                        </Button>
                        <Button
                          variant={timeWindow === '7d' ? 'default' : 'outline'}
                          onClick={() => setTimeWindow('7d')}
                          size="sm"
                        >
                          7d
                        </Button>
                        <Button
                          variant={timeWindow === '30d' ? 'default' : 'outline'}
                          onClick={() => setTimeWindow('30d')}
                          size="sm"
                        >
                          30d
                        </Button>
                      </div>
                    </div>
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
                              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {index + 1}
                              </div>
                            </div>
                          )}
                          <PostCard post={post} currentUserId={currentUserId} />
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