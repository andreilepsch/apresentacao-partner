import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, CreditCard, Users, PiggyBank, BarChart3, ArrowRightLeft } from 'lucide-react';

interface DynamicStrategyHeaderProps {
  strategy: string;
  className?: string;
}

const getStrategyIcon = (strategy: string) => {
  if (strategy.includes('Poupança')) return PiggyBank;
  if (strategy.includes('CDI')) return BarChart3;
  if (strategy.includes('Híbrido')) return ArrowRightLeft;
  return BarChart3;
};

const getStrategyComponents = (strategy: string) => {
  const components = [
    { icon: Building2, label: 'Imóvel', description: 'Valorização garantida' },
    { icon: CreditCard, label: 'Consórcio', description: 'Sem juros abusivos' },
    { icon: Users, label: 'Airbnb', description: 'Alta rentabilidade' }
  ];

  if (strategy.includes('Poupança')) {
    components.push({ icon: PiggyBank, label: 'Poupança', description: 'Segurança total' });
  }
  
  if (strategy.includes('CDI')) {
    components.push({ icon: BarChart3, label: 'CDI', description: 'Rentabilidade superior' });
  }
  
  if (strategy.includes('Híbrido')) {
    components.push({ icon: PiggyBank, label: 'Poupança', description: 'Segurança' });
    components.push({ icon: BarChart3, label: 'CDI', description: 'Rentabilidade' });
  }

  return components;
};

export function DynamicStrategyHeader({ strategy, className }: DynamicStrategyHeaderProps) {
  const components = getStrategyComponents(strategy);
  
  return (
    <Card className={`bg-white/95 backdrop-blur-sm border border-white/20 ${className}`}>
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
            {components.map((component, index) => (
              <React.Fragment key={component.label}>
                <div className="w-16 h-16 bg-rc-accent rounded-full flex items-center justify-center">
                  <component.icon className="h-8 w-8 text-rc-primary" />
                </div>
                {index < components.length - 1 && (
                  <div className="text-4xl text-gray-300">+</div>
                )}
              </React.Fragment>
            ))}
          </div>
          <h3 className="text-2xl font-bold text-rc-primary">{strategy}</h3>
        </div>
        
        <div className={`grid gap-6 ${components.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {components.map((component) => (
            <div key={component.label} className="text-center p-6 border border-rc-primary/20 rounded-2xl">
              <component.icon className="h-10 w-10 mx-auto mb-4 text-rc-primary" />
              <h4 className="font-bold text-rc-primary mb-2">{component.label}</h4>
              <p className="text-sm text-gray-600">{component.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}