import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Lightbulb, Star, Globe, Flame } from "lucide-react";

export function RightSidebar() {
  return (
    <aside className="lg:col-span-3">
      <div className="space-y-6">
        {/* The Pulse */}
        <div className="glass-card rounded-xl p-6 hover-lift" data-testid="the-pulse">
          <h3 className="text-lg font-display font-semibold mb-4 flex items-center">
            <TrendingUp className="text-primary mr-2" size={20} />
            The Pulse
          </h3>
          <h4 className="font-semibold mb-3 text-foreground">
            Which virtual world has the best creator economy?
          </h4>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Second Life</span>
              <div className="flex items-center space-x-2">
                <Progress value={40} className="w-20 h-2" />
                <span className="text-xs text-muted-foreground">40%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Roblox</span>
              <div className="flex items-center space-x-2">
                <Progress value={35} className="w-20 h-2" />
                <span className="text-xs text-muted-foreground">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">VRChat</span>
              <div className="flex items-center space-x-2">
                <Progress value={25} className="w-20 h-2" />
                <span className="text-xs text-muted-foreground">25%</span>
              </div>
            </div>
          </div>
          <Button className="w-full py-2 text-sm transition-all hover:scale-105" data-testid="vote-now-button">
            Vote Now
          </Button>
        </div>

        {/* Creator Insights */}
        <div className="glass-card rounded-xl p-6 hover-lift" data-testid="creator-insights">
          <h3 className="text-lg font-display font-semibold mb-4 flex items-center">
            <Lightbulb className="text-accent mr-2" size={20} />
            Creator Insights
          </h3>
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160" 
            alt="Creator workspace setup" 
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          <h4 className="font-semibold mb-2 text-foreground">
            The Psychology of Virtual World Design
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            How understanding player psychology can boost your world's engagement by 300%...
          </p>
          <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium p-0" data-testid="read-article-button">
            Read Article →
          </Button>
        </div>

        {/* Creator Spotlight */}
        <div className="glass-card rounded-xl p-6 hover-lift" data-testid="creator-spotlight">
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
          <Button className="w-full py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-all hover:scale-105 text-sm font-medium" data-testid="view-portfolio-button">
            View Portfolio
          </Button>
        </div>

        {/* Meta Layer & Trending */}
        <div className="glass-card rounded-xl overflow-hidden hover-lift" data-testid="meta-trending">
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
