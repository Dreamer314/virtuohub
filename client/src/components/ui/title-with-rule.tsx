import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TitleWithRuleProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export const TitleWithRule: React.FC<TitleWithRuleProps> = ({ icon: Icon, title, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
        <div className="flex items-center space-x-4">
          <Icon className="w-8 h-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h2>
        </div>
        <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
      </div>
    </div>
  );
};