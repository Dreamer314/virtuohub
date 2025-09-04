import chartsData from '@/data/charts.seed.json';

export interface ChartEntry {
  id: string;
  rank: number;
  name: string;
  avatarUrl?: string;
  platforms: string[];
  metricLabel: string;
  metricValue: number;
  movement?: number;   // positive for rise, negative for drop
  isNew?: boolean;
  streakWeeks?: number;
  voices: string[];  // VHub Picks, User Choice
  href?: string;
  logo?: string;
  category?: string;
  tagline?: string;
}

export interface ChartConfig {
  id: string;
  title: string;
  description: string;
  sponsorName?: string;
  sponsorHref?: string;
  entries: ChartEntry[];
  updatedAt: string;
  isPro: boolean;
  entityType: 'creator' | 'platform';
  metricLabel: string;
  metricTooltip?: string;
}

export type ChartType = 'vhub-100' | 'platforms-index' | 'momentum-50' | 'studios-watchlist';
export type VoiceFilter = 'VHub Picks' | 'User Choice';
export type SortOption = 'Most Recent' | 'Most Viewed';

export function getChartById(chartId: ChartType, voice?: 'editorial' | 'community'): ChartConfig | null {
  const chart = chartsData.charts[chartId] as ChartConfig;
  if (!chart) return null;
  
  let entries = [...chart.entries];
  
  // For creator charts, filter entries based on voice
  if (voice && (chartId === 'vhub-100' || chartId === 'momentum-50')) {
    entries = entries.filter(entry => {
      if (voice === 'editorial') {
        return entry.voices.includes('VHub Picks');
      } else {
        return entry.voices.includes('User Choice');
      }
    });
  }
  
  // Always sort by rank numerically (ascending: 1, 2, 3...)
  entries.sort((a, b) => a.rank - b.rank);
  
  return {
    ...chart,
    entries
  };
}

export function getChartsList(): ChartConfig[] {
  return Object.values(chartsData.charts) as ChartConfig[];
}

export function filterChartEntries(
  entries: ChartEntry[], 
  filters: {
    platforms?: string[];
  }
): ChartEntry[] {
  let filtered = [...entries];

  if (filters.platforms && filters.platforms.length > 0) {
    filtered = filtered.filter(entry =>
      filters.platforms!.some(platform => entry.platforms.includes(platform))
    );
  }

  return filtered;
}

export function getProGatedEntries(entries: ChartEntry[], isProUser: boolean = false): ChartEntry[] {
  if (isProUser) {
    return entries;
  }
  return entries.slice(0, 10); // Show only top 10 for non-pro users
}

export function calculateMovement(currentRank: number, previousRank: number): number {
  return previousRank - currentRank; // positive = moved up, negative = moved down
}

export function formatMetricValue(value: number, metricLabel: string): string {
  if (metricLabel.includes('Growth')) {
    return `${value.toFixed(1)}%`;
  }
  if (metricLabel.includes('Score') || metricLabel.includes('Index')) {
    return value.toFixed(1);
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}