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
          setIsAutoPlaying(prev => !prev);
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

  return (
    <section 
      id="featuredV2" 
      className="relative mx-auto max-w-[1400px] px-6 md:px-8 lg:pr-[360px] not-prose"
      aria-roledescription="carousel"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="relative grid gap-12 xl:gap-20 items-start lg:[grid-template-columns:minmax(720px,1fr)_minmax(300px,560px)]">
        {/* Media */}
        <div className="relative md:-ml-6 xl:-ml-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(closest-side,rgba(120,100,255,.18),transparent_70%)]" />
          <div className="w-full aspect-[16/9] min-h-[360px] xl:min-h-[440px] rounded-2xl overflow-hidden shadow-[0_0_90px_rgba(120,100,255,.16)] ring-1 ring-white/8">
            <img 
              src={currentItem.imageSrc} 
              alt={currentItem.imageAlt} 
              className="w-full h-full object-cover object-center" 
              loading="lazy" 
            />
          </div>
        </div>

        {/* Text */}
        <div className="cq min-w-0 max-w-[560px] lg:min-w-[300px] xl:min-w-[440px]">
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
            className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 bg-[#6E4BFF] hover:bg-[#825FFF] text-white font-medium transition-colors"
          >
            {currentItem.ctaLabel}
          </a>
        </div>
      </div>

      {/* Arrows positioned at far left edge */}
      <div className="pointer-events-none absolute inset-y-0 -left-32 flex items-center z-20">
        <div className="flex flex-col gap-4">
          <button 
            onClick={goToPrevious} 
            aria-label="Previous slide" 
            className="pointer-events-auto h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 flex items-center justify-center text-white text-xl font-bold transition-all"
          >
            ‹
          </button>
          <button 
            onClick={goToNext} 
            aria-label="Next slide" 
            className="pointer-events-auto h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 flex items-center justify-center text-white text-xl font-bold transition-all"
          >
            ›
          </button>
        </div>
      </div>

      {/* Dots */}
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
    </section>
  );
}