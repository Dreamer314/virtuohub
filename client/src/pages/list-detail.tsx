import React, { useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { type FullList } from '@/types/lists';
import { getListBySlug, incrementViews, getRelatedLists } from '@/lib/data/lists';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PlatformPill } from '@/components/pills/PlatformPill';
import { VoiceBadge } from '@/components/common/VoiceBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Clock, ExternalLink, Heart } from 'lucide-react';
import { Link } from 'wouter';

const ListDetailPage: React.FC = () => {
  const [, params] = useRoute('/community/lists/:slug');
  const slug = params?.slug;

  // Fetch list data
  const { data: list, isLoading, error } = useQuery<FullList | null>({
    queryKey: ['list', slug],
    queryFn: () => slug ? getListBySlug(slug) : null,
    enabled: !!slug
  });

  // Fetch related lists
  const { data: relatedLists = [] } = useQuery({
    queryKey: ['related-lists', list?.id],
    queryFn: () => list ? getRelatedLists(list.id) : [],
    enabled: !!list
  });

  // Increment views on mount
  useEffect(() => {
    if (slug) {
      incrementViews(slug);
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCreatePost={() => {}} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCreatePost={() => {}} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">List Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The list you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/community/lists">
              <Button>Back to Lists</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatViews = (views: number): string => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getTypeColor = (type: string): string => {
    const colors = {
      'Charting': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Best Of': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Entertainment': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const isRankedList = list.items.every(item => item.rank !== undefined);

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
              selectedPlatforms={[]}
              onPlatformChange={() => {}}
              currentSection="feed"
            />
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="grid-right hidden lg:block bg-background/95 backdrop-blur-sm border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <RightSidebar />
            
            {/* Related Lists */}
            {relatedLists.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-foreground mb-4">Related Lists</h3>
                <div className="space-y-3">
                  {relatedLists.map((relatedList) => (
                    <Link key={relatedList.id} href={`/community/lists/${relatedList.slug}`}>
                      <div className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                          {relatedList.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatViews(relatedList.views)} views
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid-main relative z-0">
          <div className="py-8 relative z-10 px-4 lg:px-8">
            
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Link href="/community/lists">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Lists
                </Button>
              </Link>
            </div>
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Cover Image */}
                {list.coverImageUrl && (
                  <div className="lg:w-80 aspect-[16/9] rounded-lg overflow-hidden">
                    <img
                      src={list.coverImageUrl}
                      alt={list.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                )}
                
                {/* Header Info */}
                <div className="flex-1">
                  {/* Tags and Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge 
                      variant="secondary" 
                      className={`${getTypeColor(list.type)} font-medium border-0`}
                    >
                      {list.type}
                    </Badge>
                    
                    {list.voices.map((voice) => (
                      <VoiceBadge key={voice} voice={voice} />
                    ))}
                    
                    {list.isSponsored && (
                      <Badge variant="outline">
                        Sponsored by {list.sponsorName}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                    {list.title}
                  </h1>
                  
                  {/* Description */}
                  {list.dek && (
                    <p className="text-lg text-muted-foreground mb-6">
                      {list.dek}
                    </p>
                  )}
                  
                  {/* Platforms */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {list.platforms.map((platform) => (
                      <PlatformPill key={platform} platform={platform} />
                    ))}
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatViews(list.views)} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Updated {new Date(list.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* List Content */}
            <div className="max-w-4xl">
              <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
                {/* List Header */}
                <div className="p-6 bg-muted/20 border-b border-border/30">
                  <h2 className="text-xl font-bold text-foreground">
                    {isRankedList ? 'Rankings' : 'Featured Items'}
                  </h2>
                  {list.methodology && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {list.methodology}
                    </p>
                  )}
                </div>
                
                {/* List Items */}
                <div className="divide-y divide-border/20">
                  {list.items.map((item, index) => (
                    <div 
                      key={item.id}
                      className="p-6 hover:bg-muted/10 transition-colors"
                      data-testid={`list-item-${item.id}`}
                    >
                      <div className="flex gap-4">
                        {/* Rank or Bullet */}
                        {isRankedList ? (
                          <div className="flex-shrink-0 w-8 text-center">
                            <span className={`text-2xl font-bold ${
                              index === 0 ? 'text-amber-500' :
                              index === 1 ? 'text-gray-400' :
                              index === 2 ? 'text-amber-600' :
                              'text-muted-foreground'
                            }`}>
                              {item.rank || index + 1}
                            </span>
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-3"></div>
                        )}
                        
                        {/* Image */}
                        {item.imageUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover border border-border/50"
                              loading="lazy"
                            />
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-foreground">
                              {item.title}
                            </h3>
                            
                            {item.metricValue && (
                              <div className="text-right">
                                <div className="font-semibold text-foreground">
                                  {item.metricValue.toLocaleString()}
                                </div>
                                {item.metricLabel && (
                                  <div className="text-xs text-muted-foreground">
                                    {item.metricLabel}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Summary */}
                          {item.summary && (
                            <p className="text-muted-foreground text-sm mb-3">
                              {item.summary}
                            </p>
                          )}
                          
                          {/* Platforms and CTA */}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {item.platforms.slice(0, 3).map((platform) => (
                                <PlatformPill key={platform} platform={platform} size="sm" />
                              ))}
                            </div>
                            
                            {item.ctaHref && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={item.ctaHref} target="_blank" rel="noopener noreferrer">
                                  {item.ctaLabel || 'View'}
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="mt-8 p-6 bg-muted/20 rounded-lg border border-border/30">
                <h3 className="font-semibold text-foreground mb-3">How we built this list</h3>
                <p className="text-sm text-muted-foreground">
                  {list.methodology || 'This list was curated based on community feedback, engagement metrics, and platform data.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListDetailPage;