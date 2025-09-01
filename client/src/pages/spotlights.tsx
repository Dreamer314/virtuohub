import React from 'react';
import { Star } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const SpotlightsPage: React.FC = () => {
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
                    <div className="flex items-center space-x-2 mb-8">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent flex-1"></div>
                      <div className="flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-yellow-500/10 via-yellow-500/20 to-yellow-500/10 rounded-full border border-yellow-500/30">
                        <Star className="w-8 h-8 text-yellow-500" />
                        <h1 className="text-5xl font-bold text-foreground tracking-tight">
                          Spotlights
                        </h1>
                      </div>
                      <div className="h-0.5 bg-gradient-to-r from-yellow-500 via-transparent to-transparent flex-1"></div>
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
                        <article className="glass-card rounded-xl p-8 border border-yellow-500/30">
                          <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-1/3">
                              <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                <span className="text-6xl">👤</span>
                              </div>
                            </div>
                            <div className="lg:w-2/3">
                              <div className="mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full">Spotlight</span>
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

                              <div className="flex flex-wrap gap-3">
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">VRChat</span>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Unity</span>
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Blender</span>
                              </div>
                            </div>
                          </div>
                        </article>

                        {/* More Spotlights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <article className="glass-card rounded-xl p-6 border border-sidebar-border hover:border-yellow-500/30 transition-all">
                            <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                              <span className="text-4xl">🏢</span>
                            </div>
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full mb-3">Studio Spotlight</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">PixelCraft Studios</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Independent game studio creating immersive Roblox experiences with over 10M total plays.
                            </p>
                            <div className="flex gap-2">
                              <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">Roblox</span>
                              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">Game Design</span>
                            </div>
                          </article>

                          <article className="glass-card rounded-xl p-6 border border-sidebar-border hover:border-yellow-500/30 transition-all">
                            <div className="w-full h-48 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg mb-4 flex items-center justify-center">
                              <span className="text-4xl">🛠️</span>
                            </div>
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full mb-3">Tool Spotlight</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">VirtualForge</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              AI-powered world generation tool helping creators build immersive environments 10x faster.
                            </p>
                            <div className="flex gap-2">
                              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">AI Tools</span>
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">Unity</span>
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