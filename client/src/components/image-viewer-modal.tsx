import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
}

export function ImageViewerModal({ isOpen, onClose, imageUrl, imageAlt }: ImageViewerModalProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom and position when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageAlt || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Handle mouse drag for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 overflow-hidden bg-black/90 border-0"
        data-testid="image-viewer-modal"
      >
        <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center">
          {/* Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="bg-black/50 text-white border-white/20 hover:bg-black/70"
              data-testid="zoom-out-button"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 5}
              className="bg-black/50 text-white border-white/20 hover:bg-black/70"
              data-testid="zoom-in-button"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="bg-black/50 text-white border-white/20 hover:bg-black/70"
              data-testid="download-button"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="bg-black/50 text-white border-white/20 hover:bg-black/70"
              data-testid="close-button"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom level indicator */}
          {zoom !== 1 && (
            <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-md text-sm">
              {Math.round(zoom * 100)}%
            </div>
          )}

          {/* Image */}
          <div
            className="cursor-move select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              style={{ pointerEvents: 'none' }}
              data-testid="full-size-image"
            />
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white/70 px-4 py-2 rounded-md text-sm text-center">
            {zoom > 1 ? 'Click and drag to pan • Scroll to zoom' : 'Scroll to zoom • Click controls above'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}