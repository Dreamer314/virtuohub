import type { Spotlight } from '@/types/spotlight';

interface SpotlightHeroProps {
  spotlight: Spotlight;
  emoji?: string;
  gradient?: string;
}

export function SpotlightHero({ spotlight, emoji = '👤', gradient = 'from-yellow-400 via-orange-500 to-red-500' }: SpotlightHeroProps) {
  const badgeText = spotlight.type === 'creator' ? 'Spotlight' : spotlight.type === 'studio' ? 'Studio Spotlight' : 'Tool Spotlight';
  const badgeColor = spotlight.type === 'tool' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-primary/20 text-primary border-primary/30';
  
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/3">
        <div className={`w-full h-64 lg:h-80 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <span className="text-6xl relative z-10">{emoji}</span>
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="text-white font-semibold">{spotlight.name}</div>
            {spotlight.stats?.visits && (
              <div className="text-white/80 text-sm">{spotlight.stats.visits >= 1000000 ? `${(spotlight.stats.visits / 1000000).toFixed(0)}M+` : `${Math.floor(spotlight.stats.visits / 1000)}K+`} world visits</div>
            )}
          </div>
        </div>
      </div>
      <div className="lg:w-2/3 p-8">
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 text-xs font-medium ${badgeColor} border rounded-full`}>{badgeText}</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-3">{spotlight.name}</h2>
        <p className="text-lg text-muted-foreground mb-6">{spotlight.role}</p>
      </div>
    </div>
  );
}
