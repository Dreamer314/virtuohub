import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/ui/button";
import { ChartEntry, ChartConfig, getProGatedEntries, CHART_LIMIT } from "@/lib/data/charts";
import { motion } from "framer-motion";
import { Lock, Crown, User } from "lucide-react";
import { Platform } from "@/types/lists";
import { SignupModal } from "@/components/modals/SignupModal";
import { useState } from "react";

interface ChartTableProps {
  chart: ChartConfig;
  entries: ChartEntry[];
  isProUser?: boolean;
  isLoggedIn?: boolean;
  onUpgrade?: () => void;
  onSignup?: () => void;
}

// Signup lock card component for anonymous users
function SignupLockCard({ onSignup }: { onSignup?: () => void }) {
  return (
    <div className="vh-row bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30 border-2 border-dashed">
      <div className="flex items-center justify-center w-full col-span-3 py-12">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Sign up to view full rankings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You're seeing ranks 1-10. Create a free account to unlock the complete Top 25 rankings and detailed creator insights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onSignup} className="btn-primary">
              Create Free Account
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Already have an account? Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pro lock card component for logged-in users
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
  isLoggedIn = false,
  onUpgrade,
  onSignup
}: ChartTableProps) {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const displayEntries = getProGatedEntries(entries, isProUser);
  // Show signup/upgrade card if the original chart has more than 5 entries and user doesn't have full access
  // Use originalEntries if available (for filtered charts), otherwise use chart.entries
  const originalEntriesCount = chart.originalEntries?.length || chart.entries?.length || 0;
  const hasMoreEntries = originalEntriesCount > 5 && (!isLoggedIn || (isLoggedIn && !isProUser));
  
  // For Top 25 charts, show entries 1-5 for anonymous users, then Load Full Chart button
  const freeEntries = displayEntries.slice(0, 5);
  const proEntries = displayEntries.slice(5, 25);
  
  // Debug: Log actual entry count and button visibility
  console.log(`Chart ${chart.id}:`, {
    originalEntriesCount,
    displayEntries: displayEntries.length,
    freeEntries: freeEntries.length,
    proEntries: proEntries.length,
    isLoggedIn,
    isProUser,
    hasMoreEntries,
    willShowButton: hasMoreEntries && !isLoggedIn
  });

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
        
      </ul>

      {/* Load Full Chart Button - show for anonymous users only */}
      {hasMoreEntries && !isLoggedIn && (
        <div className="text-center py-6">
          <Button 
            onClick={() => setShowSignupModal(true)}
            className="btn-primary"
            data-testid="load-full-chart-button"
          >
            Load Full Chart
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            See all 25 entries with a free account
          </p>
        </div>
      )}

      {/* Load Full Chart Button - show for logged-in non-pro users */}
      {hasMoreEntries && isLoggedIn && !isProUser && (
        <div className="text-center py-6">
          <Button 
            onClick={onUpgrade}
            className="btn-primary"
            data-testid="upgrade-to-pro-button"
          >
            Load Full Chart
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            See all 25 entries with VHUB Pro
          </p>
        </div>
      )}

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        title={chart.title}
      />
    </div>
  );
}