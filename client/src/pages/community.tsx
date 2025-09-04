import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Star, TrendingUp, Heart, ImageIcon, BarChart3, FileText, Zap, MessageCircle, Share, PenTool } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { PollCard } from '@/components/polls/PollCard';
import { CreatePostModal } from '@/components/composer/CreatePostModal';
import { CreatePollModal } from '@/components/composer/CreatePollModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageViewerModal } from '@/components/image-viewer-modal';
import { pulseApi, subscribe } from '@/data/pulseApi';
import { mockApi } from '@/data/mockApi';
import type { FeedItem, Post, Poll } from '@/types/content';

type TabType = 'all' | 'general' | 'assets' | 'jobs' | 'collaboration';

const CommunityPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('all');
  const [pulsePollsRefresh, setPulsePollsRefresh] = useState(0);
  const [feedRefresh, setFeedRefresh] = useState(0);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  // Subscribe to pulse updates
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setPulsePollsRefresh(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Get featured polls for VHub Pulse section (adapter function to convert old pulse API to new format)
  const getFeaturedPolls = useCallback(() => {
    const featured = pulseApi.listFeaturedPolls();
    const pollsToShow = featured.length > 0 ? featured : pulseApi.listActivePolls().slice(0, 1);
    
    // Convert old pulse API format to new unified format
    return pollsToShow.map(oldPoll => ({
      id: oldPoll.id,
      type: 'poll' as const,
      question: oldPoll.question,
      options: oldPoll.options.map((opt, index) => ({
        id: `${oldPoll.id}-opt-${index}`,
        label: opt.label,
        votes: opt.votes
      })),
      allowMultiple: false, // legacy polls are single-choice
      showResults: 'after-vote' as const,
      closesAt: oldPoll.endsAt, // convert endsAt to closesAt
      category: 'General',
      platforms: [],
      createdAt: oldPoll.createdAt,
      author: {
        id: 'vhub-pulse',
        name: 'VHub Data Pulse',
        avatar: undefined
      },
      status: oldPoll.endsAt > Date.now() ? 'active' : 'completed' as 'active' | 'completed'
    }));
  }, [pulsePollsRefresh]);

  const featuredPolls = getFeaturedPolls();

  // Get unified feed data
  const feedItems = mockApi.listFeed();

  // Filter feed based on current tab
  const getFilteredItems = useCallback(() => {
    if (currentTab === 'all') return feedItems;
    
    return feedItems.filter(item => {
      if (!item.category) return false;
      
      switch (currentTab) {
        case 'general':
          return item.category === 'General';
        case 'assets':
          return item.category === 'Assets for Sale';
        case 'jobs':
          return item.category === 'Jobs & Gigs';
        case 'collaboration':
          return item.category === 'Collaboration & WIP';
        default:
          return true;
      }
    });
  }, [feedItems, currentTab]);

  const filteredItems = getFilteredItems();

  const { data: posts } = useQuery({
    queryKey: ['/api/posts'],
    refetchInterval: 30000
  });

  const handleCreatePost = (newPost: Post) => {
    setFeedRefresh(prev => prev + 1);
  };

  const handleCreatePoll = (newPoll: Poll) => {
    setFeedRefresh(prev => prev + 1);
    setPulsePollsRefresh(prev => prev + 1);
  };

  const openImageViewer = (images: string[], startIndex: number = 0) => {
    setCurrentImages(images);
    setCurrentImageIndex(startIndex);
    setImageViewerOpen(true);
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as TabType);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-xl" style={{ animationDelay: '-2s' }}></div>
        <div className="floating-element absolute bottom-20 left-1/4 w-20 h-20 bg-primary/15 rounded-full blur-xl" style={{ animationDelay: '-4s' }}></div>
      </div>

      <Header onCreatePost={() => setShowCreatePost(true)} />
      
      <div className="community-grid">
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar currentTab={currentTab} onTabChange={handleTabChange} />
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
                  <LeftSidebar currentTab={currentTab} onTabChange={handleTabChange} />
                </div>

                <main>
                  {/* Create Actions Header */}
                  <div className="mb-8">
                    <div className="enhanced-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-foreground">Share with the community</h2>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => setShowCreatePost(true)}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                          data-testid="create-post-button"
                        >
                          <PenTool className="w-4 h-4 mr-2" />
                          Create Post
                        </Button>
                        <Button 
                          onClick={() => setShowCreatePoll(true)}
                          variant="outline"
                          className="flex-1"
                          data-testid="create-poll-button"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Create Poll
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* VHub Pulse Section - Only show on 'all' tab */}
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
                          // Create a custom voting handler that works with the old pulse API
                          const handlePollUpdate = () => {
                            setPulsePollsRefresh(prev => prev + 1);
                          };
                          
                          return (
                            <PollCard 
                              key={poll.id}
                              poll={poll}
                              context="feed"
                              onUpdate={handlePollUpdate}
                            />
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
                  <div className="space-y-6" data-testid="community-feed">
                    {filteredItems.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground mb-4">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">No posts yet</p>
                          <p className="text-sm">Be the first to share something with the community!</p>
                        </div>
                        <Button 
                          onClick={() => setShowCreatePost(true)}
                          className="mt-4"
                        >
                          Create First Post
                        </Button>
                      </div>
                    ) : (
                      filteredItems.map((item) => {
                        if (item.type === 'post') {
                          return (
                            <PostCard 
                              key={item.id}
                              post={item}
                              onImageClick={openImageViewer}
                            />
                          );
                        } else if (item.type === 'poll') {
                          return (
                            <PollCard 
                              key={item.id}
                              poll={item}
                              context="feed"
                              onUpdate={() => setFeedRefresh(prev => prev + 1)}
                            />
                          );
                        }
                        return null;
                      })
                    )}
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
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
        onSuccess={handleCreatePost}
      />
      
      <CreatePollModal 
        open={showCreatePoll}
        onOpenChange={setShowCreatePoll}
        onSuccess={handleCreatePoll}
      />

      <ImageViewerModal
        images={currentImages}
        currentIndex={currentImageIndex}
        open={imageViewerOpen}
        onOpenChange={setImageViewerOpen}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  );
};

export default CommunityPage;