import React from 'react';
import { Newspaper, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { EngagementSection } from '@/components/engagement-section';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const NewsPage: React.FC = () => {
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  const newsPosts = posts.filter(post => 
    post.type === 'regular' && 
    (post.category === 'General' && 
     (post.title.toLowerCase().includes('industry') || 
      post.title.toLowerCase().includes('news') ||
      post.title.toLowerCase().includes('update') ||
      post.title.toLowerCase().includes('announcement') ||
      post.title.toLowerCase().includes('launch') ||
      post.title.toLowerCase().includes('release')))
  ).sort((a, b) => {
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
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar currentTab="all" onTabChange={() => {}} />
          </div>
        </div>
        
        <div className="grid-right hidden lg:block bg-background/95 backdrop-blur-sm border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <RightSidebar />
          </div>
        </div>

        <div className="grid-main relative z-0">
          <div className="py-8 relative z-10 px-4 lg:px-8">
            <div className="w-full">
              <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
                <div className="xl:hidden">
                  <LeftSidebar currentTab="all" onTabChange={() => {}} />
                </div>

                <main>
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4">
                          <Newspaper className="w-8 h-8 text-transparent bg-gradient-mist bg-clip-text" style={{backgroundImage: 'var(--gradient-mist)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Industry News
                          </h1>
                        </div>
                        <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      What changed and why it matters
                    </p>
                  </div>

                  <div className="space-y-8">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">Loading industry news...</div>
                      </div>
                    ) : (
                      <>
                        {/* Featured News */}
                        <article className="enhanced-card hover-lift rounded-xl overflow-hidden">
                          <div className="w-full h-64 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/30"></div>
                            <div className="relative z-10 text-center px-8">
                              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded-full mb-4">Breaking News</span>
                              <h2 className="text-3xl font-bold text-white mb-3">
                                Meta Announces Horizon Worlds Creator Fund Expansion
                              </h2>
                              <p className="text-blue-200 text-lg">$50M fund now available to developers across 15 countries</p>
                            </div>
                          </div>
                          
                          <div className="p-8">
                            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                              <span>Dec 30, 2024</span>
                              <span>•</span>
                              <span>VirtuoHub Staff</span>
                              <span>•</span>
                              <span>3 min read</span>
                            </div>

                            <div className="prose prose-invert max-w-none mb-6">
                              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                Meta has announced a major expansion of its Horizon Worlds Creator Fund, increasing the total pool to $50 million and extending availability to developers in 15 countries, up from the original 3.
                              </p>
                              
                              <p className="text-muted-foreground leading-relaxed mb-4">
                                The expanded fund aims to support creators building immersive social experiences within Meta's VR platform. Key changes include streamlined application processes, increased maximum grants from $10k to $25k per project, and new mentorship programs pairing emerging creators with industry veterans.
                              </p>

                              <blockquote className="border-l-4 border-blue-500 pl-6 my-6 text-lg italic text-muted-foreground">
                                "This expansion represents our commitment to fostering a thriving creator economy in virtual worlds," said Meta's VP of Metaverse Content.
                              </blockquote>

                              <p className="text-muted-foreground leading-relaxed">
                                Applications open January 15th, 2025, with the first round of funding decisions expected by March. The announcement comes as Meta faces increased competition from emerging platforms and seeks to strengthen its creator ecosystem ahead of broader consumer VR adoption.
                              </p>
                            </div>

                            <div className="flex gap-2 mb-6">
                              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm border border-primary/30">Meta</span>
                              <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm border border-accent/30">Horizon Worlds</span>
                              <span className="px-3 py-1 bg-primary/15 text-primary rounded-full text-sm border border-primary/25">Creator Fund</span>
                            </div>

                            <EngagementSection 
                              contentId="news-meta-horizon-fund"
                              contentType="news"
                              initialLikes={156}
                              initialComments={[
                                {
                                  id: '1',
                                  author: 'DevMaster99',
                                  content: 'Finally! This is exactly what the creator ecosystem needed. $25k grants will make a real difference.',
                                  timestamp: '30 minutes ago',
                                  likes: 24
                                },
                                {
                                  id: '2',
                                  author: 'VRCreator_Sarah',
                                  content: 'Love the mentorship program addition. Having industry veterans guide new creators is huge.',
                                  timestamp: '1 hour ago',
                                  likes: 18
                                }
                              ]}
                            />
                          </div>
                        </article>

                        {/* More News */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <article className="glass-card rounded-xl border border-sidebar-border hover:border-blue-500/30 transition-all overflow-hidden">
                            <div className="w-full h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              <span className="text-4xl relative z-10">🚀</span>
                              <div className="absolute bottom-4 left-4 right-4 z-10">
                                <div className="text-white font-semibold text-sm">Unity Engine</div>
                              </div>
                            </div>
                            <div className="p-6">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full mb-3">Industry News</span>
                              <h3 className="text-lg font-semibold text-foreground mb-2">Unity Launches VR Creator Hub</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                New platform consolidates VR development tools, asset marketplace, and community features for creators.
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                <span>Dec 28, 2024</span> • <span>2 min read</span>
                              </div>
                              <div className="mb-4">
                                <Link href="/news/unity-vr-creator-hub" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm font-medium rounded-lg transition-all duration-300 group">
                                  Read Full Article
                                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                              <EngagementSection 
                                contentId="news-unity-vr-hub"
                                contentType="news"
                                initialLikes={89}
                                initialComments={[]}
                              />
                            </div>
                          </article>

                          <article className="glass-card rounded-xl border border-sidebar-border hover:border-blue-500/30 transition-all overflow-hidden">
                            <div className="w-full h-48 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              <span className="text-4xl relative z-10">🎮</span>
                              <div className="absolute bottom-4 left-4 right-4 z-10">
                                <div className="text-white font-semibold text-sm">Roblox Updates</div>
                              </div>
                            </div>
                            <div className="p-6">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full mb-3">Platform Update</span>
                              <h3 className="text-lg font-semibold text-foreground mb-2">Roblox Introduces Premium Assets</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                New marketplace tier allows creators to sell high-quality assets with enhanced revenue sharing.
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                <span>Dec 26, 2024</span> • <span>4 min read</span>
                              </div>
                              <div className="mb-4">
                                <Link href="/news/roblox-premium-assets" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm font-medium rounded-lg transition-all duration-300 group">
                                  Read Full Article
                                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                              <EngagementSection 
                                contentId="news-roblox-premium"
                                contentType="news"
                                initialLikes={134}
                                initialComments={[]}
                              />
                            </div>
                          </article>

                          <article className="glass-card rounded-xl border border-sidebar-border hover:border-blue-500/30 transition-all overflow-hidden">
                            <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              <span className="text-4xl relative z-10">🥽</span>
                              <div className="absolute bottom-4 left-4 right-4 z-10">
                                <div className="text-white font-semibold text-sm">VRChat</div>
                              </div>
                            </div>
                            <div className="p-6">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full mb-3">Feature Release</span>
                              <h3 className="text-lg font-semibold text-foreground mb-2">VRChat Creator Economy Beta</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Closed beta program launches for world creators to monetize premium experiences and content.
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                <span>Dec 24, 2024</span> • <span>5 min read</span>
                              </div>
                              <div className="mb-4">
                                <Link href="/news/vrchat-creator-economy-beta" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm font-medium rounded-lg transition-all duration-300 group">
                                  Read Full Article
                                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                              <EngagementSection 
                                contentId="news-vrchat-economy"
                                contentType="news"
                                initialLikes={267}
                                initialComments={[]}
                              />
                            </div>
                          </article>

                          <article className="glass-card rounded-xl border border-sidebar-border hover:border-blue-500/30 transition-all overflow-hidden">
                            <div className="w-full h-48 bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              <span className="text-4xl relative z-10">💼</span>
                              <div className="absolute bottom-4 left-4 right-4 z-10">
                                <div className="text-white font-semibold text-sm">Industry Report</div>
                              </div>
                            </div>
                            <div className="p-6">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full mb-3">Market Analysis</span>
                              <h3 className="text-lg font-semibold text-foreground mb-2">Virtual Worlds Market Hits $5.7B</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Q4 2024 growth driven by creator economy expansion and enterprise adoption of virtual collaboration tools.
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                <span>Dec 22, 2024</span> • <span>6 min read</span>
                              </div>
                              <div className="mb-4">
                                <Link href="/news/virtual-worlds-market-report" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm font-medium rounded-lg transition-all duration-300 group">
                                  Read Full Article
                                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                              <EngagementSection 
                                contentId="news-market-report"
                                contentType="news"
                                initialLikes={98}
                                initialComments={[]}
                              />
                            </div>
                          </article>
                        </div>
                      </>
                    )}
                  </div>
                </main>

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

export default NewsPage;