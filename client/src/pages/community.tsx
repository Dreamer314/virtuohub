import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard } from '@/components/post-card';
import { CreatePostModal } from '@/components/create-post-modal';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { FeaturedCarousel } from '@/components/featured/FeaturedCarousel';
import { featuredItems } from '@/components/featured/types';
import { Plus, Star, BarChart3 } from 'lucide-react';
import type { PostWithAuthor, Platform } from 'shared/schema';

const CommunityPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'all' | 'saved'>('all');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<'regular' | 'pulse' | 'insight'>('regular');

  // Fetch posts data from API
  const { data: posts = [], isLoading: postsLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  // Fetch saved posts data from API (only when on 'saved' tab)
  const { data: savedPosts = [], isLoading: savedPostsLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/users/user1/saved-posts'],
    enabled: currentTab === 'saved'
  });

  // Filter posts by type
  const pulsePosts = posts.filter(post => post.type === 'pulse');
  const insightPosts = posts.filter(post => post.type === 'insight');
  const regularPosts = posts.filter(post => post.type === 'regular');

  const FEATURED_V2 = true;

  // Add scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('[data-testid^="post-card-"]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [pulsePosts, insightPosts, regularPosts]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-xl" style={{ animationDelay: '-2s' }}></div>
        <div className="floating-element absolute bottom-20 left-1/4 w-20 h-20 bg-primary/15 rounded-full blur-xl" style={{ animationDelay: '-4s' }}></div>
      </div>

      <Header onCreatePost={() => {
        setCreateModalType('regular');
        setIsCreateModalOpen(true);
      }} />
      
      {/* Main Container with proper max-width and centering */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 bg-background/95 backdrop-blur-sm border border-border rounded-xl">
              <div className="p-4">
                <LeftSidebar
                  currentTab={currentTab}
                  onTabChange={setCurrentTab}
                  selectedPlatforms={selectedPlatforms.map(p => p)}
                  onPlatformChange={(platforms) => setSelectedPlatforms(platforms as Platform[])}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 relative">
            {/* Extended glow effect that affects the whole page */}
            <div className="absolute -top-20 -left-20 -right-20 h-96 pointer-events-none z-0">
              <div className="w-full h-full bg-gradient-to-br from-cyan-400/15 via-purple-500/10 to-orange-400/15 blur-3xl"></div>
            </div>
            
            <div className="py-8 relative z-10">
              {/* Hero Section - Full Width */}
              <div className="mb-8">
                <div className="glass-card rounded-2xl overflow-hidden hover-lift relative" data-testid="hero-section">
                  <div className="relative min-h-[576px] flex items-center justify-center hero-glow-container bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-cyan-900/20">
                    <div className="text-center z-10 relative">
                      <h1 className="text-9xl font-display font-bold text-white mb-6 drop-shadow-lg">
                        VirtuoHub Community
                      </h1>
                      <h2 className="text-5xl font-display font-bold text-white mb-4 drop-shadow-lg">
                        Your Immersive Economy HQ
                      </h2>
                      <p className="text-3xl text-white/90 drop-shadow-md mb-8">
                        Discover, connect, and build together.
                      </p>
                      <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-xl transition-all hover:scale-105 drop-shadow-lg">
                        Join the Community
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
                  </div>
                </div>
              </div>

              {/* Featured Content Carousel - Full Width */}
              {currentTab === 'all' && (
                <div className="mb-24">
                  <div className="w-full">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-2 w-full max-w-4xl">
                        <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4">
                          <Star className="w-8 h-8 text-accent" />
                          <h2 className="text-5xl font-bold text-foreground tracking-tight">
                            Featured Content
                          </h2>
                        </div>
                        <div className="h-px bg-gradient-to-r from-accent via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                  </div>
                  {FEATURED_V2 ? (
                    <FeaturedCarousel items={featuredItems} />
                  ) : (
                    <div className="space-y-6">
                      {/* Legacy Featured section would go here */}
                    </div>
                  )}
                </div>
              )}

              {/* VHub Pulse Section */}
              {currentTab === 'all' && (
                <div className="mb-24">
                  <div className="w-full">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-2 w-full max-w-4xl">
                        <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4">
                          <BarChart3 className="w-8 h-8 text-accent" />
                          <h2 className="text-5xl font-bold text-foreground tracking-tight">
                            VHub Pulse
                          </h2>
                        </div>
                        <div className="h-px bg-gradient-to-r from-accent via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pulsePosts.slice(0, 4).map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* Constrained Content Area */}
              <div className="px-6 sm:px-8 lg:px-12">
                <main className="min-h-screen">
                  <div className="max-w-3xl mx-auto">
                    {/* Post Creation Section */}
                    <div className="mb-8">
                      <div className="glass-card rounded-xl p-6 bg-card/50 border border-border/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                            <span className="text-sm font-medium text-primary">U</span>
                          </div>
                          <div className="flex-1">
                            <button
                              onClick={() => {
                                setCreateModalType('regular');
                                setIsCreateModalOpen(true);
                              }}
                              className="w-full text-left px-4 py-3 bg-muted/50 hover:bg-muted/70 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-200 text-muted-foreground hover:text-foreground"
                              data-testid="create-post-input"
                            >
                              What's happening in your virtual world?
                            </button>
                            <p className="text-xs text-muted-foreground mt-2 hidden sm:block">
                              You can attach images or files in the next step.
                            </p>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => {
                                    setCreateModalType('pulse');
                                    setIsCreateModalOpen(true);
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                  data-testid="add-poll-button"
                                >
                                  <BarChart3 className="w-4 h-4" />
                                  Poll
                                </button>
                              </div>
                              <Button
                                onClick={() => {
                                  setCreateModalType('regular');
                                  setIsCreateModalOpen(true);
                                }}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all hover:scale-105"
                                data-testid="post-button"
                              >
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feed Content */}
                    <div className="space-y-6">
                      {/* Display posts based on current tab */}
                      {(currentTab === 'all' ? regularPosts : savedPosts).length > 0 ? (
                        (currentTab === 'all' ? regularPosts : savedPosts).map((post) => (
                          <PostCard key={post.id} post={post} />
                        ))
                      ) : (
                        <div className="glass-card rounded-xl p-12 text-center" data-testid="empty-state">
                          <div className="text-6xl mb-4">🌟</div>
                          <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                            No posts found
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Try adjusting your filters or be the first to create a post!
                          </p>
                          <Button
                            onClick={() => {
                              setCreateModalType('regular');
                              setIsCreateModalOpen(true);
                            }}
                            className="transition-all hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent"
                            data-testid="create-first-post-button"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Post
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </main>

                {/* Mobile Right Sidebar */}
                <div className="lg:hidden mt-8">
                  <RightSidebar />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-20 bg-background/95 backdrop-blur-sm border border-border rounded-xl">
              <div className="p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Action Button */}
      <Button
        onClick={() => {
          setCreateModalType('regular');
          setIsCreateModalOpen(true);
        }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-transparent text-primary rounded-full border border-primary/30 hover:border-primary hover:border-2 transition-all z-40 p-0"
        data-testid="floating-action-button"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialType={createModalType}
      />
    </div>
  );
};

export default CommunityPage;