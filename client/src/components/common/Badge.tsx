import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Sparkles, Crown, Users } from "lucide-react";

interface BadgeProps {
  variant: 'new' | 'movement' | 'streak' | 'vhub-picks' | 'user-choice';
  value?: number;
  className?: string;
}

export function Badge({ variant, value, className }: BadgeProps) {
  const baseClasses = "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full";
  
  switch (variant) {
    case 'new':
      return (
        <span className={cn(
          baseClasses,
          "bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30",
          className
        )}>
          <Sparkles className="h-3 w-3" />
          NEW
        </span>
      );
      
    case 'movement':
      if (!value || value === 0) return null;
      
      const isPositive = value > 0;
      return (
        <span className={cn(
          baseClasses,
          isPositive 
            ? "bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30"
            : "bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30",
          className
        )}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {isPositive ? `+${value}` : value}
        </span>
      );
      
    case 'streak':
      if (!value || value < 2) return null;
      
      return (
        <span className={cn(
          baseClasses,
          "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30",
          className
        )}>
          <Crown className="h-3 w-3" />
          #{1} for {value} weeks
        </span>
      );
      
    case 'vhub-picks':
      return (
        <span className={cn(
          baseClasses,
          "bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/30",
          className
        )}>
          <Crown className="h-3 w-3" />
          VHub Picks
        </span>
      );
      
    case 'user-choice':
      return (
        <span className={cn(
          baseClasses,
          "bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30",
          className
        )}>
          <Users className="h-3 w-3" />
          User Choice
        </span>
      );
      
    default:
      return null;
  }
}