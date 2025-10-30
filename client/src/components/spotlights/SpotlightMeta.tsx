import { MapPin, Users, Calendar } from 'lucide-react';
import type { Spotlight } from '@/types/spotlight';

interface SpotlightMetaProps {
  spotlight: Spotlight;
}

export function SpotlightMeta({ spotlight }: SpotlightMetaProps) {
  if (!spotlight.stats) return null;
  
  const { location, followers, years } = spotlight.stats;
  const hasAnyMeta = location || followers || years;
  
  if (!hasAnyMeta) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
      {location && location !== '—' && (
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      )}
      {followers && (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{followers >= 1000 ? `${(followers / 1000).toFixed(1)}K` : followers} followers</span>
        </div>
      )}
      {years && (
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{years} {years === 1 ? 'year' : 'years'} experience</span>
        </div>
      )}
    </div>
  );
}
