import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Star, Globe, Flame, Clock } from "lucide-react";

export function RightSidebar() {
  return (
    <aside className="w-full">
      <div className="space-y-6">
        {/* Upcoming Events */}
        <div className="bg-sidebar enhanced-card glow-border rounded-xl p-6 border border-sidebar-border hover:border-primary/30 transition-all duration-300 hover:shadow-md" data-testid="upcoming-events">
          <h3 className="text-lg font-display font-semibold mb-4 flex items-center">
            <Calendar className="text-accent mr-2" size={20} />
            Upcoming Events
          </h3>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Coming Soon</span>
              </div>
              <h4 className="font-semibold mb-2 text-foreground">
                Virtual Creator Conference 2025
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Join industry leaders for talks on the future of virtual world creation, monetization strategies, and emerging technologies.
              </p>
              <div className="text-xs text-muted-foreground mb-3">
                📅 March 15-17, 2025 • Virtual Event
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full opacity-60 cursor-not-allowed" 
                disabled
                data-testid="early-access-button"
              >
                Early Access Soon
              </Button>
            </div>
            
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">
                More events coming soon!
              </p>
              <Button variant="link" className="text-accent hover:text-accent/80 text-sm font-medium p-0">
                Get Notified →
              </Button>
            </div>
          </div>
        </div>

        {/* Creator Spotlight */}
        <div className="bg-sidebar enhanced-card glow-border rounded-xl p-6 border border-sidebar-border hover:border-primary/30 transition-all duration-300 hover:shadow-md" data-testid="creator-spotlight">
          <h3 className="text-lg font-display font-semibold mb-4 flex items-center">
            <Star className="text-yellow-500 mr-2" size={20} />
            Creator Spotlight
          </h3>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
            <div>
              <h4 className="font-semibold text-foreground">Emma Thompson</h4>
              <p className="text-sm text-muted-foreground">VR Environment Artist</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Creator of award-winning VRChat worlds with over 2M visits. Specializes in atmospheric environments and interactive experiences.
          </p>
          <Button className="w-full py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 hover:border-2 hover:border-yellow-300 border border-transparent transition-all text-sm font-medium" data-testid="view-portfolio-button">
            View Portfolio
          </Button>
        </div>

        {/* Meta Layer & Trending */}
        <div className="bg-sidebar enhanced-card glow-border rounded-xl overflow-hidden border border-sidebar-border hover:border-primary/30 transition-all duration-300 hover:shadow-md" data-testid="meta-trending">
          {/* Top Half: Meta Layer Report */}
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-display font-semibold mb-3 flex items-center">
              <Globe className="text-blue-500 mr-2" size={20} />
              Meta Layer Report
            </h3>
            <h4 className="font-semibold mb-2 text-foreground">
              Virtual Real Estate Market Hits Record High
            </h4>
            <p className="text-sm text-muted-foreground">
              Decentraland and Sandbox properties see 40% increase in value this quarter...
            </p>
          </div>

          {/* Bottom Half: Trending */}
          <div className="p-6">
            <h3 className="text-lg font-display font-semibold mb-3 flex items-center">
              <Flame className="text-red-500 mr-2" size={20} />
              Trending
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between hover:bg-muted/50 rounded p-2 transition-colors cursor-pointer" data-testid="trending-item-vrchat">
                <span className="text-sm text-foreground">#VRChatSDK</span>
                <span className="text-xs text-muted-foreground">1.2K posts</span>
              </div>
              <div className="flex items-center justify-between hover:bg-muted/50 rounded p-2 transition-colors cursor-pointer" data-testid="trending-item-roblox">
                <span className="text-sm text-foreground">#RobloxStudio</span>
                <span className="text-xs text-muted-foreground">890 posts</span>
              </div>
              <div className="flex items-center justify-between hover:bg-muted/50 rounded p-2 transition-colors cursor-pointer" data-testid="trending-item-jobs">
                <span className="text-sm text-foreground">#MetaverseJobs</span>
                <span className="text-xs text-muted-foreground">654 posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
