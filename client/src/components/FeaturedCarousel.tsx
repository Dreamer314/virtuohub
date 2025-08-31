import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FeaturedItem = {
  id: string
  tag: 'News' | 'Creator Insights' | 'Spotlight' | 'Interview' | 'Tech'
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
  'News': 'bg-blue-500/12 text-blue-300 shadow-[0_0_20px_rgba(56,132,255,0.15)]',
  'Creator Insights': 'bg-emerald-400/10 text-emerald-300',
  'Spotlight': 'bg-purple-400/12 text-purple-300',
  'Interview': 'bg-cyan-400/12 text-cyan-300',
  'Tech': 'bg-orange-400/10 text-orange-300'
}

export function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
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
    <div 
      className="max-w-[90rem] mx-auto px-6"
      onMouseEnter={() => setIsAutoplayPaused(true)}
      onMouseLeave={() => setIsAutoplayPaused(false)}
      data-testid="featured-carousel"
    >
      <div className="relative">
        {/* Navigation arrows - positioned outside the content */}
        <button
          onClick={prevSlide}
          className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background z-10"
          aria-label="Previous featured item"
          data-testid="featured-prev-button"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background z-10"
          aria-label="Next featured item"
          data-testid="featured-next-button"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>

        {/* Main carousel content */}
        <div 
          className="transition-opacity duration-300 ease-in-out"
          aria-live="polite"
          role="region"
          aria-label="Featured content carousel"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image column */}
            <div className="order-1 md:order-1">
              <div className="aspect-video overflow-hidden rounded-2xl shadow-[0_0_60px_rgba(120,100,255,.15)]">
                <img
                  src={currentItem.imageSrc}
                  alt={currentItem.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  data-testid={`featured-image-${currentItem.id}`}
                />
              </div>
            </div>

            {/* Text column */}
            <div className="order-2 md:order-2 space-y-6">
              {/* Tag chip */}
              <div className="inline-block">
                <span 
                  className={`px-4 py-2 rounded-full text-sm font-medium ${tagStyles[currentItem.tag]}`}
                  data-testid={`featured-tag-${currentItem.id}`}
                >
                  {currentItem.tag}
                </span>
              </div>

              {/* Title */}
              <h2 
                className="text-3xl md:text-4xl font-bold text-foreground leading-tight"
                data-testid={`featured-title-${currentItem.id}`}
              >
                {currentItem.title}
              </h2>

              {/* Blurb */}
              <p 
                className="text-muted-foreground text-base md:text-lg leading-relaxed"
                data-testid={`featured-blurb-${currentItem.id}`}
              >
                {currentItem.blurb}
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg px-8 py-3"
                  onClick={() => window.open(currentItem.ctaHref, '_blank')}
                  data-testid={`featured-cta-${currentItem.id}`}
                >
                  {currentItem.ctaLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control bar with dots and play/pause */}
      <div className="flex items-center justify-center gap-6 mt-8">
        {/* Play/Pause button */}
        <button
          onClick={() => setIsAutoplayPaused(!isAutoplayPaused)}
          className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          aria-label={isAutoplayPaused ? "Resume slideshow" : "Pause slideshow"}
          data-testid="featured-autoplay-toggle"
        >
          {isAutoplayPaused ? (
            <Play className="w-4 h-4 text-foreground ml-0.5" />
          ) : (
            <Pause className="w-4 h-4 text-foreground" />
          )}
        </button>

        {/* Indicator dots */}
        <div className="flex space-x-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                index === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              data-testid={`featured-dot-${index}`}
            >
              {index === currentIndex && !isAutoplayPaused && (
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping"></div>
              )}
            </button>
          ))}
        </div>

        {/* Status text */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${
            isAutoplayPaused ? 'bg-orange-500' : 'bg-green-500 animate-pulse'
          }`}></div>
          <span>{isAutoplayPaused ? 'Slideshow paused' : 'Auto-rotating every 5s'}</span>
        </div>
      </div>
    </div>
  )
}