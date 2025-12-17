import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumLayoutProps {
  children: React.ReactNode;
  backTo?: string;
  className?: string;
}

interface GoldenDividerProps {
  className?: string;
}

export function PremiumLayout({ children, backTo, className }: PremiumLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#163B36' }}>
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      
      <div className={cn("relative z-10 max-w-7xl mx-auto px-6 py-8", className)}>
        {/* Header */}
        <header className="relative flex items-center justify-center mb-12">
          {backTo && (
            <Button
              onClick={() => navigate(backTo)}
              variant="ghost"
              size="icon"
              className="absolute left-0 text-white hover:bg-white/10 transition-all rounded-xl group"
            >
              <ArrowLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </Button>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}

export function GoldenDivider({ className }: GoldenDividerProps) {
  return (
    <div 
      className={cn("w-32 h-0.5 mx-auto", className)}
      style={{ background: 'linear-gradient(90deg, #C9A45C, #E5C875, #C9A45C)' }}
    />
  );
}

export default PremiumLayout;