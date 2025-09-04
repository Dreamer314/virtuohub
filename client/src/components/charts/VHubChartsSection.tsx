import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { ChartTabs } from "@/components/charts/ChartTabs";
import { ChartTable } from "@/components/charts/ChartTable";
import { ChartFilters } from "@/components/charts/ChartFilters";
import { getChartById, filterChartEntries, ChartType, VoiceFilter, SortOption } from "@/lib/data/charts";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface VHubChartsSectionProps {
  onFiltersChange?: (params: URLSearchParams) => void;
}

// Chart definitions per requirements
const CHART_DEFINITIONS: Record<ChartType, string> = {
  'vhub-100': "The top 100 creators across immersive platforms ranked by multi-signal reach and impact over the last 30 days.",
  'platforms-index': "Where creators are thriving most, based on earnings potential, engagement, and activity.",
  'momentum-50': "The fastest rising creators, streamers, and studios over the past 30 days.", 
  'studios-watchlist': "A curated radar of teams to watch."
};

export function VHubChartsSection({ onFiltersChange }: VHubChartsSectionProps) {
  // URL state management
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  // Chart state
  const [activeChart, setActiveChart] = useState<ChartType>(
    (searchParams.get('chart') as ChartType) || 'vhub-100'
  );
  const [voices, setVoices] = useState<VoiceFilter[]>(
    searchParams.get('voices')?.split(',').filter(Boolean) as VoiceFilter[] || []
  );
  const [platforms, setPlatforms] = useState<string[]>(
    searchParams.get('platforms')?.split(',').filter(Boolean) || []
  );
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'Most Recent'
  );
  
  // Modal states
  const [showMethodology, setShowMethodology] = useState(false);

  // Mock Pro user state - in real app this would come from auth context
  const [isProUser] = useState(false);
  const { toast } = useToast();

  // Get chart data
  const chartData = getChartById(activeChart);

  // Filter entries based on current filters
  const filteredEntries = chartData ? filterChartEntries(chartData.entries, {
    voices: voices.length > 0 ? voices : undefined,
    platforms: platforms.length > 0 ? platforms : undefined
  }) : [];

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (activeChart !== 'vhub-100') params.set('chart', activeChart);
    if (voices.length > 0) params.set('voices', voices.join(','));
    if (platforms.length > 0) params.set('platforms', platforms.join(','));
    if (sort !== 'Most Recent') params.set('sort', sort);
    
    onFiltersChange?.(params);
  }, [activeChart, voices, platforms, sort, onFiltersChange, searchParams]);

  const handleChartChange = (chart: ChartType) => {
    setActiveChart(chart);
    // Reset filters when switching charts for better UX
    setVoices([]);
    setPlatforms([]);
    setSort('Most Recent');
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade to Pro",
      description: "Pro features coming soon! Get access to full charts and advanced analytics.",
    });
  };

  const handleSuggestUpdate = () => {
    toast({
      title: "Thanks for the suggestion!",
      description: "We'll review your feedback for future updates.",
    });
  };

  if (!chartData) {
    return null;
  }

  // Contextual filters: Hide Voice filter for Platforms Index
  const showVoiceFilter = activeChart !== 'platforms-index';
  
  // Special handling for Studios Watchlist
  const isComingSoon = activeChart === 'studios-watchlist' && chartData.entries.length === 0;

  return (
    <div className="space-y-8">
      {/* Charts Header */}
      <div className="space-y-4">
        {/* Sponsor Banner */}
        {chartData.sponsorName && chartData.sponsorHref && (
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Presented by</span>
              <Button variant="ghost" size="sm" asChild>
                <a href={chartData.sponsorHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  {chartData.sponsorName}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Main Header */}
        <div className="space-y-2">
          <p className="vh-eyebrow">VHUB Charts</p>
          <h1 className="vh-hero">The scoreboards of the immersive creator economy.</h1>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-4 vh-meta">
            <span>Last updated {format(new Date(chartData.updatedAt), 'MMM d, yyyy • h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowMethodology(true)}
              className="flex items-center gap-1 hover:text-primary"
              data-testid="methodology-button"
            >
              <HelpCircle className="w-4 h-4" />
              Methodology
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSuggestUpdate}
              className="hover:text-primary"
              data-testid="suggest-update-button"
            >
              Suggest Update
            </Button>
          </div>
        </div>
      </div>

      {/* Chart Navigation Tabs */}
      <ChartTabs
        activeChart={activeChart}
        onChartChange={handleChartChange}
      />

      {/* Chart Definition - immediately under active tab */}
      <div className="text-muted-foreground">
        {CHART_DEFINITIONS[activeChart]}
      </div>

      {/* Coming Soon for Studios Watchlist */}
      {isComingSoon ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're preparing a comprehensive list of the most promising virtual world studios. 
            Check back soon for exclusive insights.
          </p>
        </div>
      ) : (
        <>
          {/* Contextual Filters */}
          <ChartFilters
            activeChart={activeChart}
            voices={showVoiceFilter ? voices : []}
            platforms={platforms}
            sort={sort}
            onVoicesChange={showVoiceFilter ? setVoices : () => {}}
            onPlatformsChange={setPlatforms}
            onSortChange={setSort}
            showVoiceFilter={showVoiceFilter}
          />

          {/* Chart Table */}
          <ChartTable
            chart={chartData}
            entries={filteredEntries}
            isProUser={isProUser}
            onUpgrade={handleUpgrade}
          />
        </>
      )}
      
      {/* Methodology Modal */}
      {showMethodology && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMethodology(false)}>
          <div className="bg-background p-6 rounded-lg max-w-md mx-4 border" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Methodology</h3>
            <p className="text-muted-foreground mb-4">
              Our rankings are calculated using a combination of metrics including engagement, 
              growth rate, community impact, and platform-specific data points. Rankings are 
              updated regularly based on the latest available data.
            </p>
            <Button onClick={() => setShowMethodology(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}