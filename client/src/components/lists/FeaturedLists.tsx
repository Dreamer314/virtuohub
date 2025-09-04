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

function Cover({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-surface/80">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(transparent,transparent),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]">
          <div className="absolute inset-0 grid [grid-template-columns:repeat(24,1fr)] opacity-[0.06]">
            <div className="col-span-24 border-t border-border/30 mt-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <section className="mt-12" style={{ color: 'white' }}>
      {/* Section header */}
      <div className="mb-6">
        <div className="text-xs tracking-wide text-foreground/70 uppercase">COMMUNITY LISTS</div>
        <h2 className="orbitron-font text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mt-1">
          Featured Industry Lists
        </h2>
        <p className="mt-2 text-foreground/80">
          Editor-led and data-driven rankings, roundups, and best-of lists.
        </p>
        <p className="text-sm text-foreground/70 mt-1">
          {items.length} lists found
        </p>
        {/* DEV: remove after verification */}
        <span data-dev-id="featured-lists-verified" className="mt-2 inline-block text-xs px-2 py-0.5 rounded bg-accent/15 text-accent ring-1 ring-accent/30">
          FeaturedLists verified
        </span>
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
          <span className="text-sm text-foreground/70">Voice:</span>
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
            className={selectClass}
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
        <span className="text-sm text-foreground/70 mr-2">Filter by Platform</span>
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
            className="text-sm underline text-foreground/80 ml-2 hover:text-foreground"
            data-testid="clear-filters"
          >
            Clear All
          </button>
        ) : null}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-foreground/70">Loading…</div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <li key={item.id} className="relative">
              <a 
                href={`/lists/${item.slug}`} 
                className="group block rounded-2xl overflow-hidden ring-1 ring-border/50 bg-surface/80 hover:bg-surface/90 transition"
                data-testid={`list-card-${item.slug}`}
              >
                <Cover src={item.coverUrl} alt={item.title} />
                <div className="p-4 text-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={typeBadgeClass()}>{labelForType(item.type)}</span>
                    <span className={voiceBadgeClass(item.voice)}>{item.voice === 'editorial' ? 'VHub Picks' : 'User Choice'}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  {item.subtitle ? <p className="mt-1 text-sm text-foreground/80">{item.subtitle}</p> : null}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-foreground/70">
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
                      <span key={platform} className="px-2 py-0.5 rounded text-xs bg-surface/90 text-foreground/80 ring-1 ring-border/50">
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
        <div className="text-center py-12 text-foreground/70">
          <p>No lists found matching your filters.</p>
          <button onClick={clearAll} className="underline text-sm mt-2 text-foreground/80 hover:text-foreground">Clear filters</button>
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
    active
      ? 'bg-accent/15 text-accent ring-accent/40'
      : 'bg-surface/80 text-foreground/80 hover:bg-surface/90'
  ].join(' ');
}

const selectClass =
  'rounded-lg bg-surface/80 text-foreground ring-1 ring-border/50 ' +
  'px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 ' +
  'placeholder:text-foreground/60';

function typeBadgeClass() {
  return 'px-2 py-0.5 rounded-full text-xs bg-surface/90 text-foreground/80 ring-1 ring-border/50';
}

function voiceBadgeClass(v: Voice) {
  return v === 'editorial'
    ? 'px-2 py-0.5 rounded-full text-xs bg-accent/15 text-accent ring-1 ring-accent/30'
    : 'px-2 py-0.5 rounded-full text-xs bg-surface/90 text-foreground/80 ring-1 ring-border/50';
}

function labelForType(t: ListType) {
  switch (t) {
    case 'charting': return 'Charting';
    case 'upcoming': return 'Upcoming';
    case 'best-of': return 'Best Of';
    case 'entertainment': return 'Entertainment';
  }
}