import chartsData from '@/data/charts.seed.json';

export const CHART_LIMIT = 25;

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
  originalEntries?: ChartEntry[];  // Keep reference to original entries before filtering
  updatedAt: string;
  isPro: boolean;
  entityType: 'creator' | 'platform';
  metricLabel: string;
  metricTooltip?: string;
}

export type ChartType = 'vhub-25' | 'platforms-index' | 'momentum-25' | 'studios-watchlist';
export type VoiceFilter = 'VHub Picks' | 'User Choice';
export type SortOption = 'Most Recent' | 'Most Viewed';

export function getChartById(chartId: ChartType, voice?: 'editorial' | 'community'): ChartConfig | null {
  // Map new chart IDs to existing data keys in JSON
  const chartKeyMap = {
    'vhub-25': 'vhub-100',  // Map to existing data key
    'momentum-25': 'momentum-25', // This should work since momentum-25 exists
    'platforms-index': 'platforms-index',
    'studios-watchlist': 'studios-watchlist'
  } as const;
  
  const dataKey = chartKeyMap[chartId];
  const chart = (chartsData.charts as any)[dataKey] as ChartConfig;
  
  if (!chart) return null;
  
  let entries = [...chart.entries].slice(0, CHART_LIMIT);
  
  // For creator charts, filter entries based on voice
  if (voice && (chartId === 'vhub-25' || chartId === 'momentum-25')) {
    entries = entries.filter(entry => {
      if (voice === 'editorial') {
        return entry.voices.includes('VHub Picks');
      } else {
        return entry.voices.includes('User Choice');
      }
    });
    
    // Re-rank filtered entries starting from 1
    entries.sort((a, b) => a.rank - b.rank);
    entries = entries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  } else {
    // Always sort by rank numerically (ascending: 1, 2, 3...)
    entries.sort((a, b) => a.rank - b.rank);
  }
  
  return {
    ...chart,
    entries,
    originalEntries: chart.entries  // Keep reference to original entries before filtering
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
  // Always return the full 25 entries for Top 25 charts - Pro gating is handled in the UI
  return entries.slice(0, CHART_LIMIT);
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