import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';

interface PreviewCardProps {
  valorCredito: number;
  duracaoCiclo: number;
  taxaRendimento: string;
  valorParcela: number;
  correcaoINCC: string;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  valorCredito,
  duracaoCiclo,
  taxaRendimento,
  valorParcela,
  correcaoINCC,
}) => {
  const { estimativaMensal, valorFinalProjetado } = useMemo(() => {
    const taxaRendMensal = parseFloat(taxaRendimento) / 100;
    const taxaCorrecaoAnual = parseFloat(correcaoINCC) / 100;
    
    // Cálculo simplificado: valor da parcela + rendimento mensal
    const rendimentoMensal = valorParcela * taxaRendMensal;
    const estimativa = valorParcela + rendimentoMensal;
    
    // Projeção final: valor do crédito com correção anual composta
    const anos = duracaoCiclo / 12;
    const valorFinal = valorCredito * Math.pow(1 + taxaCorrecaoAnual, anos);
    
    return {
      estimativaMensal: estimativa,
      valorFinalProjetado: valorFinal,
    };
  }, [valorCredito, duracaoCiclo, taxaRendimento, valorParcela, correcaoINCC]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="bg-slate-50/50 border-slate-200 shadow-sm sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Preview em Tempo Real
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>Estimativa Mensal</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(estimativaMensal)}
          </p>
        </div>
        
        <div className="h-px bg-slate-200" />
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Valor Final Projetado</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(valorFinalProjetado)}
          </p>
        </div>

        <div className="pt-2 text-xs text-muted-foreground">
          * Valores atualizados automaticamente
        </div>
      </CardContent>
    </Card>
  );
};
