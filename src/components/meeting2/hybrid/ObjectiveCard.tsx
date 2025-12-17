import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ObjectiveCardProps {
  number: number;
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  index: number;
  className?: string;
}

export function ObjectiveCard({ 
  number, 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  index,
  className 
}: ObjectiveCardProps) {
  return (
    <div 
      className={cn(
        "group relative animate-fade-in hover:scale-105 transition-all duration-500",
        className
      )}
      style={{ 
        animationDelay: `${index * 0.2}s`,
      }}
    >
      {/* Card */}
      <div className="relative h-full rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-[#C9A45C]/30 bg-white/5 backdrop-blur-sm">
        {/* Number Badge */}
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full border-2 border-[#C9A45C] flex items-center justify-center shadow-lg" style={{ backgroundColor: '#DFFFEF' }}>
          <span className="text-lg font-bold" style={{ color: '#C9A45C' }}>{number}</span>
        </div>

        {/* Icon Container */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: '#DFFFEF' }}
        >
          <Icon className="h-8 w-8" style={{ color: '#C9A45C' }} />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white group-hover:text-[#E5C875] transition-colors">
            {title}
          </h3>
          
          <div className="text-center p-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="text-2xl font-bold mb-1" style={{ color: '#C9A45C' }}>
              {value}
            </div>
            <div className="text-sm" style={{ color: '#BFCAC7' }}>
              {subtitle}
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle at center, rgba(201, 164, 92, 0.08) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}

export default ObjectiveCard;