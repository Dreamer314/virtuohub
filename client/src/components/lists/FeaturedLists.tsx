'use client';
import { useEffect, useState } from 'react';
import { fetchFeaturedLists } from '@/lib/lists/repo';
import { FeaturedList, ListType, Platform, Voice } from '@/lib/lists/types';

const TYPES: { key: ListType; label: string }[] = [
  { key: 'charting', label: 'Charting' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'best-of', label: 'Best Of' },
  { key: 'entertainment', label: 'Entertainment' },
];

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: 'vrchat', label: 'VRChat' },
  { key: 'horizon-worlds', label: 'Horizon Worlds' },
  { key: 'roblox', label: 'Roblox' },
  { key: 'imvu', label: 'IMVU' },
  { key: 'unity', label: 'Unity' },
  { key: 'unreal', label: 'Unreal' },
  { key: 'cross-platform', label: 'Cross-Platform' },
];

export default function FeaturedLists() {
  const [types, setTypes] = useState<ListType[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [voice, setVoice] = useState<Voice | undefined>(undefined);
  const [sort, setSort] = useState<'recent' | 'views' | 'rating'>('recent');
  const [items, setItems] = useState<FeaturedList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchFeaturedLists({ types, platforms, voice, sort })
      .then(setItems)
      .finally(() => setLoading(false));
  }, [types, platforms, voice, sort]);

  function toggleType(t: ListType) {
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }
  function togglePlatform(p: Platform) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }

  function clearAll() {
    setTypes([]);
    setPlatforms([]);
    setVoice(undefined);
  }

  return (
    <section className="mt-12">
      {/* Section header */}
      <div className="mb-6">
        <div className="text-xs tracking-wide opacity-70 uppercase">COMMUNITY LISTS</div>
        <h2 className="orbitron-font text-4xl md:text-5xl font-extrabold tracking-tight mt-1">
          Featured Industry Lists
        </h2>
        <p className="mt-2 opacity-80">
          Editor-led and data-driven rankings, roundups, and best-of lists.
        </p>
        <p className="text-sm opacity-70 mt-1">
          {items.length} lists found
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Type chips */}
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button
              key={t.key}
              onClick={() => toggleType(t.key)}
              className={chipClass(types.includes(t.key))}
              data-testid={`filter-type-${t.key}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Voice */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm opacity-70">Voice:</span>
          <button
            onClick={() => setVoice(voice === 'editorial' ? undefined : 'editorial')}
            className={chipClass(voice === 'editorial')}
            data-testid="voice-editorial"
          >
            VHub Picks
          </button>
          <button
            onClick={() => setVoice(voice === 'community' ? undefined : 'community')}
            className={chipClass(voice === 'community')}
            data-testid="voice-community"
          >
            User Choice
          </button>

          {/* Sort */}
          <label className="sr-only" htmlFor="list-sort">Sort</label>
          <select
            id="list-sort"
            value={sort}
            onChange={e => setSort(e.target.value as any)}
            className="rounded-lg bg-surface/70 ring-1 ring-border/50 px-3 py-2 text-sm"
            data-testid="sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="views">Most Viewed</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Platform filter row */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm opacity-70 mr-2">Filter by Platform</span>
        {PLATFORMS.map(p => (
          <button
            key={p.key}
            onClick={() => togglePlatform(p.key)}
            className={chipClass(platforms.includes(p.key))}
            data-testid={`filter-platform-${p.key}`}
          >
            {p.label}
          </button>
        ))}
        {(types.length || platforms.length || voice) ? (
          <button 
            onClick={clearAll}
            className="text-sm underline opacity-80 ml-2 hover:opacity-100"
            data-testid="clear-filters"
          >
            Clear All
          </button>
        ) : null}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="opacity-70">Loading…</div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <li key={item.id} className="relative">
              <a 
                href={`/lists/${item.slug}`} 
                className="group block rounded-2xl overflow-hidden ring-1 ring-border/50 bg-surface/70 hover:bg-surface/80 transition"
                data-testid={`list-card-${item.slug}`}
              >
                {item.coverUrl ? (
                  <div className="relative aspect-[16/9]">
                    <img src={item.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={typeBadgeClass(item.type)}>{labelForType(item.type)}</span>
                    <span className={voiceBadgeClass(item.voice)}>{item.voice === 'editorial' ? 'VHub Picks' : 'User Choice'}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  {item.subtitle ? <p className="mt-1 text-sm opacity-80">{item.subtitle}</p> : null}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs opacity-70">
                    <span>{formatDate(item.updatedAt)}</span>
                    <span>•</span>
                    <span>{formatViews(item.metrics.views)}</span>
                    {item.metrics.rating && (
                      <>
                        <span>•</span>
                        <span>★ {item.metrics.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.platforms.map(platform => (
                      <span key={platform} className="px-2 py-0.5 rounded text-xs bg-muted/50 text-muted-foreground">
                        {PLATFORMS.find(p => p.key === platform)?.label || platform}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 opacity-70">
          <p>No lists found matching your filters.</p>
          <button onClick={clearAll} className="underline text-sm mt-2">Clear filters</button>
        </div>
      )}
    </section>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatViews(v?: number) {
  if (!v) return '0 views';
  if (v < 1000) return `${v} views`;
  if (v < 1000000) return `${(v/1000).toFixed(1)}K views`;
  return `${(v/1000000).toFixed(1)}M views`;
}

// Brand-matching chip styles (no loud rainbow pills)
function chipClass(active: boolean) {
  return [
    'px-3 py-1.5 rounded-full text-sm transition-colors',
    'ring-1 ring-border/50',
    active ? 'bg-accent/15 text-accent ring-accent/40' : 'bg-surface/70 hover:bg-surface/80'
  ].join(' ');
}

function typeBadgeClass(t: ListType) {
  // all use the same brand tone with tiny hue shifts if tokens exist; keep subtle
  return 'px-2 py-0.5 rounded-full text-xs bg-surface/80 ring-1 ring-border/50';
}

function voiceBadgeClass(v: Voice) {
  return v === 'editorial'
    ? 'px-2 py-0.5 rounded-full text-xs bg-accent/15 text-accent ring-1 ring-accent/30'
    : 'px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30';
}

function labelForType(t: ListType) {
  switch (t) {
    case 'charting': return 'Charting';
    case 'upcoming': return 'Upcoming';
    case 'best-of': return 'Best Of';
    case 'entertainment': return 'Entertainment';
  }
}