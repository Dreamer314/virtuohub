import React, { useEffect, useState } from 'react';
import { Zap, Clock, Users, BarChart3, Download, CreditCard, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { PollCard } from '@/components/polls/PollCard';
import { pulseApi, subscribe, type Poll as PulseApiPoll, type Report } from '@/data/pulseApi';
import { type Poll } from '@/types/content';
import { useAuth } from '@/providers/AuthProvider';
import { AuthModal } from '@/components/auth/AuthModal';

const PulsePage: React.FC = () => {
  const [pulseRefresh, setPulseRefresh] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const { user } = useAuth();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Subscribe to pulse updates
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setPulseRefresh(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Get data from pulse API (refresh when pulseRefresh changes)
  const [activePolls, setActivePolls] = useState<PulseApiPoll[]>([]);
  const [completedPolls, setCompletedPolls] = useState<PulseApiPoll[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    setActivePolls(pulseApi.listActivePolls());
    setCompletedPolls(pulseApi.listCompletedPolls());
    setReports(pulseApi.listReports());
  }, [pulseRefresh]);

  // Convert pulseApi Poll to content Poll type
  const convertPulseApiPoll = (apiPoll: PulseApiPoll): Poll => {
    const now = Date.now();
    return {
      id: apiPoll.id,
      type: 'poll' as const,
      question: apiPoll.question,
      options: apiPoll.options.map((opt, index) => ({
        id: `${apiPoll.id}_option_${index}`,
        label: opt.label,
        votes: opt.votes
      })),
      allowMultiple: false, // Default for pulse polls
      showResults: 'after-vote' as const,
      closesAt: apiPoll.endsAt,
      category: 'General',
      platforms: [],
      createdAt: apiPoll.createdAt,
      author: { 
        id: 'system', 
        name: 'VHub Data Pulse',
        avatar: undefined 
      },
      status: (apiPoll.endsAt > now ? 'active' : 'completed') as 'active' | 'completed'
    };
  };

  const handleVote = (pollId: string, optionIndex: number) => {
    try {
      pulseApi.vote(pollId, optionIndex);
      setPulseRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

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
                            Pulse Reports
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
                    {activePolls.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No active polls. Check back soon.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {activePolls.map((poll) => (
                          <PollCard 
                            key={poll.id}
                            poll={convertPulseApiPoll(poll)}
                            context="pulse"
                            onUpdate={() => setPulseRefresh(prev => prev + 1)}
                            onVote={async (pollId: string, optionIds: string[]) => {
                              try {
                                // Convert optionIds to option indices for pulseApi
                                const optionIndex = parseInt(optionIds[0].split('_option_')[1]);
                                console.log('Voting:', { pollId, optionIds, optionIndex });
                                pulseApi.vote(pollId, optionIndex);
                                setPulseRefresh(prev => prev + 1);
                              } catch (error) {
                                console.error('Vote failed:', error);
                              }
                            }}
                            userHasVoted={pulseApi.hasVoted(poll.id)}
                            userVoteIds={pulseApi.getUserVote(poll.id) !== null ? [`${poll.id}_option_${pulseApi.getUserVote(poll.id)}`] : undefined}
                            openAuthModal={() => {
                              setAuthModalMode('signin');
                              setAuthModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Completed Polls Section */}
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <div className="w-3 h-3 bg-slate-500 rounded-full mr-3"></div>
                      Completed Polls
                    </h2>
                    {completedPolls.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No completed polls yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {completedPolls.map((poll) => (
                          <PollCard 
                            key={poll.id}
                            poll={convertPulseApiPoll(poll)}
                            context="pulse"
                            onUpdate={() => setPulseRefresh(prev => prev + 1)}
                            onVote={async (pollId: string, optionIds: string[]) => {
                              try {
                                // Convert optionIds to option indices for pulseApi
                                const optionIndex = parseInt(optionIds[0].split('_option_')[1]);
                                console.log('Voting (completed):', { pollId, optionIds, optionIndex });
                                pulseApi.vote(pollId, optionIndex);
                                setPulseRefresh(prev => prev + 1);
                              } catch (error) {
                                console.error('Vote failed (completed):', error);
                              }
                            }}
                            userHasVoted={pulseApi.hasVoted(poll.id)}
                            userVoteIds={pulseApi.getUserVote(poll.id) !== null ? [`${poll.id}_option_${pulseApi.getUserVote(poll.id)}`] : undefined}
                            openAuthModal={() => {
                              setAuthModalMode('signin');
                              setAuthModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Published Reports Section */}
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      Published Reports
                    </h2>
                    {reports.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No reports published yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {reports.map((report) => {
                          const daysAgo = Math.floor((Date.now() - report.releasedAt) / (1000 * 60 * 60 * 24));
                          const isAvailable = report.releasedAt <= Date.now();
                          
                          return (
                            <article key={report.id} className="vh-card" data-testid={`report-card-${report.id}`}>
                              <div className="flex items-center justify-between mb-4">
                                {report.priceType === 'free' && (
                                  <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">FREE</span>
                                )}
                                {report.priceType === 'paid' && (
                                  <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full">
                                    ${(report.priceCents! / 100).toFixed(0)}
                                  </span>
                                )}
                                {report.priceType === 'private' && (
                                  <span className="inline-block px-3 py-1 text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded-full">PRIVATE</span>
                                )}
                                <span className="text-sm text-muted-foreground">
                                  {daysAgo >= 0 ? `${daysAgo} days ago` : `Available in ${Math.abs(daysAgo)} days`}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-foreground mb-3">
                                {report.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                {report.summary}
                              </p>
                              {report.badges && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {report.badges.map((badge, index) => (
                                    <span key={index} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">{badge}</span>
                                  ))}
                                </div>
                              )}
                              
                              {report.priceType === 'free' && isAvailable && (
                                <Button 
                                  onClick={() => {
                                    console.log(`Downloading free report: ${report.title}`);
                                    // Simulate download - in real app would download actual PDF
                                    window.open(report.downloadUrl, '_blank');
                                  }}
                                  className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 hover:border-green-500 text-green-300 transition-colors"
                                  data-testid={`download-button-${report.id}`}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download PDF
                                </Button>
                              )}
                              
                              {report.priceType === 'paid' && (
                                <Button 
                                  onClick={() => {
                                    console.log(`Initiating purchase for: ${report.title} - $${(report.priceCents! / 100).toFixed(2)}`);
                                    // Simulate payment flow - in real app would redirect to payment processor
                                    alert(`Purchase flow for ${report.title} - $${(report.priceCents! / 100).toFixed(2)}\n\nIn a real app, this would redirect to a payment processor.`);
                                  }}
                                  className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 hover:border-yellow-500 text-yellow-300 transition-colors"
                                  data-testid={`purchase-button-${report.id}`}
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Purchase
                                </Button>
                              )}
                              
                              {report.priceType === 'private' && (
                                <Button 
                                  onClick={() => {
                                    console.log(`Requesting access for private report: ${report.title}`);
                                    // Simulate contact form - in real app would open contact modal
                                    alert(`Request access to: ${report.title}\n\nIn a real app, this would open a contact form or email client.`);
                                  }}
                                  className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 text-red-300 transition-colors"
                                  data-testid={`request-access-button-${report.id}`}
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Request Access
                                </Button>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        defaultMode={authModalMode}
      />
      
      <Footer />
    </div>
  );
};

export default PulsePage;