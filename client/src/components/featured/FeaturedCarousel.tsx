import { useState, useEffect, useCallback } from "react";
import type { FeaturedItem } from "./types";

interface FeaturedCarouselProps {
  items: FeaturedItem[]
}

export function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const currentItem = items[currentIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const go = useCallback((direction: number) => {
    if (direction > 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  }, [goToNext, goToPrevious]);

  const formatDate = (dateISO: string) => {
    const date = new Date(dateISO);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const chipClass = (tag: string) => {
    switch (tag) {
      case 'Creator Insights':
        return 'bg-teal-500/20 text-teal-300 border border-teal-500/30';
      case 'Industry News':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'Tips & Guides':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    }
  };

  const noWidow = (text: string) => {
    // Prevents widow words by replacing the last space with a non-breaking space
    return text.replace(/\s+(\S+)$/, '\u00A0$1');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case ' ':
          event.preventDefault();
          setIsPaused(prev => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, goToNext]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  // Debug effect to check layout
  useEffect(() => {
    const t = document.querySelector('#featuredV2 [data-el="textcol"]');
    const m = document.querySelector('#featuredV2 [data-el="media"]');
    if (t && m) {
      console.table({
        textWidth: getComputedStyle(t).width,
        mediaWidth: getComputedStyle(m).width,
        grid: getComputedStyle(t.closest('[class*="grid"]')).gridTemplateColumns
      });
    }
  }, []);

  return (
    <div 
      className="relative grid lg:[grid-template-columns:220px_minmax(980px,1fr)_360px] gap-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* Left control rail lives in col 1 */}
      <aside className="hidden lg:flex col-[1] flex-col items-start justify-center gap-3 text-white/70">
        <p className="text-xs">Use ← → to navigate • Space to pause</p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => go(-1)} 
            aria-label={`Previous slide (${currentIndex + 1} of ${items.length})`}
            className="h-12 w-12 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 flex items-center justify-center text-white font-bold"
          >
            ‹
          </button>
          <button 
            onClick={() => go(1)} 
            aria-label={`Next slide (${currentIndex + 1} of ${items.length})`}
            className="h-12 w-12 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 flex items-center justify-center text-white font-bold"
          >
            ›
          </button>
          <button 
            onClick={() => setIsPaused(p => !p)} 
            aria-pressed={isPaused}
            aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
            className="h-12 w-12 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 flex items-center justify-center text-white font-bold"
          >
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>
        {/* dots */}
        <div className="mt-2 flex gap-2">
          {items.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => goToIndex(idx)} 
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                idx === currentIndex ? "bg-[#825FFF]" : "bg-white/25 hover:bg-white/40"
              }`} 
            />
          ))}
        </div>
      </aside>

      {/* Hero card sits in the middle column, locked */}
      <section 
        id="featuredV2" 
        className="col-[2] relative px-6 md:px-0 not-prose"
        aria-roledescription="carousel"
        aria-live="polite"
      >
        {/* Inner 2-col grid with hard minimums so the text can't collapse */}
        <div className="relative grid gap-14 items-center md:[grid-template-columns:minmax(620px,1fr)_minmax(460px,560px)]">
          {/* Media */}
          <div data-el="media" className="relative ml-0">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(closest-side,rgba(120,100,255,.18),transparent_70%)]" />
            <div className="w-full aspect-[16/9] min-h-[360px] rounded-2xl overflow-hidden shadow-[0_0_90px_rgba(120,100,255,.16)] ring-1 ring-white/8">
              <img 
                src={currentItem.imageSrc} 
                alt={currentItem.imageAlt} 
                className="w-full h-full object-cover object-center" 
                loading="lazy" 
              />
            </div>
          </div>

          {/* Text */}
          <div data-el="textcol" className="cq min-w-[460px] max-w-[560px]">
            <div className="text-sm text-white/55">{formatDate(currentItem.dateISO)}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${chipClass(currentItem.tag)}`}>
                {currentItem.tag}
              </span>
              {currentItem.type ? (
                <span className="text-white/55 text-xs">• {currentItem.type}</span>
              ) : null}
            </div>
            <h2 className="mt-3 text-balance text-pretty keep-words leading-[1.05] tracking-tight text-[clamp(2.25rem,6cqi,3.75rem)] text-white font-bold">
              {noWidow(currentItem.title)}
            </h2>
            <p className="mt-5 text-lg text-white/80">{currentItem.blurb}</p>
            <a 
              href={currentItem.ctaHref} 
              className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 bg-[#6E4BFF] hover:bg-[#825FFF] text-white font-medium"
            >
              {currentItem.ctaLabel}
            </a>
          </div>
        </div>

        {/* Mobile overlay arrows and dots (only visible on small screens) */}
        <div className="lg:hidden">
          {/* Mobile arrows */}
          <div className="pointer-events-none absolute inset-y-0 left-2 right-2 flex items-center justify-between z-20">
            <button 
              onClick={goToPrevious} 
              aria-label="Previous slide" 
              className="pointer-events-auto h-12 w-12 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 flex items-center justify-center text-white text-xl font-bold transition-all"
            >
              ‹
            </button>
            <button 
              onClick={goToNext} 
              aria-label="Next slide" 
              className="pointer-events-auto h-12 w-12 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 flex items-center justify-center text-white text-xl font-bold transition-all"
            >
              ›
            </button>
          </div>

          {/* Mobile dots */}
          <div className="mt-10 flex justify-center gap-3">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                aria-label={`Go to item ${index + 1} of ${items.length}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Right rail column is your existing sidebar space */}
      <div className="hidden lg:block col-[3]" />
    </div>
  );
}