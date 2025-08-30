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
import { Plus, Image, BarChart3, ChevronLeft, ChevronRight, Lightbulb, Star, Calendar, Newspaper, TrendingUp, Play, Pause, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import communityHeaderImage from "@/assets/community-header.png";

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<'all' | 'saved'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);


  // Fetch all posts
  const { data: allPosts, isLoading } = useQuery({
    queryKey: ['/api/posts'],
    enabled: currentTab === 'all',
  });

  const { data: savedPosts } = useQuery({
    queryKey: ['/api/users/user1/saved-posts'],
    enabled: currentTab === 'saved',
  });

  // Get all posts first
  const allPostsData = currentTab === 'all' 
    ? (Array.isArray(allPosts) ? allPosts : [])
    : (Array.isArray(savedPosts) ? savedPosts : []);

  // Separate posts by type FIRST (before filtering)
  const pulsePosts = Array.isArray(allPostsData) 
    ? allPostsData.filter((post: any) => post.type === 'pulse')
    : [];
    
  const insightPosts = Array.isArray(allPostsData) 
    ? allPostsData.filter((post: any) => post.type === 'insight')
    : [];
  
  // ONLY filter regular posts (Community Feed posts) - this is key!
  const regularPosts = Array.isArray(allPostsData) 
    ? allPostsData
        .filter((post: any) => post.type === 'regular')
        .filter((post: any) => {
          // Search filter
          if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
              !post.content.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          // Category filter
          if (selectedCategory !== 'All' && post.category !== selectedCategory) {
            return false;
          }
          // Platform filter
          if (selectedPlatforms.length > 0 && !post.platforms.some((p: string) => selectedPlatforms.includes(p as Platform))) {
            return false;
          }
          return true;
        })
    : [];

  // Featured content data
  const featuredContent = [
    {
      type: 'Creator Insights',
      icon: Lightbulb,
      title: 'Breaking Creative Blocks with AI Tools',
      description: 'Alex Chen shares how he uses generative AI to speed up concept art workflows — without losing the human touch. Practical tips for creators.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
      category: 'Interview',
      link: '/article/breaking-creative-blocks-with-ai-tools'
    },
    {
      type: 'Creator Spotlight',
      icon: Star,
      title: 'Emma Thompson: VR Environment Artist',
      description: 'Creator of award-winning VRChat worlds with over 2M visits. Specializes in atmospheric environments and interactive experiences.',
      image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
      category: 'Profile',
      link: '#'
    },
    {
      type: 'Industry News',
      icon: Newspaper,
      title: 'Virtual Real Estate Market Hits Record High',
      description: 'Decentraland and Sandbox properties see 40% increase in value this quarter as brands invest heavily in virtual experiences.',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
      category: 'Market Report',
      link: '#'
    }
  ];

  // Navigation functions for insight carousel
  const nextInsight = () => {
    setCurrentInsightIndex((prev) => (prev + 1) % insightPosts.length);
  };

  const prevInsight = () => {
    setCurrentInsightIndex((prev) => (prev - 1 + insightPosts.length) % insightPosts.length);
  };

  // Navigation functions for featured content
  const nextFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % featuredContent.length);
    setIsAutoplayPaused(true);
    // Resume autoplay after 10 seconds of manual control
    setTimeout(() => setIsAutoplayPaused(false), 10000);
  };

  const prevFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev - 1 + featuredContent.length) % featuredContent.length);
    setIsAutoplayPaused(true);
    // Resume autoplay after 10 seconds of manual control
    setTimeout(() => setIsAutoplayPaused(false), 10000);
  };

  // Auto-advance featured content every 5 seconds
  useEffect(() => {
    if (isAutoplayPaused || featuredContent.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredContent.length, isAutoplayPaused]);

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
        <div className="flex-1 lg:ml-64 lg:mr-80">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-8">
            <div className="grid grid-cols-1 gap-8">
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
            {/* Hero Section */}
            <div className="glass-card rounded-xl mb-8 overflow-hidden hover-lift" data-testid="hero-section">
              <div className="relative h-48 flex items-center justify-center">
                <img 
                  src={communityHeaderImage} 
                  alt="VirtuoHub Community Header"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="text-center z-10 relative">
                  <h1 className="text-3xl font-display font-bold text-white mb-2">
                    VirtuoHub Community
                  </h1>
                  <p className="text-white/80">
                    Connect, Create, and Collaborate in Virtual Worlds
                  </p>
                </div>
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            </div>

            {/* Featured Content Carousel */}
            {currentTab === 'all' && (
              <div className="mb-8" data-testid="featured-carousel">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent flex-1"></div>
                  <div className="flex items-center space-x-4">
                    {(() => {
                      const Icon = featuredContent[currentFeaturedIndex].icon;
                      return <Icon className="w-8 h-8 text-purple-600" />;
                    })()}
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                      Featured Content
                    </h2>
                  </div>
                  <div className="h-px bg-gradient-to-r from-accent via-transparent to-transparent flex-1"></div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Autoplay Control */}
                  <button
                    onClick={() => setIsAutoplayPaused(!isAutoplayPaused)}
                    className="bg-transparent text-accent p-2 rounded-full transition-all hover:border-accent hover:border-2 border border-accent/30"
                    data-testid="autoplay-toggle-button"
                    title={isAutoplayPaused ? "Start slideshow" : "Pause slideshow"}
                  >
                    {isAutoplayPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  {/* Left Navigation Arrow */}
                  <button
                    onClick={prevFeatured}
                    className="bg-transparent text-accent p-3 rounded-full transition-all hover:border-accent hover:border-2 border border-accent/30"
                    data-testid="featured-prev-button"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Featured Content Card */}
                  <div className="relative glass-card rounded-xl overflow-hidden hover-lift flex-1">
                    {/* Large Header Image */}
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={featuredContent[currentFeaturedIndex].image} 
                        alt={featuredContent[currentFeaturedIndex].title}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Content Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {featuredContent[currentFeaturedIndex].type}
                        </span>
                      </div>
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-2xl font-display font-bold mb-2">
                          {featuredContent[currentFeaturedIndex].title}
                        </h2>
                        <p className="text-white/90 mb-4 line-clamp-2">
                          {featuredContent[currentFeaturedIndex].description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">{featuredContent[currentFeaturedIndex].category}</span>
                          {featuredContent[currentFeaturedIndex].link !== '#' ? (
                            <Link href={featuredContent[currentFeaturedIndex].link}>
                              <Button size="sm" variant="secondary" className="transition-all hover:border-2">
                                Read More →
                              </Button>
                            </Link>
                          ) : (
                            <Button size="sm" variant="secondary" className="transition-all" disabled>
                              Coming Soon
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Navigation Arrow */}
                  <button
                    onClick={nextFeatured}
                    className="bg-transparent text-accent p-3 rounded-full transition-all hover:border-accent hover:border-2 border border-accent/30"
                    data-testid="featured-next-button"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Dots Indicator */}
                <div className="flex justify-center mt-4 space-x-2">
                  {featuredContent.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentFeaturedIndex(index);
                        setIsAutoplayPaused(true);
                        setTimeout(() => setIsAutoplayPaused(false), 10000);
                      }}
                      className={`relative w-3 h-3 rounded-full transition-all ${
                        index === currentFeaturedIndex
                          ? 'bg-accent scale-125'
                          : 'bg-accent/30 hover:bg-accent/50'
                      }`}
                      data-testid={`featured-dot-${index}`}
                    >
                      {index === currentFeaturedIndex && !isAutoplayPaused && (
                        <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Autoplay Status */}
                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${
                    isAutoplayPaused ? 'bg-orange-500' : 'bg-green-500 animate-pulse'
                  }`}></div>
                  <span>{isAutoplayPaused ? 'Slideshow paused' : 'Auto-rotating every 5s'}</span>
                </div>
              </div>
            )}

            {/* The Creator Pulse */}
            {currentTab === 'all' && pulsePosts.length > 0 && (
              <div className="mb-8" data-testid="pulse-posts-feed">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                      The Creator Pulse
                    </h2>
                  </div>
                  <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                </div>
                <div className="space-y-6">
                  {pulsePosts.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* Community Feed Header */}
            <div className="mb-8" data-testid="community-feed-section">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent flex-1"></div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-4xl font-bold text-foreground tracking-tight">
                    Community Feed
                  </h2>
                </div>
                <div className="h-px bg-gradient-to-r from-accent via-transparent to-transparent flex-1"></div>
              </div>

              {/* Filter Controls */}
              <div className="glass-card rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Filter className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold text-foreground">Filter & Search</h3>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:border-accent focus:ring-1 focus:ring-accent/20"
                      data-testid="search-input"
                    />
                  </div>
                  
                  {/* Category Filter Dropdown */}
                  <div className="min-w-[200px]">
                    <Select value={selectedCategory} onValueChange={(value: Category) => setSelectedCategory(value)}>
                      <SelectTrigger className="bg-background/50 border-border/50 focus:border-accent focus:ring-1 focus:ring-accent/20" data-testid="category-select">
                        <SelectValue placeholder="Filter Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Categories</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Assets for Sale">Assets for Sale</SelectItem>
                        <SelectItem value="Jobs & Gigs">Jobs & Gigs</SelectItem>
                        <SelectItem value="Freelance/Hiring">Freelance/Hiring</SelectItem>
                        <SelectItem value="Collaborations">Collaborations</SelectItem>
                        <SelectItem value="WIP">Work in Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Active Filters Display */}
                {(selectedCategory !== 'All' || searchQuery) && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Active filters:</span>
                      {selectedCategory !== 'All' && (
                        <span className="px-2 py-1 bg-accent/20 text-accent rounded-full">
                          {selectedCategory}
                        </span>
                      )}
                      {searchQuery && (
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded-full">
                          Search: "{searchQuery}"
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory('All');
                          setSearchQuery('');
                        }}
                        className="ml-auto h-6 px-2 text-xs hover:bg-destructive/20 hover:text-destructive"
                        data-testid="clear-filters"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Post Creation */}
            <div className="glass-card rounded-xl p-6 mb-8 hover-lift" data-testid="post-creation-section">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full"></div>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex-1 text-left px-4 py-3 bg-input rounded-lg text-muted-foreground hover:border-2 hover:border-muted-foreground/30 border border-transparent transition-all justify-start"
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
                    className="px-3 py-2 text-sm bg-transparent text-primary hover:border-primary hover:border-2 border border-primary/30 transition-all"
                    data-testid="media-button"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Media
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 py-2 text-sm bg-transparent text-accent hover:border-accent hover:border-2 border border-accent/30 transition-all"
                    data-testid="poll-button"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Poll
                  </Button>
                </div>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-2 bg-transparent text-primary hover:border-primary hover:border-2 border border-primary/30 transition-all"
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
                Array.isArray(allPostsData) && allPostsData.length > 0 ? (
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

          {/* Mobile Right Sidebar - only show on smaller screens */}
          <div className="lg:hidden mt-8">
            <RightSidebar />
          </div>
            </div>
          </div>
        </div>
      </div>

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
}
