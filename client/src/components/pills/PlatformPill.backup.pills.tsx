import React from 'react';
import { cn, getPlatformColor } from '@/lib/utils';

export type Platform = 
  | 'Roblox' 
  | 'VRChat' 
  | 'Second Life' 
  | 'IMVU' 
  | 'Meta Horizon Worlds'
  | 'Unity'
  | 'Unreal Engine' 
  | 'Core'
  | 'Dreams'
  | 'Fortnite Creative'
  | 'Minecraft'
  | 'GTA FiveM'
  | 'The Sims'
  | 'inZOI'
  | 'Elder Scrolls Online'
  | 'Fallout'
  | 'Counter-Strike'
  | 'Team Fortress 2'
  | 'Other';

interface PlatformPillProps {
  platform: Platform | string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'active' | 'outline';
  onClick?: () => void;
  className?: string;
}


export const PlatformPill: React.FC<PlatformPillProps> = ({ 
  platform, 
  size = 'default', 
  variant = 'default',
  onClick,
  className 
}) => {
  const sizeClasses = {
    sm: 'vh-caption px-2 py-1',
    default: 'vh-body-small px-3 py-1.5',
    lg: 'vh-body px-4 py-2'
  };

  const baseClasses = 'vh-platform-pill inline-flex items-center font-medium rounded-full border transition-vh-fast';
  
  const variantClasses = {
    default: getPlatformColor(platform),
    active: 'bg-vh-accent1 text-white border-vh-accent1',
    outline: 'bg-transparent text-vh-text-muted border-vh-border hover:border-vh-accent1 hover:text-vh-accent1'
  };

  const combinedClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    onClick && 'cursor-pointer',
    className
  );
  
  return (
    <span 
      className={combinedClasses}
      onClick={onClick}
      data-testid={`platform-pill-${platform.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {platform}
    </span>
  );
};