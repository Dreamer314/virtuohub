import { Link } from 'wouter';
import { ArrowLeft, Info } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { SpotlightHero } from '@/components/spotlights/SpotlightHero';
import { SpotlightMeta } from '@/components/spotlights/SpotlightMeta';
import { SpotlightPortfolioList } from '@/components/spotlights/SpotlightPortfolioList';
import { SpotlightAchievements } from '@/components/spotlights/SpotlightAchievements';
import { SpotlightConnect } from '@/components/spotlights/SpotlightConnect';
import type { Spotlight } from '@/types/spotlight';

const DEMO_SPOTLIGHT: Spotlight = {
  id: 'demo',
  slug: 'demo',
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
};

const SpotlightDemoPage = () => {
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
                  {/* Demo Badge */}
                  <div className="mb-6 flex items-center justify-between">
                    <Link href="/spotlights" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors" data-testid="back-to-spotlights">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Spotlights
                    </Link>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg" data-testid="demo-badge">
                      <Info className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-500 font-medium text-sm">Demo Layout Preview</span>
                    </div>
                  </div>

                  {/* Spotlight Detail */}
                  <article className="enhanced-card hover-lift rounded-xl overflow-hidden mb-8">
                    <SpotlightHero 
                      spotlight={DEMO_SPOTLIGHT} 
                      emoji="👤"
                      gradient="from-yellow-400 via-orange-500 to-red-500"
                    />
                    
                    <div className="p-8">
                      <SpotlightMeta spotlight={DEMO_SPOTLIGHT} />
                      
                      {DEMO_SPOTLIGHT.about && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
                          {DEMO_SPOTLIGHT.about.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-muted-foreground mb-4">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}

                      <SpotlightPortfolioList spotlight={DEMO_SPOTLIGHT} />
                      <SpotlightAchievements spotlight={DEMO_SPOTLIGHT} />
                      <SpotlightConnect spotlight={DEMO_SPOTLIGHT} />

                      {DEMO_SPOTLIGHT.tags && DEMO_SPOTLIGHT.tags.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-foreground mb-3">Tags</h3>
                          <div className="flex flex-wrap gap-3">
                            {DEMO_SPOTLIGHT.tags.map((tag, index) => (
                              <span key={index} className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Demo Engagement Notice */}
                      <div className="mt-8 p-4 bg-muted/50 border border-border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">
                          Engagement disabled in demo
                        </p>
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

export default SpotlightDemoPage;
