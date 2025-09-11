import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ExternalLink, Play, Pause } from "lucide-react";
import { MethodologyModal } from "@/components/modals/MethodologyModal";
import { SuggestUpdateModal } from "@/components/modals/SuggestUpdateModal";

export interface ChartsHeroProps {
  backgroundImageUrl?: string;
  sponsorName?: string;
  sponsorHref?: string;
  heroMedia?:
    | { type: "image"; imageUrl: string; caption?: string }
    | { type: "slideshow"; slides: Array<{ imageUrl: string; title?: string }> }
    | { type: "video"; src: string; poster?: string; caption?: string };
}

const HERO_MEDIA_ENABLED = true;

export function ChartsHero({ backgroundImageUrl, sponsorName, sponsorHref, heroMedia }: ChartsHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showSuggestUpdate, setShowSuggestUpdate] = useState(false);

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
    setShowMethodology(true);
  };

  const handleSuggestUpdate = () => {
    setShowSuggestUpdate(true);
  };

  const getMethodologyData = () => {
    // Default methodology data for VHUB Charts
    return {
      signals: [
        "Follower/subscriber count across platforms",
        "Content engagement rates (likes, comments, shares)",
        "Community growth velocity",
        "Cross-platform presence",
        "Creator earnings and monetization",
        "Industry recognition and awards",
        "Collaboration network strength"
      ],
      window: "Rolling 30-day window with weighted emphasis on recent activity",
      normalization: "Scores normalized to 0-100 scale with platform-specific adjustments for creator economy differences"
    };
  };

  const methodologyData = getMethodologyData();

  const renderMediaSlot = () => {
    if (!HERO_MEDIA_ENABLED || !heroMedia) return null;

    const mediaFrame = "relative aspect-video rounded-2xl overflow-hidden ring-2 ring-white/20 shadow-2xl";

    switch (heroMedia.type) {
      case 'image':
        return (
          <div className={`${mediaFrame} hero-image-glow`}>
            <OptimizedImage
              src={heroMedia.imageUrl}
              alt={heroMedia.caption || "Hero image"}
              width="100%"
              height="100%"
              aspectRatio="video"
              loading="eager"
              priority={true}
              className="w-full h-full object-cover"
              data-testid="charts-hero-image"
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
                <OptimizedImage
                  src={slide.imageUrl}
                  alt={slide.title || `Slide ${index + 1}`}
                  width="100%"
                  height="100%"
                  aspectRatio="video"
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                  className="w-full h-full object-cover"
                  data-testid={`charts-hero-slide-${index}`}
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
          <div className={`${mediaFrame} hero-video-enhanced`}>
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
    <div className="relative hero-outer-glow-wrapper mb-8">
      <div className="relative overflow-hidden rounded-2xl p-8 md:p-16 lg:p-20 bg-surface/70 ring-1 ring-border/50 min-h-[600px] md:min-h-[700px] hero-glow-container">
      {/* Background image with glow effect */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center hero-background-glow"
        style={{ backgroundImage: `url(${backgroundImageUrl ?? '/hero/vhub-charts-placeholder.jpg'})` }}
        aria-hidden="true"
      />
      
      {/* Ambient light effect that extends beyond the container */}
      <div className="absolute inset-0 -z-10 bg-black/30 md:bg-black/25 hero-ambient-light" aria-hidden="true" />
      
      {/* Faded #1 watermark - positioned to not overlap text */}
      <div 
        className="absolute right-6 bottom-2 text-[18rem] md:text-[22rem] font-extrabold leading-none opacity-[0.06] select-none pointer-events-none"
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
            {/* Eyebrow - removed duplicate */}
            
            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white hero-title-glow orbitron-font">
              VHUB Charts
            </h1>
            
            {/* Subline - enhanced visibility */}
            <p className="text-xl font-medium max-w-xl text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 shadow-lg hero-subtitle-enhanced">
              Updated weekly with data on creators, platforms, and momentum.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleExploreCharts}
                className="btn-primary hero-cta-glow"
                data-testid="explore-charts-cta"
              >
                Explore all charts
              </Button>
              <Button
                variant="outline"
                onClick={handleMethodology}
                className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20"
                data-testid="methodology-cta"
              >
                Methodology
              </Button>
              <Button
                variant="outline"
                onClick={handleSuggestUpdate}
                className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20"
                data-testid="suggest-update-cta"
              >
                Suggest Update
              </Button>
            </div>
          </div>
          
          {/* Right media slot */}
          <div className="order-first lg:order-last">
            {HERO_MEDIA_ENABLED && renderMediaSlot()}
          </div>
        </div>
      </div>
      </div>
      
      {/* Modals */}
      <MethodologyModal
        isOpen={showMethodology}
        onClose={() => setShowMethodology(false)}
        chartTitle="VHUB Charts"
        signals={methodologyData.signals}
        window={methodologyData.window}
        normalization={methodologyData.normalization}
        disputesUrl="https://virtuohub.com/support/chart-disputes"
      />

      <SuggestUpdateModal
        isOpen={showSuggestUpdate}
        onClose={() => setShowSuggestUpdate(false)}
        chartTitle="VHUB Charts"
      />
    </div>
  );
}