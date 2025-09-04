import React from 'react';
import { type Platform } from '@/types/lists';
import { getPlatformColor } from '@/lib/data/lists';
import { Badge } from '@/components/ui/badge';

interface PlatformPillProps {
  platform: Platform;
  size?: 'sm' | 'default';
}

export const PlatformPill: React.FC<PlatformPillProps> = ({ platform, size = 'default' }) => {
  const colorClass = getPlatformColor(platform);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1';
  
  return (
    <Badge 
      variant="secondary" 
      className={`${colorClass} ${sizeClass} font-medium border-0`}
      data-testid={`platform-pill-${platform}`}
    >
      {platform}
    </Badge>
  );
};