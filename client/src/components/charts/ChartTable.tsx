import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/ui/button";
import { ChartEntry, ChartConfig } from "@/lib/data/charts";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Platform } from "@/types/lists";

interface ChartTableProps {
  chart: ChartConfig;
  entries: ChartEntry[];
  isProUser?: boolean;
  onUpgrade?: () => void;
}

// Helper function to get single platform label
const getPlatformLabel = (platforms: Platform[]): string => {
  if (platforms.length === 0) return 'Unknown';
  if (platforms.length === 1) return platforms[0];
  return 'Cross-platform';
};

// Simplified column configurations per requirements - minimal billboard-style charts
const getColumnConfig = (chart: ChartConfig) => {
  switch (chart.id) {
    case 'vhub-100':
      return {
        columns: ['Rank', 'Creator', 'Platform'],
        showNewChips: false,
        entityLabel: 'Creator'
      };
    case 'platforms-index':
      return {
        columns: ['Rank', 'Platform', 'Category'],
        showNewChips: false,
        entityLabel: 'Platform'
      };
    case 'momentum-50':
      return {
        columns: ['Rank', 'Creator', 'Platform'],
        showNewChips: true, // Only for NEW chips on first-timers
        entityLabel: 'Creator'
      };
    default:
      return {
        columns: ['Rank', 'Creator', 'Platform'],
        showNewChips: false,
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

  // Only render NEW chips for Momentum 50 first-timers
  const renderNewChip = (entry: ChartEntry) => {
    if (chart.id === 'momentum-50' && entry.isNew) {
      return <span className="vh-chip bg-muted text-muted-foreground border-muted-foreground/30 ml-2">NEW</span>;
    }
    return null;
  };

  const renderTableHeader = () => {
    if (chart.id === 'platforms-index') {
      return (
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50">
          <div className="col-span-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Rank
          </div>
          <div className="col-span-7 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Platform
          </div>
          <div className="col-span-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Category
          </div>
        </div>
      );
    }

    // For creator charts (VHUB 100, Momentum 50)
    return (
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50">
        <div className="col-span-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Rank
        </div>
        <div className="col-span-7 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {config.entityLabel}
        </div>
        <div className="col-span-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Platform
        </div>
      </div>
    );
  };

  const renderTableRow = (entry: ChartEntry, index: number) => {
    if (chart.id === 'platforms-index') {
      return (
        <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
             onClick={() => entry.href && window.open(entry.href, '_blank')}
             data-testid={`chart-entry-${entry.id}`}>
          {/* Rank */}
          <div className="col-span-2 flex items-center">
            <div className="vh-rank text-foreground">
              {entry.rank}
            </div>
          </div>

          {/* Platform */}
          <div className="col-span-7 flex items-center gap-3">
            {entry.logo && (
              <img
                src={entry.logo}
                alt={entry.name}
                className="w-8 h-8 object-contain"
                data-testid={`platform-logo-${entry.id}`}
              />
            )}
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {entry.name}
              </h3>
            </div>
          </div>

          {/* Category */}
          <div className="col-span-3 flex items-center">
            <span className="vh-platform-label">
              {entry.category || 'Platform'}
            </span>
          </div>
        </div>
      );
    }

    // For creator charts (VHUB 100, Momentum 50)
    return (
      <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
           onClick={() => entry.href && window.open(entry.href, '_blank')}
           data-testid={`chart-entry-${entry.id}`}>
        {/* Rank */}
        <div className="col-span-2 flex items-center">
          <div className="vh-rank text-foreground">
            {entry.rank}
          </div>
        </div>

        {/* Creator */}
        <div className="col-span-7 flex items-center gap-3">
          {entry.avatarUrl && (
            <img
              src={entry.avatarUrl}
              alt={entry.name}
              className="w-10 h-10 rounded-full object-cover"
              data-testid={`avatar-${entry.id}`}
            />
          )}
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {entry.name}
            </h3>
            {entry.tagline && (
              <p className="text-sm text-muted-foreground">{entry.tagline}</p>
            )}
          </div>
        </div>

        {/* Platform (minimal) */}
        <div className="col-span-3 flex items-center">
          <span className="vh-platform-label">
            {getPlatformLabel(entry.platforms as Platform[])}
          </span>
          {renderNewChip(entry)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-0" data-testid={`chart-table-${chart.id}`}>
      {/* Table with proper grid styling and ambient lighting */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        {/* Table Header */}
        {renderTableHeader()}
        
        {/* Table Body with alternating rows and defined lighting */}
        <div className="divide-y divide-border/30">
          {displayEntries.map((entry, index) => (
            <motion.div 
              key={entry.id} 
              className={`${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'} hover:bg-muted/40 transition-all duration-200 shadow-inner`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              {renderTableRow(entry, index)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pro Gating */}
      {hasMoreEntries && (
        <div className="relative mt-4">
          {/* Frosted overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background rounded-lg z-10 flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Unlock full {chart.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get access to the complete rankings and advanced analytics.
                </p>
              </div>
              <Button onClick={onUpgrade} className="mt-4">
                Upgrade to Pro
              </Button>
            </div>
          </div>
          
          {/* Placeholder content showing partial entries */}
          <div className="space-y-0 opacity-30 border border-border rounded-lg overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`grid grid-cols-12 gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'} border-b border-border/30 last:border-none`}>
                <div className="col-span-2 flex items-center">
                  <div className="vh-rank">{11 + i}</div>
                </div>
                <div className="col-span-7 flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-20" />
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="h-4 bg-muted rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}