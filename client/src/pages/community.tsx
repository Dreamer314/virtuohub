import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Star, TrendingUp, Heart } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { CreatePostModal } from '@/components/create-post-modal';
import { Footer } from '@/components/layout/footer';
import { FeaturedCarousel } from '@/components/featured/FeaturedCarousel';
import { featuredItems } from '@/components/featured/types';
import vhubHeaderImage from '@assets/VHub.Header.no.font.Light.Page.png';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor, Platform } from '@/shared/schema';

const FEATURED_V2 = true;

const CommunityPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'all' | 'saved'>('all');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch posts data from API
  const { data: posts = [], isLoading: postsLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  const { data: savedPosts = [], isLoading: savedLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/users/user1/saved-posts']
  });

  // Filter posts by type
  const pulsePosts = posts.filter(post => post.type === 'pulse');
  const insightPosts = posts.filter(post => post.type === 'insight');
  const regularPosts = posts.filter(post => post.type === 'regular');
  const allPostsData = currentTab === 'saved' ? savedPosts : regularPosts;

  // Add scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-up');
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

      <Header onCreatePost={() => setIsCreateModalOpen(true)} />
      
      <div className="flex">
        {/* Fixed Left Sidebar */}
        <div className="hidden lg:block w-64 fixed left-0 top-0 h-screen bg-background/95 backdrop-blur-sm border-r border-border z-10">
          <div className="pt-20 px-4">
            <LeftSidebar
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              selectedPlatforms={selectedPlatforms.map(p => p)}
              onPlatformChange={(platforms) => setSelectedPlatforms(platforms as Platform[])}
            />
          </div>
        </div>
        
        {/* Fixed Right Sidebar */}
        <div className="hidden lg:block w-80 fixed right-0 top-0 h-screen bg-background/95 backdrop-blur-sm border-l border-border z-10">
          <div className="pt-20 px-4 overflow-y-auto">
            <RightSidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64 lg:mr-80 relative">
          {/* Extended glow effect that affects the whole page */}
          <div className="absolute -top-20 -left-20 -right-20 h-96 pointer-events-none z-0">
            <div className="w-full h-full bg-gradient-to-br from-cyan-400/15 via-purple-500/10 to-orange-400/15 blur-3xl"></div>
          </div>
          
          <div className="py-8 relative z-10">
            {/* Hero Section - Full Width */}
            <div className="mb-8">
              <div className="glass-card rounded-2xl overflow-hidden hover-lift relative" data-testid="hero-section">
                <div className="relative min-h-[576px] flex items-center justify-center hero-glow-container">
                  <img 
                    src={vhubHeaderImage} 
                    alt="VirtuoHub Community Header"
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.2)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.15))'
                    }}
                  />
                  <div className="text-center z-10 relative">
                    <h1 className="text-9xl font-display font-bold text-white mb-6 drop-shadow-lg">
                      VirtuoHub Community
                    </h1>
                    <p className="text-3xl text-white/90 drop-shadow-md">
                      Connect, Create, and Collaborate in Virtual Worlds
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
                </div>
              </div>
            </div>

            {/* Featured Content Carousel - Full Width */}
            {currentTab === 'all' && (
              <div className="mb-24">
                <div className="px-6 sm:px-8 lg:px-12">
                  <div className="max-w-[720px] min-w-[580px] mx-auto">
                    <div className="flex items-center space-x-2 mb-6">
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

            {/* Constrained Content Area with Padding */}
            <div className="px-6 sm:px-8 lg:px-12">
              <div className="max-w-[720px] min-w-[580px] mx-auto grid grid-cols-1 gap-8">
                {/* Mobile Left Sidebar */}
                <div className="lg:hidden">
                  <LeftSidebar
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                    selectedPlatforms={selectedPlatforms.map(p => p)}
                    onPlatformChange={(platforms) => setSelectedPlatforms(platforms as Platform[])}
                  />
                </div>

                {/* Main Content */}
                <main>

                  {/* VHub Pulse */}
                  {currentTab === 'all' && pulsePosts.length > 0 && (
                    <div className="mb-16 pb-8 border-b border-border/30" data-testid="pulse-posts-feed">
                      <div className="flex flex-col items-center space-y-3 mb-6">
                        <div className="flex items-center space-x-2 w-full">
                          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                          <div className="flex items-center space-x-4">
                            <TrendingUp className="w-8 h-8 text-primary" />
                            <h2 className="text-5xl font-bold text-foreground tracking-tight font-tech">
                              VHub Pulse
                            </h2>
                          </div>
                          <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-lg font-semibold text-accent">Quick polls on Immersive Economy topics.</p>
                          <p className="text-sm text-muted-foreground">Cast your vote. See results.</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        {pulsePosts.map((post: any) => (
                          <PostCard key={post.id} post={post} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Community Feed */}
                  <div className="relative" data-testid="community-feed-section">
                    {/* Content Area */}
                    <div className="mb-8 relative">
                      <div className="flex items-center space-x-2 mb-8">
                        <div className="h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-accent/10 via-accent/20 to-accent/10 rounded-full border border-accent/30">
                          <div className="w-12 h-12 rounded-xl bg-accent/20 border-2 border-accent/40 flex items-center justify-center shadow-lg">
                            <Plus className="w-7 h-7 text-accent animate-pulse" />
                          </div>
                          <h2 className="text-5xl font-bold text-foreground tracking-tight bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                            Community Feed
                          </h2>
                          <div className="w-3 h-3 rounded-full bg-accent animate-ping"></div>
                        </div>
                        <div className="h-0.5 bg-gradient-to-r from-accent via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>

                    {/* Posts */}
                    <div className="space-y-6">
                      {currentTab === 'saved' ? (
                        allPostsData.length > 0 ? (
                          allPostsData.map((post: any) => (
                            <PostCard key={post.id} post={post} />
                          ))
                        ) : (
                          <div className="glass-card rounded-xl p-12 text-center" data-testid="empty-state">
                            <div className="text-6xl mb-4">🌟</div>
                            <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                              No saved posts yet
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              Start saving posts by clicking the heart icon on posts you like!
                            </p>
                          </div>
                        )
                      ) : regularPosts.length > 0 ? (
                        regularPosts.map((post: any) => (
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
                            onClick={() => setIsCreateModalOpen(true)}
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
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-transparent text-primary rounded-full border border-primary/30 hover:border-primary hover:border-2 transition-all z-40 p-0"
        data-testid="floating-action-button"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default CommunityPage;