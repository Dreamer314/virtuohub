import React from 'react';
import { Zap } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const PulsePage: React.FC = () => {
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
                    <div className="flex items-center space-x-2 mb-8">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent flex-1"></div>
                      <div className="flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-cyan-500/10 via-cyan-500/20 to-cyan-500/10 rounded-full border border-cyan-500/30">
                        <Zap className="w-8 h-8 text-cyan-500" />
                        <h1 className="text-5xl font-bold text-foreground tracking-tight">
                          Pulse Reports
                        </h1>
                      </div>
                      <div className="h-0.5 bg-gradient-to-r from-cyan-500 via-transparent to-transparent flex-1"></div>
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
                      <article className="glass-card rounded-xl p-6 border border-green-500/30">
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

                      <article className="glass-card rounded-xl p-6 border border-green-500/30">
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

                  {/* Published Reports */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Published Reports</h2>
                    <div className="space-y-6">
                      {/* Free Report */}
                      <article className="glass-card rounded-xl p-6 border border-sidebar-border hover:border-cyan-500/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full mb-3">Free Report</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Q4 2024 Platform Usage Trends
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Analysis of user engagement patterns across major virtual world platforms. Based on 15,000+ creator responses.
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">FREE</div>
                            <div className="text-xs text-muted-foreground">Released Dec 30</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">Platform Data</span>
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">Usage Analytics</span>
                          </div>
                          <button className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors text-sm font-medium">
                            Download PDF
                          </button>
                        </div>
                      </article>

                      {/* Premium Report */}
                      <article className="glass-card rounded-xl p-6 border border-sidebar-border hover:border-cyan-500/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full mb-3">Premium Report</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Virtual Economy Revenue Analysis 2024
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Comprehensive revenue breakdown by platform, creator type, and monetization strategy. Includes forecasting models.
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-yellow-400">$49</div>
                            <div className="text-xs text-muted-foreground">Released Dec 28</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">Revenue Data</span>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">Forecasting</span>
                          </div>
                          <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors text-sm font-medium">
                            Purchase Report
                          </button>
                        </div>
                      </article>

                      {/* Private Report */}
                      <article className="glass-card rounded-xl p-6 border border-sidebar-border hover:border-cyan-500/30 transition-all opacity-60">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded-full mb-3">Private Report</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Enterprise Virtual Workspace Adoption
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Detailed analysis of enterprise VR/AR workspace implementations. Access restricted to enterprise subscribers.
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-400">PRIVATE</div>
                            <div className="text-xs text-muted-foreground">Dec 26</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">Enterprise</span>
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">Restricted</span>
                          </div>
                          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg cursor-not-allowed text-sm font-medium" disabled>
                            Access Required
                          </button>
                        </div>
                      </article>

                      {/* Completed Poll Results */}
                      <article className="glass-card rounded-xl p-6 border border-sidebar-border hover:border-cyan-500/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full mb-3">Poll Results</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Creator Tool Preferences Survey
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Results from our survey on preferred creation tools and workflows. 8,500+ responses collected.
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-400">FREE</div>
                            <div className="text-xs text-muted-foreground">Completed Dec 22</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">Survey Data</span>
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">Tools</span>
                          </div>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors text-sm font-medium">
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