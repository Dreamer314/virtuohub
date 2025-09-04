import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Star, TrendingUp, Heart, ImageIcon, BarChart3, FileText, Zap, ThumbsUp, MessageCircle, Share } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { CreatePostModal } from '@/components/composer/CreatePostModal';
import { CreatePollModal } from '@/components/composer/CreatePollModal';
import { PollCard } from '@/components/polls/PollCard';
import { Footer } from '@/components/layout/footer';
import { FeaturedCarousel } from '@/components/featured/FeaturedCarousel';
import { featuredItems } from '@/components/featured/types';
import vhubHeaderImage from '@assets/VHub.Header.no.font.Light.Page.png';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor, Platform } from '@shared/schema';
import { pulseApi, subscribe, type Poll } from '@/data/pulseApi';
import { mockApi } from '@/data/mockApi';
import type { FeedItem } from '@/types/content';

const FEATURED_V2 = true;

const CommunityPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'all' | 'saved'>('all');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreatePollModalOpen, setIsCreatePollModalOpen] = useState(false);
  const [pulsePollsRefresh, setPulsePollsRefresh] = useState(0);
  const [feedRefresh, setFeedRefresh] = useState(0);

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

  // Get pulse polls from existing API (for VHub Pulse section only)
  const getFeaturedPolls = useCallback(() => {
    const featured = pulseApi.listFeaturedPolls();
    return featured.slice(0, 3);
  }, [pulsePollsRefresh]);

  const activePolls = getFeaturedPolls();

  // Get feed data from new mock API (for community feed section)
  const getFeedData = useCallback(() => {
    return mockApi.listFeed();
  }, [feedRefresh]);

  const feedItems = getFeedData();

  // Subscribe to pulse updates for VHub Pulse section
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setPulsePollsRefresh(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCreatePost = () => {
    setIsCreatePostModalOpen(true);
  };

  const handleCreatePoll = () => {
    setIsCreatePollModalOpen(true);
  };

  const handlePostSuccess = () => {
    setFeedRefresh(prev => prev + 1);
  };

  const handlePollSuccess = () => {
    setFeedRefresh(prev => prev + 1);
    // Also update pulse data since polls are shared
    setPulsePollsRefresh(prev => prev + 1);
  };

  const handleVoteFromPulse = (pollId: string, optionIndex: number) => {
    try {
      pulseApi.vote(pollId, optionIndex);
      setPulsePollsRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const displayedPosts = currentTab === 'all' ? posts : savedPosts;
  const isLoading = currentTab === 'all' ? postsLoading : savedLoading;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-xl" style={{ animationDelay: '-2s' }}></div>
        <div className="floating-element absolute bottom-20 left-1/4 w-20 h-20 bg-primary/15 rounded-full blur-xl" style={{ animationDelay: '-4s' }}></div>
      </div>

      <Header onCreatePost={handleCreatePost} />
      
      <div className="community-grid">
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar 
              currentTab={currentTab} 
              onTabChange={setCurrentTab} 
              selectedPlatforms={selectedPlatforms}
              onPlatformChange={setSelectedPlatforms}
            />
          </div>
        </div>
        
        <div className="grid-right hidden lg:block bg-background/95 backdrop-blur-sm border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <RightSidebar />
          </div>
        </div>

        <div className="grid-main relative z-0">
          <div className="py-8 relative z-10 px-4 lg:px-8">
            <div className="w-full">
              <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
                <div className="xl:hidden">
                  <LeftSidebar 
                    currentTab={currentTab} 
                    onTabChange={setCurrentTab} 
                    selectedPlatforms={selectedPlatforms}
                    onPlatformChange={setSelectedPlatforms}
                  />
                </div>

                <main>
                  {/* Featured Section */}
                  {FEATURED_V2 && (
                    <div className="mb-12">
                      <FeaturedCarousel items={featuredItems} />
                    </div>
                  )}

                  {/* VHub Pulse Section - DO NOT MODIFY */}
                  {activePolls.length > 0 && (
                    <div className="mb-12">
                      <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                          <div className="flex items-center space-x-4">
                            <Zap className="w-8 h-8 text-transparent bg-gradient-cosmic bg-clip-text" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                              VHub Pulse
                            </h2>
                          </div>
                          <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                        </div>
                      </div>
                      <p className="text-center text-lg text-muted-foreground mb-8">
                        Industry data collection and insights
                      </p>

                      <div className="space-y-6">
                        {activePolls.map((poll, index) => {
                          const hasVoted = pulseApi.hasVoted(poll.id);
                          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                          const timeLeft = Math.max(0, poll.endsAt - Date.now());
                          const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
                          const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
                          const createdAgo = Math.floor((Date.now() - poll.createdAt) / (1000 * 60 * 60));
                          const isExpired = poll.endsAt <= Date.now();

                          const handleVote = (optionIndex: number) => {
                            handleVoteFromPulse(poll.id, optionIndex);
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

                  {/* Community Feed Section */}
                  <div className="mb-12">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4">
                          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Community Feed
                          </h2>
                        </div>
                        <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                    
                    {/* Composer Buttons */}
                    <div className="mb-8 flex justify-center gap-4">
                      <Button
                        onClick={handleCreatePost}
                        className="flex items-center gap-2"
                        data-testid="create-post-button"
                      >
                        <FileText className="w-4 h-4" />
                        Create Post
                      </Button>
                      <Button
                        onClick={handleCreatePoll}
                        variant="outline"
                        className="flex items-center gap-2"
                        data-testid="create-poll-button"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Create Poll
                      </Button>
                    </div>

                    {/* Feed Items */}
                    <div className="space-y-6">
                      {isLoading ? (
                        <div className="space-y-6">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="enhanced-card hover-lift p-6 animate-pulse">
                              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                              <div className="h-20 bg-muted rounded mb-4"></div>
                              <div className="h-4 bg-muted rounded w-1/2"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {/* Feed from Mock API */}
                          {feedItems.map(item => (
                            item.type === 'post' ? (
                              <PostCard 
                                key={item.id} 
                                post={{
                                  ...item,
                                  authorId: item.author.id,
                                  author: {
                                    id: item.author.id,
                                    username: item.author.name,
                                    displayName: item.author.name,
                                    avatar: item.author.avatar || '',
                                    role: 'Member'
                                  },
                                  saves: item.stats.saves,
                                  likes: item.stats.likes,
                                  comments: item.stats.comments,
                                  isSaved: false,
                                  isLiked: false
                                } as any} 
                                currentUserId="user1" 
                              />
                            ) : (
                              <PollCard
                                key={item.id}
                                poll={item}
                                context="feed"
                                onUpdate={() => setFeedRefresh(prev => prev + 1)}
                              />
                            )
                          ))}
                          
                          {/* Existing Posts from API */}
                          {displayedPosts.map(post => (
                            <PostCard 
                              key={post.id} 
                              post={post} 
                              currentUserId="user1" 
                            />
                          ))}
                          
                          {feedItems.length === 0 && displayedPosts.length === 0 && (
                            <div className="text-center py-12">
                              <p className="text-muted-foreground mb-4">
                                {currentTab === 'all' 
                                  ? 'No posts yet. Be the first to share something!'
                                  : 'No saved posts yet. Save posts by clicking the bookmark icon.'
                                }
                              </p>
                              {currentTab === 'all' && (
                                <Button onClick={handleCreatePost}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create Your First Post
                                </Button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSuccess={handlePostSuccess}
      />
      
      <CreatePollModal
        isOpen={isCreatePollModalOpen}
        onClose={() => setIsCreatePollModalOpen(false)}
        onSuccess={handlePollSuccess}
      />
    </div>
  );
};

export default CommunityPage;