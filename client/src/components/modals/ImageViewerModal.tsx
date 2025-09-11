import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { X, Download, ExternalLink } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
  showActions?: boolean;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageAlt,
  showActions = true
}) => {
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

  const handleOpenInNewTab = () => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="vh-modal-content max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">{imageAlt || 'Image Viewer'}</DialogTitle>
        
        {/* Header with actions */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {showActions && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="vh-button-secondary h-8 w-8 p-0"
                data-testid="download-image"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenInNewTab}
                className="vh-button-secondary h-8 w-8 p-0"
                data-testid="open-in-new-tab"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="vh-button-secondary h-8 w-8 p-0"
            data-testid="close-modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Image container */}
        <div className="flex items-center justify-center min-h-[50vh] max-h-[80vh] bg-vh-bg">
          <OptimizedImage
            src={imageUrl}
            alt={imageAlt}
            width="auto"
            height="auto"
            objectFit="contain"
            loading="eager"
            priority={true}
            className="max-w-full max-h-full object-contain"
            data-testid="modal-image"
            onLoad={() => {
              // Ensure the dialog content adjusts to image size
              const content = document.querySelector('[role="dialog"]');
              if (content) {
                content.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
          />
        </div>

        {/* Image caption */}
        {imageAlt && (
          <div className="px-6 py-4 border-t border-vh-border">
            <p className="vh-body-small text-vh-text-muted text-center">
              {imageAlt}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};