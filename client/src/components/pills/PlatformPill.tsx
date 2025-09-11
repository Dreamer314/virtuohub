import React from 'react';
import { cn } from '@/lib/utils';

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

const platformColors: Record<string, string> = {
  'Roblox': 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20',
  'VRChat': 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20',
  'Second Life': 'bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20',
  'IMVU': 'bg-pink-500/10 text-pink-600 border-pink-500/20 hover:bg-pink-500/20',
  'Meta Horizon Worlds': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:bg-cyan-500/20',
  'Unity': 'bg-gray-500/10 text-gray-600 border-gray-500/20 hover:bg-gray-500/20',
  'Unreal Engine': 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20',
  'Core': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20',
  'Dreams': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20',
  'Fortnite Creative': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20',
  'Minecraft': 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
  'GTA FiveM': 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20',
  'The Sims': 'bg-teal-500/10 text-teal-600 border-teal-500/20 hover:bg-teal-500/20',
  'inZOI': 'bg-violet-500/10 text-violet-600 border-violet-500/20 hover:bg-violet-500/20',
  'Elder Scrolls Online': 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20',
  'Fallout': 'bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20',
  'Counter-Strike': 'bg-red-600/10 text-red-700 border-red-600/20 hover:bg-red-600/20',
  'Team Fortress 2': 'bg-orange-600/10 text-orange-700 border-orange-600/20 hover:bg-orange-600/20',
  'Other': 'bg-vh-accent1-light text-vh-accent1 border-vh-accent1/20 hover:bg-vh-accent1/10',
};

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
    default: platformColors[platform] || platformColors['Other'],
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