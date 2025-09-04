import React from 'react';
import { useLocation } from 'wouter';
import { type ListType, type VoiceTag, type Platform } from '@/types/lists';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface ListFiltersProps {
  selectedType?: ListType;
  selectedVoices: VoiceTag[];
  selectedPlatforms: Platform[];
  selectedSort: string;
  onTypeChange: (type?: ListType) => void;
  onVoicesChange: (voices: VoiceTag[]) => void;
  onPlatformsChange: (platforms: Platform[]) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

const LIST_TYPES: ListType[] = ['Charting', 'Upcoming', 'Best Of', 'Entertainment'];
const VOICE_TAGS: VoiceTag[] = ['VHub Picks', 'User Choice'];
const PLATFORMS: Platform[] = [
  'Roblox', 'VRChat', 'Second Life', 'IMVU', 'Horizon Worlds',
  'Sims', 'GTA RP', 'Unity', 'Unreal', 'InZoi', 'Cross-Platform'
];

export const ListFilters: React.FC<ListFiltersProps> = ({
  selectedType,
  selectedVoices,
  selectedPlatforms,
  selectedSort,
  onTypeChange,
  onVoicesChange,
  onPlatformsChange,
  onSortChange,
  onClearFilters
}) => {
  const hasActiveFilters = selectedType || selectedVoices.length > 0 || selectedPlatforms.length > 0 || selectedSort !== 'recent';

  const handleVoiceToggle = (voice: VoiceTag) => {
    const newVoices = selectedVoices.includes(voice)
      ? selectedVoices.filter(v => v !== voice)
      : [...selectedVoices, voice];
    onVoicesChange(newVoices);
  };

  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    onPlatformsChange(newPlatforms);
  };

  return (
    <div className="sticky top-[var(--header-height)] z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Filter Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          {/* Type Segmented Control */}
          <div className="flex flex-wrap gap-1" data-testid="type-filter">
            <Button
              variant={!selectedType ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange(undefined)}
              className="h-8 px-3 text-xs"
            >
              All Types
            </Button>
            {LIST_TYPES.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange(type)}
                className="h-8 px-3 text-xs"
                data-testid={`type-filter-${type.toLowerCase().replace(' ', '-')}`}
              >
                {type}
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="hidden lg:block h-6" />

          {/* Voice Filters */}
          <div className="flex items-center gap-3" data-testid="voice-filters">
            <span className="text-sm font-medium text-muted-foreground">Voice:</span>
            {VOICE_TAGS.map((voice) => (
              <label 
                key={voice} 
                className="flex items-center gap-2 cursor-pointer text-sm"
                data-testid={`voice-filter-${voice.toLowerCase().replace(' ', '-')}`}
              >
                <Checkbox
                  checked={selectedVoices.includes(voice)}
                  onCheckedChange={() => handleVoiceToggle(voice)}
                />
                {voice}
              </label>
            ))}
          </div>

          <Separator orientation="vertical" className="hidden lg:block h-6" />

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Sort:</span>
            <Select value={selectedSort} onValueChange={onSortChange}>
              <SelectTrigger className="w-40 h-8 text-sm" data-testid="sort-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="viewed">Most Viewed</SelectItem>
                <SelectItem value="rated">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
              data-testid="clear-filters"
            >
              <X className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Platform Pills - Collapsible Row */}
        {selectedPlatforms.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <div className="flex flex-wrap gap-2" data-testid="platform-filters">
              {PLATFORMS.map((platform) => (
                <Badge
                  key={platform}
                  variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                  className="cursor-pointer text-xs px-2 py-1 transition-colors hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handlePlatformToggle(platform)}
                  data-testid={`platform-filter-${platform.toLowerCase().replace(' ', '-')}`}
                >
                  {platform}
                  {selectedPlatforms.includes(platform) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Platform Toggle Button - Show when no platforms selected */}
        {selectedPlatforms.length === 0 && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                <span>Filter by Platform</span>
                <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-2 flex flex-wrap gap-2" data-testid="platform-filters">
                {PLATFORMS.map((platform) => (
                  <Badge
                    key={platform}
                    variant="outline"
                    className="cursor-pointer text-xs px-2 py-1 transition-colors hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handlePlatformToggle(platform)}
                    data-testid={`platform-filter-${platform.toLowerCase().replace(' ', '-')}`}
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};