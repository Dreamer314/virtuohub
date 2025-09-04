import React from 'react';
import { type VoiceTag } from '@/types/lists';
import { Badge } from '@/components/ui/badge';
import { Star, Users } from 'lucide-react';

interface VoiceBadgeProps {
  voice: VoiceTag;
  size?: 'sm' | 'default';
}

export const VoiceBadge: React.FC<VoiceBadgeProps> = ({ voice, size = 'default' }) => {
  const isVHubPicks = voice === 'VHub Picks';
  const icon = isVHubPicks ? Star : Users;
  const Icon = icon;
  
  const baseClass = isVHubPicks 
    ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-800'
    : 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-800';
  
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1';
  const iconSize = size === 'sm' ? 12 : 14;
  
  return (
    <Badge 
      variant="outline" 
      className={`${baseClass} ${sizeClass} font-medium flex items-center gap-1`}
      data-testid={`voice-badge-${voice.toLowerCase().replace(' ', '-')}`}
    >
      <Icon size={iconSize} />
      {voice}
    </Badge>
  );
};