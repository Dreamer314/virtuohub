import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import type { Spotlight } from '@/types/spotlight';

interface SpotlightCardProps {
  spotlight: Spotlight;
  emoji?: string;
  gradient?: string;
  statOverlay?: string;
}

export function SpotlightCard({ spotlight, emoji = '👤', gradient = 'from-blue-500 to-purple-600', statOverlay }: SpotlightCardProps) {
  const badgeText = spotlight.type === 'creator' ? 'Spotlight' : spotlight.type === 'studio' ? 'Studio Spotlight' : 'Tool Spotlight';
  const badgeColor = spotlight.type === 'tool' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-primary/20 text-primary border-primary/30';
  
  return (
    <article className="enhanced-card hover-lift rounded-xl border border-sidebar-border hover:border-yellow-500/30 transition-all overflow-hidden">
      <div className={`w-full h-48 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <span className="text-4xl relative z-10">{emoji}</span>
        {statOverlay && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="text-white font-semibold text-sm">{statOverlay}</div>
          </div>
        )}
      </div>
      <div className="p-6">
        <span className={`inline-block px-2 py-1 text-xs font-medium ${badgeColor} border rounded-full mb-3`}>{badgeText}</span>
        <h3 className="text-xl font-semibold text-foreground mb-2">{spotlight.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{spotlight.about || spotlight.role}</p>
        {spotlight.tags && spotlight.tags.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {spotlight.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className={index === 0 ? "px-2 py-1 bg-accent/20 text-accent rounded text-xs" : "px-2 py-1 bg-primary/20 text-primary rounded text-xs border border-primary/30"}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link href={`/spotlight/${spotlight.slug}`} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm font-medium rounded-lg transition-all duration-300 group" data-testid={`view-spotlight-${spotlight.slug}`}>
          View Full Spotlight
          <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
