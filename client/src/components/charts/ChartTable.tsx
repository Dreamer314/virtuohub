import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/ui/button";
import { ChartEntry, ChartConfig, getProGatedEntries, CHART_LIMIT } from "@/lib/data/charts";
import { motion } from "framer-motion";
import { Lock, Crown } from "lucide-react";
import { Platform } from "@/types/lists";

interface ChartTableProps {
  chart: ChartConfig;
  entries: ChartEntry[];
  isProUser?: boolean;
  onUpgrade?: () => void;
}

// Pro lock card component
function ProLockCard({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div className="vh-row bg-gradient-to-r from-accent/5 to-accent/10 border-accent/30 border-2 border-dashed">
      <div className="flex items-center justify-center w-full col-span-3 py-12">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">See the Full Top 25 Rankings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You're seeing ranks 1-10. Upgrade to VHUB Pro to unlock ranks 11-25 plus advanced analytics, creator insights, and weekly data exports.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onUpgrade} className="btn-primary">
              Upgrade to Pro - $9/month
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Learn more about Pro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChartTable({ 
  chart,
  entries, 
  isProUser = false,
  onUpgrade 
}: ChartTableProps) {
  const displayEntries = getProGatedEntries(entries, isProUser);
  const hasMoreEntries = chart.isPro && !isProUser && entries.length > 10;
  
  // For Top 25 charts, show entries 1-10 for free users, then Pro lock card, then grayed out entries 11-25
  const freeEntries = displayEntries.slice(0, 10);
  const proEntries = displayEntries.slice(10, 25);
  
  // Debug: Log actual entry count
  console.log(`Chart ${chart.id} has ${displayEntries.length} entries, showing ${freeEntries.length} free + ${proEntries.length} pro`);

  // Only render NEW chips for Momentum 25 first-timers
  const renderNewChip = (entry: ChartEntry) => {
    if (chart.id === 'momentum-25' && entry.isNew) {
      return <span className="vh-chip bg-muted text-muted-foreground border-muted-foreground/30 ml-2">NEW</span>;
    }
    return null;
  };

  const renderRankedCard = (entry: ChartEntry, index: number) => {
    const isTop1 = entry.rank === 1;
    const isTop2 = entry.rank === 2;
    const isTop3 = entry.rank === 3;
    
    const cardClasses = `vh-row ${
      isTop1 ? 'vh-row-top1' :
      isTop2 ? 'vh-row-top2' :
      isTop3 ? 'vh-row-top3' :
      ''
    }`;

    // For platforms chart
    if (chart.id === 'platforms-index') {
      return (
        <li 
          className={cardClasses}
          onClick={() => entry.href && window.open(entry.href, '_blank')}
          tabIndex={0}
          role="button"
          aria-label={`View details for ${entry.name}, ranked #${entry.rank}`}
          data-testid={`chart-entry-${entry.id}`}
        >
          <div className="vh-rank">
            {isTop1 && <Crown className="h-5 w-5 text-accent" aria-hidden />}
            {entry.rank}
          </div>
          <div className="flex items-center gap-3">
            {entry.logo && (
              <img
                src={entry.logo}
                alt=""
                className="h-10 w-10 object-contain"
              />
            )}
            <div>
              <div className="font-semibold">{entry.name}</div>
            </div>
          </div>
          <div className="vh-platform">
            {entry.category || 'Platform'}
          </div>
        </li>
      );
    }

    // For creator charts
    return (
      <li 
        className={cardClasses}
        onClick={() => entry.href && window.open(entry.href, '_blank')}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${entry.name}, ranked #${entry.rank}`}
        data-testid={`chart-entry-${entry.id}`}
      >
        <div className="vh-rank">
          {isTop1 && <Crown className="h-5 w-5 text-accent" aria-hidden />}
          {entry.rank}
        </div>
        <div className="flex items-center gap-3">
          {entry.avatarUrl && (
            <img
              src={entry.avatarUrl}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-semibold">{entry.name}</div>
            {entry.tagline && (
              <div className="text-xs opacity-70">{entry.tagline}</div>
            )}
          </div>
        </div>
        <div className="vh-platform">
          {entry.platforms?.length === 1 ? entry.platforms[0] : 'Cross-platform'}
          {renderNewChip(entry)}
        </div>
      </li>
    );
  };

  return (
    <div className="space-y-0" data-testid={`chart-table-${chart.id}`}>
      {/* Ranked cards list */}
      <ul className="space-y-2">
        {/* Show entries 1-10 for everyone */}
        {freeEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            {renderRankedCard(entry, index)}
          </motion.div>
        ))}
        
        {/* Pro lock card after entry 10 for non-Pro users */}
        {hasMoreEntries && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 10 * 0.03 }}
          >
            <ProLockCard onUpgrade={onUpgrade} />
          </motion.div>
        )}
        
        {/* Show entries 11-25 - only if they exist */}
        {proEntries.length > 0 && proEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 11) * 0.03 }}
            className={!isProUser ? "opacity-30 pointer-events-none grayscale" : ""}
          >
            {renderRankedCard(entry, index + 10)}
          </motion.div>
        ))}
        
        {/* Show placeholder entries if we don't have enough data */}
        {!isProUser && proEntries.length < 15 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Entries 11-25 available with VHUB Pro</p>
          </div>
        )}
      </ul>
    </div>
  );
}