import React from 'react';
import { Check } from 'lucide-react';

interface CheckItemProps {
  children: React.ReactNode;
  className?: string;
}

export const CheckItem: React.FC<CheckItemProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
};