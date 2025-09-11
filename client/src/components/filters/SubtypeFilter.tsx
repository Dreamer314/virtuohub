import React from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, BarChart3, Star, Mic, Lightbulb, Newspaper, TrendingUp, Calendar, FileText, List } from 'lucide-react';

interface SubtypeFilterProps {
  selectedSubtypes: string[];
  onSubtypeToggle: (subtype: string) => void;
  showAllOption?: boolean;
  className?: string;
}

export type PostSubtype = 'thread' | 'poll' | 'spotlight' | 'interview' | 'tip' | 'news' | 'trending' | 'event' | 'report' | 'list';

const subtypeConfig: Record<PostSubtype, { label: string; icon: React.ReactNode; description: string }> = {
  thread: {
    label: 'Threads',
    icon: <MessageSquare className="w-4 h-4" />,
    description: 'General discussions and conversations'
  },
  poll: {
    label: 'Polls',
    icon: <BarChart3 className="w-4 h-4" />,
    description: 'VHub Data Pulse community polls'
  },
  spotlight: {
    label: 'Spotlights',
    icon: <Star className="w-4 h-4" />,
    description: 'Featured creators and projects'
  },
  interview: {
    label: 'Interviews',
    icon: <Mic className="w-4 h-4" />,
    description: 'Creator interviews and Q&As'
  },
  tip: {
    label: 'Tips',
    icon: <Lightbulb className="w-4 h-4" />,
    description: 'Tips, tutorials, and guides'
  },
  news: {
    label: 'News',
    icon: <Newspaper className="w-4 h-4" />,
    description: 'Industry news and updates'
  },
  trending: {
    label: 'Trending',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Trending topics and discussions'
  },
  event: {
    label: 'Events',
    icon: <Calendar className="w-4 h-4" />,
    description: 'Virtual events and meetups'
  },
  report: {
    label: 'Reports',
    icon: <FileText className="w-4 h-4" />,
    description: 'Data reports and analysis'
  },
  list: {
    label: 'Lists',
    icon: <List className="w-4 h-4" />,
    description: 'Curated lists and rankings'
  }
};

export const SubtypeFilter: React.FC<SubtypeFilterProps> = ({
  selectedSubtypes,
  onSubtypeToggle,
  showAllOption = true,
  className = ''
}) => {
  const isAllSelected = selectedSubtypes.length === 0;
  const allSubtypes = Object.keys(subtypeConfig) as PostSubtype[];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} data-testid="subtype-filter">
      {showAllOption && (
        <button
          onClick={() => {
            // Clear all selections to show all subtypes
            selectedSubtypes.forEach(subtype => onSubtypeToggle(subtype));
          }}
          className={cn(
            'vh-category-pill inline-flex items-center gap-2',
            isAllSelected ? 'active' : ''
          )}
          data-testid="subtype-all"
        >
          <MessageSquare className="w-4 h-4" />
          All Posts
        </button>
      )}
      
      {allSubtypes.map((subtype) => {
        const isSelected = selectedSubtypes.includes(subtype);
        const config = subtypeConfig[subtype];
        
        return (
          <button
            key={subtype}
            onClick={() => onSubtypeToggle(subtype)}
            className={cn(
              'vh-category-pill inline-flex items-center gap-2',
              isSelected ? 'active' : ''
            )}
            title={config.description}
            data-testid={`subtype-${subtype}`}
          >
            {config.icon}
            {config.label}
          </button>
        );
      })}
    </div>
  );
};