import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FeaturedItem = {
  id: string
  dateISO: string
  tag: 'Creator Insights' | 'Spotlight' | 'Tips & Guides' | 'Industry News' | 'Tech'
  type?: 'Interview' | 'Article' | 'Video'
  title: string
  blurb: string
  ctaLabel: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
}

interface FeaturedCarouselProps {
  items: FeaturedItem[]
}

function chipClass(tag: string) {
  switch (tag) {
    case 'Creator Insights': return 'text-[#7AF3CF] bg-[rgba(120,243,207,.12)]';
    case 'Spotlight':        return 'text-[#C5A8FF] bg-[rgba(197,168,255,.12)]';
    case 'Tips & Guides':    return 'text-[#B6E86E] bg-[rgba(182,232,110,.12)]';
    case 'Industry News':    return 'text-[#6EA8FF] bg-[rgba(56,132,255,.12)]';
    case 'Tech':             return 'text-[#FFC888] bg-[rgba(255,196,136,.10)]';
    default:                 return 'text-white bg-white/10';
  }
}

export function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % items.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const formatDate = (dateISO: string) => {
    const date = new Date(dateISO)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Auto-advance slides
  useEffect(() => {
    if (isAutoplayPaused) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoplayPaused])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!items.length) return null

  const currentItem = items[currentIndex]

  return (
    <section 
      className="relative w-full"
      onMouseEnter={() => setIsAutoplayPaused(true)}
      onMouseLeave={() => setIsAutoplayPaused(false)}
      data-testid="featured-carousel"
    >
      {/* Navigation arrows - positioned inside content area */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        aria-label={`Previous featured item (${currentIndex + 1} of ${items.length})`}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 z-10"
        data-testid="featured-prev-button"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        aria-label={`Next featured item (${currentIndex + 1} of ${items.length})`}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 z-10"
        data-testid="featured-next-button"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </button>

      {/* Main content - optimized for center column */}
      <div 
        className="grid md:grid-cols-[1.3fr_1fr] gap-6 md:gap-8 items-center px-4"
        aria-live="polite"
        role="region"
        aria-label="Featured content carousel"
      >
        {/* Image - sized for center column */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(closest-side,rgba(120,100,255,.15),transparent_70%)] pointer-events-none" />
          <div className="aspect-[16/9] w-full min-h-[250px] md:min-h-[320px] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(120,100,255,.15)] ring-1 ring-white/8">
            <img
              src={currentItem.imageSrc}
              alt={currentItem.imageAlt}
              className="w-full h-full object-cover"
              loading="lazy"
              data-testid={`featured-image-${currentItem.id}`}
            />
          </div>
        </div>

        {/* Text - optimized spacing */}
        <div className="space-y-4">
          {/* Date */}
          <div className="text-sm text-white/60" data-testid={`featured-date-${currentItem.id}`}>
            {formatDate(currentItem.dateISO)}
          </div>

          {/* Tag and type */}
          <div className="flex items-center gap-2 flex-wrap">
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${chipClass(currentItem.tag)}`}
              data-testid={`featured-tag-${currentItem.id}`}
            >
              {currentItem.tag}
            </span>
            {currentItem.type && (
              <span className="text-white/50 text-sm">• {currentItem.type}</span>
            )}
          </div>

          {/* Title - sized for column */}
          <h2 
            className="text-2xl md:text-3xl xl:text-4xl font-bold text-white leading-tight"
            data-testid={`featured-title-${currentItem.id}`}
          >
            {currentItem.title}
          </h2>

          {/* Blurb */}
          <p 
            className="text-base text-white/80 leading-relaxed"
            data-testid={`featured-blurb-${currentItem.id}`}
          >
            {currentItem.blurb}
          </p>

          {/* CTA */}
          <div className="pt-2">
            <a
              href={currentItem.ctaHref}
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 bg-[#6E4BFF] hover:bg-[#825FFF] text-white font-medium transition-colors text-sm"
              data-testid={`featured-cta-${currentItem.id}`}
            >
              {currentItem.ctaLabel}
            </a>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 space-y-4">
        {/* Dots */}
        <div className="flex justify-center gap-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 ${
                index === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1} of ${items.length}`}
              data-testid={`featured-dot-${index}`}
            >
              {index === currentIndex && !isAutoplayPaused && (
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping"></div>
              )}
            </button>
          ))}
        </div>

        {/* Play/pause */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsAutoplayPaused(!isAutoplayPaused)}
            className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            aria-label={isAutoplayPaused ? "Resume slideshow" : "Pause slideshow"}
            data-testid="featured-autoplay-toggle"
          >
            {isAutoplayPaused ? (
              <Play className="w-3 h-3 text-foreground ml-0.5" />
            ) : (
              <Pause className="w-3 h-3 text-foreground" />
            )}
          </button>

          <div className="text-xs text-muted-foreground">
            {isAutoplayPaused ? 'Paused' : 'Auto-rotating every 5s'}
          </div>
        </div>
      </div>
    </section>
  )
}