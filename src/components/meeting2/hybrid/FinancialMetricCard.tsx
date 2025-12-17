import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancialMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'highlight';
  format?: 'currency' | 'percentage' | 'number';
  className?: string;
}

export function FinancialMetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'default',
  format = 'number',
  className 
}: FinancialMetricCardProps) {
  
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(2)}%`;
      default:
        return val.toLocaleString('pt-BR');
    }
  };

  return (
    <Card className={cn(
      "bg-white/95 backdrop-blur-sm border border-white/20 hover:bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            variant === 'success' && "bg-consortium-mint text-consortium-gold",
            variant === 'warning' && "bg-consortium-mint text-consortium-gold", 
            variant === 'highlight' && "bg-consortium-mint text-consortium-gold",
            variant === 'default' && "bg-consortium-mint text-consortium-gold"
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-consortium-gray mb-1">{title}</p>
          <p className={cn(
            "text-2xl font-bold mb-1",
            variant === 'success' && "text-consortium-gold",
            variant === 'warning' && "text-consortium-gold",
            variant === 'highlight' && "text-consortium-gold", 
            variant === 'default' && "text-consortium-gold"
          )}>
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-xs text-consortium-gray">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}