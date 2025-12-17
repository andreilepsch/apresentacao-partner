import React from 'react';
import { ClientProfile } from '@/types/hybridPresentation';
import { cn } from '@/lib/utils';
import { Star, TrendingUp, BarChart3, Target, CheckCircle2, UserCheck } from 'lucide-react';

interface HybridHeroProps {
  title: string | React.ReactNode;
  subtitle?: string;
  client?: ClientProfile;
  badge?: {
    text: string;
    variant?: 'result' | 'new' | 'highlight' | 'personalized' | 'default';
  };
  className?: string;
}

export function HybridHero({ title, subtitle, client, badge, className }: HybridHeroProps) {
  const getBadgeIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('consultoria')) return <UserCheck className="h-5 w-5" />;
    if (lowerText.includes('patrimônio') || lowerText.includes('patrimonio')) return <TrendingUp className="h-5 w-5" />;
    if (lowerText.includes('análise') || lowerText.includes('analise')) return <BarChart3 className="h-5 w-5" />;
    if (lowerText.includes('estratégia') || lowerText.includes('estrategia')) return <Target className="h-5 w-5" />;
    if (lowerText.includes('resultado')) return <CheckCircle2 className="h-5 w-5" />;
    return <Star className="h-5 w-5" fill="currentColor" />;
  };

  return (
    <div className={cn("text-center mb-16", className)}>
      {badge && (
        <div className="inline-block mb-8">
          <div className={cn(
            "px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl",
            badge.variant === 'result' && "text-black font-bold",
            badge.variant === 'new' && "text-black font-bold",
            badge.variant === 'highlight' && "text-black font-bold",
            badge.variant === 'personalized' && "text-black font-bold",
            badge.variant === 'default' && "text-black font-bold"
          )} style={{ 
            background: 'linear-gradient(135deg, #C9A45C, #E5C875)',
            boxShadow: '0 10px 30px rgba(201, 164, 92, 0.3)'
          }}>
            {getBadgeIcon(badge.text)}
            {badge.text}
          </div>
        </div>
      )}
      
      {client && (
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-white/20 hover:bg-white/15 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-2">Apresentação Personalizada</h3>
            <div className="text-white/90">
              <p className="text-xl font-bold text-consortium-gold">{client.nome}</p>
              <p className="text-consortium-gray">{client.idade} anos • {client.profissao}</p>
              {client.startup && <p className="text-sm text-white/70">{client.startup}</p>}
            </div>
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