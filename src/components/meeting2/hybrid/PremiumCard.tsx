import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'glass';
  hover?: boolean;
  icon?: LucideIcon;
  title?: string;
  badge?: {
    text: string;
    variant?: 'gold' | 'highlight' | 'new';
  };
}

export function PremiumCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true,
  icon: Icon,
  title,
  badge
}: PremiumCardProps) {
  
  const variantStyles = {
    default: "bg-white/10 backdrop-blur-sm border border-white/20",
    highlight: "bg-white/15 backdrop-blur-sm border border-consortium-gold/30",
    glass: "bg-white/5 backdrop-blur-md border border-white/10"
  };

  const hoverStyles = hover ? "hover:scale-[1.02] hover:bg-white/20 transition-all duration-300 hover:shadow-xl" : "";
  const glowEffect = hover ? "hover:shadow-[0_0_30px_rgba(201,164,92,0.08)]" : "";

  return (
    <div className="relative">
      {badge && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold",
            badge.variant === 'gold' && "text-black",
            badge.variant === 'highlight' && "text-black",
            badge.variant === 'new' && "text-black"
          )} style={{ 
            background: 'linear-gradient(135deg, #C9A45C, #E5C875)',
            boxShadow: '0 4px 12px rgba(201, 164, 92, 0.3)'
          }}>
            {badge.text}
          </span>
        </div>
      )}
      
      <Card className={cn(
        variantStyles[variant],
        hoverStyles,
        glowEffect,
        className
      )}>
        <CardContent className="p-6">
          {(Icon || title) && (
            <div className="flex items-center gap-4 mb-6">
              {Icon && (
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#DFFFEF' }}
                >
                  <Icon className="w-6 h-6 text-consortium-gold" />
                </div>
              )}
              {title && (
                <h3 className="text-xl font-bold text-white">{title}</h3>
              )}
            </div>
          )}
          {children}
        </CardContent>
      </Card>
    </div>
  );
}