import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { User, MapPin, Calendar, Briefcase, Users, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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

interface ProfileV2 {
  profile_id: string;
  user_id: string;
  handle: string;
  display_name: string;
  headline: string | null;
  profile_photo_url: string | null;
  about: string | null;
  visibility: string;
  created_at: string;
  is_open_to_work: boolean;
  is_hiring: boolean;
  availability_note: string | null;
  quick_facts: QuickFacts | null;
}

export default function PublicProfile() {
  const { handle } = useParams<{ handle: string }>();
  
  // Check if user came from talent directory
  const searchParams = new URLSearchParams(window.location.search);
  const fromTalent = searchParams.get('from') === 'talent';

  const { data: profile, isLoading, error } = useQuery<ProfileV2 | null>({
    queryKey: ['profile-v2', handle],
    queryFn: async () => {
      if (!handle) return null;

      const { data, error } = await supabase
        .from('profiles_v2')
        .select('profile_id, user_id, handle, display_name, headline, profile_photo_url, about, visibility, created_at, is_open_to_work, is_hiring, availability_note, quick_facts')
        .eq('handle', handle.toLowerCase())
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    },
    enabled: !!handle
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
            <p className="text-muted-foreground">
              The profile @{handle} does not exist or you don't have permission to view it.
            </p>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = profile.display_name || profile.handle;
  const headline = profile.headline || "Creator on VirtuoHub";
  const bio = profile.about;
  const avatarUrl = profile.profile_photo_url;
  const qf = profile.quick_facts;
  const primarySkill = qf?.primary_role?.trim();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              href={fromTalent ? "/talent" : "/"} 
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid={fromTalent ? "link-back-talent" : "link-back-home"}
            >
              <ArrowLeft className="w-4 h-4" />
              {fromTalent ? "Back to Talent" : "Back to VirtuoHub"}
            </Link>
          </div>

          {/* Hero Block */}
          <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-border"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-4 border-border">
                  <span className="text-4xl font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {/* Creator Profile Label */}
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                VirtuoHub Creator
              </div>

              <h1 className="text-3xl font-bold mb-1" data-testid="profile-display-name">
                {displayName}
              </h1>
              <p className="text-xl text-muted-foreground mb-2" data-testid="profile-handle">
                @{profile.handle}
              </p>

              {/* Headline */}
              <p className="text-base text-foreground mb-3" data-testid="profile-headline">
                {headline}
              </p>

              {/* Primary Skill + Availability Pills */}
              {(primarySkill || profile.is_open_to_work || profile.is_hiring) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {primarySkill && (
                    <Badge variant="default" data-testid="hero-primary-skill">
                      {primarySkill}
                    </Badge>
                  )}
                  {profile.is_open_to_work && (
                    <Badge variant="secondary" className="flex items-center gap-1" data-testid="badge-open-to-work">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-0.5"></span>
                      Available for work
                    </Badge>
                  )}
                  {profile.is_hiring && (
                    <Badge variant="secondary" className="flex items-center gap-1" data-testid="badge-hiring">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-0.5"></span>
                      Hiring creators
                    </Badge>
                  )}
                </div>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {new Date(profile.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          </Card>

          {/* About Section */}
          <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">About</h2>
          <div className="text-sm space-y-2">
            {bio ? (
              <p className="text-foreground whitespace-pre-wrap" data-testid="about-section-bio">
                {bio}
              </p>
            ) : (
              <p className="text-muted-foreground" data-testid="about-section-placeholder">
                This creator has not added a bio yet.
              </p>
            )}
          </div>
          </Card>

          {/* Opportunities Section */}
          {(profile.availability_note?.trim() || profile.is_open_to_work || profile.is_hiring) && (
            <Card className="p-6 mb-6" data-testid="opportunities-section">
            <h2 className="text-lg font-semibold mb-3">Opportunities</h2>
            <div className="text-sm">
              {profile.availability_note?.trim() ? (
                <p className="text-foreground whitespace-pre-wrap" data-testid="opportunities-note">
                  {profile.availability_note}
                </p>
              ) : (
                <p className="text-muted-foreground" data-testid="opportunities-default">
                  Open to new collaborations and opportunities.
                </p>
              )}
            </div>
            </Card>
          )}

          {/* Creator Profile Section */}
          {(() => {
          const hasOtherSkills = qf?.secondary_roles && qf.secondary_roles.length > 0;
          const hasPlatforms = qf?.platforms && qf.platforms.length > 0;
          const hasTools = qf?.tools && qf.tools.length > 0;
          const hasExperience = qf?.experience_level && qf.experience_level.trim();
          const hasLinks = qf?.portfolio_url?.trim() || 
                          qf?.social_links?.website?.trim() ||
                          qf?.social_links?.twitter?.trim() ||
                          qf?.social_links?.instagram?.trim() ||
                          qf?.social_links?.artstation?.trim() ||
                          qf?.social_links?.discord?.trim() ||
                          qf?.social_links?.primfeed?.trim();
          
            const hasAnyCreatorData = hasOtherSkills || hasPlatforms || hasTools || hasExperience || hasLinks;
            
            if (!hasAnyCreatorData) return null;

            return (
              <Card className="p-6" data-testid="creator-profile-section">
                <h2 className="text-lg font-semibold mb-4">Creator profile</h2>
                <div className="space-y-5">
                  
                  {/* Other skills */}
                  {hasOtherSkills && (
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Other skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {qf.secondary_roles!.map((skill) => (
                          <Badge key={skill} variant="secondary" data-testid={`other-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Platforms */}
                  {hasPlatforms && (
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Platforms</h3>
                      <div className="flex flex-wrap gap-2">
                        {qf.platforms!.map((platform) => (
                          <Badge key={platform} variant="outline" data-testid={`platform-${platform.toLowerCase().replace(/\s+/g, '-')}`}>
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tools */}
                  {hasTools && (
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Tools</h3>
                      <div className="flex flex-wrap gap-2">
                        {qf.tools!.map((tool) => (
                          <Badge key={tool} variant="outline" data-testid={`tool-${tool.toLowerCase().replace(/\s+/g, '-')}`}>
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {hasExperience && (
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Experience</h3>
                      <p className="text-sm text-foreground" data-testid="experience-level">
                        {qf.experience_level}
                      </p>
                    </div>
                  )}

                  {/* Portfolio & socials */}
                  {hasLinks && (
                    <div className="pt-1 border-t">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 mt-1">Portfolio & socials</h3>
                      <div className="space-y-2 text-sm">
                        {qf.portfolio_url?.trim() && (
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[90px]">Portfolio:</span>
                            <a 
                              href={qf.portfolio_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline break-all"
                              data-testid="link-portfolio"
                            >
                              {qf.portfolio_url}
                            </a>
                          </div>
                        )}
                        {qf.social_links?.website?.trim() && (
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[90px]">Website:</span>
                            <a 
                              href={qf.social_links.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline break-all"
                              data-testid="link-website"
                            >
                              {qf.social_links.website}
                            </a>
                          </div>
                        )}
                        {qf.social_links?.twitter?.trim() && (
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[90px]">Twitter/X:</span>
                            <a 
                              href={qf.social_links.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline break-all"
                              data-testid="link-twitter"
                            >
                              {qf.social_links.twitter}
                            </a>
                          </div>
                        )}
                        {qf.social_links?.instagram?.trim() && (
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[90px]">Instagram:</span>
                            <a 
                              href={qf.social_links.instagram} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline break-all"
                              data-testid="link-instagram"
                            >
                              {qf.social_links.instagram}
                            </a>
                          </div>
                        )}
                        {qf.social_links?.artstation?.trim() && (
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[90px]">ArtStation:</span>
                            <a 
                              href={qf.social_links.artstation} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline break-all"
                              data-testid="link-artstation"
                            >
                              {qf.social_links.artstation}
                            </a>
                          </div>
                        )}
                        {qf.social_links?.discord?.trim() && (
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[90px]">Discord:</span>
                            <span className="text-foreground break-all" data-testid="link-discord">
                              {qf.social_links.discord}
                            </span>
                          </div>
                        )}
                        {qf.social_links?.primfeed?.trim() && (
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[90px]">Primfeed:</span>
                            <a 
                              href={qf.social_links.primfeed} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline break-all"
                              data-testid="link-primfeed"
                            >
                              {qf.social_links.primfeed}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
