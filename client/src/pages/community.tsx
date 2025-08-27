import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { PostCard } from "@/components/post-card";
import { CreatePostModal } from "@/components/create-post-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type Category, type Platform } from "@shared/schema";
import { Plus, Image, BarChart3, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [currentTab, setCurrentTab] = useState<'all' | 'saved'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (selectedCategory && selectedCategory !== 'All') {
    queryParams.append('category', selectedCategory);
  }
  selectedPlatforms.forEach(platform => {
    queryParams.append('platforms', platform);
  });

  // Fetch posts based on current tab
  const { data: posts, isLoading } = useQuery({
    queryKey: currentTab === 'all' 
      ? ['/api/posts', selectedCategory, ...selectedPlatforms]
      : ['/api/users/user1/saved-posts'],
    enabled: true,
  });

  const { data: allPosts } = useQuery({
    queryKey: ['/api/posts'],
    enabled: currentTab === 'all',
  });

  const { data: savedPosts } = useQuery({
    queryKey: ['/api/users/user1/saved-posts'],
    enabled: currentTab === 'saved',
  });

  // Filter posts client-side for better UX
  const allFilteredPosts = currentTab === 'all' 
    ? (Array.isArray(allPosts) ? allPosts : []).filter((post: any) => {
        if (selectedCategory !== 'All' && post.category !== selectedCategory) {
          return false;
        }
        if (selectedPlatforms.length > 0 && !post.platforms.some((p: string) => selectedPlatforms.includes(p as Platform))) {
          return false;
        }
        return true;
      })
    : savedPosts || [];

  // Separate special posts by type
  const pulsePosts = Array.isArray(allFilteredPosts) 
    ? allFilteredPosts.filter((post: any) => post.type === 'pulse')
    : [];
    
  const insightPosts = Array.isArray(allFilteredPosts) 
    ? allFilteredPosts.filter((post: any) => post.type === 'insight')
    : [];
  
  const regularPosts = Array.isArray(allFilteredPosts) 
    ? allFilteredPosts.filter((post: any) => post.type === 'regular')
    : [];

  // Navigation functions for insight carousel
  const nextInsight = () => {
    setCurrentInsightIndex((prev) => (prev + 1) % insightPosts.length);
  };

  const prevInsight = () => {
    setCurrentInsightIndex((prev) => (prev - 1 + insightPosts.length) % insightPosts.length);
  };

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

      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <LeftSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPlatforms={selectedPlatforms}
            onPlatformsChange={setSelectedPlatforms}
            currentTab={currentTab}
            onTabChange={setCurrentTab}
          />

          {/* Main Content */}
          <main className="lg:col-span-6">
            {/* Hero Section */}
            <div className="glass-card rounded-xl mb-8 overflow-hidden hover-lift" data-testid="hero-section">
              <div className="relative h-48 animated-background flex items-center justify-center">
                <div className="text-center z-10">
                  <h1 className="text-3xl font-display font-bold text-white mb-2">
                    VirtuoHub Community
                  </h1>
                  <p className="text-white/80">
                    Connect, Create, and Collaborate in Virtual Worlds
                  </p>
                </div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>

            {/* Creator Insights Carousel */}
            {currentTab === 'all' && insightPosts.length > 0 && (
              <div className="mb-8" data-testid="insights-carousel">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent flex-1"></div>
                  <span className="text-sm font-medium text-accent bg-background px-4 py-2 rounded-full border border-accent/20 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Creator Insights
                  </span>
                  <div className="h-px bg-gradient-to-r from-accent via-transparent to-transparent flex-1"></div>
                </div>
                
                {/* Section Description */}
                <div className="text-center mb-6">
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Creator Insights is where we hear from the creators making an impact. We feature innovative minds and showcase their work, but more importantly, they share the real-world wisdom and practical tips that can help you level up.
                  </p>
                </div>
                
                <div className="relative glass-card rounded-xl overflow-hidden hover-lift">
                  {/* Large Header Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={insightPosts[currentInsightIndex]?.imageUrl || ''} 
                      alt={insightPosts[currentInsightIndex]?.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Navigation Arrows */}
                    {insightPosts.length > 1 && (
                      <>
                        <button
                          onClick={prevInsight}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110"
                          data-testid="insight-prev-button"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextInsight}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110"
                          data-testid="insight-next-button"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="text-2xl font-display font-bold mb-2">
                        {insightPosts[currentInsightIndex]?.title}
                      </h2>
                      <p className="text-white/90 mb-4 line-clamp-2">
                        {insightPosts[currentInsightIndex]?.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">15 min read • Interview</span>
                        <Button size="sm" variant="secondary" className="transition-all hover:scale-105">
                          Read More →
                        </Button>
                      </div>
                    </div>
                    
                    {/* Dots Indicator */}
                    {insightPosts.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {insightPosts.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentInsightIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentInsightIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Footer Link */}
                <div className="text-center mt-6">
                  <Button variant="ghost" className="text-accent hover:text-accent/80 transition-colors">
                    See all Creator Insights →
                  </Button>
                </div>
              </div>
            )}

            {/* Creator Pulse Posts */}
            {currentTab === 'all' && pulsePosts.length > 0 && (
              <div className="space-y-6 mb-8" data-testid="pulse-posts-feed">
                {pulsePosts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Post Creation */}
            <div className="glass-card rounded-xl p-6 mb-8 hover-lift" data-testid="post-creation-section">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full"></div>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex-1 text-left px-4 py-3 bg-input rounded-lg text-muted-foreground hover:bg-muted transition-colors justify-start"
                  data-testid="create-post-trigger"
                >
                  Share your latest creation...
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    data-testid="media-button"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Media
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 py-2 text-sm bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                    data-testid="poll-button"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Poll
                  </Button>
                </div>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                  data-testid="post-button"
                >
                  Post
                </Button>
              </div>
            </div>

            {/* Regular Posts Feed */}
            <div className="space-y-6" data-testid="posts-feed">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-xl p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                  </div>
                ))
              ) : currentTab === 'saved' ? (
                Array.isArray(allFilteredPosts) && allFilteredPosts.length > 0 ? (
                  allFilteredPosts.map((post: any) => (
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
                    className="transition-all hover:scale-105"
                    data-testid="create-first-post-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                </div>
              )}
            </div>
          </main>

          <RightSidebar />
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40 p-0"
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
}
