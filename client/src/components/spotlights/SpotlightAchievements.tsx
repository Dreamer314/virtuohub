import { Award } from 'lucide-react';
import type { Spotlight } from '@/types/spotlight';

interface SpotlightAchievementsProps {
  spotlight: Spotlight;
}

export function SpotlightAchievements({ spotlight }: SpotlightAchievementsProps) {
  if (!spotlight.achievements || spotlight.achievements.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        Achievements
      </h3>
      <ul className="space-y-2 text-muted-foreground">
        {spotlight.achievements.map((achievement, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>{achievement}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
