import React, { useEffect } from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/cards/PostCard';
import { Footer } from '@/components/layout/footer';
import { EngagementSection } from '@/components/engagement-section';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const InterviewsPage: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch all posts and filter for interview posts
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  const interviewPosts = posts
    .filter(post => post.type === 'insight') // Using insight posts as interview content
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
                        <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4">
                          <Lightbulb className="w-8 h-8 text-transparent bg-gradient-nebula bg-clip-text" style={{backgroundImage: 'var(--gradient-nebula)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Interviews
                          </h1>
                        </div>
                        <div className="h-px bg-gradient-to-r from-accent via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      Advice and insight from working creators
                    </p>
                  </div>

                  {/* Interview Articles */}
                  <div className="space-y-8">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">Loading interviews...</div>
                      </div>
                    ) : (
                      <>
                        {/* Featured Interview */}
                        <article className="enhanced-card hover-lift rounded-xl border border-purple-500/30 overflow-hidden">
                          {/* Hero Image */}
                          <div className="w-full h-80 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="relative z-10 text-center">
                              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/20">
                                <span className="text-4xl">👤</span>
                              </div>
                              <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/30 text-purple-200 border border-purple-400/30 rounded-full mb-2">Interview</span>
                              <h2 className="text-3xl font-bold text-white mb-2">Building Immersive Worlds</h2>
                              <p className="text-purple-200">A Conversation with Alex Chen</p>
                              <p className="text-purple-300 text-sm">Senior World Designer at Horizon Worlds</p>
                            </div>
                          </div>
                          
                          <div className="p-8">

                            <div className="prose prose-invert max-w-none">
                              <blockquote className="border-l-4 border-purple-500 pl-6 my-6 text-lg italic text-muted-foreground">
                                "The key to creating truly immersive virtual worlds isn't just technical skill—it's understanding human psychology and what makes people feel present in a space."
                              </blockquote>

                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground mb-3">Q: What's your approach to designing for presence?</h3>
                                  <p className="text-muted-foreground">
                                    <strong className="text-purple-400">Alex:</strong> I start with the emotional journey I want users to experience. Whether it's wonder, excitement, or tranquility, every visual element—from lighting to scale—serves that emotional goal. Technical optimization comes second.
                                  </p>
                                </div>

                                <div>
                                  <h3 className="text-lg font-semibold text-foreground mb-3">Q: How has VR design evolved in the past few years?</h3>
                                  <p className="text-muted-foreground">
                                    <strong className="text-purple-400">Alex:</strong> We've moved from "wow, this is VR!" novelty to focusing on genuine utility and comfort. Users now expect seamless interactions and intuitive navigation. The bar for quality has risen dramatically.
                                  </p>
                                </div>

                                <div>
                                  <h3 className="text-lg font-semibold text-foreground mb-3">Q: What tools are essential for aspiring world builders?</h3>
                                  <p className="text-muted-foreground">
                                    <strong className="text-purple-400">Alex:</strong> Master Unity and Blender first—they're your foundation. But also study traditional architecture and game design principles. The best VR worlds borrow from centuries of spatial design knowledge.
                                  </p>
                                </div>
                              </div>

                              <div className="mt-8 p-4 bg-muted/20 rounded-lg">
                                <h4 className="font-semibold text-foreground mb-3">Key Takeaways</h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                  <li>• Focus on emotional impact before technical features</li>
                                  <li>• Study real-world architecture and spatial design</li>
                                  <li>• Prioritize user comfort and intuitive interactions</li>
                                  <li>• Test early and often with diverse user groups</li>
                                </ul>
                              </div>
                            </div>

                            {/* Read Full Interview Button */}
                            <div className="mb-6">
                              <Link href="/interview/alex-chen-vrchat-worlds" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium rounded-lg transition-all duration-300 group">
                                Read Full Interview
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>

                            {/* Engagement Section */}
                            <EngagementSection 
                              contentId="interview-alex-chen"
                              contentType="interview"
                              initialLikes={247}
                              initialComments={[
                                {
                                  id: '1',
                                  author: 'Maya Singh',
                                  content: 'This is exactly what I needed to hear! The part about emotional journey first, technical second really resonates with my approach.',
                                  timestamp: '2 hours ago',
                                  likes: 12
                                },
                                {
                                  id: '2', 
                                  author: 'Jordan Kim',
                                  content: 'Great insights on the evolution of VR design. The comparison to traditional architecture is spot on.',
                                  timestamp: '4 hours ago',
                                  likes: 8
                                }
                              ]}
                            />
                          </div>
                        </article>

                        {/* More Interviews */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <article className="enhanced-card hover-lift rounded-xl border border-sidebar-border hover:border-purple-500/30 transition-all overflow-hidden">
                            <div className="w-full h-32 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                              <span className="text-3xl">👗</span>
                            </div>
                            <div className="p-6">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full mb-3">Interview</span>
                              <h3 className="text-lg font-semibold text-foreground mb-2">Monetizing Virtual Fashion</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Fashion designer Maya Patel shares insights on building a sustainable virtual clothing business across multiple platforms.
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                <span>8 min read</span> • <span>Dec 28, 2024</span>
                              </div>
                              <div className="mb-4">
                                <Link href="/interview/maya-patel-virtual-fashion" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm font-medium rounded-lg transition-all duration-300 group">
                                  Read Full Interview
                                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                              <EngagementSection 
                                contentId="interview-maya-fashion"
                                contentType="interview"
                                initialLikes={89}
                                initialComments={[]}
                              />
                            </div>
                          </article>

                          <article className="enhanced-card hover-lift rounded-xl border border-sidebar-border hover:border-purple-500/30 transition-all overflow-hidden">
                            <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                              <span className="text-3xl">🏢</span>
                            </div>
                            <div className="p-6">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full mb-3">Interview</span>
                              <h3 className="text-lg font-semibold text-foreground mb-2">From Hobbyist to Studio</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                How Tom Richards grew his weekend VRChat world project into a full-time virtual experiences studio.
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                <span>12 min read</span> • <span>Dec 25, 2024</span>
                              </div>
                              <div className="mb-4">
                                <Link href="/interview/tom-richards-hobbyist-studio" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm font-medium rounded-lg transition-all duration-300 group">
                                  Read Full Interview
                                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                              <EngagementSection 
                                contentId="interview-tom-studio"
                                contentType="interview"
                                initialLikes={156}
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

export default InterviewsPage;