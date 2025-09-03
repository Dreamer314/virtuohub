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
                      {/* Active Polls */}
                      {activePolls.length > 0 && (
                        <section>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <h2 className="text-2xl font-bold text-foreground">Active Polls</h2>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {activePolls.length} active
                            </Badge>
                          </div>
                          <div className="space-y-6">
                            {activePolls.map((poll: any) => (
                              <VHubPulseCard key={poll.id} poll={poll} />
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Completed Polls */}
                      {completedPolls.length > 0 && (
                        <section>
                          <div className="flex items-center gap-3 mb-6">
                            <BarChart3 className="w-5 h-5 text-muted-foreground" />
                            <h2 className="text-2xl font-bold text-foreground">Recent Results</h2>
                            <Badge variant="outline">
                              {completedPolls.length} completed
                            </Badge>
                          </div>
                          <div className="space-y-6">
                            {completedPolls.map((poll: any) => (
                              <VHubPulseCard key={poll.id} poll={poll} />
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Reports */}
                      {allReports.length > 0 && (
                        <section>
                          <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <h2 className="text-2xl font-bold text-foreground">Published Reports</h2>
                            <Badge variant="outline">
                              {allReports.length} reports
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allReports.map((report: any) => (
                              <Card key={report.id} className="p-6 hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-foreground mb-2">{report.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {report.accessType === 'free' && (
                                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        <Eye className="w-3 h-3 mr-1" />
                                        Free
                                      </Badge>
                                    )}
                                    {report.accessType === 'paid' && (
                                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        <DollarSign className="w-3 h-3 mr-1" />
                                        Paid
                                      </Badge>
                                    )}
                                    {report.accessType === 'private' && (
                                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                                        <Lock className="w-3 h-3 mr-1" />
                                        Private
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(report.publishDate).toLocaleDateString()}
                                  </div>
                                  <Button size="sm" variant="outline">
                                    View Report
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Empty State */}
                      {activePolls.length === 0 && completedPolls.length === 0 && allReports.length === 0 && (
                        <div className="text-center py-12">
                          <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-foreground mb-2">No Pulse Data Available</h3>
                          <p className="text-muted-foreground">Check back later for new polls and reports.</p>
                        </div>
                      )}
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