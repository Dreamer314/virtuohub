import React from 'react';
import { PlatformPill, type Platform } from '../pills/PlatformPill';

interface PlatformFilterProps {
  selectedPlatforms: string[];
  onPlatformToggle: (platform: string) => void;
  showAllOption?: boolean;
  className?: string;
}

const allPlatforms: Platform[] = [
  'Roblox',
  'VRChat', 
  'Second Life',
  'IMVU',
  'Meta Horizon Worlds',
  'Unity',
  'Unreal Engine',
  'Core',
  'Dreams',
  'Fortnite Creative',
  'Minecraft',
  'GTA FiveM',
  'The Sims',
  'inZOI',
  'Elder Scrolls Online',
  'Fallout',
  'Counter-Strike',
  'Team Fortress 2',
  'Other'
];

export const PlatformFilter: React.FC<PlatformFilterProps> = ({
  selectedPlatforms,
  onPlatformToggle,
  showAllOption = true,
  className = ''
}) => {
  const isAllSelected = selectedPlatforms.length === 0;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} data-testid="platform-filter">
      {showAllOption && (
        <PlatformPill
          platform="All"
          variant={isAllSelected ? 'active' : 'outline'}
          onClick={() => {
            // Clear all selections to show all platforms
            selectedPlatforms.forEach(platform => onPlatformToggle(platform));
          }}
        />
      )}
      
      {allPlatforms.map((platform) => {
        const isSelected = selectedPlatforms.includes(platform);
        
        return (
          <PlatformPill
            key={platform}
            platform={platform}
            variant={isSelected ? 'active' : 'default'}
            onClick={() => onPlatformToggle(platform)}
          />
        );
      })}
    </div>
  );
};