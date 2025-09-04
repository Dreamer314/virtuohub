import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ChartTabs } from "@/components/charts/ChartTabs";
import { ChartHeader } from "@/components/charts/ChartHeader";
import { ChartTable } from "@/components/charts/ChartTable";
import { ChartFilters } from "@/components/charts/ChartFilters";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { getChartById, filterChartEntries, ChartType, VoiceFilter, SortOption } from "@/lib/data/charts";
import { useToast } from "@/hooks/use-toast";

export default function ChartsPage() {
  // URL state management
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const [, setLocation] = useLocation();
  
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
    const params = new URLSearchParams();
    if (activeChart !== 'vhub-100') params.set('chart', activeChart);
    if (voices.length > 0) params.set('voices', voices.join(','));
    if (platforms.length > 0) params.set('platforms', platforms.join(','));
    if (sort !== 'Most Recent') params.set('sort', sort);
    
    const newSearch = params.toString();
    setLocation(`/community/charts${newSearch ? `?${newSearch}` : ''}`, { replace: true });
  }, [activeChart, voices, platforms, sort, setLocation]);

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
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <LeftSidebar
            currentTab="all"
            onTabChange={() => {}}
            currentSection="feed"
            onSectionChange={() => {}}
          />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Chart Not Found</h1>
                <p className="text-muted-foreground">The requested chart could not be loaded.</p>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar */}
        <LeftSidebar
          currentTab="all"
          onTabChange={() => {}}
          currentSection="feed"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">VHUB Charts</h1>
                <p className="text-muted-foreground text-lg mt-2">
                  The scoreboards of the immersive creator economy.
                </p>
              </div>

              {/* Chart Navigation Tabs */}
              <ChartTabs
                activeChart={activeChart}
                onChartChange={handleChartChange}
                className="mb-6"
              />
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

            {/* Chart Header with Metadata */}
            <ChartHeader
              title={chartData.title}
              description={chartData.description}
              sponsorName={chartData.sponsorName}
              sponsorHref={chartData.sponsorHref}
              updatedAt={chartData.updatedAt}
              totalEntries={chartData.entries.length}
              isProChart={chartData.isPro}
              isProUser={isProUser}
            />

            {/* Chart Table */}
            <ChartTable
              entries={filteredEntries}
              isProChart={chartData.isPro}
              isProUser={isProUser}
              onUpgrade={handleUpgrade}
            />
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}