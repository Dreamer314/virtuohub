import { Link as LinkIcon, Twitter, MessageCircle, Globe } from 'lucide-react';
import type { Spotlight } from '@/types/spotlight';

interface SpotlightConnectProps {
  spotlight: Spotlight;
}

export function SpotlightConnect({ spotlight }: SpotlightConnectProps) {
  if (!spotlight.social) return null;
  
  const { vrchat, twitter, discord, website } = spotlight.social;
  const hasAnySocial = vrchat || twitter || discord || website;
  
  if (!hasAnySocial) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <LinkIcon className="w-5 h-5 text-primary" />
        Connect
      </h3>
      <div className="flex flex-wrap gap-3">
        {vrchat && (
          <a
            href={`https://vrchat.com/home/user/${vrchat.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>VRChat</span>
          </a>
        )}
        {twitter && (
          <a
            href={`https://twitter.com/${twitter.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            <span>Twitter</span>
          </a>
        )}
        {discord && (
          <a
            href={`https://discord.com/users/${discord}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Discord</span>
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Website</span>
          </a>
        )}
      </div>
    </div>
  );
}
