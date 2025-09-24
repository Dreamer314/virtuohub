import React, { useEffect } from 'react';
import { Calendar, MapPin, Clock, ExternalLink, Users } from 'lucide-react';
import { Link } from 'wouter';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/cards/PostCard';
import { Footer } from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useFilterStore } from '@/lib/stores/filter-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const EventsPage: React.FC = () => {
  const { actions } = useURLFilters();
  const filterStore = useFilterStore();

  // Initialize page-specific filtering on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Only set event filter if it's not already active or if there are conflicting filters
    const currentSubtypes = filterStore.selectedSubtypes;
    const hasEventFilter = currentSubtypes.includes('event');
    const hasOtherFilters = currentSubtypes.some(subtype => subtype !== 'event');
    
    if (!hasEventFilter || hasOtherFilters) {
      // Clear other subtypes and set event - but do it gently
      if (hasOtherFilters) {
        actions.clearSubtypes();
      }
      if (!hasEventFilter) {
        actions.addSubtype('event');
      }
    }
  }, []); // Remove actions from dependencies to prevent re-runs

  // Fetch all posts and filter for event posts using unified schema
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  // Filter posts by event subtype and apply other active filters
  const eventPosts = posts
    .filter(post => {
      // Always include event subtype
      if (post.subtype !== 'event') return false;
      
      // Apply platform filtering if active
      if (filterStore.selectedPlatforms.length > 0) {
        const hasMatchingPlatform = post.platforms?.some(platform => 
          filterStore.selectedPlatforms.includes(platform as any)
        );
        if (!hasMatchingPlatform) return false;
      }
      
      // Apply search query if active
      if (filterStore.searchQuery.trim()) {
        const query = filterStore.searchQuery.toLowerCase();
        const matchesSearch = 
          post.title.toLowerCase().includes(query) ||
          post.body?.toLowerCase().includes(query) ||
          post.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by event start time if available, otherwise by creation date
      const aEventData = a.subtypeData as any;
      const bEventData = b.subtypeData as any;
      
      const aStartTime = aEventData?.startTime ? new Date(aEventData.startTime).getTime() : 0;
      const bStartTime = bEventData?.startTime ? new Date(bEventData.startTime).getTime() : 0;
      
      if (aStartTime && bStartTime) {
        return aStartTime - bStartTime; // Upcoming events first
      }
      
      // Fallback to creation date sorting
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      if (filterStore.sortBy === 'recent') {
        return filterStore.sortDirection === 'desc' ? bTime - aTime : aTime - bTime;
      } else if (filterStore.sortBy === 'popular') {
        const aPopularity = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
        const bPopularity = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
        return filterStore.sortDirection === 'desc' ? bPopularity - aPopularity : aPopularity - bPopularity;
      }
      return bTime - aTime; // Default to recent desc
    });

  // Helper function to format event date
  const formatEventDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Helper function to format event time
  const formatEventTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-xl" style={{ animationDelay: '-2s' }}></div>
        <div className="floating-element absolute bottom-20 left-1/4 w-20 h-20 bg-primary/15 rounded-full blur-xl" style={{ animationDelay: '-4s' }}></div>
      </div>

      <Header onCreatePost={() => {}} />
      
      <div className="community-grid">
        {/* Left Sidebar */}
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar
              currentTab="all"
              onTabChange={() => {}}
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
                  />
                </div>

                {/* Main Content */}
                <main>
                  {/* Page Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4">
                          <Calendar className="w-8 h-8 text-transparent bg-gradient-dusk bg-clip-text" style={{backgroundImage: 'var(--gradient-dusk)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Events
                          </h1>
                        </div>
                        <div className="h-px bg-gradient-to-r from-accent via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      What's happening next, online and IRL
                    </p>
                  </div>

                  {/* Search and Filter Integration */}
                  <div className="mb-6">
                    <div className="text-center text-sm text-muted-foreground">
                      {eventPosts.length === 0 
                        ? 'No events match your current filters'
                        : `Showing ${eventPosts.length} event${eventPosts.length !== 1 ? 's' : ''}`
                      }
                      {filterStore.hasActiveFilters() && (
                        <button 
                          onClick={actions.clearFilters}
                          className="ml-2 text-primary hover:text-primary/80 underline vh-btn"
                          data-variant="link"
                          data-testid="button-clear-filters"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Event Posts */}
                  <div className="space-y-8">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">Loading events...</div>
                      </div>
                    ) : eventPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                          No events found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {filterStore.hasActiveFilters() 
                            ? 'Try adjusting your filters to see more content.'
                            : 'No events are scheduled yet. Check back soon!'}
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Render Event Posts Dynamically */}
                        {eventPosts.map((post) => {
                          const eventData = post.subtypeData as any;
                          return (
                            <div key={post.id} className="enhanced-card hover-lift rounded-xl overflow-hidden">
                              {/* Event Header */}
                              <div className="flex flex-col lg:flex-row gap-6 p-6">
                                {/* Event Date Badge */}
                                <div className="lg:w-32 flex-shrink-0">
                                  <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-4 text-center text-white">
                                    {eventData?.startTime ? (
                                      <>
                                        <div className="text-sm font-medium opacity-90">
                                          {formatEventDate(eventData.startTime).split(' ')[0]}
                                        </div>
                                        <div className="text-2xl font-bold">
                                          {formatEventDate(eventData.startTime).split(' ')[2]}
                                        </div>
                                        <div className="text-sm opacity-90">
                                          {formatEventDate(eventData.startTime).split(' ')[1]}
                                        </div>
                                      </>
                                    ) : (
                                      <Calendar className="w-8 h-8 mx-auto" />
                                    )}
                                  </div>
                                </div>

                                {/* Event Details */}
                                <div className="flex-1">
                                  <div className="mb-4">
                                    <Badge variant="secondary" className="mb-2">
                                      Event
                                    </Badge>
                                    <h2 className="text-2xl font-bold text-foreground mb-2" data-testid={`text-event-title-${post.id}`}>
                                      {post.title}
                                    </h2>
                                    {post.summary && (
                                      <p className="text-lg text-muted-foreground mb-4" data-testid={`text-event-summary-${post.id}`}>
                                        {post.summary}
                                      </p>
                                    )}
                                  </div>

                                  {/* Event Meta Information */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {eventData?.startTime && (
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>
                                          {formatEventTime(eventData.startTime)}
                                          {eventData?.endTime && ` - ${formatEventTime(eventData.endTime)}`}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {eventData?.location && (
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{eventData.location}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Platform Tags */}
                                  {post.platforms && post.platforms.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {post.platforms.map((platform) => (
                                        <Badge key={platform} variant="outline" className="text-xs">
                                          {platform}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}

                                  {/* Event Description */}
                                  <div className="mb-4">
                                    <p className="text-muted-foreground" data-testid={`text-event-description-${post.id}`}>
                                      {post.body}
                                    </p>
                                  </div>

                                  {/* Event Actions */}
                                  <div className="flex items-center gap-4 mt-6">
                                    {eventData?.rsvpLink && (
                                      <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                                        <a 
                                          href={eventData.rsvpLink} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          data-testid={`link-rsvp-${post.id}`}
                                        >
                                          <Users className="w-4 h-4 mr-2" />
                                          RSVP Now
                                          <ExternalLink className="w-4 h-4 ml-2" />
                                        </a>
                                      </Button>
                                    )}
                                    
                                    {/* Engagement metrics */}
                                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                                      <span className="flex items-center gap-1">
                                        👍 {post.likes || 0}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        💬 {post.comments || 0}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        🔄 {post.shares || 0}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Featured Event (fallback content when there are events) */}
                        {eventPosts.length > 0 && (
                          <div className="mt-8">
                            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                              Featured Event
                            </h2>
                            <article className="enhanced-card hover-lift rounded-xl overflow-hidden border-2 border-primary/20">
                              <div className="flex flex-col lg:flex-row gap-8">
                                {/* Event Image/Icon */}
                                <div className="lg:w-1/3">
                                  <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <span className="text-6xl relative z-10">🌐</span>
                                    <div className="absolute bottom-4 left-4 right-4 z-10">
                                      <div className="text-white font-semibold">Virtual Metaverse Summit</div>
                                      <div className="text-white/80 text-sm">March 15-16, 2025</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Event Content */}
                                <div className="lg:w-2/3 p-8">
                                  <div className="mb-4">
                                    <Badge className="bg-primary/20 text-primary border border-primary/30">
                                      Featured Event
                                    </Badge>
                                  </div>
                                  
                                  <h2 className="text-3xl font-bold text-foreground mb-3">
                                    Virtual Metaverse Summit 2025
                                  </h2>
                                  <p className="text-lg text-muted-foreground mb-6">
                                    The largest gathering of metaverse creators, developers, and visionaries
                                  </p>

                                  {/* Event Details */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                                      <span>March 15-16, 2025</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Clock className="w-4 h-4 mr-2 text-primary" />
                                      <span>9:00 AM - 6:00 PM PST</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                                      <span>VRChat & Horizon Worlds</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Users className="w-4 h-4 mr-2 text-primary" />
                                      <span>5000+ Expected Attendees</span>
                                    </div>
                                  </div>

                                  {/* Event Description */}
                                  <div className="mb-6">
                                    <p className="text-muted-foreground mb-4">
                                      Join industry leaders, creators, and innovators for two days of groundbreaking sessions, 
                                      workshops, and networking opportunities in the metaverse. Explore the future of virtual 
                                      worlds, learn from successful creators, and connect with your community.
                                    </p>
                                    
                                    <h3 className="font-semibold text-foreground mb-2">Highlights Include:</h3>
                                    <ul className="text-muted-foreground space-y-1">
                                      <li>• Keynotes from top metaverse companies</li>
                                      <li>• Creator workshops and masterclasses</li>
                                      <li>• Virtual world showcases and demos</li>
                                      <li>• Networking sessions and career fair</li>
                                    </ul>
                                  </div>

                                  {/* Platform Tags */}
                                  <div className="flex flex-wrap gap-3 mb-6">
                                    <Badge variant="outline">VRChat</Badge>
                                    <Badge variant="outline">Horizon Worlds</Badge>
                                    <Badge variant="outline">Unity</Badge>
                                    <Badge variant="outline">Unreal Engine</Badge>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-wrap gap-3">
                                    <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                                      <Users className="w-4 h-4 mr-2" />
                                      Register Now
                                      <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                    <Button variant="outline">
                                      Learn More
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </article>
                          </div>
                        )}
                      </>
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

export default EventsPage;