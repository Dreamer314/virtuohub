import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartType } from "@/lib/data/charts";
import { BarChart3, TrendingUp, Zap, Building2 } from "lucide-react";

interface ChartTabsProps {
  activeChart: ChartType;
  onChartChange: (chart: ChartType) => void;
  className?: string;
}

const chartTabs = [
  {
    id: 'vhub-100' as ChartType,
    label: 'VHUB 100',
    description: 'Top 100 creators',
    icon: BarChart3,
    isPro: true
  },
  {
    id: 'platforms-index' as ChartType,
    label: 'Platforms Index',
    description: 'Where creators thrive',
    icon: TrendingUp,
    isPro: false
  },
  {
    id: 'momentum-50' as ChartType,
    label: 'Momentum 50',
    description: 'Fastest rising creators',
    icon: Zap,
    isPro: false
  },
  {
    id: 'studios-watchlist' as ChartType,
    label: 'Studios Watchlist',
    description: 'Coming soon',
    icon: Building2,
    isPro: false,
    isComingSoon: true
  }
];

export function ChartTabs({ activeChart, onChartChange, className }: ChartTabsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chartTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeChart === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => onChartChange(tab.id)}
            disabled={tab.isComingSoon}
            className={cn(
              "flex items-center gap-2 h-auto p-4 text-left",
              isActive && "ring-2 ring-primary/20",
              tab.isComingSoon && "opacity-60"
            )}
            data-testid={`chart-tab-${tab.id}`}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-md",
                isActive 
                  ? "bg-primary-foreground/10" 
                  : "bg-muted"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className={cn(
                  "font-semibold text-sm",
                  tab.isPro && "flex items-center gap-1"
                )}>
                  {tab.label}
                  {tab.isPro && !tab.isComingSoon && (
                    <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      PRO
                    </span>
                  )}
                </div>
                <div className={cn(
                  "text-xs",
                  isActive 
                    ? "text-primary-foreground/70" 
                    : "text-muted-foreground"
                )}>
                  {tab.description}
                </div>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}