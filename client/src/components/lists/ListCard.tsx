import React from 'react';
import { Link } from 'wouter';
import { type ListMeta } from '@/types/lists';
import { PlatformPill } from '@/components/pills/PlatformPill';
import { VoiceBadge } from '@/components/common/VoiceBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Eye, Bookmark, Share } from 'lucide-react';

interface ListCardProps {
  list: ListMeta;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
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

  return (
    <article 
      className="enhanced-card hover-lift group transition-all duration-200"
      data-testid={`list-card-${list.slug}`}
    >
      <Link href={`/community/lists/${list.slug}`}>
        <div className="cursor-pointer">
          {/* Cover Image */}
          {list.coverImageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
              <OptimizedImage
                src={list.coverImageUrl}
                alt={list.title}
                width="100%"
                height="100%"
                aspectRatio="video"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                data-testid={`list-cover-${list.slug}`}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              
              {/* Overlaid badges */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                <Badge 
                  variant="secondary" 
                  className={`${getTypeColor(list.type)} font-medium border-0 shadow-sm`}
                >
                  {list.type}
                </Badge>
                
                {list.isSponsored && (
                  <Badge variant="outline" className="bg-background/90 backdrop-blur-sm shadow-sm">
                    Sponsored
                  </Badge>
                )}
              </div>

              {/* Voice badges */}
              {list.voices.length > 0 && (
                <div className="absolute bottom-3 left-3 flex gap-1">
                  {list.voices.map((voice) => (
                    <VoiceBadge key={voice} voice={voice} size="sm" />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {list.title}
            </h3>
            
            {/* Description */}
            {list.dek && (
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {list.dek}
              </p>
            )}
            
            {/* Platform Pills */}
            <div className="flex flex-wrap gap-1 mb-4">
              {list.platforms.slice(0, 3).map((platform) => (
                <PlatformPill key={platform} platform={platform} size="sm" />
              ))}
              {list.platforms.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{list.platforms.length - 3}
                </Badge>
              )}
            </div>
            
            {/* Meta Info */}
            <div className="text-xs text-muted-foreground mb-4">
              Updated on {new Date(list.updatedAt).toLocaleDateString()}
            </div>
            
            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" />
                <span>{formatViews(list.views)} views</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-accent/50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle save
                  }}
                  data-testid={`save-list-${list.slug}`}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-accent/50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle share
                  }}
                  data-testid={`share-list-${list.slug}`}
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};