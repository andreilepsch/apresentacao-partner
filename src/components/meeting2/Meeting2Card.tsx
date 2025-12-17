import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Meeting2CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'highlight' | 'glass';
  hover?: boolean;
}

interface Meeting2CardHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'recommended' | 'highlight' | 'new';
  };
}

interface Meeting2CardStatsProps {
  stats: Array<{
    value: string;
    label: string;
    color?: string;
  }>;
}

// Main Card Component
export function Meeting2Card({ 
  children, 
  className, 
  variant = 'default',
  hover = true 
}: Meeting2CardProps) {
  const variantStyles = {
    default: "bg-white/10 backdrop-blur-sm border border-white/20",
    primary: "bg-rc-primary/20 backdrop-blur-sm border border-rc-secondary/30",
    highlight: "bg-gradient-to-r from-rc-secondary/20 to-rc-primary/20 border border-rc-secondary/40",
    glass: "bg-white/5 backdrop-blur-md border border-white/10"
  };

  return (
    <Card className={cn(
      variantStyles[variant],
      hover && "hover:scale-[1.02] transition-all duration-300",
      className
    )}>
      {children}
    </Card>
  );
}

// Card Header Component
export function Meeting2CardHeader({ 
  icon: Icon, 
  title, 
  subtitle, 
  badge 
}: Meeting2CardHeaderProps) {
  return (
    <div className="relative text-center mb-6">
      {badge && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold",
            badge.variant === 'recommended' && "bg-rc-secondary text-rc-primary",
            badge.variant === 'highlight' && "bg-gradient-to-r from-rc-secondary to-rc-primary text-white",
            badge.variant === 'new' && "bg-gradient-to-r from-emerald-400 to-teal-500 text-white"
          )}>
            {badge.text}
          </span>
        </div>
      )}
      
      {Icon && (
        <div className="w-16 h-16 bg-gradient-to-br from-rc-primary to-rc-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
      )}
      
      <h3 className="text-heading-3 font-bold text-white mb-2">{title}</h3>
      {subtitle && (
        <p className="text-body text-white/80">{subtitle}</p>
      )}
    </div>
  );
}

// Card Stats Component
export function Meeting2CardStats({ stats }: Meeting2CardStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      {stats.map((stat, index) => (
        <div key={index}>
          <div className={cn(
            "text-heading-4 font-bold mb-1",
            stat.color || "text-rc-secondary"
          )}>
            {stat.value}
          </div>
          <div className="text-small text-white/70">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// Card Content for consistency
Meeting2Card.Content = CardContent;
Meeting2Card.Header = Meeting2CardHeader;
Meeting2Card.Stats = Meeting2CardStats;

export default Meeting2Card;