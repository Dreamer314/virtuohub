import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const PulsePage: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  const pulsePosts = posts
    .filter(post => post.type === 'pulse')
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
                          <Zap className="w-8 h-8 text-transparent bg-gradient-cosmic bg-clip-text" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            VHub Pulse
                          </h1>
                        </div>
                        <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      Industry data collection center and poll results
                    </p>
                  </div>

                  {/* Active Polls Section */}
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                      Active Polls
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <article className="enhanced-card hover-lift rounded-xl p-6 border border-green-500/30">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">Active Poll</span>
                          <span className="text-sm text-muted-foreground">Ends in 5 days</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          What's your primary revenue stream in virtual worlds?
                        </h3>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Asset sales</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 rounded-full" style={{width: '45%'}}></div>
                              </div>
                              <span className="text-sm text-cyan-400">45%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Virtual events</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{width: '30%'}}></div>
                              </div>
                              <span className="text-sm text-purple-400">30%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Commissions</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 rounded-full" style={{width: '25%'}}></div>
                              </div>
                              <span className="text-sm text-yellow-400">25%</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">2,847 responses</p>
                        <button className="w-full py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors text-sm font-medium">
                          Participate in Poll
                        </button>
                      </article>

                      <article className="enhanced-card hover-lift rounded-xl p-6 border border-green-500/30">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">Active Poll</span>
                          <span className="text-sm text-muted-foreground">Ends in 12 days</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          Which platform do you prioritize for new projects?
                        </h3>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">VRChat</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 rounded-full" style={{width: '38%'}}></div>
                              </div>
                              <span className="text-sm text-cyan-400">38%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Roblox</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{width: '35%'}}></div>
                              </div>
                              <span className="text-sm text-orange-400">35%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Horizon Worlds</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{width: '27%'}}></div>
                              </div>
                              <span className="text-sm text-blue-400">27%</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">1,924 responses</p>
                        <button className="w-full py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors text-sm font-medium">
                          Participate in Poll
                        </button>
                      </article>
                    </div>
                  </div>

                  {/* Completed Polls Section */}
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Completed Polls</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <article className="enhanced-card hover-lift rounded-xl p-6 border border-sidebar-border hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-full">Completed</span>
                          <span className="text-sm text-muted-foreground">Ended Dec 20</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          Which creation tool do you use most?
                        </h3>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Unity</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{width: '52%'}}></div>
                              </div>
                              <span className="text-sm text-blue-400">52%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Blender</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{width: '28%'}}></div>
                              </div>
                              <span className="text-sm text-orange-400">28%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Unreal Engine</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{width: '20%'}}></div>
                              </div>
                              <span className="text-sm text-purple-400">20%</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">4,562 responses</p>
                      </article>

                      <article className="enhanced-card hover-lift rounded-xl p-6 border border-sidebar-border hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-full">Completed</span>
                          <span className="text-sm text-muted-foreground">Ended Dec 15</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          How many hours per week do you spend creating?
                        </h3>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">20+ hours (Full-time)</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{width: '34%'}}></div>
                              </div>
                              <span className="text-sm text-green-400">34%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">10-20 hours</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 rounded-full" style={{width: '31%'}}></div>
                              </div>
                              <span className="text-sm text-yellow-400">31%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">5-10 hours</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 rounded-full" style={{width: '35%'}}></div>
                              </div>
                              <span className="text-sm text-cyan-400">35%</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">3,891 responses</p>
                      </article>

                      <article className="enhanced-card hover-lift rounded-xl p-6 border border-sidebar-border hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-full">Completed</span>
                          <span className="text-sm text-muted-foreground">Ended Dec 10</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          What's your biggest creation challenge?
                        </h3>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Learning new tools</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full" style={{width: '42%'}}></div>
                              </div>
                              <span className="text-sm text-red-400">42%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Finding time</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{width: '33%'}}></div>
                              </div>
                              <span className="text-sm text-blue-400">33%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Technical limitations</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{width: '25%'}}></div>
                              </div>
                              <span className="text-sm text-purple-400">25%</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">5,234 responses</p>
                      </article>

                      <article className="enhanced-card hover-lift rounded-xl p-6 border border-sidebar-border hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-full">Completed</span>
                          <span className="text-sm text-muted-foreground">Ended Dec 5</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          Which monetization model works best?
                        </h3>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">One-time purchases</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{width: '39%'}}></div>
                              </div>
                              <span className="text-sm text-green-400">39%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Subscriptions</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{width: '32%'}}></div>
                              </div>
                              <span className="text-sm text-orange-400">32%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Commission-based</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 rounded-full" style={{width: '29%'}}></div>
                              </div>
                              <span className="text-sm text-cyan-400">29%</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">2,678 responses</p>
                      </article>
                    </div>
                  </div>

                  {/* Published Reports */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Published Reports</h2>
                    <div className="space-y-6">
                      {/* Free Report */}
                      <article className="enhanced-card hover-lift rounded-xl p-6 border border-sidebar-border hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/20 text-primary border border-primary/30 rounded-full mb-3">Free Report</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Q4 2024 Platform Usage Trends
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Analysis of user engagement patterns across major virtual world platforms. Based on 15,000+ creator responses.
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">FREE</div>
                            <div className="text-xs text-muted-foreground">Released Dec 30</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">Platform Data</span>
                            <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">Usage Analytics</span>
                          </div>
                          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                            Download PDF
                          </button>
                        </div>
                      </article>

                      {/* Premium Report */}
                      <article className="enhanced-card hover-lift rounded-xl p-6 border border-sidebar-border hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/20 text-accent border border-accent/30 rounded-full mb-3">Premium Report</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Virtual Economy Revenue Analysis 2024
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Comprehensive revenue breakdown by platform, creator type, and monetization strategy. Includes forecasting models.
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-accent">$49</div>
                            <div className="text-xs text-muted-foreground">Released Dec 28</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">Revenue Data</span>
                            <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">Forecasting</span>
                          </div>
                          <button className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary/90 hover:to-accent/90 transition-colors text-sm font-medium">
                            Purchase Report
                          </button>
                        </div>
                      </article>

                      {/* Private Report */}
                      <article className="enhanced-card hover-lift rounded-xl p-6 border border-sidebar-border hover:border-cyan-500/30 transition-all opacity-60">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-muted/20 text-muted-foreground border border-muted/30 rounded-full mb-3">Private Report</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Enterprise Virtual Workspace Adoption
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Detailed analysis of enterprise VR/AR workspace implementations. Access restricted to enterprise subscribers.
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-muted-foreground">PRIVATE</div>
                            <div className="text-xs text-muted-foreground">Dec 26</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-muted/20 text-muted-foreground rounded text-xs">Enterprise</span>
                            <span className="px-2 py-1 bg-muted/20 text-muted-foreground rounded text-xs">Restricted</span>
                          </div>
                          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg cursor-not-allowed text-sm font-medium" disabled>
                            Access Required
                          </button>
                        </div>
                      </article>

                      {/* Completed Poll Results */}
                      <article className="enhanced-card hover-lift rounded-xl p-6 border border-sidebar-border hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/20 text-primary border border-primary/30 rounded-full mb-3">Poll Results</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Creator Tool Preferences Survey
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Results from our survey on preferred creation tools and workflows. 8,500+ responses collected.
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">FREE</div>
                            <div className="text-xs text-muted-foreground">Completed Dec 22</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">Survey Data</span>
                            <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">Tools</span>
                          </div>
                          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                            View Results
                          </button>
                        </div>
                      </article>
                    </div>
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

export default PulsePage;