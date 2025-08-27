import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES, PLATFORMS, type Category, type Platform } from "@shared/schema";
import { Bookmark } from "lucide-react";

interface LeftSidebarProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  selectedPlatforms: Platform[];
  onPlatformsChange: (platforms: Platform[]) => void;
  currentTab: 'all' | 'saved';
  onTabChange: (tab: 'all' | 'saved') => void;
}

export function LeftSidebar({ 
  selectedCategory, 
  onCategoryChange, 
  selectedPlatforms, 
  onPlatformsChange,
  currentTab,
  onTabChange
}: LeftSidebarProps) {
  const { data: savedPosts = [] } = useQuery({
    queryKey: ['/api/users/user1/saved-posts'], // Using user1 for demo
  });

  const handlePlatformChange = (platform: Platform, checked: boolean) => {
    if (checked) {
      onPlatformsChange([...selectedPlatforms, platform]);
    } else {
      onPlatformsChange(selectedPlatforms.filter(p => p !== platform));
    }
  };

  return (
    <aside className="lg:col-span-3">
      <div className="space-y-6">
        {/* Community Section */}
        <div className="glass-card rounded-xl p-6 hover-lift" data-testid="community-section">
          <h2 className="text-lg font-display font-semibold mb-4 gradient-text">
            Community Section
          </h2>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-2 mb-6">
            <Button
              onClick={() => onTabChange('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 ${
                currentTab === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              data-testid="tab-all"
            >
              All
            </Button>
            <Button
              onClick={() => onTabChange('saved')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 ${
                currentTab === 'saved'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              data-testid="tab-saved"
            >
              <Bookmark className="w-4 h-4 mr-1" />
              Saved
            </Button>
          </div>

          {currentTab === 'all' && (
            <>
              {/* Filter by Category */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-foreground">
                  Filter by Category
                </h3>
                <Select value={selectedCategory} onValueChange={(value) => onCategoryChange(value as Category)}>
                  <SelectTrigger className="w-full" data-testid="category-filter">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category} data-testid={`category-${category}`}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Platform */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-foreground">
                  Filter by Platform
                </h3>
                <div className="space-y-2">
                  {PLATFORMS.map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={selectedPlatforms.includes(platform)}
                        onCheckedChange={(checked) => 
                          handlePlatformChange(platform, checked as boolean)
                        }
                        data-testid={`platform-${platform}`}
                      />
                      <label
                        htmlFor={platform}
                        className="text-sm text-foreground cursor-pointer"
                      >
                        {platform}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Saved Posts Preview */}
        {Array.isArray(savedPosts) && savedPosts.length > 0 && (
          <div className="glass-card rounded-xl p-6 hover-lift" data-testid="saved-posts-preview">
            <h3 className="text-lg font-display font-semibold mb-4 gradient-text flex items-center">
              <Bookmark className="w-5 h-5 mr-2" />
              Recent Saves
            </h3>
            <div className="space-y-3">
              {(savedPosts as any[]).slice(0, 3).map((post: any) => (
                <div key={post.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" data-testid={`saved-post-preview-${post.id}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
