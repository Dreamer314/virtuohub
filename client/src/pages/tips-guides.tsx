import React from 'react';
import { BookOpen } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const TipsGuidesPage: React.FC = () => {
  // Fetch all posts and filter for tips and guides
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  const tipsGuidesPosts = posts.filter(post => 
    post.type === 'regular' && 
    (post.title.toLowerCase().includes('tip') || 
     post.title.toLowerCase().includes('guide') ||
     post.title.toLowerCase().includes('tutorial') ||
     post.title.toLowerCase().includes('how to') ||
     post.title.toLowerCase().includes('workflow') ||
     post.title.toLowerCase().includes('best practice'))
  ).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header onCreatePost={() => {}} />
      
      <div className="community-grid">
        {/* Left Sidebar */}
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar
              currentTab="all"
              onTabChange={() => {}}
              currentSection="tips"
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
                    currentSection="tips"
                  />
                </div>

                {/* Main Content */}
                <main>
                  {/* Page Header */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-8">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent flex-1"></div>
                      <div className="flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-500/10 rounded-full border border-green-500/30">
                        <BookOpen className="w-8 h-8 text-green-500" />
                        <h1 className="text-5xl font-bold text-foreground tracking-tight">
                          Tips & Guides
                        </h1>
                      </div>
                      <div className="h-0.5 bg-gradient-to-r from-green-500 via-transparent to-transparent flex-1"></div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      Helpful tutorials and best practices for virtual world creators
                    </p>
                  </div>

                  {/* Posts */}
                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">Loading tips and guides...</div>
                      </div>
                    ) : tipsGuidesPosts.length > 0 ? (
                      tipsGuidesPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))
                    ) : (
                      <div className="glass-card rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                          No tips and guides yet
                        </h3>
                        <p className="text-muted-foreground">
                          Helpful tutorials and guides will be shared here!
                        </p>
                      </div>
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

export default TipsGuidesPage;