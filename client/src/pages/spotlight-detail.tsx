import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { SpotlightHero } from '@/components/spotlights/SpotlightHero';
import { SpotlightMeta } from '@/components/spotlights/SpotlightMeta';
import { SpotlightPortfolioList } from '@/components/spotlights/SpotlightPortfolioList';
import { SpotlightAchievements } from '@/components/spotlights/SpotlightAchievements';
import { SpotlightConnect } from '@/components/spotlights/SpotlightConnect';
import { SpotlightEngagement } from '@/components/spotlight-engagement';
import { supabase } from '@/lib/supabaseClient';
import type { Spotlight } from '@/types/spotlight';

const LOCAL_SEED_SPOTLIGHTS: Record<string, Spotlight> = {
  'emma-thompson-vr-artist': {
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
  'pixelcraft-studios': {
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
  'virtualforge-ai-tool': {
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
};

const SpotlightDetailPage = () => {
  const params = useParams();
  const slug = params.id as string;

  const { data: spotlight, isLoading } = useQuery<Spotlight>({
    queryKey: ['spotlights:detail', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spotlights')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) {
        return LOCAL_SEED_SPOTLIGHTS[slug] || null;
      }
      return data;
    }
  });

  const getEmojiAndGradient = (type: string) => {
    if (type === 'creator') return { emoji: '👤', gradient: 'from-yellow-400 via-orange-500 to-red-500' };
    if (type === 'studio') return { emoji: '🏢', gradient: 'from-blue-500 to-purple-600' };
    return { emoji: '🛠️', gradient: 'from-green-500 to-teal-600' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header onCreatePost={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Loading spotlight...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!spotlight) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header onCreatePost={() => {}} />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Spotlight Not Found</h2>
          <p className="text-muted-foreground mb-6">This spotlight doesn't exist or has been removed.</p>
          <Link href="/spotlights" className="text-primary hover:underline">← Back to Spotlights</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const config = getEmojiAndGradient(spotlight.type);

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
            <LeftSidebar currentTab="all" onTabChange={() => {}} />
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
                  <LeftSidebar currentTab="all" onTabChange={() => {}} />
                </div>

                {/* Main Content */}
                <main>
                  {/* Back Button */}
                  <div className="mb-6">
                    <Link href="/spotlights" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Spotlights
                    </Link>
                  </div>

                  {/* Spotlight Detail */}
                  <article className="enhanced-card hover-lift rounded-xl overflow-hidden mb-8">
                    <SpotlightHero spotlight={spotlight} {...config} />
                    
                    <div className="p-8">
                      <SpotlightMeta spotlight={spotlight} />
                      
                      {spotlight.about && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
                          {spotlight.about.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-muted-foreground mb-4">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}

                      <SpotlightPortfolioList spotlight={spotlight} />
                      <SpotlightAchievements spotlight={spotlight} />
                      <SpotlightConnect spotlight={spotlight} />

                      {spotlight.tags && spotlight.tags.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-foreground mb-3">Tags</h3>
                          <div className="flex flex-wrap gap-3">
                            {spotlight.tags.map((tag, index) => (
                              <span key={index} className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Engagement Section */}
                      <div className="mt-8">
                        <SpotlightEngagement spotlightId={spotlight.id} />
                      </div>
                    </div>
                  </article>
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

export default SpotlightDetailPage;
