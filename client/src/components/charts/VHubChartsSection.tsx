import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { ChartTabs } from "@/components/charts/ChartTabs";
import { ChartHeader } from "@/components/charts/ChartHeader";
import { ChartTable } from "@/components/charts/ChartTable";
import { ChartFilters } from "@/components/charts/ChartFilters";
import { getChartById, filterChartEntries, ChartType, VoiceFilter, SortOption } from "@/lib/data/charts";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface VHubChartsSectionProps {
  onFiltersChange?: (params: URLSearchParams) => void;
}

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

  if (!chartData) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
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
          <h1 className="vh-title">The scoreboards of the immersive creator economy.</h1>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 vh-meta">
          <span>Last updated {format(new Date(chartData.updatedAt), 'MMM d, yyyy • h:mm a')}</span>
        </div>
      </div>

      {/* Chart Navigation Tabs */}
      <ChartTabs
        activeChart={activeChart}
        onChartChange={handleChartChange}
      />

      {/* Chart Definition */}
      <div className="text-muted-foreground">
        {chartData.description}
      </div>

      {/* Filters */}
      <ChartFilters
        activeChart={activeChart}
        voices={voices}
        platforms={platforms}
        sort={sort}
        onVoicesChange={setVoices}
        onPlatformsChange={setPlatforms}
        onSortChange={setSort}
      />

      {/* Chart Table */}
      <ChartTable
        entries={filteredEntries}
        isProChart={chartData.isPro}
        isProUser={isProUser}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}