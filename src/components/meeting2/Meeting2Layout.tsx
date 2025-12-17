import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LucideIcon } from "lucide-react";
import PageBadge from "@/components/common/PageBadge";
import { cn } from "@/lib/utils";

interface Meeting2LayoutProps {
  children: React.ReactNode;
  backTo?: string;
  badgeIcon?: LucideIcon;
  badgeText?: string;
  badgeVariant?: "default" | "golden";
  className?: string;
}

interface Meeting2HeroProps {
  title: string | React.ReactNode;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'result' | 'new' | 'highlight';
  };
  className?: string;
}

export function Meeting2Layout({ 
  children, 
  backTo, 
  badgeIcon, 
  badgeText,
  badgeVariant = "default",
  className 
}: Meeting2LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#163B36' }}>
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      
      <div className={cn("relative z-10 max-w-6xl mx-auto px-6 py-8", className)}>
        {/* Header */}
        <header className="relative flex items-center justify-center mb-12">
          {backTo && (
            <Button
              onClick={() => navigate(backTo)}
              variant="ghost"
              size="icon"
              className="absolute left-0 text-white hover:bg-white/10 transition-all rounded-xl"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          
          {badgeIcon && badgeText && (
            <PageBadge icon={badgeIcon} text={badgeText} variant={badgeVariant} />
          )}
        </header>

        {children}
      </div>
    </div>
  );
}

export function Meeting2Hero({ title, subtitle, badge, className }: Meeting2HeroProps) {
  return (
    <div className={cn("text-center mb-16", className)}>
      {badge && (
        <div className="inline-block mb-8">
          <div className={cn(
            "px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl animate-pulse",
            badge.variant === 'result' && "bg-gradient-to-r from-rc-secondary to-rc-primary text-white",
            badge.variant === 'new' && "bg-gradient-to-r from-emerald-400 to-teal-500 text-white",
            badge.variant === 'highlight' && "bg-rc-secondary text-rc-primary"
          )}>
            {badge.text}
          </div>
        </div>
      )}
      
      <h1 className="text-heading-1 font-bold text-white mb-6 leading-tight">
        {title}
      </h1>
      
      {subtitle && (
        <p className="text-heading-4 text-white/90 max-w-4xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

Meeting2Layout.Hero = Meeting2Hero;
export default Meeting2Layout;