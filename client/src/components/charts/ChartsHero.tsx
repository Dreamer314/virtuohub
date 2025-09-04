import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play, Pause } from "lucide-react";

export interface ChartsHeroProps {
  sponsorName?: string;
  sponsorHref?: string;
  heroMedia?:
    | { type: "image"; imageUrl: string; caption?: string }
    | { type: "slideshow"; slides: Array<{ imageUrl: string; title?: string }> }
    | { type: "video"; src: string; poster?: string; caption?: string };
}

export function ChartsHero({ sponsorName, sponsorHref, heroMedia }: ChartsHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Slideshow auto-advance
  useEffect(() => {
    if (heroMedia?.type === 'slideshow' && !prefersReducedMotion && heroMedia.slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroMedia.slides.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [heroMedia, prefersReducedMotion]);

  const handleVideoToggle = () => {
    const video = document.querySelector('#hero-video') as HTMLVideoElement;
    if (video) {
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleExploreCharts = () => {
    const chartsSection = document.getElementById('charts-start');
    if (chartsSection) {
      chartsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMethodology = () => {
    // This will trigger the existing methodology modal
    const methodologyButton = document.querySelector('[data-testid="methodology-button"]') as HTMLButtonElement;
    if (methodologyButton) {
      methodologyButton.click();
    }
  };

  const renderMediaSlot = () => {
    if (!heroMedia) return null;

    const mediaFrame = "relative aspect-video rounded-xl overflow-hidden ring-1 ring-border/30 shadow-lg";

    switch (heroMedia.type) {
      case 'image':
        return (
          <div className={mediaFrame}>
            <img
              src={heroMedia.imageUrl}
              alt={heroMedia.caption || "Hero image"}
              className="w-full h-full object-cover"
            />
            {heroMedia.caption && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {heroMedia.caption}
              </div>
            )}
          </div>
        );

      case 'slideshow':
        return (
          <div className={mediaFrame}>
            {heroMedia.slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.title || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {slide.title && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {slide.title}
                  </div>
                )}
              </div>
            ))}
            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
              {heroMedia.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className={mediaFrame}>
            <video
              id="hero-video"
              src={heroMedia.src}
              poster={heroMedia.poster}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
            />
            <button
              onClick={handleVideoToggle}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
              aria-label={isVideoPlaying ? "Pause video" : "Play video"}
            >
              <div className="bg-black/60 rounded-full p-3 group-hover:bg-black/80 transition-colors">
                {isVideoPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </div>
            </button>
            {heroMedia.caption && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {heroMedia.caption}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 md:p-10 bg-card/80 ring-1 ring-border/50 mb-8">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
        aria-hidden="true"
      />
      
      {/* Large #1 watermark */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-foreground/[0.03] pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        #1
      </div>

      {/* Optional sponsor chip */}
      {sponsorName && sponsorHref && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <div className="bg-muted/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-muted-foreground border border-border/50">
            <span className="mr-1">Presented by</span>
            <a 
              href={sponsorHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              {sponsorName}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="vh-eyebrow">VHUB Charts</p>
              <h1 className="vh-hero">
                The scoreboards of the immersive creator economy.
              </h1>
              <p className="vh-meta text-lg">
                Updated weekly with data on creators, platforms, and momentum.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleExploreCharts}
                className="btn-primary"
                data-testid="explore-charts-cta"
              >
                Explore all charts
              </Button>
              <Button
                variant="outline"
                onClick={handleMethodology}
                className="btn-secondary"
                data-testid="methodology-cta"
              >
                Methodology
              </Button>
            </div>
          </div>

          {/* Right media slot */}
          <div className="order-first lg:order-last">
            {renderMediaSlot()}
          </div>
        </div>
      </div>
    </div>
  );
}