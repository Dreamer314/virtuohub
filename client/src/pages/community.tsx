import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Star, TrendingUp, Heart, ImageIcon, BarChart3, FileText, Zap, ThumbsUp, MessageCircle, Share } from 'lucide-react';
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
import type { PostWithAuthor, Platform } from '@shared/schema';
import { pulseApi, subscribe, type Poll } from '@/data/pulseApi';

const FEATURED_V2 = true;

const CommunityPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'all' | 'saved'>('all');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<'regular' | 'pulse' | 'insight'>('regular');
  const [pulsePollsRefresh, setPulsePollsRefresh] = useState(0);

  // Fetch posts data from API with platform filtering
  const { data: posts = [], isLoading: postsLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts', selectedPlatforms],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedPlatforms.length > 0) {
        selectedPlatforms.forEach(platform => params.append('platforms', platform));
      }
      const url = `/api/posts${params.toString() ? `?${params.toString()}` : ''}`;
      return fetch(url).then(res => res.json());
    }
  });

  const { data: savedPosts = [], isLoading: savedLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/users/user1/saved-posts']
  });

  // Get pulse polls from new API
  const getFeaturedPolls = useCallback(() => {
    const featured = pulseApi.listFeaturedPolls();
    return featured.length > 0 ? featured : pulseApi.listActivePolls().slice(0, 1);
  }, [pulsePollsRefresh]);

  const featuredPolls = getFeaturedPolls();

  // Subscribe to pulse updates
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setPulsePollsRefresh(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Filter posts by type (keeping for regular posts)
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
  }, [featuredPolls, insightPosts, regularPosts]);

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
      
      <div className="community-grid">
        {/* Left Sidebar */}
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              selectedPlatforms={selectedPlatforms.map(p => p)}
              onPlatformChange={(platforms) => setSelectedPlatforms(platforms as Platform[])}
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
          {/* Extended glow effect that affects the whole page */}
          <div className="absolute -top-20 -left-20 -right-20 h-96 pointer-events-none z-0">
            <div className="w-full h-full bg-gradient-to-br from-cyan-400/15 via-purple-500/10 to-orange-400/15 blur-3xl"></div>
          </div>
          
          <div className="py-8 relative z-10 px-4 lg:px-8">
            {/* Hero Section */}
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

            {/* Featured Content Carousel */}
            {currentTab === 'all' && (
              <div className="mb-24 relative">
                <div className="w-full">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
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

            {/* Content Area */}
            <div className="w-full">
              <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
                {/* Mobile Left Sidebar */}
                <div className="xl:hidden">
                  <LeftSidebar
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                    selectedPlatforms={selectedPlatforms.map(p => p)}
                    onPlatformChange={(platforms) => setSelectedPlatforms(platforms as Platform[])}
                    currentSection="feed"
                  />
                </div>

                {/* Main Content */}
                <main>

                  {/* VHub Pulse */}
                  {currentTab === 'all' && featuredPolls.length > 0 && (
                    <div className="mb-16 pb-8 border-b border-border/30" data-testid="pulse-posts-feed">
                      <div className="flex flex-col items-center space-y-3 mb-6">
                        <div className="flex items-center space-x-2 w-full">
                          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                          <div className="flex items-center space-x-4">
                            <Zap className="w-8 h-8 text-transparent bg-gradient-cosmic bg-clip-text" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
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
                        {featuredPolls.map((poll) => {
                          const hasVoted = pulseApi.hasVoted(poll.id);
                          const isExpired = poll.endsAt <= Date.now();
                          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                          const timeLeft = Math.max(0, poll.endsAt - Date.now());
                          const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
                          const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
                          const createdAgo = Math.floor((Date.now() - poll.createdAt) / (1000 * 60 * 60));
                          
                          const handleVote = (optionIndex: number) => {
                            try {
                              pulseApi.vote(poll.id, optionIndex);
                              setPulsePollsRefresh(prev => prev + 1);
                            } catch (error) {
                              console.error('Vote failed:', error);
                            }
                          };
                          
                          return (
                            <article key={poll.id} className="enhanced-card hover-lift group p-6 transition-all duration-200 flex flex-col min-h-[280px]" data-testid={`pulse-card-${poll.id}`}>
                              <div className="flex space-x-4 flex-1">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-medium text-lg">
                                    <Zap className="w-6 h-6" />
                                  </span>
                                </div>
                                
                                <div className="flex-1 min-w-0 flex flex-col">
                                  {/* Header */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-foreground">VHub Data Pulse</span>
                                      <span className="text-xs text-muted-foreground">•</span>
                                      <span className="text-xs text-muted-foreground">{createdAgo}h ago</span>
                                    </div>
                                  </div>
                                  
                                  {/* Poll Question */}
                                  <h3 className="text-lg font-semibold text-foreground mb-4">
                                    {poll.question}
                                  </h3>
                                  
                                  {/* Poll Options */}
                                  <div className="space-y-3 mb-4 flex-1">
                                    {poll.options.map((option, index) => {
                                      const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                      
                                      if (hasVoted || isExpired) {
                                        // Show results
                                        return (
                                          <div key={index} className="relative w-full p-3 border border-border rounded-lg bg-muted/20">
                                            <div className="flex justify-between items-center relative z-10">
                                              <span className="text-sm font-medium text-foreground">{option.label}</span>
                                              <span className="text-xs text-muted-foreground">{option.votes} votes ({percentage.toFixed(0)}%)</span>
                                            </div>
                                            <div className="absolute inset-0 bg-primary/10 rounded-lg" style={{ width: `${percentage}%` }}></div>
                                          </div>
                                        );
                                      } else {
                                        // Show voting buttons
                                        return (
                                          <button
                                            key={index}
                                            onClick={() => handleVote(index)}
                                            className="w-full p-3 text-left border border-border rounded-lg hover:border-primary/50 transition-colors"
                                            data-testid={`poll-option-${poll.id}-${index}`}
                                          >
                                            <span className="text-sm font-medium text-foreground">{option.label}</span>
                                          </button>
                                        );
                                      }
                                    })}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Sticky Bottom Section */}
                              <div className="mt-auto pt-4 border-t border-border/30">
                                {/* Poll Meta */}
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs text-muted-foreground">{totalVotes} votes</span>
                                  {isExpired ? (
                                    <span className="text-xs text-muted-foreground">Poll ended</span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      Poll ends in {daysLeft > 0 ? `${daysLeft} days` : `${hoursLeft} hours`}
                                    </span>
                                  )}
                                </div>
                                
                                {!hasVoted && !isExpired && (
                                  <div className="text-center text-sm text-muted-foreground mb-3">
                                    Click an option above to vote
                                  </div>
                                )}

                                {/* Engagement Actions */}
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
                                    data-testid={`like-button-${poll.id}`}
                                  >
                                    <ThumbsUp size={16} />
                                    <span>0</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
                                    data-testid={`comment-button-${poll.id}`}
                                  >
                                    <MessageCircle size={16} />
                                    <span>0 comments</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
                                    data-testid={`share-button-${poll.id}`}
                                  >
                                    <Share size={16} />
                                    <span>Share</span>
                                  </Button>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                      
                      {/* CTA Button */}
                      <div className="mt-8 text-center">
                        <Button 
                          onClick={() => window.location.href = '/pulse'}
                          className="bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-primary font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
                          data-testid="view-all-polls-button"
                        >
                          <BarChart3 className="w-5 h-5" />
                          View All Active Polls
                        </Button>
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

                    {/* Create Post Section */}
                    <div className="mb-8" data-testid="create-post-section">
                      <div className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300">
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
                                <Button
                                  onClick={() => {
                                    setCreateModalType('regular');
                                    setIsCreateModalOpen(true);
                                  }}
                                  variant="outline"
                                  className="flex items-center gap-2 px-4 py-2 text-sm border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                                  data-testid="create-post-button"
                                >
                                  <FileText className="w-4 h-4" />
                                  Create Post
                                </Button>
                                <Button
                                  onClick={() => {
                                    setCreateModalType('pulse');
                                    setIsCreateModalOpen(true);
                                  }}
                                  variant="outline"
                                  className="flex items-center gap-2 px-4 py-2 text-sm border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                                  data-testid="create-poll-button"
                                >
                                  <BarChart3 className="w-4 h-4" />
                                  Create Poll
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
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