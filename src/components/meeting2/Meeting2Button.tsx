import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowRight } from "lucide-react";

interface Meeting2ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  showArrow?: boolean;
  className?: string;
  disabled?: boolean;
  scrollToTop?: boolean;
}

export default function Meeting2Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  showArrow = false,
  className,
  disabled = false,
  scrollToTop = true
}: Meeting2ButtonProps) {
  const variantStyles = {
    primary: "bg-rc-primary hover:bg-rc-primary/90 text-white",
    secondary: "bg-rc-secondary hover:bg-rc-secondary/90 text-rc-primary",
    outline: "border-2 border-rc-secondary text-rc-secondary hover:bg-rc-secondary hover:text-rc-primary",
    ghost: "text-white hover:bg-white/10",
    cta: "bg-gradient-to-r from-rc-secondary via-rc-secondary to-rc-primary hover:from-rc-secondary hover:via-rc-secondary/95 hover:to-rc-primary/95 text-rc-primary shadow-2xl hover:shadow-rc-secondary/50 hover:scale-105 border border-rc-secondary/20 backdrop-blur-sm font-bold"
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-small",
    md: "px-6 py-3 text-body",
    lg: "px-8 py-4 text-body",
    xl: "px-12 py-6 text-heading-4"
  };

  const handleClick = () => {
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "font-semibold transition-all duration-300 rounded-xl",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        {showArrow && <ArrowRight className="w-5 h-5" />}
      </div>
    </Button>
  );
}