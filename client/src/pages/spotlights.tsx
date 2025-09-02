import React, { useEffect } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { EngagementSection } from '@/components/engagement-section';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const SpotlightsPage: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch all posts and filter for spotlight posts
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  const spotlightPosts = posts
    .filter(post => post.type === 'insight') // Using insight posts as spotlight content
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

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

                  {/* Spotlight Cards */}
                  <div className="space-y-8">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">Loading spotlights...</div>
                      </div>
                    ) : (
                      <>
                        {/* Featured Spotlight */}
                        <article className="enhanced-card hover-lift rounded-xl overflow-hidden">
                          <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-1/3">
                              <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                <span className="text-6xl relative z-10">👤</span>
                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                  <div className="text-white font-semibold">Emma Thompson</div>
                                  <div className="text-white/80 text-sm">2M+ world visits</div>
                                </div>
                              </div>
                            </div>
                            <div className="lg:w-2/3 p-8">
                              <div className="mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/20 text-primary border border-primary/30 rounded-full">Spotlight</span>
                              </div>
                              <h2 className="text-3xl font-bold text-foreground mb-3">Emma Thompson</h2>
                              <p className="text-lg text-muted-foreground mb-6">VR Environment Artist & World Builder</p>
                              
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
                                <p className="text-muted-foreground mb-4">
                                  Emma is a pioneering VR environment artist known for creating atmospheric virtual worlds that have garnered over 2 million visits across VRChat. Her expertise lies in blending photorealistic environments with interactive storytelling elements.
                                </p>
                                <p className="text-muted-foreground">
                                  She specializes in cyberpunk and fantasy themes, using cutting-edge lighting techniques and particle systems to create immersive experiences that transport users to entirely new realities.
                                </p>
                              </div>

                              <div className="mb-6">
                                <h3 className="text-lg font-semibold text-foreground mb-3">Portfolio Highlights</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                  <li>• Neon Dreams - Cyberpunk City World (500K+ visits)</li>
                                  <li>• Mystic Forest Temple - Fantasy Environment (800K+ visits)</li>
                                  <li>• Underground Club Scene - Social Hub (400K+ visits)</li>
                                </ul>
                              </div>

                              <div className="flex flex-wrap gap-3 mb-6">
                                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">VRChat</span>
                                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">Unity</span>
                                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Blender</span>
                              </div>

                              {/* View Full Spotlight Button */}
                              <div className="mb-6">
                                <Link href="/spotlight/emma-thompson-vr-artist" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium rounded-lg transition-all duration-300 group">
                                  View Full Spotlight
                                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>

                              {/* Engagement Section */}
                              <EngagementSection 
                                contentId="spotlight-emma-thompson"
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
                          </div>
                        </article>

                        {/* More Spotlights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <article className="enhanced-card hover-lift rounded-xl border border-sidebar-border hover:border-yellow-500/30 transition-all overflow-hidden">
                            <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              <span className="text-4xl relative z-10">🏢</span>
                              <div className="absolute bottom-4 left-4 right-4 z-10">
                                <div className="text-white font-semibold text-sm">10M+ total plays</div>
                              </div>
                            </div>
                            <div className="p-6">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/20 text-primary border border-primary/30 rounded-full mb-3">Studio Spotlight</span>
                              <h3 className="text-xl font-semibold text-foreground mb-2">PixelCraft Studios</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Independent game studio creating immersive Roblox experiences with over 10M total plays.
                              </p>
                              <div className="flex gap-2 mb-4">
                                <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">Roblox</span>
                                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs border border-primary/30">Game Design</span>
                              </div>
                              <div className="mb-4">
                                <Link href="/spotlight/pixelcraft-studios" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm font-medium rounded-lg transition-all duration-300 group">
                                  View Full Spotlight
                                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                              <EngagementSection 
                                contentId="spotlight-pixelcraft"
                                contentType="spotlight"
                                initialLikes={178}
                                initialComments={[]}
                              />
                            </div>
                          </article>

                          <article className="enhanced-card hover-lift rounded-xl border border-sidebar-border hover:border-yellow-500/30 transition-all overflow-hidden">
                            <div className="w-full h-48 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              <span className="text-4xl relative z-10">🛠️</span>
                              <div className="absolute bottom-4 left-4 right-4 z-10">
                                <div className="text-white font-semibold text-sm">AI-Powered</div>
                              </div>
                            </div>
                            <div className="p-6">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full mb-3">Tool Spotlight</span>
                              <h3 className="text-xl font-semibold text-foreground mb-2">VirtualForge</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                AI-powered world generation tool helping creators build immersive environments 10x faster.
                              </p>
                              <div className="flex gap-2 mb-4">
                                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs border border-primary/30">AI Tools</span>
                                <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs border border-accent/30">Unity</span>
                              </div>
                              <div className="mb-4">
                                <Link href="/spotlight/virtualforge-ai-tool" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm font-medium rounded-lg transition-all duration-300 group">
                                  View Full Spotlight
                                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                              <EngagementSection 
                                contentId="spotlight-virtualforge"
                                contentType="spotlight"
                                initialLikes={203}
                                initialComments={[]}
                              />
                            </div>
                          </article>
                        </div>
                      </>
                    )}
                  </div>
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