import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { VoiceFilter, SortOption, ChartType } from "@/lib/data/charts";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ChartFiltersProps {
  activeChart: ChartType;
  voices: VoiceFilter[];
  platforms: string[];
  sort: SortOption;
  onVoicesChange: (voices: VoiceFilter[]) => void;
  onPlatformsChange: (platforms: string[]) => void;
  onSortChange: (sort: SortOption) => void;
}

const availablePlatforms = [
  'VRChat', 'Roblox', 'Unity', 'Horizon Worlds', 'Unreal', 'IMVU', 
  'Core', 'Minecraft', 'Dreams', 'Fortnite Creative', 'Cross-Platform'
];

const voiceOptions: VoiceFilter[] = ['VHub Picks', 'User Choice'];
const sortOptions: SortOption[] = ['Most Recent', 'Most Viewed'];

export function ChartFilters({
  activeChart,
  voices,
  platforms,
  sort,
  onVoicesChange,
  onPlatformsChange,
  onSortChange
}: ChartFiltersProps) {
  const [isPlatformFiltersCollapsed, setIsPlatformFiltersCollapsed] = useState(true);

  const toggleVoice = (voice: VoiceFilter) => {
    if (voices.includes(voice)) {
      onVoicesChange(voices.filter(v => v !== voice));
    } else {
      onVoicesChange([...voices, voice]);
    }
  };

  const togglePlatform = (platform: string) => {
    if (platforms.includes(platform)) {
      onPlatformsChange(platforms.filter(p => p !== platform));
    } else {
      onPlatformsChange([...platforms, platform]);
    }
  };

  const clearAllFilters = () => {
    onVoicesChange([]);
    onPlatformsChange([]);
    onSortChange('Most Recent');
  };

  const hasActiveFilters = voices.length > 0 || platforms.length > 0 || sort !== 'Most Recent';

  return (
    <div className="space-y-4 bg-card/30 rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-clear-filters"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Voice Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Voice</label>
          <div className="flex flex-wrap gap-1">
            {voiceOptions.map((voice) => (
              <Badge
                key={voice}
                variant={voices.includes(voice) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => toggleVoice(voice)}
                data-testid={`voice-filter-${voice.toLowerCase().replace(' ', '-')}`}
              >
                {voice}
                {voices.includes(voice) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort</label>
          <Select value={sort} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger data-testid="select-sort">
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Platform Filters */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Collapsible
            open={!isPlatformFiltersCollapsed}
            onOpenChange={setIsPlatformFiltersCollapsed}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between p-0 h-auto font-medium text-sm"
                data-testid="button-toggle-platforms"
              >
                <span>Platforms ({platforms.length} selected)</span>
                {isPlatformFiltersCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="flex flex-wrap gap-1">
                {availablePlatforms.map((platform) => (
                  <Badge
                    key={platform}
                    variant={platforms.includes(platform) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20 text-xs"
                    onClick={() => togglePlatform(platform)}
                    data-testid={`platform-filter-${platform.toLowerCase()}`}
                  >
                    {platform}
                    {platforms.includes(platform) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Showing results for {activeChart} • {voices.length > 0 && `${voices.length} voice${voices.length > 1 ? 's' : ''}`}
            {voices.length > 0 && platforms.length > 0 && ' • '}
            {platforms.length > 0 && `${platforms.length} platform${platforms.length > 1 ? 's' : ''}`}
            {(voices.length > 0 || platforms.length > 0) && ` • Sorted by ${sort}`}
          </div>
        </div>
      )}
    </div>
  );
}