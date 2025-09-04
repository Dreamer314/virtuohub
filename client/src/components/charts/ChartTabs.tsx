import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartType } from "@/lib/data/charts";
import { BarChart3, TrendingUp, Zap } from "lucide-react";

interface ChartTabsProps {
  activeChart: ChartType;
  onChartChange: (chart: ChartType) => void;
  className?: string;
}

const chartTabs = [
  {
    id: 'vhub-25' as ChartType,
    label: 'VHUB 25',
    description: 'Top 25 creators',
    icon: BarChart3
  },
  {
    id: 'platforms-index' as ChartType,
    label: 'Platforms Index',
    description: 'Where creators thrive',
    icon: TrendingUp
  },
  {
    id: 'momentum-25' as ChartType,
    label: 'Momentum 25',
    description: 'Top 25 rising creators',
    icon: Zap
  }
  // Studios Watchlist removed until feature is live
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
            className={cn(
              "flex items-center gap-2 h-auto p-4 text-left",
              isActive && "ring-2 ring-primary/20"
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
                <div className="font-semibold text-sm">
                  {tab.label}
                </div>
                <div className="text-xs text-muted-foreground">
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