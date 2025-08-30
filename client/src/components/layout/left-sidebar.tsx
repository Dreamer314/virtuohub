import { Button } from "@/components/ui/button";
import { Home, TrendingUp, Newspaper, Star, Lightbulb, Monitor, BookOpen, Gamepad2, Hammer, Zap, Mountain, Sword, Target, Palette, Users, Blocks, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { SiRoblox, SiUnity, SiUnrealengine } from "react-icons/si";
import { Link } from "wouter";
import { useState } from "react";

interface LeftSidebarProps {
  currentTab: 'all' | 'saved';
  onTabChange: (tab: 'all' | 'saved') => void;
  selectedPlatforms?: string[];
  onPlatformChange?: (platforms: string[]) => void;
}

export function LeftSidebar({ currentTab, onTabChange, selectedPlatforms = [], onPlatformChange }: LeftSidebarProps) {
  const [isPlatformFiltersCollapsed, setIsPlatformFiltersCollapsed] = useState(false);
  const mainSections = [
    { id: 'feed', label: 'Feed', icon: Home, active: currentTab === 'all', onClick: () => onTabChange('all') },
    { id: 'trending', label: 'Trending', icon: TrendingUp, active: false, onClick: () => {} },
    { id: 'industry', label: 'Industry News', icon: Newspaper, active: false, onClick: () => {} },
    { id: 'spotlights', label: 'Creator Spotlights', icon: Star, active: false, onClick: () => {} },
    { id: 'insights', label: 'Creator Insights', icon: Lightbulb, active: false, href: '/insights' },
    { id: 'tips', label: 'Tips and Guides', icon: BookOpen, active: false, onClick: () => {} },
  ];

  const platformFilters = [
    { id: 'roblox', label: 'Roblox', icon: SiRoblox },
    { id: 'imvu', label: 'IMVU', icon: Users },
    { id: 'secondlife', label: 'Second Life', icon: Monitor },
    { id: 'fortnite', label: 'Fortnite', icon: Target },
    { id: 'minecraft', label: 'Minecraft', icon: Blocks },
    { id: 'gtafivem', label: 'GTA FiveM', icon: Gamepad2 },
    { id: 'metahorizon', label: 'Meta Horizon Worlds', icon: Globe },
    { id: 'vrchat', label: 'VRChat', icon: Monitor },
    { id: 'unity', label: 'Unity', icon: SiUnity },
    { id: 'unreal', label: 'Unreal Engine', icon: SiUnrealengine },
    { id: 'elderscrolls', label: 'Elder Scrolls', icon: Sword },
    { id: 'fallout', label: 'Fallout', icon: Zap },
    { id: 'counterstrike', label: 'Counter-Strike', icon: Target },
    { id: 'teamfortress', label: 'Team Fortress 2', icon: Hammer },
    { id: 'dreams', label: 'Dreams', icon: Palette },
    { id: 'core', label: 'Core', icon: Mountain },
    { id: 'simscc', label: 'The Sims CC', icon: Home },
    { id: 'inzoi', label: 'inZOI', icon: Users },
  ];

  const togglePlatform = (platformId: string) => {
    if (!onPlatformChange) return;
    const updated = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(p => p !== platformId)
      : [...selectedPlatforms, platformId];
    onPlatformChange(updated);
  };

  return (
    <aside className="w-full">
      <div className="sticky top-4">
        <div className="bg-sidebar enhanced-card glow-border rounded-xl p-6 border border-sidebar-border" data-testid="community-navigation">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Community Section
            </h2>
            <p className="text-sm text-muted-foreground">
              Navigation Hub
            </p>
          </div>

          {/* Main Sections */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              MAIN SECTIONS
            </h3>
            <div className="space-y-1">
              {mainSections.map((section) => {
                const Icon = section.icon;
                
                if (section.href) {
                  return (
                    <Link key={section.id} href={section.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start px-3 h-10 transition-all ${
                          section.active
                            ? 'bg-accent/20 text-accent font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                        data-testid={`nav-${section.id}`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {section.label}
                        {section.active && (
                          <span className="ml-auto text-xs font-semibold">
                            [ACTIVE]
                          </span>
                        )}
                      </Button>
                    </Link>
                  );
                }
                
                return (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className={`w-full justify-start px-3 h-10 transition-all ${
                      section.active
                        ? 'bg-accent/20 text-accent font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                    onClick={section.onClick}
                    data-testid={`nav-${section.id}`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {section.label}
                    {section.active && (
                      <span className="ml-auto text-xs font-semibold">
                        [ACTIVE]
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Platform Filters */}
          {onPlatformChange && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  PLATFORM FILTERS
                </h3>
                <button
                  onClick={() => setIsPlatformFiltersCollapsed(!isPlatformFiltersCollapsed)}
                  className="p-1 hover:bg-muted/50 rounded transition-colors"
                  data-testid="platform-filters-toggle"
                >
                  {isPlatformFiltersCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {!isPlatformFiltersCollapsed && (
                <div className="space-y-1">
                  {platformFilters.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    return (
                      <Button
                        key={platform.id}
                        variant="ghost"
                        className={`w-full justify-start px-3 h-10 transition-all ${
                          isSelected
                            ? 'bg-primary/20 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                        onClick={() => togglePlatform(platform.id)}
                        data-testid={`platform-filter-${platform.id}`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {platform.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}