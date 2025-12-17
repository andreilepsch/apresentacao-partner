import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketComparison } from '@/types/hybridPresentation';
import { TrendingUp, CheckCircle, XCircle, Target } from 'lucide-react';

interface StrategicComparisonProps {
  comparisons: MarketComparison[];
  className?: string;
}

export function StrategicComparison({ comparisons, className }: StrategicComparisonProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'Airbnb': return 'default';
      case 'Aluguel Tradicional': return 'secondary';
      case 'Renda Fixa': return 'outline';
      default: return 'outline';
    }
  };

  const getCardStyle = (tipo: string) => {
    if (tipo === 'Airbnb') {
      return "border-2 border-rc-primary bg-gradient-to-br from-rc-accent to-white shadow-xl";
    }
    return "border border-gray-200 bg-white";
  };

  const getBestOption = () => {
    return comparisons.reduce((best, current) => 
      current.rentabilidadeAnual > best.rentabilidadeAnual ? current : best
    );
  };

  const bestOption = getBestOption();

  return (
    <div className={className}>
      <Card className="bg-white/95 backdrop-blur-sm border border-white/20 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-rc-primary flex items-center gap-3">
            <Target className="h-8 w-8" />
            Análise Comparativa de Estratégias
          </CardTitle>
          <p className="text-gray-600">
            Compare diferentes opções de investimento e suas rentabilidades
          </p>
        </CardHeader>
      </Card>

      {/* Cards de comparação */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {comparisons.map((comparison) => (
          <Card key={comparison.tipo} className={getCardStyle(comparison.tipo)}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg">{comparison.tipo}</CardTitle>
                <Badge variant={getBadgeVariant(comparison.tipo)}>
                  {comparison.tipo === bestOption.tipo ? '🏆 Melhor' : 'Opção'}
                </Badge>
              </div>
              {comparison.tipo === bestOption.tipo && (
                <div className="bg-rc-primary/10 border border-rc-primary/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-rc-primary font-semibold text-sm">
                    <TrendingUp className="h-4 w-4" />
                    ESTRATÉGIA RECOMENDADA
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Métricas principais */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-rc-primary">
                    {comparison.rentabilidadeAnual.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Rentabilidade/ano</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-rc-primary">
                    {formatCurrency(comparison.rendaMensal)}
                  </div>
                  <div className="text-xs text-gray-600">Renda/mês</div>
                </div>
              </div>

              {/* Vantagens */}
              <div>
                <h5 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Vantagens
                </h5>
                <ul className="space-y-1">
                  {comparison.vantagens.map((vantagem, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                      {vantagem}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Desvantagens */}
              <div>
                <h5 className="font-semibold text-red-700 mb-2 flex items-center gap-1">
                  <XCircle className="h-4 w-4" />
                  Desvantagens
                </h5>
                <ul className="space-y-1">
                  {comparison.desvantagens.map((desvantagem, index) => (
                    <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                      {desvantagem}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo comparativo */}
      <Card className="bg-gradient-to-r from-rc-primary to-rc-secondary text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">
              🏆 {bestOption.tipo} - Estratégia Vencedora
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{bestOption.rentabilidadeAnual.toFixed(1)}%</div>
                <div className="text-white/80">Rentabilidade Anual</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(bestOption.rendaMensal)}</div>
                <div className="text-white/80">Renda Mensal</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(bestOption.rendaMensal * 12)}
                </div>
                <div className="text-white/80">Renda Anual</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}