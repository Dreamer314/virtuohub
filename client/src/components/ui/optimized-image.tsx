import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fallbackSrc?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * OptimizedImage - A performance-optimized image component for VirtuoHub
 * 
 * Features:
 * - Automatic lazy loading (unless priority is true)
 * - Proper width/height for CLS prevention
 * - Aspect ratio utilities
 * - Placeholder support
 * - Error handling with fallbacks
 * - Intersection Observer for better lazy loading
 * - Performance optimizations
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  loading: loadingProp,
  priority = false,
  aspectRatio,
  objectFit = 'cover',
  placeholder = 'empty',
  blurDataURL,
  fallbackSrc = '/placeholder-image.jpg',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Determine loading strategy
  const loading = priority ? 'eager' : (loadingProp || 'lazy');

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setInView(true);
      return;
    }

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        },
        {
          rootMargin: '50px' // Start loading 50px before the image enters viewport
        }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      // Fallback for browsers without IntersectionObserver
      setInView(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, loading]);

  // Generate aspect ratio classes
  const getAspectRatioClass = (ratio?: string) => {
    if (!ratio) return '';
    
    switch (ratio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'wide':
        return 'aspect-[21/9]';
      default:
        return ratio.startsWith('aspect-') ? ratio : `aspect-[${ratio}]`;
    }
  };

  // Handle image load
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  // Handle image error
  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    if (fallbackSrc && imgRef.current) {
      imgRef.current.src = fallbackSrc;
    }
    onError?.(event);
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (originalSrc: string) => {
    // For now, return the original src
    // This could be enhanced with a service that generates multiple sizes
    return originalSrc;
  };

  // Base classes
  const baseClasses = cn(
    'transition-opacity duration-300',
    objectFit === 'cover' && 'object-cover',
    objectFit === 'contain' && 'object-contain',
    objectFit === 'fill' && 'object-fill',
    objectFit === 'none' && 'object-none',
    objectFit === 'scale-down' && 'object-scale-down',
    getAspectRatioClass(aspectRatio),
    !isLoaded && placeholder === 'blur' && 'blur-sm',
    !isLoaded && 'opacity-0',
    isLoaded && 'opacity-100',
    className
  );

  return (
    <div className={cn('relative overflow-hidden', aspectRatio && getAspectRatioClass(aspectRatio))}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full object-cover blur-sm scale-110',
            'pointer-events-none select-none'
          )}
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      {inView && (
        <img
          ref={imgRef}
          src={hasError ? fallbackSrc : src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          className={baseClasses}
          onLoad={handleLoad}
          onError={handleError}
          data-testid={(props as any)['data-testid'] || `optimized-image-${alt.toLowerCase().replace(/\s+/g, '-')}`}
          {...props}
        />
      )}

      {/* Loading state */}
      {!inView && (
        <div 
          className={cn(
            'w-full h-full bg-muted animate-pulse flex items-center justify-center',
            getAspectRatioClass(aspectRatio)
          )}
          style={{ width, height }}
          aria-label="Loading image..."
        >
          <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
        </div>
      )}
    </div>
  );
};

// Export utility function for generating responsive image props
export const getResponsiveImageProps = (
  src: string,
  sizes: { width: number; height: number }[]
) => {
  // This could be enhanced with a real image optimization service
  const srcSet = sizes
    .map(size => `${src}?w=${size.width}&h=${size.height} ${size.width}w`)
    .join(', ');
  
  return { srcSet, sizes: '(max-width: 768px) 100vw, 50vw' };
};

export default OptimizedImage;