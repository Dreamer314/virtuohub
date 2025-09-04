import React, { useEffect, useState } from 'react';
import { Zap, Clock, Users, BarChart3, Download, CreditCard, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { pulseApi, subscribe, type Poll, type Report } from '@/data/pulseApi';
import { mockApi } from '@/data/mockApi';
import { PollCard } from '@/components/polls/PollCard';

const PulsePage: React.FC = () => {
  const [pulseRefresh, setPulseRefresh] = useState(0);
  
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

  // Get data from both APIs - combine VHub Pulse and user-created polls
  const vhubActivePolls = pulseApi.listActivePolls();
  const userActivePolls = mockApi.listActivePolls();
  const activePolls = [...vhubActivePolls, ...userActivePolls];
  
  const vhubCompletedPolls = pulseApi.listCompletedPolls();
  const userCompletedPolls = mockApi.listCompletedPolls();
  const completedPolls = [...vhubCompletedPolls, ...userCompletedPolls];
  
  const reports = pulseApi.listReports();

  const handleVote = (pollId: string, optionIndex: number) => {
    try {
      // Try VHub Pulse API first, then mock API
      try {
        pulseApi.vote(pollId, optionIndex);
      } catch {
        // If VHub poll fails, try mock API
        mockApi.votePoll(pollId, [pollId + '-' + optionIndex]);
      }
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
                        {activePolls.map((poll) => {
                          const hasVoted = pulseApi.hasVoted(poll.id);
                          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                          const timeLeft = Math.max(0, poll.endsAt - Date.now());
                          const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
                          
                          return (
                            <article key={poll.id} className="enhanced-card hover-lift rounded-xl p-6 border border-green-500/30 flex flex-col min-h-[320px]">
                              <div className="flex items-center justify-between mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">Active Poll</span>
                                <span className="text-sm text-muted-foreground">Ends in {daysLeft} days</span>
                              </div>
                              <h3 className="text-lg font-semibold text-foreground mb-3">
                                {poll.question}
                              </h3>
                              
                              <div className="flex-1">
                                {hasVoted ? (
                                  <div className="space-y-3 mb-4">
                                    {poll.options.map((option, index) => {
                                      const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                      const colors = ['cyan', 'purple', 'yellow', 'green', 'blue', 'pink'];
                                      const color = colors[index % colors.length];
                                      
                                      return (
                                        <div key={index} className="flex justify-between items-center">
                                          <span className="text-sm text-muted-foreground">{option.label}</span>
                                          <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                              <div className={`h-full bg-${color}-500 rounded-full`} style={{width: `${percentage}%`}}></div>
                                            </div>
                                            <span className={`text-sm text-${color}-400`}>{percentage.toFixed(0)}%</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="space-y-2 mb-4">
                                    {poll.options.map((option, index) => (
                                      <button
                                        key={index}
                                        onClick={() => handleVote(poll.id, index)}
                                        className="w-full p-3 text-left border border-border rounded-lg hover:border-primary/50 transition-colors"
                                        data-testid={`poll-option-${poll.id}-${index}`}
                                      >
                                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {/* Sticky Bottom Section */}
                              <div className="mt-auto pt-4 border-t border-border/30">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm text-muted-foreground flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {totalVotes} votes
                                  </span>
                                  <span className="text-sm text-muted-foreground flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {daysLeft} days left
                                  </span>
                                </div>
                                
                                {!hasVoted && (
                                  <div className="text-center text-sm text-muted-foreground">
                                    Click an option above to vote
                                  </div>
                                )}
                                
                                {hasVoted && (
                                  <div className="flex items-center justify-center text-sm text-green-400">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    You voted in this poll
                                  </div>
                                )}
                              </div>
                            </article>
                          );
                        })}
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
                        {completedPolls.map((poll) => {
                          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                          const endedDaysAgo = Math.floor((Date.now() - poll.endsAt) / (1000 * 60 * 60 * 24));
                          
                          return (
                            <article key={poll.id} className="enhanced-card hover-lift rounded-xl p-6 border border-slate-500/30 flex flex-col min-h-[320px]">
                              <div className="flex items-center justify-between mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30 rounded-full">Completed</span>
                                <span className="text-sm text-muted-foreground">Ended {endedDaysAgo} days ago</span>
                              </div>
                              <h3 className="text-lg font-semibold text-foreground mb-3">
                                {poll.question}
                              </h3>
                              
                              <div className="flex-1">
                                <div className="space-y-3 mb-4">
                                  {poll.options.map((option, index) => {
                                    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                    const colors = ['cyan', 'purple', 'yellow', 'green', 'blue', 'pink'];
                                    const color = colors[index % colors.length];
                                    
                                    return (
                                      <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{option.label}</span>
                                        <div className="flex items-center gap-2">
                                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full bg-${color}-500 rounded-full`} style={{width: `${percentage}%`}}></div>
                                          </div>
                                          <span className={`text-sm text-${color}-400`}>{percentage.toFixed(0)}%</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              {/* Sticky Bottom Section */}
                              <div className="mt-auto pt-4 border-t border-border/30">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {totalVotes.toLocaleString()} total votes
                                  </span>
                                  <span className="text-sm text-muted-foreground">Final results</span>
                                </div>
                              </div>
                            </article>
                          );
                        })}
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
                            <article key={report.id} className="enhanced-card hover-lift rounded-xl p-6 border border-blue-500/30">
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
                                <Button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 hover:border-green-500 text-green-300">
                                  <Download className="w-4 h-4 mr-2" />
                                  Download PDF
                                </Button>
                              )}
                              
                              {report.priceType === 'paid' && (
                                <Button className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 hover:border-yellow-500 text-yellow-300">
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Purchase
                                </Button>
                              )}
                              
                              {report.priceType === 'private' && (
                                <Button className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 text-red-300">
                                  <Mail className="w-4 h-4 mr-2" />
                                  Access Required
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
      
      <Footer />
    </div>
  );
};

export default PulsePage;