import { Badge } from "@/components/common/Badge";
import { PlatformPill } from "@/components/common/PlatformPill";
import { Button } from "@/components/ui/button";
import { ChartEntry, formatMetricValue } from "@/lib/data/charts";
import { motion } from "framer-motion";
import { Crown, Lock } from "lucide-react";

interface ChartTableProps {
  entries: ChartEntry[];
  isProChart?: boolean;
  isProUser?: boolean;
  onUpgrade?: () => void;
}

export function ChartTable({ 
  entries, 
  isProChart = false, 
  isProUser = false,
  onUpgrade 
}: ChartTableProps) {
  const displayEntries = isProChart && !isProUser ? entries.slice(0, 10) : entries;
  const hasMoreEntries = isProChart && !isProUser && entries.length > 10;

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b">
        <div className="col-span-1">Rank</div>
        <div className="col-span-6">Creator/Platform</div>
        <div className="col-span-2">Platforms</div>
        <div className="col-span-2">Metric</div>
        <div className="col-span-1">Change</div>
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
              <div className="col-span-1 flex items-center">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">
                    {entry.rank}
                  </span>
                  {entry.rank === 1 && entry.streakWeeks && (
                    <Crown className="h-4 w-4 text-yellow-500 mt-1" />
                  )}
                </div>
              </div>

              {/* Creator/Platform Info */}
              <div className="col-span-6 flex items-center gap-3">
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
                  <div className="flex flex-wrap gap-1">
                    {entry.voices.includes('VHub Picks') && (
                      <Badge variant="vhub-picks" />
                    )}
                    {entry.voices.includes('User Choice') && (
                      <Badge variant="user-choice" />
                    )}
                    {entry.isNew && <Badge variant="new" />}
                    {entry.streakWeeks && entry.streakWeeks > 1 && (
                      <Badge variant="streak" value={entry.streakWeeks} />
                    )}
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div className="col-span-2 flex items-center">
                <div className="flex flex-wrap gap-1">
                  {entry.platforms.slice(0, 2).map((platform) => (
                    <PlatformPill key={platform} platform={platform as any} size="sm" />
                  ))}
                  {entry.platforms.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{entry.platforms.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Metric */}
              <div className="col-span-2 flex items-center">
                <div className="text-right">
                  <div className="font-semibold">
                    {formatMetricValue(entry.metricValue, entry.metricLabel)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entry.metricLabel}
                  </div>
                </div>
              </div>

              {/* Movement */}
              <div className="col-span-1 flex items-center justify-center">
                {entry.movement !== undefined && entry.movement !== 0 && (
                  <Badge variant="movement" value={entry.movement} />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pro Upgrade CTA */}
      {hasMoreEntries && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Fade overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10 pointer-events-none" />
          
          {/* Locked entries preview */}
          <div className="opacity-30 pointer-events-none space-y-2">
            {entries.slice(10, 15).map((entry, index) => (
              <div key={entry.id} className="grid grid-cols-12 gap-4 px-4 py-4 bg-card/50 rounded-lg border">
                <div className="col-span-1 flex items-center">
                  <span className="text-2xl font-bold">{entry.rank}</span>
                </div>
                <div className="col-span-6 flex items-center gap-3">
                  {entry.avatarUrl && (
                    <img
                      src={entry.avatarUrl}
                      alt={entry.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{entry.name}</h3>
                  </div>
                </div>
                <div className="col-span-5 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>

          {/* Upgrade CTA */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="bg-card border rounded-lg p-6 text-center space-y-4 max-w-md">
              <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Unlock Full VHUB 100</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  See all {entries.length} creators and get access to advanced analytics
                </p>
              </div>
              <Button onClick={onUpgrade} className="w-full" data-testid="button-upgrade-pro">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State for Studios Watchlist */}
      {entries.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Crown className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            The Studios Watchlist will track promising virtual world studios and their upcoming releases. 
            Stay tuned for the most exciting developments in the creator economy.
          </p>
        </div>
      )}
    </div>
  );
}