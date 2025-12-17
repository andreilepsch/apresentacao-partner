import React from 'react';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimulatorButtonProps {
  onClick: () => void;
  className?: string;
}

export function SimulatorButton({ onClick, className }: SimulatorButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-14 h-14 rounded-full",
        "bg-gradient-to-br from-[#C9A45C] to-[#E5C875]",
        "text-white shadow-lg",
        "hover:scale-110 hover:shadow-xl",
        "transition-all duration-300",
        "flex items-center justify-center",
        "border border-[#B78D4A]/20",
        className
      )}
      title="Simulador de Parcelas"
    >
      <Calculator className="w-6 h-6" />
    </button>
  );
}