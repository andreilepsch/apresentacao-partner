import React from 'react';
import { ClientProfile } from '@/types/hybridPresentation';
import { cn } from '@/lib/utils';
import { GoldenDivider } from './PremiumLayout';
import { Star, TrendingUp, BarChart3, Target, CheckCircle2, UserCheck } from 'lucide-react';

interface PremiumHeroProps {
  title: string | React.ReactNode;
  subtitle?: string;
  client?: ClientProfile;
  badge?: {
    text: string;
    variant?: 'result' | 'new' | 'highlight' | 'personalized' | 'default';
  };
  className?: string;
  showClient?: boolean;
}

export function PremiumHero({ 
  title, 
  subtitle, 
  client, 
  badge, 
  className,
  showClient = true 
}: PremiumHeroProps) {
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
    <div className={cn("text-center mb-16 pb-8 relative", className)}>
      {badge && (
        <div className="inline-block mb-8">
          <div 
            className="px-8 py-3 rounded-full font-bold shadow-xl border-2 border-[#C9A45C]/30 flex items-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, #C9A45C, #E5C875)',
              color: '#000000'
            }}
          >
            {getBadgeIcon(badge.text)}
            {badge.text}
          </div>
        </div>
      )}
      
      {client && showClient && (
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-white/20 hover:bg-white/15 transition-all duration-300 hover:border-[#C9A45C]/30">
            <div className="text-white/90">
              <p className="text-xl font-bold" style={{ color: '#C9A45C' }}>{client.nome}</p>
              <p style={{ color: '#BFCAC7' }}>{client.idade} anos • {client.profissao}</p>
              {client.startup && <p className="text-sm text-white/70">{client.startup}</p>}
            </div>
          </div>
        </div>
      )}
      
      <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
        {title}
      </h1>
      
      {subtitle && (
        <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
          {subtitle}
        </p>
      )}
      
      <GoldenDivider />
    </div>
  );
}

export default PremiumHero;