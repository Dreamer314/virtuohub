import { Badge } from "@/components/common/Badge";
import { PlatformPill } from "@/components/common/PlatformPill";
import { Button } from "@/components/ui/button";
import { ChartEntry, ChartConfig, formatMetricValue } from "@/lib/data/charts";
import { motion } from "framer-motion";
import { Crown, Lock, TrendingUp, TrendingDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Platform } from "@/types/lists";

interface ChartTableProps {
  chart: ChartConfig;
  entries: ChartEntry[];
  isProUser?: boolean;
  onUpgrade?: () => void;
}

// Per-chart column configurations as per requirements
const getColumnConfig = (chart: ChartConfig) => {
  switch (chart.id) {
    case 'vhub-100':
      return {
        columns: ['Rank', 'Avatar', 'Creator', 'Platforms', 'Metric', 'Movement'],
        showBadges: true,
        entityLabel: 'Creator'
      };
    case 'platforms-index':
      return {
        columns: ['Rank', 'Platform logo', 'Platform name', 'Category', 'Metric', 'Movement'],
        showBadges: false,
        entityLabel: 'Platform'
      };
    case 'momentum-50':
      return {
        columns: ['Rank', 'Avatar', 'Creator', 'Platforms', 'Metric', 'Movement'],
        showBadges: true,
        entityLabel: 'Creator'
      };
    case 'studios-watchlist':
      return {
        columns: ['Rank', 'Avatar', 'Studio', 'Platforms', 'Metric', 'Movement'],
        showBadges: true,
        entityLabel: 'Studio'
      };
    default:
      return {
        columns: ['Rank', 'Avatar', 'Name', 'Platforms', 'Metric', 'Movement'],
        showBadges: true,
        entityLabel: 'Entity'
      };
  }
};

export function ChartTable({ 
  chart,
  entries, 
  isProUser = false,
  onUpgrade 
}: ChartTableProps) {
  const config = getColumnConfig(chart);
  const displayEntries = chart.isPro && !isProUser ? entries.slice(0, 10) : entries;
  const hasMoreEntries = chart.isPro && !isProUser && entries.length > 10;

  const renderMovementChip = (entry: ChartEntry) => {
    if (entry.isNew) {
      return <span className="vh-chip bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400">NEW</span>;
    }
    if (entry.movement === undefined || entry.movement === 0) return null;
    
    const isUp = entry.movement > 0;
    return (
      <span className={`vh-chip ${isUp ? 'bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400' : 'bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-400'}`}>
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isUp ? '+' : '−'}{Math.abs(entry.movement)}
      </span>
    );
  };

  const renderStreakInfo = (entry: ChartEntry) => {
    if (!entry.streakWeeks || entry.rank !== 1) return null;
    return (
      <div className="text-xs text-muted-foreground mt-1">
        #1 for {entry.streakWeeks} week{entry.streakWeeks > 1 ? 's' : ''}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b">
        <div className="col-span-1 vh-rank">Rank</div>
        <div className="col-span-5">{config.entityLabel}</div>
        <div className="col-span-2">Platforms</div>
        <div className="col-span-2 flex items-center gap-1">
          {chart.metricLabel}
          {chart.metricTooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{chart.metricTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="col-span-2">Movement</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {displayEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
            data-testid={`chart-entry-${entry.id}`}
          >
            <div className="grid grid-cols-12 gap-4 px-4 py-4 bg-card/50 hover:bg-card/80 transition-colors rounded-lg border">
              {/* Rank */}
              <div className="col-span-1 flex flex-col items-center">
                <span className="vh-rank">
                  {entry.rank}
                </span>
                {entry.rank === 1 && entry.streakWeeks && (
                  <Crown className="h-4 w-4 text-yellow-500 mt-1" />
                )}
              </div>

              {/* Entity Info (Creator/Platform) */}
              <div className="col-span-5 flex items-center gap-3">
                {entry.avatarUrl && (
                  <img
                    src={entry.avatarUrl}
                    alt={entry.name}
                    className="h-12 w-12 rounded-full object-cover"
                    data-testid={`avatar-${entry.id}`}
                  />
                )}
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {entry.name}
                  </h3>
                  {/* Voice badges removed per requirements - voice is now chart-level */}
                  {renderStreakInfo(entry)}
                </div>
              </div>

              {/* Platforms */}
              <div className="col-span-2 flex flex-wrap gap-1">
                {entry.platforms.slice(0, 2).map((platform) => (
                  <PlatformPill key={platform} platform={platform as Platform} size="sm" />
                ))}
                {entry.platforms.length > 2 && (
                  <span className="vh-chip bg-muted text-muted-foreground border-muted">
                    +{entry.platforms.length - 2}
                  </span>
                )}
              </div>

              {/* Metric */}
              <div className="col-span-2 flex items-center">
                <div className="text-right">
                  <div className="font-semibold text-foreground">
                    {formatMetricValue(entry.metricValue, chart.metricLabel)}
                  </div>
                </div>
              </div>

              {/* Movement */}
              <div className="col-span-2 flex items-center">
                {renderMovementChip(entry)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pro Gating */}
      {hasMoreEntries && (
        <div className="relative">
          {/* Frosted overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background rounded-lg z-10 flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Upgrade to see full rankings</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get access to the complete {chart.title} and unlock advanced analytics.
                </p>
              </div>
              <Button onClick={onUpgrade} className="mt-4">
                Upgrade to Pro
              </Button>
            </div>
          </div>
          
          {/* Placeholder content showing partial entries */}
          <div className="space-y-2 opacity-30">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-4 py-4 bg-card/50 rounded-lg border">
                <div className="col-span-1 flex items-center">
                  <div className="vh-rank">{11 + i}</div>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-20" />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
                <div className="col-span-2">
                  <div className="h-4 bg-muted rounded w-12" />
                </div>
                <div className="col-span-2">
                  <div className="h-6 bg-muted rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}