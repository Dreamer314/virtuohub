import { Button } from "@/components/ui/button";
import { Badge } from "@/components/common/Badge";
import { MethodologyModal } from "@/components/modals/MethodologyModal";
import { SuggestUpdateModal } from "@/components/modals/SuggestUpdateModal";
import { useState } from "react";
import { ExternalLink, HelpCircle, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";

interface ChartHeaderProps {
  title: string;
  description: string;
  sponsorName?: string;
  sponsorHref?: string;
  updatedAt: string;
  totalEntries: number;
  isProChart?: boolean;
  isProUser?: boolean;
}

export function ChartHeader({
  title,
  description,
  sponsorName,
  sponsorHref,
  updatedAt,
  totalEntries,
  isProChart = false,
  isProUser = false
}: ChartHeaderProps) {
  const [showMethodology, setShowMethodology] = useState(false);
  const [showSuggestUpdate, setShowSuggestUpdate] = useState(false);

  const getMethodologyData = (chartTitle: string) => {
    const baseSignals = [
      "Follower/subscriber count across platforms",
      "Content engagement rates (likes, comments, shares)",
      "Community growth velocity",
      "Cross-platform presence"
    ];

    switch (chartTitle) {
      case 'VHUB 100':
        return {
          signals: [
            ...baseSignals,
            "Creator earnings and monetization",
            "Industry recognition and awards",
            "Collaboration network strength"
          ],
          window: "Rolling 30-day window with weighted emphasis on recent activity",
          normalization: "Scores normalized to 0-100 scale with platform-specific adjustments for creator economy differences"
        };
      case 'Platforms Index':
        return {
          signals: [
            "Average creator earnings per platform",
            "Creator onboarding and retention rates",
            "Platform feature updates and tools",
            "Community size and activity"
          ],
          window: "Quarterly data with monthly updates",
          normalization: "Index scaled to reflect relative earning potential and creator satisfaction"
        };
      case 'Momentum 50':
        return {
          signals: [
            "30-day growth rate in followers/subscribers",
            "Content virality and reach expansion",
            "New platform adoption",
            "Engagement rate acceleration"
          ],
          window: "30-day measurement period compared to previous 30 days",
          normalization: "Growth percentages calculated with minimum threshold requirements"
        };
      default:
        return {
          signals: baseSignals,
          window: "30-day rolling period",
          normalization: "Platform-normalized scoring system"
        };
    }
  };

  const methodologyData = getMethodologyData(title);

  return (
    <>
      <div className="space-y-4">
        {/* Sponsor Banner */}
        {sponsorName && sponsorHref && (
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Presented by</span>
              <Button variant="ghost" size="sm" asChild>
                <a href={sponsorHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  {sponsorName}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Chart Title and Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{title}</h1>
            {isProChart && !isProUser && (
              <Badge variant="vhub-picks" className="text-xs" />
            )}
          </div>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Last updated {format(new Date(updatedAt), 'MMM d, yyyy • h:mm a')}
          </div>
          <span>•</span>
          <span>{totalEntries} entries</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMethodology(true)}
            data-testid="button-methodology"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Methodology
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSuggestUpdate(true)}
            data-testid="button-suggest-update"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Suggest Update
          </Button>
        </div>
      </div>

      {/* Modals */}
      <MethodologyModal
        isOpen={showMethodology}
        onClose={() => setShowMethodology(false)}
        chartTitle={title}
        signals={methodologyData.signals}
        window={methodologyData.window}
        normalization={methodologyData.normalization}
        disputesUrl="https://virtuohub.com/support/chart-disputes"
      />

      <SuggestUpdateModal
        isOpen={showSuggestUpdate}
        onClose={() => setShowSuggestUpdate(false)}
        chartTitle={title}
      />
    </>
  );
}