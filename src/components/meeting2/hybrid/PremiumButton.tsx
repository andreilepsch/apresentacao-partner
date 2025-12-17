import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
}

export function PremiumButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  disabled = false
}: PremiumButtonProps) {
  
  const baseStyles = "group inline-flex items-center gap-3 rounded-3xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "text-black shadow-2xl hover:scale-105",
    secondary: "text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20",
    outline: "text-consortium-gold border-2 border-consortium-gold hover:bg-consortium-gold hover:text-black"
  };
  
  const sizeStyles = {
    sm: "px-6 py-3 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-12 py-6 text-lg"
  };

  const primaryStyle = variant === 'primary' ? {
    background: 'linear-gradient(135deg, #C9A45C, #E5C875)',
    boxShadow: '0 10px 30px rgba(201, 164, 92, 0.3)'
  } : {};

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'primary') {
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(201, 164, 92, 0.5)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'primary') {
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(201, 164, 92, 0.3)';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      style={primaryStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {Icon && (
        <Icon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
      )}
    </button>
  );
}