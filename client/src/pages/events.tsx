import React from 'react';
import { Monitor } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';

const EventsPage: React.FC = () => {
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
                    <div className="flex items-center space-x-2 mb-8">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                      <div className="flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-full border border-primary/30">
                        <Monitor className="w-8 h-8 text-primary" />
                        <h1 className="text-5xl font-bold text-foreground tracking-tight">
                          Events
                        </h1>
                      </div>
                      <div className="h-0.5 bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      What's happening next, online and IRL
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="glass-card rounded-xl p-12 text-center">
                      <div className="text-6xl mb-4">📅</div>
                      <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                        Events coming soon
                      </h3>
                      <p className="text-muted-foreground">
                        Upcoming events and conferences will be listed here!
                      </p>
                    </div>
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

export default EventsPage;