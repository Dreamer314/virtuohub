import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { User, Search, X } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";

// Primary roles matching profile settings
const PRIMARY_ROLES = [
  "3D Modeler",
  "World Builder",
  "Environment Artist",
  "Character Artist",
  "Rigger",
  "Animator",
  "Scripter / Programmer",
  "Technical Artist",
  "UI / UX Designer",
  "Sound Designer",
  "Video Editor",
  "Community Manager",
  "Store Owner",
  "Educator",
  "Publisher / Producer",
  "Investor",
  "Other (Business / Education)"
];

// Platforms matching profile settings
const PLATFORMS = [
  "Roblox",
  "VRChat",
  "Second Life",
  "IMVU",
  "Meta Horizon Worlds",
  "GTA / FiveM",
  "The Sims (CC)",
  "Unity",
  "Unreal Engine"
];

// Tools matching profile settings
const TOOLS = [
  "Blender",
  "Maya",
  "ZBrush",
  "Substance Painter",
  "Photoshop",
  "Marvelous Designer",
  "Unity",
  "Unreal Engine",
  "Notepad++",
  "VS Code",
  "Udon / UdonSharp"
];

interface QuickFacts {
  primary_role?: string;
  secondary_roles?: string[];
  platforms?: string[];
  tools?: string[];
  experience_level?: string;
  portfolio_url?: string;
  social_links?: {
    website?: string;
    twitter?: string;
    instagram?: string;
    artstation?: string;
    discord?: string;
    primfeed?: string;
  };
}

interface TalentProfile {
  profile_id: string;
  user_id: string;
  handle: string;
  display_name: string;
  headline: string | null;
  profile_photo_url: string | null;
  about: string | null;
  is_open_to_work: boolean;
  is_hiring: boolean;
  availability_note: string | null;
  quick_facts: QuickFacts | null;
}

interface TalentFilters {
  primarySkill: string;
  platform: string;
  tool: string;
  search: string;
}

export default function Talent() {
  const [filters, setFilters] = useState<TalentFilters>({
    primarySkill: "",
    platform: "",
    tool: "",
    search: "",
  });

  const { data: profiles, isLoading, error, refetch } = useQuery<TalentProfile[]>({
    queryKey: ['talent-directory', filters],
    queryFn: async () => {
      let query = supabase
        .from('profiles_v2')
        .select('profile_id, user_id, handle, display_name, headline, profile_photo_url, about, is_open_to_work, is_hiring, availability_note, quick_facts')
        .eq('visibility', 'PUBLIC')
        .not('handle', 'is', null)
        .not('display_name', 'is', null)
        .or('is_open_to_work.eq.true,is_hiring.eq.true');

      // Apply text search filter (search across display_name, handle, about)
      if (filters.search) {
        query = query.or(`display_name.ilike.%${filters.search}%,handle.ilike.%${filters.search}%,about.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching talent profiles:', error);
        throw error;
      }

      console.log('Talent directory query returned', data?.length || 0, 'profiles:', data?.map(p => ({ handle: p.handle, is_open_to_work: p.is_open_to_work, is_hiring: p.is_hiring })));

      // Filter by quick_facts fields in JavaScript (since they're JSONB)
      let filtered = data || [];

      if (filters.primarySkill) {
        filtered = filtered.filter(p => 
          p.quick_facts?.primary_role?.toLowerCase() === filters.primarySkill.toLowerCase()
        );
      }

      if (filters.platform) {
        filtered = filtered.filter(p => 
          p.quick_facts?.platforms?.some(platform => 
            platform.toLowerCase() === filters.platform.toLowerCase()
          )
        );
      }

      if (filters.tool) {
        filtered = filtered.filter(p => 
          p.quick_facts?.tools?.some(tool => 
            tool.toLowerCase() === filters.tool.toLowerCase()
          )
        );
      }

      return filtered;
    },
  });

  const handleClearFilters = () => {
    setFilters({
      primarySkill: "",
      platform: "",
      tool: "",
      search: "",
    });
  };

  const hasActiveFilters = filters.primarySkill || filters.platform || filters.tool || filters.search;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Title Block */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="page-title">VirtuoHub Talent</h1>
            <p className="text-lg text-muted-foreground mb-6" data-testid="page-subtitle">
              Discover creators to collaborate with across virtual worlds.
            </p>

            {/* Tabs */}
            <div className="flex gap-4 border-b">
              <button
                className="pb-3 px-1 text-sm font-medium border-b-2 border-primary text-foreground"
                data-testid="tab-find-talent"
              >
                Find Talent
              </button>
              <button
                className="pb-3 px-1 text-sm font-medium text-muted-foreground cursor-not-allowed flex items-center gap-2"
                disabled
                data-testid="tab-find-work"
              >
                Find Work
                <Badge variant="secondary" className="text-xs">Coming soon</Badge>
              </button>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Primary Skill */}
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Skill</label>
                <Select
                  value={filters.primarySkill || undefined}
                  onValueChange={(value) => setFilters({ ...filters, primarySkill: value })}
                >
                  <SelectTrigger data-testid="filter-primary-skill">
                    <SelectValue placeholder="Any skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIMARY_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform */}
              <div>
                <label className="text-sm font-medium mb-2 block">Platform</label>
                <Select
                  value={filters.platform || undefined}
                  onValueChange={(value) => setFilters({ ...filters, platform: value })}
                >
                  <SelectTrigger data-testid="filter-platform">
                    <SelectValue placeholder="Any platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tools */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tools</label>
                <Select
                  value={filters.tool || undefined}
                  onValueChange={(value) => setFilters({ ...filters, tool: value })}
                >
                  <SelectTrigger data-testid="filter-tool">
                    <SelectValue placeholder="Any tool" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOOLS.map((tool) => (
                      <SelectItem key={tool} value={tool}>
                        {tool}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Name, handle, bio..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                    data-testid="filter-search"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                data-testid="button-clear-filters"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </Card>

          {/* Results */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-muted rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Failed to load talent profiles</p>
              <Button onClick={() => refetch()} data-testid="button-retry">
                Try again
              </Button>
            </Card>
          )}

          {!isLoading && !error && profiles && profiles.length === 0 && (
            <Card className="p-8 text-center" data-testid="empty-state">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No creators match these filters yet</h3>
              <p className="text-muted-foreground">
                Try removing a filter or broadening your search.
              </p>
            </Card>
          )}

          {!isLoading && !error && profiles && profiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="talent-grid">
              {profiles.map((profile) => {
                const displayName = profile.display_name || profile.handle;
                const primarySkill = profile.quick_facts?.primary_role?.trim();
                const platforms = profile.quick_facts?.platforms || [];
                const tools = profile.quick_facts?.tools || [];
                const experienceLevel = profile.quick_facts?.experience_level?.trim();
                
                // Truncate bio
                const bio = profile.about || "Creator on VirtuoHub.";
                const truncatedBio = bio.length > 160 
                  ? bio.substring(0, 160).trim() + '...' 
                  : bio;

                return (
                  <Card key={profile.profile_id} className="p-6 hover:shadow-lg transition-shadow" data-testid={`talent-card-${profile.handle}`}>
                    {/* Header: Avatar + Name + Handle */}
                    <div className="flex items-start gap-4 mb-4">
                      {profile.profile_photo_url ? (
                        <img 
                          src={profile.profile_photo_url} 
                          alt={displayName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-border"
                          data-testid={`avatar-${profile.handle}`}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-border">
                          <span className="text-2xl font-bold text-white">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate" data-testid={`name-${profile.handle}`}>
                          {displayName}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate" data-testid={`handle-${profile.handle}`}>
                          @{profile.handle}
                        </p>
                      </div>
                    </div>

                    {/* Primary Skill & Availability Badges */}
                    {(primarySkill || profile.is_open_to_work || profile.is_hiring) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {primarySkill && (
                          <Badge variant="default" data-testid={`primary-skill-${profile.handle}`}>
                            {primarySkill}
                          </Badge>
                        )}
                        {profile.is_open_to_work && (
                          <Badge variant="secondary" className="flex items-center gap-1" data-testid={`badge-available-${profile.handle}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Available for work
                          </Badge>
                        )}
                        {profile.is_hiring && (
                          <Badge variant="secondary" className="flex items-center gap-1" data-testid={`badge-hiring-${profile.handle}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Hiring creators
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground mb-4" data-testid={`bio-${profile.handle}`}>
                      {truncatedBio}
                    </p>

                    {/* Platforms */}
                    {platforms.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Platforms</p>
                        <div className="flex flex-wrap gap-2">
                          {platforms.slice(0, 3).map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs" data-testid={`platform-${profile.handle}-${platform.toLowerCase().replace(/\s+/g, '-')}`}>
                              {platform}
                            </Badge>
                          ))}
                          {platforms.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{platforms.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tools */}
                    {tools.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Tools</p>
                        <div className="flex flex-wrap gap-2">
                          {tools.slice(0, 3).map((tool) => (
                            <Badge key={tool} variant="outline" className="text-xs" data-testid={`tool-${profile.handle}-${tool.toLowerCase().replace(/\s+/g, '-')}`}>
                              {tool}
                            </Badge>
                          ))}
                          {tools.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tools.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Experience Level */}
                    {experienceLevel && (
                      <p className="text-xs text-muted-foreground mb-4" data-testid={`experience-${profile.handle}`}>
                        Experience: {experienceLevel}
                      </p>
                    )}

                    {/* View Profile Button */}
                    <Link href={`/u/${profile.handle}?from=talent`}>
                      <Button className="w-full" variant="default" data-testid={`button-view-profile-${profile.handle}`}>
                        View profile
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
