import React, { useEffect } from 'react';
import { TrendingUp, BarChart3, FileText, Lock, DollarSign, Eye } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { VHubPulseCard } from '@/components/vhub-pulse-card';

const PulsePage: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch all pulse data using the same API as community page
  const { data: activePolls = [], isLoading: activeLoading } = useQuery({
    queryKey: ['/api/pulse/polls', 'active'],
    queryFn: () => fetch('/api/pulse/polls?status=active').then(res => res.json()),
  });

  const { data: completedPolls = [], isLoading: completedLoading } = useQuery({
    queryKey: ['/api/pulse/polls', 'completed'],
    queryFn: () => fetch('/api/pulse/polls?status=completed').then(res => res.json()),
  });

  const { data: allReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['/api/pulse/reports'],
    queryFn: () => fetch('/api/pulse/reports').then(res => res.json()),
  });

  const isLoading = activeLoading || completedLoading || reportsLoading;

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
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4">
                          <TrendingUp className="w-8 h-8 text-primary" />
                          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            VHub Pulse
                          </h1>
                        </div>
                        <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      Real-time insights into the Immersive Economy through data-driven polls and reports.
                    </p>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      {/* Active Polls Section */}
                      <section className="mb-12">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <h2 className="text-2xl font-bold text-foreground">Active Polls</h2>
                        </div>
                        {activePolls.length > 0 ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {activePolls.map((poll: any) => (
                              <article key={poll.id} className="enhanced-card hover-lift rounded-xl p-6 border border-green-500/30">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">Active Poll</span>
                                  <span className="text-sm text-muted-foreground">
                                    Ends in {Math.ceil((new Date(poll.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                                  </span>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">
                                  {poll.title}
                                </h3>
                                <div className="space-y-3 mb-4">
                                  {poll.options.map((option: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">{option.text}</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                          <div 
                                            className="h-full rounded-full" 
                                            style={{
                                              width: `${option.percentage}%`,
                                              backgroundColor: index === 0 ? '#06b6d4' : index === 1 ? '#8b5cf6' : '#eab308'
                                            }}
                                          ></div>
                                        </div>
                                        <span className="text-sm" style={{
                                          color: index === 0 ? '#06b6d4' : index === 1 ? '#8b5cf6' : '#eab308'
                                        }}>
                                          {option.percentage}%
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">{poll.totalVotes} responses</p>
                                <button 
                                  onClick={() => {/* Handle vote */}}
                                  className="w-full py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors text-sm font-medium"
                                >
                                  Participate in Poll
                                </button>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No active polls at the moment.
                          </div>
                        )}
                      </section>

                      {/* Published Reports Section */}
                      <section>
                        <div className="flex items-center gap-3 mb-8">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <h2 className="text-2xl font-bold text-foreground">Published Reports</h2>
                        </div>
                        {allReports.length > 0 ? (
                          <div className="space-y-6">
                            {allReports.map((report: any) => (
                              <article key={report.id} className="enhanced-card hover-lift rounded-xl p-6 border border-border/50">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      {report.accessType === 'free' && (
                                        <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">Free Report</span>
                                      )}
                                      {report.accessType === 'paid' && (
                                        <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">Premium Report</span>
                                      )}
                                      {report.accessType === 'private' && (
                                        <span className="inline-block px-3 py-1 text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded-full">Private Report</span>
                                      )}
                                      <span className="text-sm text-muted-foreground">
                                        Released {new Date(report.publishDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{report.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded">Platform Data</span>
                                      <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded">Usage Analytics</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    {report.accessType === 'free' && (
                                      <div className="text-2xl font-bold text-green-400 mb-2">FREE</div>
                                    )}
                                    {report.accessType === 'paid' && (
                                      <div className="text-2xl font-bold text-blue-400 mb-2">${report.price || '49'}</div>
                                    )}
                                    {report.accessType === 'private' && (
                                      <div className="text-2xl font-bold text-red-400 mb-2">PRIVATE</div>
                                    )}
                                    <Button 
                                      size="sm" 
                                      className={`${
                                        report.accessType === 'free' 
                                          ? 'bg-green-600 hover:bg-green-500' 
                                          : report.accessType === 'paid'
                                          ? 'bg-blue-600 hover:bg-blue-500'
                                          : 'bg-red-600 hover:bg-red-500'
                                      }`}
                                    >
                                      {report.accessType === 'free' ? 'Download PDF' : 'View Report'}
                                    </Button>
                                  </div>
                                </div>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No published reports available.
                          </div>
                        )}
                      </section>
                    </div>
                  )}
                </main>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PulsePage;