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

const tagStyles = {
  'Creator Insights': 'bg-[rgba(120,243,207,.12)] text-[#7AF3CF]',
  'Spotlight': 'bg-[rgba(197,168,255,.12)] text-[#C5A8FF]',
  'Tips & Guides': 'bg-[rgba(182,232,110,.12)] text-[#B6E86E]',
  'Industry News': 'bg-[rgba(56,132,255,.12)] text-[#6EA8FF]',
  'Tech': 'bg-[rgba(255,196,136,.10)] text-[#FFC888]'
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
      id="featured" 
      className="relative max-w-[1600px] mx-auto px-6 py-12"
      onMouseEnter={() => setIsAutoplayPaused(true)}
      onMouseLeave={() => setIsAutoplayPaused(false)}
      data-testid="featured-carousel"
    >
      <div 
        className="relative grid md:grid-cols-[2fr_1fr] gap-16 xl:gap-20 items-center"
        aria-live="polite"
        role="region"
        aria-label="Featured content carousel"
      >
        {/* Media */}
        <div className="relative">
          {/* Radial background */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(closest-side,rgba(120,100,255,.18),transparent_70%)] pointer-events-none" />
          
          {/* Media frame */}
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(120,100,255,.18)] ring-1 ring-white/8">
            <img
              src={currentItem.imageSrc}
              alt={currentItem.imageAlt}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              data-testid={`featured-image-${currentItem.id}`}
            />
          </div>
        </div>

        {/* Text */}
        <div className="max-w-[48ch] pt-2">
          {/* Date */}
          <div className="text-sm text-white/55 mb-2" data-testid={`featured-date-${currentItem.id}`}>
            {formatDate(currentItem.dateISO)}
          </div>

          {/* Tag and type */}
          <div className="mt-2 flex items-center gap-2">
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${tagStyles[currentItem.tag]}`}
              data-testid={`featured-tag-${currentItem.id}`}
            >
              {currentItem.tag}
            </span>
            {currentItem.type && (
              <span className="text-white/55">• {currentItem.type}</span>
            )}
          </div>

          {/* Title */}
          <h3 
            className="text-5xl leading-tight font-extrabold tracking-tight mt-3 text-balance"
            data-testid={`featured-title-${currentItem.id}`}
          >
            {currentItem.title}
          </h3>

          {/* Blurb */}
          <p 
            className="text-lg text-white/80 mt-4"
            data-testid={`featured-blurb-${currentItem.id}`}
          >
            {currentItem.blurb}
          </p>

          {/* CTA Button */}
          <a
            href={currentItem.ctaHref}
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-[#6E4BFF] hover:bg-[#825FFF] text-white font-medium mt-6 transition-colors"
            data-testid={`featured-cta-${currentItem.id}`}
          >
            {currentItem.ctaLabel}
          </a>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          aria-label={`Previous featured item (${currentIndex + 1} of ${items.length})`}
          className="absolute left-0 md:-left-10 xl:-left-16 top-1/2 -translate-y-1/2 h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 transition flex items-center justify-center disabled:opacity-50"
          data-testid="featured-prev-button"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          aria-label={`Next featured item (${currentIndex + 1} of ${items.length})`}
          className="absolute right-0 md:-right-10 xl:-right-16 top-1/2 -translate-y-1/2 h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/6 backdrop-blur ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 transition flex items-center justify-center disabled:opacity-50"
          data-testid="featured-next-button"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {/* Dots under card */}
      <div className="mt-8 flex justify-center gap-3">
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

      {/* Play/pause status */}
      <div className="flex items-center justify-center gap-4 mt-4">
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
    </section>
  )
}