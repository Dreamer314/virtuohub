import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      className="relative isolate not-prose overflow-visible" 
      data-scope="featured"
      aria-roledescription="carousel"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* Stage */}
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-8 lg:pr-[360px]">
        {/* Grid */}
        <div className="relative grid md:grid-cols-[1.8fr_1fr] gap-20 xl:gap-28 items-center">
          {/* Media */}
          <div className="relative md:-ml-6 xl:-ml-12">
            {/* Radial glow behind frame */}
            <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(120,100,255,.18),transparent_70%)] rounded-2xl"></div>
            
            {/* Frame */}
            <div className="w-full aspect-[16/9] min-h-[360px] xl:min-h-[440px] rounded-2xl overflow-hidden shadow-[0_0_90px_rgba(120,100,255,.16)] ring-1 ring-white/8 relative">
              <img 
                src={currentItem.imageSrc}
                alt={currentItem.imageAlt}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text column */}
          <div className="cq max-w-[38ch] md:mr-2">
            {/* Date */}
            <div className="text-sm text-white/60 mb-3">
              {formatDate(currentItem.dateISO)}
            </div>

            {/* Tag and Type */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                currentItem.tag === 'Creator Insights' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                currentItem.tag === 'Industry News' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                currentItem.tag === 'Tips & Guides' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {currentItem.tag}
              </span>
              {currentItem.type && (
                <span className="text-xs text-white/50">
                  {currentItem.type}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-balance text-pretty keep-words leading-[1.05] tracking-tight text-[clamp(2.25rem,6cqi,3.75rem)] text-white font-bold mb-5">
              {currentItem.title}
            </h2>

            {/* Blurb */}
            <p className="text-lg text-white/80 mt-5 mb-6">
              {currentItem.blurb}
            </p>

            {/* Primary button */}
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              <a href={currentItem.ctaHref}>{currentItem.ctaLabel}</a>
            </Button>
          </div>
        </div>

        {/* Controls - Arrows */}
        <div className="pointer-events-none absolute inset-y-0 left-2 right-2 lg:right-[380px] flex items-center justify-between">
          <button
            onClick={goToPrevious}
            aria-label={`Go to previous item (${currentIndex === 0 ? items.length : currentIndex} of ${items.length})`}
            className="pointer-events-auto h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 flex items-center justify-center text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <button
            onClick={goToNext}
            aria-label={`Go to next item (${currentIndex + 2 > items.length ? 1 : currentIndex + 2} of ${items.length})`}
            className="pointer-events-auto h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 flex items-center justify-center text-white transition-all"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
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
  );
}