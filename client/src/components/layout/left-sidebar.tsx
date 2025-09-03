import { Button } from "@/components/ui/button";
import { Home, TrendingUp, Newspaper, Star, Lightbulb, Monitor, BookOpen, Gamepad2, Hammer, Zap, Mountain, Sword, Target, Palette, Users, Blocks, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { SiRoblox, SiUnity, SiUnrealengine } from "react-icons/si";
import { Link, useLocation } from "wouter";
import { useState } from "react";

interface LeftSidebarProps {
  currentTab: 'all' | 'saved';
  onTabChange: (tab: 'all' | 'saved') => void;
  selectedPlatforms?: string[];
  onPlatformChange?: (platforms: string[]) => void;
  currentSection?: 'feed' | 'trending' | 'industry' | 'spotlights' | 'insights' | 'tips';
  onSectionChange?: (section: 'feed' | 'trending' | 'industry' | 'spotlights' | 'insights' | 'tips') => void;
}

export function LeftSidebar({ 
  currentTab, 
  onTabChange, 
  selectedPlatforms = [], 
  onPlatformChange,
  currentSection = 'feed',
  onSectionChange 
}: LeftSidebarProps) {
  const [isPlatformFiltersCollapsed, setIsPlatformFiltersCollapsed] = useState(false);
  const [location] = useLocation();
  
  const mainSections = [
    { 
      id: 'feed', 
      label: 'Feed', 
      icon: Home, 
      active: location === '/' || location === '/community', 
      href: '/'
    },
    { 
      id: 'spotlights', 
      label: 'Spotlights', 
      icon: Star, 
      active: location === '/spotlights' || location.startsWith('/spotlights/') || location.startsWith('/spotlight/'), 
      href: '/spotlights'
    },
    { 
      id: 'interviews', 
      label: 'Interviews', 
      icon: Lightbulb, 
      active: location === '/interviews' || location.startsWith('/interviews/') || location.startsWith('/interview/'), 
      href: '/interviews' 
    },
    { 
      id: 'guides', 
      label: 'Tips & Guides', 
      icon: BookOpen, 
      active: location === '/guides' || location.startsWith('/guides/'), 
      href: '/guides'
    },
    { 
      id: 'news', 
      label: 'Industry News', 
      icon: Newspaper, 
      active: location === '/news' || location.startsWith('/news/'), 
      href: '/news'
    },
    { 
      id: 'trending', 
      label: 'Trending', 
      icon: TrendingUp, 
      active: location === '/trending', 
      href: '/trending'
    },
    { 
      id: 'events', 
      label: 'Events', 
      icon: Monitor, 
      active: location === '/events' || location.startsWith('/events/'), 
      href: '/events'
    },
    { 
      id: 'pulse', 
      label: 'Pulse Reports', 
      icon: Zap, 
      active: location === '/pulse' || location.startsWith('/pulse/'), 
      href: '/pulse'
    },
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
      <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
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
                
                return (
                  <Link key={section.id} href={section.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between px-3 h-10 transition-all ${
                        section.active
                          ? 'bg-accent/20 text-accent font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                      data-testid={`nav-${section.id}`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-3" />
                        {section.label}
                      </div>
                      {section.active && (
                        <span className="text-xs font-semibold text-accent">
                          [ACTIVE]
                        </span>
                      )}
                    </Button>
                  </Link>
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