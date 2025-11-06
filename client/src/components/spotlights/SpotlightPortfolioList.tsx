import type { Spotlight } from '@/types/spotlight';

interface SpotlightPortfolioListProps {
  spotlight: Spotlight;
}

export function SpotlightPortfolioList({ spotlight }: SpotlightPortfolioListProps) {
  if (!spotlight.portfolio || spotlight.portfolio.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-3">Portfolio Highlights</h3>
      <ul className="space-y-2 text-muted-foreground">
        {spotlight.portfolio.map((item, index) => (
          <li key={index}>
            • {item.title}
            {item.category && ` - ${item.category}`}
            {item.statLabel && ` (${item.statLabel})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
