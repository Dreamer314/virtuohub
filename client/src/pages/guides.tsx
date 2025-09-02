import React from 'react';
import { BookOpen } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const GuidesPage: React.FC = () => {
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
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">Loading guides...</div>
                      </div>
                    ) : guidesPosts.length > 0 ? (
                      guidesPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))
                    ) : (
                      <div className="enhanced-card hover-lift rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                          No guides yet
                        </h3>
                        <p className="text-muted-foreground">
                          Helpful tutorials and guides will be shared here!
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