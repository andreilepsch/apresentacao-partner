import React from 'react';
import { cn } from "@/lib/utils";

interface Meeting2ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success';
  showPercentage?: boolean;
}

export default function Meeting2ProgressBar({
  value,
  max = 10,
  label,
  className,
  variant = 'primary',
  showPercentage = true
}: Meeting2ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantStyles = {
    primary: "from-consortium-gold to-consortium-gold-light",
    secondary: "from-consortium-gold-light to-consortium-gold",
    success: "from-emerald-500 to-teal-600"
  };

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-body font-medium text-white">{label}</span>
          )}
          {showPercentage && (
            <span className="text-heading-4 font-bold text-consortium-gold">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: 'rgba(201, 164, 92, 0.3)' }}>
        <div 
          className={cn(
            "h-full bg-gradient-to-r transition-all duration-1000 ease-out",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}