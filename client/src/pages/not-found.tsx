import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Home, Search, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    // Set page title for 404
    document.title = '404 - Page Not Found | VirtuoHub';
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex">
        <LeftSidebar currentTab="all" onTabChange={() => {}} />
        <main className="flex-1 px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 404 Content */}
            <div className="text-center py-16">
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-cosmic bg-clip-text"
                       style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                    404
                  </div>
                  <AlertTriangle className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Page Not Found
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                The page you're looking for doesn't exist in the VirtuoHub community.
                It might have been moved, deleted, or you entered the wrong URL.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300"
                  data-testid="button-home"
                >
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Community Home
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild
                  className="px-6 py-3 rounded-lg border-muted-foreground/20 hover:border-accent hover:text-accent transition-all duration-300"
                  data-testid="button-back"
                >
                  <Link href="javascript:history.back()">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Link>
                </Button>
              </div>
              
              {/* Helpful Links */}
              <div className="enhanced-card rounded-xl p-8 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Looking for something specific?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <Link href="/spotlights" className="group">
                    <div className="p-4 rounded-lg border border-sidebar-border hover:border-accent/30 transition-all cursor-pointer group-hover:bg-accent/5">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-foreground group-hover:text-accent transition-colors">Creator Spotlights</span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/events" className="group">
                    <div className="p-4 rounded-lg border border-sidebar-border hover:border-accent/30 transition-all cursor-pointer group-hover:bg-accent/5">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-foreground group-hover:text-accent transition-colors">Virtual Events</span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/community/lists" className="group">
                    <div className="p-4 rounded-lg border border-sidebar-border hover:border-accent/30 transition-all cursor-pointer group-hover:bg-accent/5">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-foreground group-hover:text-accent transition-colors">Community Lists</span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/trending" className="group">
                    <div className="p-4 rounded-lg border border-sidebar-border hover:border-accent/30 transition-all cursor-pointer group-hover:bg-accent/5">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-foreground group-hover:text-accent transition-colors">Trending Content</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              
              {/* Search Suggestion */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Or try searching for what you need:
                </p>
                <div className="flex justify-center">
                  <Button variant="ghost" className="text-accent hover:text-accent/80">
                    <Search className="w-4 h-4 mr-2" />
                    Open Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <RightSidebar />
      </div>
      <Footer />
    </div>
  );
}
