// VirtuoHub - URL Sync Demo Component
// Demonstrates URL synchronization with filter state

import { useURLFilters, usePlatformFilter } from '@/hooks/useURLFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share, X, Search } from 'lucide-react';
import { useState } from 'react';

const DEMO_PLATFORMS = ['roblox', 'vrchat', 'unity', 'secondlife'] as const;
const DEMO_SUBTYPES = ['event', 'spotlight', 'poll', 'insight'] as const;
const DEMO_CATEGORIES = ['General', 'Assets for Sale', 'Jobs & Gigs'] as const;

export function URLSyncDemo() {
  const { filters, actions, url } = useURLFilters();
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.setSearchQuery(searchInput);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Would normally use toast here
    console.log('Copied to clipboard:', text);
  };

  return (
    <Card className="max-w-4xl mx-auto" data-testid="url-sync-demo">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share className="w-5 h-5" />
          URL Sync Demo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Changes below will automatically update the URL. Refresh the page to see state restore from URL.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current State Display */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Current State</h4>
          <div className="text-sm space-y-1">
            <div><strong>URL:</strong> <code className="text-xs">{url.shareURL}</code></div>
            <div><strong>Has Filters:</strong> {filters.hasActiveFilters ? 'Yes' : 'No'}</div>
            <div><strong>Summary:</strong> {filters.filterSummary}</div>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => copyToClipboard(url.shareURL)}
            className="mt-2"
            data-testid="copy-url-button"
          >
            Copy Shareable URL
          </Button>
        </div>

        {/* Search */}
        <div>
          <h4 className="font-medium mb-2">Search</h4>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search content..."
              className="flex-1"
              data-testid="search-input"
            />
            <Button type="submit" size="sm" data-testid="search-button">
              <Search className="w-4 h-4" />
            </Button>
          </form>
          {filters.searchQuery && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">
                Search: "{filters.searchQuery}"
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  actions.setSearchQuery('');
                  setSearchInput('');
                }}
                data-testid="clear-search-button"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Platform Selection */}
        <div>
          <h4 className="font-medium mb-2">Platform Filters</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {DEMO_PLATFORMS.map((platform) => (
              <Button
                key={platform}
                size="sm"
                variant={filters.selectedPlatforms.includes(platform) ? "default" : "outline"}
                onClick={() => actions.togglePlatform(platform)}
                data-testid={`platform-${platform}`}
              >
                {platform}
              </Button>
            ))}
          </div>
          {filters.selectedPlatforms.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {filters.selectedPlatforms.map((platform) => (
                  <Badge key={platform} variant="secondary">
                    {platform}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => actions.removePlatform(platform)}
                      className="ml-1 h-auto p-0 w-4"
                      data-testid={`remove-platform-${platform}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={actions.clearPlatforms}
                data-testid="clear-platforms-button"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Content Type Selection */}
        <div>
          <h4 className="font-medium mb-2">Content Type Filters</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {DEMO_SUBTYPES.map((subtype) => (
              <Button
                key={subtype}
                size="sm"
                variant={filters.selectedSubtypes.includes(subtype) ? "default" : "outline"}
                onClick={() => actions.toggleSubtype(subtype)}
                data-testid={`subtype-${subtype}`}
              >
                {subtype}
              </Button>
            ))}
          </div>
          {filters.selectedSubtypes.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {filters.selectedSubtypes.map((subtype) => (
                  <Badge key={subtype} variant="secondary">
                    {subtype}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => actions.removeSubtype(subtype)}
                      className="ml-1 h-auto p-0 w-4"
                      data-testid={`remove-subtype-${subtype}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={actions.clearSubtypes}
                data-testid="clear-subtypes-button"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Sorting and View Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Sort By</h4>
            <div className="flex gap-2">
              {(['recent', 'popular', 'trending'] as const).map((sort) => (
                <Button
                  key={sort}
                  size="sm"
                  variant={filters.sortBy === sort ? "default" : "outline"}
                  onClick={() => actions.setSortBy(sort)}
                  data-testid={`sort-${sort}`}
                >
                  {sort}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Time Range</h4>
            <div className="flex gap-2">
              {(['all', '24h', '7d', '30d'] as const).map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={filters.timeRange === range ? "default" : "outline"}
                  onClick={() => actions.setTimeRange(range)}
                  data-testid={`time-${range}`}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={actions.clearFilters}
            disabled={!filters.hasActiveFilters}
            data-testid="clear-all-filters"
          >
            Clear All Filters
          </Button>
          <Button
            variant="outline"
            onClick={() => actions.applyPreset('trending')}
            data-testid="trending-preset"
          >
            Trending Preset
          </Button>
          <Button
            variant="outline"
            onClick={() => actions.applyPreset('saved')}
            data-testid="saved-preset"
          >
            Saved Posts
          </Button>
        </div>

        {/* URL Examples */}
        <div className="space-y-2">
          <h4 className="font-medium">Quick Links (for testing)</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(url.createPlatformURL('roblox'), '_blank')}
              data-testid="quick-roblox"
            >
              Roblox Filter
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(url.createSubtypeURL('event'), '_blank')}
              data-testid="quick-events"
            >
              Events Filter
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(url.createSearchURL('VRChat'), '_blank')}
              data-testid="quick-search"
            >
              Search "VRChat"
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}