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
    <div className="vh-row bg-gradient-to-r from-accent/5 to-accent/10 border-accent/30">
      <div className="flex items-center justify-center w-full col-span-3 py-8">
        <div className="text-center space-y-3">
          <Lock className="w-6 h-6 text-accent mx-auto" />
          <div>
            <p className="font-semibold text-foreground">Unlock the full Top 25 on VHUB Pro</p>
            <p className="text-sm text-muted-foreground">Get access to complete rankings and advanced analytics</p>
          </div>
          <Button onClick={onUpgrade} className="btn-primary mt-2">
            Upgrade to Pro
          </Button>
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
        
        {/* Show entries 11-25 */}
        {proEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 11) * 0.03 }}
            className={!isProUser ? "opacity-40 pointer-events-none" : ""}
          >
            {renderRankedCard(entry, index + 10)}
          </motion.div>
        ))}
      </ul>
    </div>
  );
}