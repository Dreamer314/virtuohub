import React, { useEffect } from 'react';
import { BookOpen, CheckCircle, Zap, Monitor, Settings } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { EngagementSection } from '@/components/engagement-section';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import type { PostWithAuthor } from '@shared/schema';
import unityImage from '@assets/generated_images/Unity_metaverse_development_54c43114.png';

const GuidesPage: React.FC = () => {
  const { slug } = useParams();
  const [location] = useLocation();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if we're on a specific guide page
  const isPerformanceGuide = slug === 'performance-optimization';

  // Fetch all posts and filter for tips and guides
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  const guidesPosts = posts.filter(post => 
    post.type === 'regular' && 
    (post.title.toLowerCase().includes('tip') || 
     post.title.toLowerCase().includes('guide') ||
     post.title.toLowerCase().includes('tutorial') ||
     post.title.toLowerCase().includes('how to') ||
     post.title.toLowerCase().includes('workflow') ||
     post.title.toLowerCase().includes('best practice'))
  ).sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  if (isPerformanceGuide) {
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
                <div className="max-w-4xl mx-auto">
                  <article className="enhanced-card p-8 mb-8">
                    {/* Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <BookOpen className="w-5 h-5" />
                          <span>Performance Guide</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>December 30, 2024</span>
                        </div>
                      </div>
                      
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Optimizing Performance in Virtual Worlds
                      </h1>
                      
                      <p className="text-lg text-muted-foreground mb-6">
                        Essential tips for creating lag-free experiences that work across all devices and platforms. Learn industry-proven techniques for performance optimization.
                      </p>
                    </div>

                    {/* Featured Image */}
                    <div className="mb-8 rounded-lg overflow-hidden">
                      <img 
                        src={unityImage} 
                        alt="Unity metaverse development"
                        className="w-full h-64 md:h-80 object-cover"
                      />
                    </div>

                    {/* Guide Content */}
                    <div className="prose prose-lg max-w-none text-foreground">
                      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        Performance Fundamentals
                      </h2>
                      
                      <p className="text-lg leading-relaxed mb-6">
                        Performance optimization in virtual worlds is crucial for user retention and engagement. Poor performance leads to immediate user dropoff, while optimized worlds create immersive experiences that keep users coming back.
                      </p>

                      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-blue-500" />
                        Hardware Targeting Strategy
                      </h3>
                      
                      <Card className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-foreground">Target Mobile First</p>
                                <p className="text-sm text-muted-foreground">Optimize for Quest 2/3 specs: 90Hz, mobile GPU limitations</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-foreground">Desktop Enhancement</p>
                                <p className="text-sm text-muted-foreground">Layer additional quality for high-end PC users</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-foreground">Cross-Platform Testing</p>
                                <p className="text-sm text-muted-foreground">Test on actual target devices, not just development machines</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-500" />
                        Unity Optimization Techniques
                      </h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="bg-muted/50 border border-border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Texture Optimization</h4>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Use texture atlasing to reduce draw calls</li>
                            <li>• Compress textures appropriately (DXT1/5 for opaque/transparent)</li>
                            <li>• Implement mipmap chains for distant objects</li>
                            <li>• Limit texture resolution: 1024x1024 for most surfaces</li>
                          </ul>
                        </div>

                        <div className="bg-muted/50 border border-border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Mesh & Geometry</h4>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Target &lt;50k triangles total for mobile platforms</li>
                            <li>• Use LOD (Level of Detail) systems for complex models</li>
                            <li>• Implement occlusion culling to hide non-visible objects</li>
                            <li>• Combine static meshes where possible</li>
                          </ul>
                        </div>

                        <div className="bg-muted/50 border border-border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Lighting & Shaders</h4>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Bake lighting whenever possible (avoid real-time)</li>
                            <li>• Use mobile-optimized shaders</li>
                            <li>• Limit dynamic lights: 1-2 per scene maximum</li>
                            <li>• Consider lightmapping for static environments</li>
                          </ul>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-4">Platform-Specific Considerations</h3>
                      
                      <p className="leading-relaxed mb-4">
                        <strong>VRChat:</strong> Follow VRChat's performance ranking system. Aim for "Good" performance rating across all categories. Use the VRChat SDK's performance analytics to identify bottlenecks.
                      </p>

                      <p className="leading-relaxed mb-4">
                        <strong>Horizon Worlds:</strong> Leverage Meta's built-in optimization tools. Use their asset optimization pipeline and follow their polygon budget guidelines strictly.
                      </p>

                      <p className="leading-relaxed mb-6">
                        <strong>Roblox:</strong> Work within Roblox's memory constraints. Use Roblox's performance profiler extensively and optimize Lua scripts for efficiency.
                      </p>

                      <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-foreground mb-2">💡 Pro Tip</h4>
                        <p className="text-muted-foreground">
                          Always profile on target hardware. Development machines often mask performance issues that become critical on end-user devices. Set up a testing pipeline using actual Quest headsets, mobile phones, and lower-end PCs.
                        </p>
                      </div>
                    </div>

                    {/* Engagement Section */}
                    <EngagementSection 
                      contentId="guide-performance-optimization"
                      contentType="news"
                      initialLikes={156}
                      initialComments={[
                        {
                          id: '1',
                          author: 'OptimizedDev',
                          content: 'This saved my project! The texture atlasing tip alone improved my performance by 40%.',
                          timestamp: '3 hours ago',
                          likes: 23
                        },
                        {
                          id: '2', 
                          author: 'VRCreator_Max',
                          content: 'Great breakdown of platform differences. The VRChat performance ranking info is spot on.',
                          timestamp: '6 hours ago',
                          likes: 18
                        },
                        {
                          id: '3',
                          author: 'MobileFirst_Dev',
                          content: 'Mobile-first approach has revolutionized how I think about world design. Essential reading.',
                          timestamp: '1 day ago',
                          likes: 31
                        }
                      ]}
                    />
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

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
                          <BookOpen className="w-8 h-8 text-transparent bg-gradient-aurora bg-clip-text" style={{backgroundImage: 'var(--gradient-aurora)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Tips & Guides
                          </h1>
                        </div>
                        <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      Tutorials and playbooks to level up
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Featured Guide */}
                    <div className="enhanced-card hover-lift rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-background overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-48 md:h-auto">
                          <img 
                            src={unityImage} 
                            alt="Unity metaverse development"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full border border-primary/30">
                              Featured Guide
                            </span>
                            <span className="text-sm text-muted-foreground">December 30, 2024</span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            Optimizing Performance in Virtual Worlds
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Essential tips for creating lag-free experiences that work across all devices and platforms. Learn industry-proven techniques for performance optimization.
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-mist flex items-center justify-center text-white text-sm font-semibold">
                                VH
                              </div>
                              <div className="text-sm">
                                <div className="font-medium text-foreground">VirtuoHub Editorial</div>
                                <div className="text-muted-foreground">Performance Guide</div>
                              </div>
                            </div>
                            <a 
                              href="/guides/performance-optimization"
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                              Read Guide
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Community Guides */}
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">Loading guides...</div>
                      </div>
                    ) : guidesPosts.length > 0 ? (
                      <>
                        <div className="flex items-center gap-3 mt-8 mb-4">
                          <div className="h-px bg-border flex-1"></div>
                          <h2 className="text-lg font-semibold text-foreground">Community Guides</h2>
                          <div className="h-px bg-border flex-1"></div>
                        </div>
                        {guidesPosts.map((post) => (
                          <PostCard key={post.id} post={post} />
                        ))}
                      </>
                    ) : (
                      <div className="enhanced-card hover-lift rounded-xl p-8 text-center mt-8">
                        <div className="text-4xl mb-3">📝</div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          Community Guides Coming Soon
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Share your own tutorials and guides with the community!
                        </p>
                      </div>
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

export default GuidesPage;