import { Button } from "@/components/ui/button";

interface VoiceSwitcherProps {
  voice: 'editorial' | 'community';
  onVoiceChange: (voice: 'editorial' | 'community') => void;
  className?: string;
}

export function VoiceSwitcher({ voice, onVoiceChange, className }: VoiceSwitcherProps) {
  return (
    <div className={`flex bg-muted rounded-lg p-1 ${className}`}>
      <Button
        variant={voice === 'editorial' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onVoiceChange('editorial')}
        className="flex-1"
        data-testid="voice-editorial"
      >
        Editorial
      </Button>
      <Button
        variant={voice === 'community' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onVoiceChange('community')}
        className="flex-1"
        data-testid="voice-community"
      >
        Community Choice
      </Button>
    </div>
  );
}