import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { EngagementSection } from '@/components/engagement-section';
import { SpotlightCard } from '@/components/spotlights/SpotlightCard';
import { SpotlightHero } from '@/components/spotlights/SpotlightHero';
import { SpotlightMeta } from '@/components/spotlights/SpotlightMeta';
import { SpotlightPortfolioList } from '@/components/spotlights/SpotlightPortfolioList';
import { SpotlightAchievements } from '@/components/spotlights/SpotlightAchievements';
import { SpotlightConnect } from '@/components/spotlights/SpotlightConnect';
import { supabase } from '@/lib/supabaseClient';
import type { Spotlight } from '@/types/spotlight';

const LOCAL_SEED_SPOTLIGHTS: Spotlight[] = [
  {
    id: '1',
    slug: 'emma-thompson-vr-artist',
    type: 'creator',
    name: 'Emma Thompson',
    role: 'VR Environment Artist & World Builder',
    about: 'Emma is a pioneering VR environment artist known for creating atmospheric virtual worlds that have garnered over 2 million visits across VRChat. Her expertise lies in blending photorealistic environments with interactive storytelling elements.\n\nShe specializes in cyberpunk and fantasy themes, using cutting-edge lighting techniques and particle systems to create immersive experiences that transport users to entirely new realities.',
    stats: { visits: 2000000, followers: 15000, years: 3, location: 'San Francisco, CA' },
    tags: ['VRChat', 'Unity', 'Blender', 'Environment Design'],
    portfolio: [
      { title: 'Neon Dreams', category: 'Cyberpunk City World', description: 'A sprawling cyberpunk metropolis', statLabel: '500K+ visits' },
      { title: 'Mystic Forest Temple', category: 'Fantasy Environment', description: 'An enchanted forest sanctuary', statLabel: '800K+ visits' },
      { title: 'Underground Club Scene', category: 'Social Hub', description: 'An underground venue for events', statLabel: '400K+ visits' }
    ],
    achievements: [
      'VRChat Creator of the Year 2023',
      'Unity Showcase Featured Artist',
      'Speaker at VR Developer Conference 2024',
      'Mentor in VRChat Creator Program'
    ],
    social: { vrchat: '@EmmaThompsonVR', twitter: '@VR_Emma_Art', discord: 'Emma#1337' },
    published: true
  },
  {
    id: '2',
    slug: 'pixelcraft-studios',
    type: 'studio',
    name: 'PixelCraft Studios',
    role: 'Independent Game Studio',
    about: 'Independent game studio creating immersive Roblox experiences with over 10M total plays.',
    stats: { location: '—' },
    tags: ['Roblox', 'Game Design'],
    portfolio: [],
    achievements: [],
    published: true
  },
  {
    id: '3',
    slug: 'virtualforge-ai-tool',
    type: 'tool',
    name: 'VirtualForge',
    role: 'AI-Powered World Generation Tool',
    about: 'AI-powered world generation tool helping creators build immersive environments 10x faster.',
    stats: { location: '—' },
    tags: ['AI Tools', 'Unity'],
    portfolio: [],
    achievements: [],
    published: true
  }
];

const SpotlightsPage = () => {
  const { data: spotlights = LOCAL_SEED_SPOTLIGHTS } = useQuery<Spotlight[]>({
    queryKey: ['spotlights:list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spotlights')
        .select('id, slug, name, role, hero_image, tags, stats, type, about')
        .eq('published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data && data.length > 0 ? data : LOCAL_SEED_SPOTLIGHTS;
    }
  });

  const featuredSpotlight = spotlights[0];
  const miniSpotlights = spotlights.slice(1, 3);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-xl" style={{ animationDelay: '-2s' }}></div>
        <div className="floating-element absolute bottom-20 left-1/4 w-20 h-20 bg-primary/15 rounded-full blur-xl" style={{ animationDelay: '-4s' }}></div>
      </div>

      <Header onCreatePost={() => {}} />
      
      <div className="community-grid">
        {/* Left Sidebar */}
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar
              currentTab="all"
              onTabChange={() => {}}
            />
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="grid-right hidden lg:block bg-background/95 backdrop-blur-sm border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <RightSidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid-main relative z-0">
          <div className="py-8 relative z-10 px-4 lg:px-8">
            <div className="w-full">
              <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
                {/* Mobile Left Sidebar */}
                <div className="xl:hidden">
                  <LeftSidebar
                    currentTab="all"
                    onTabChange={() => {}}
                  />
                </div>

                {/* Main Content */}
                <main>
                  {/* Page Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4">
                          <Star className="w-8 h-8 text-transparent bg-gradient-cosmic bg-clip-text" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Creator Spotlights
                          </h1>
                        </div>
                        <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      Profiles of creators, studios, and brands shaping the space
                    </p>
                  </div>

                  {/* Featured Spotlight */}
                  {featuredSpotlight && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                          Featured Spotlight
                        </h2>
                        <article className="enhanced-card hover-lift rounded-xl overflow-hidden">
                          <SpotlightHero 
                            spotlight={featuredSpotlight} 
                            emoji="👤"
                            gradient="from-yellow-400 via-orange-500 to-red-500"
                          />
                          <div className="lg:w-2/3 lg:ml-[33.333333%] p-8 lg:pt-0">
                            <SpotlightMeta spotlight={featuredSpotlight} />
                            
                            {featuredSpotlight.about && (
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
                                {featuredSpotlight.about.split('\n\n').map((paragraph, index) => (
                                  <p key={index} className="text-muted-foreground mb-4">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            )}

                            <SpotlightPortfolioList spotlight={featuredSpotlight} />

                            {featuredSpotlight.tags && featuredSpotlight.tags.length > 0 && (
                              <div className="flex flex-wrap gap-3 mb-6">
                                {featuredSpotlight.tags.slice(0, 3).map((tag, index) => (
                                  <span key={index} className={index % 2 === 0 ? "px-3 py-1 bg-primary/20 text-primary rounded-full text-sm" : "px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* View Full Spotlight Button */}
                            <div className="mb-6">
                              <Link href={`/spotlight/${featuredSpotlight.slug}`} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium rounded-lg transition-all duration-300 group">
                                View Full Spotlight
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>

                            {/* Engagement Section */}
                            <EngagementSection 
                              contentId={`spotlight-${featuredSpotlight.slug}`}
                              contentType="spotlight"
                              initialLikes={324}
                              initialComments={[
                                {
                                  id: '1',
                                  author: 'Alex Rivera',
                                  content: 'Emma\'s Neon Dreams world is absolutely stunning! The lighting work is incredible.',
                                  timestamp: '1 hour ago',
                                  likes: 15
                                },
                                {
                                  id: '2',
                                  author: 'Sam Chen',
                                  content: 'Been following her work for years. True pioneer in VR environment design!',
                                  timestamp: '3 hours ago',
                                  likes: 22
                                }
                              ]}
                            />
                          </div>
                        </article>

                        {/* More Spotlights */}
                        {miniSpotlights.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {miniSpotlights.map((spotlight, index) => {
                              const config = index === 0 
                                ? { emoji: '🏢', gradient: 'from-blue-500 to-purple-600', statOverlay: '10M+ total plays' }
                                : { emoji: '🛠️', gradient: 'from-green-500 to-teal-600', statOverlay: 'AI-Powered' };
                              
                              return (
                                <SpotlightCard 
                                  key={spotlight.id}
                                  spotlight={spotlight}
                                  {...config}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </main>

                {/* Mobile Right Sidebar */}
                <div className="lg:hidden mt-8">
                  <RightSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SpotlightsPage;
