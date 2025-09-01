import React from 'react';
import { Newspaper } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { PostCard } from '@/components/post-card';
import { Footer } from '@/components/layout/footer';
import { useQuery } from '@tanstack/react-query';
import type { PostWithAuthor } from '@shared/schema';

const NewsPage: React.FC = () => {
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts']
  });

  const newsPosts = posts.filter(post => 
    post.type === 'regular' && 
    (post.category === 'General' && 
     (post.title.toLowerCase().includes('industry') || 
      post.title.toLowerCase().includes('news') ||
      post.title.toLowerCase().includes('update') ||
      post.title.toLowerCase().includes('announcement') ||
      post.title.toLowerCase().includes('launch') ||
      post.title.toLowerCase().includes('release')))
  ).sort((a, b) => {
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
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1"></div>
                      <div className="flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-blue-500/20 to-blue-500/10 rounded-full border border-blue-500/30">
                        <Newspaper className="w-8 h-8 text-blue-500" />
                        <h1 className="text-5xl font-bold text-foreground tracking-tight">
                          Industry News
                        </h1>
                      </div>
                      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-transparent to-transparent flex-1"></div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      What changed and why it matters
                    </p>
                  </div>

                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">Loading industry news...</div>
                      </div>
                    ) : newsPosts.length > 0 ? (
                      newsPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))
                    ) : (
                      <div className="glass-card rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">📰</div>
                        <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                          No industry news yet
                        </h3>
                        <p className="text-muted-foreground">
                          Industry updates and announcements will appear here!
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

export default NewsPage;