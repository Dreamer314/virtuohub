import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { ChartTabs } from "@/components/charts/ChartTabs";
import { ChartTable } from "@/components/charts/ChartTable";
import { VoiceSwitcher } from "@/components/charts/VoiceSwitcher";
import { getChartById, ChartType } from "@/lib/data/charts";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VHubChartsSectionProps {
  onFiltersChange?: (params: URLSearchParams) => void;
}

// Chart definitions per requirements
const CHART_DEFINITIONS: Record<Exclude<ChartType, 'studios-watchlist'>, string> = {
  'vhub-25': "The top 25 creators across immersive platforms ranked by multi-signal reach and impact over the last 30 days.",
  'platforms-index': "Top 25 platforms where creators are thriving most, based on earnings potential, engagement, and activity.",
  'momentum-25': "Top 25 rising creators, streamers, and studios over the past 30 days."
};

export function VHubChartsSection({ onFiltersChange }: VHubChartsSectionProps) {
  // URL state management
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  // Chart state
  const [activeChart, setActiveChart] = useState<ChartType>(
    (searchParams.get('chart') as ChartType) || 'vhub-25'
  );
  const [voice, setVoice] = useState<'editorial' | 'community'>(
    (searchParams.get('voice') as 'editorial' | 'community') || 'editorial'
  );
  // Removed platform and sort filters - charts are pre-ordered
  
  // Modal states handled by ChartsHero component

  // Mock Pro user state - in real app this would come from auth context
  const [isProUser] = useState(false);
  const { toast } = useToast();

  // Get chart data
  const chartData = getChartById(activeChart, voice);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (activeChart !== 'vhub-25') params.set('chart', activeChart);
    if (voice !== 'editorial') params.set('voice', voice);
    
    onFiltersChange?.(params);
  }, [activeChart, voice, onFiltersChange, searchParams]);

  const handleChartChange = (chart: ChartType) => {
    setActiveChart(chart);
    // Reset voice when switching charts for better UX
    setVoice('editorial');
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade to Pro",
      description: "Pro features coming soon! Get access to full charts and advanced analytics.",
    });
  };

  // Suggest update handled by ChartsHero component

  if (!chartData) {
    return null;
  }

  // Contextual filters: Show Voice switcher for creator charts only
  const showVoiceSwitcher = activeChart === 'vhub-25' || activeChart === 'momentum-25';
  
  // Skip Studios Watchlist - removed from tabs
  const isComingSoon = false;

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

        {/* Header content is handled by ChartsHero component */}
      </div>

      {/* Chart Navigation Tabs */}
      <ChartTabs
        activeChart={activeChart}
        onChartChange={handleChartChange}
      />

      {/* Chart Definition - immediately under active tab */}
      <div className="space-y-2">
        <div className="text-muted-foreground">
          {CHART_DEFINITIONS[activeChart as keyof typeof CHART_DEFINITIONS]}
        </div>
        {/* Voice indicator chip for creator charts */}
        {showVoiceSwitcher && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Voice:</span>
            <span className="vh-chip bg-primary/10 text-primary border-primary/20">
              {voice === 'editorial' ? 'Editorial (VHub Picks)' : 'Community Choice'}
            </span>
          </div>
        )}
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
          {/* Voice Switcher - Only for creator charts */}
          {showVoiceSwitcher && (
            <div className="flex items-center justify-center py-4">
              <VoiceSwitcher
                voice={voice}
                onVoiceChange={setVoice}
              />
            </div>
          )}

          {/* Chart Table */}
          <ChartTable
            chart={chartData}
            entries={chartData.entries}
            isProUser={isProUser}
            onUpgrade={handleUpgrade}
          />
        </>
      )}
      
      {/* Modals are handled by ChartsHero component */}
    </div>
  );
}