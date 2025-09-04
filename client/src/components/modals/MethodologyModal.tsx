import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, BarChart3, Clock, Scale } from "lucide-react";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartTitle: string;
  signals: string[];
  window: string;
  normalization: string;
  disputesUrl: string;
}

export function MethodologyModal({
  isOpen,
  onClose,
  chartTitle,
  signals,
  window,
  normalization,
  disputesUrl
}: MethodologyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            How We Calculate {chartTitle}
          </DialogTitle>
          <DialogDescription>
            Our methodology for ranking creators and platforms in the immersive creator economy.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Data Signals */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <Scale className="h-4 w-4" />
              Data Signals
            </h3>
            <div className="grid gap-2">
              {signals.map((signal, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {signal}
                </div>
              ))}
            </div>
          </div>

          {/* Time Window */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold mb-2">
              <Clock className="h-4 w-4" />
              Time Window
            </h3>
            <p className="text-sm text-muted-foreground">{window}</p>
          </div>

          {/* Normalization */}
          <div>
            <h3 className="font-semibold mb-2">Normalization</h3>
            <p className="text-sm text-muted-foreground">{normalization}</p>
          </div>

          {/* Quality Assurance */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Quality Assurance</h3>
            <p className="text-sm text-muted-foreground mb-3">
              All data is verified through multiple sources and updated regularly. We employ anti-gaming measures to ensure chart integrity.
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href={disputesUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Report Data Issues
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground border-t pt-3">
            Charts are updated every 24 hours. Next update: Tomorrow at 12:00 AM UTC
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}