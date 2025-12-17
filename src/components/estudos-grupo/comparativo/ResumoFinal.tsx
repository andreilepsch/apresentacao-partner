import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, CheckCircle2, Calendar, Star } from 'lucide-react';
import { MetricasAdministradora } from '@/hooks/useComparativoAdministradoras';
import { MetricasGrupo } from '@/hooks/useComparativoGrupos';
import { Visao } from './SeletorVisao';

type Metricas = MetricasAdministradora | MetricasGrupo;

interface ResumoFinalProps {
  metricas: Metricas[];
  modo: 'administradoras' | 'grupos';
  visao: Visao;
}

export function ResumoFinal({ metricas, modo, visao }: ResumoFinalProps) {
  if (metricas.length === 0) return null;

  const getNome = (m: Metricas) => {
    if ('numeroGrupo' in m) {
      return `${m.administradora} - Grupo ${m.numeroGrupo}`;
    }
    return m.administradora;
  };

  // Função para calcular totais baseado na visão
  const calcularTotaisPorVisao = (m: Metricas) => {
    if (visao === 'lancefixo') {
      // Soma: Sorteio + Lance Fixo I + Lance Fixo II
      return {
        total: m.sorteio.totalContemplacoesHistorico + m.lancefixoi.totalContemplacoesHistorico + m.lancefixoii.totalContemplacoesHistorico,
        taxa: (m.sorteio.taxa + m.lancefixoi.taxa + m.lancefixoii.taxa) / 3
      };
    }
    
    if (visao === 'lancelivre') {
      // Soma: Lance Livre + Lance Limitado
      return {
        total: m.lancelivre.totalContemplacoesHistorico + m.lancelimitado.totalContemplacoesHistorico,
        taxa: (m.lancelivre.taxa + m.lancelimitado.taxa) / 2
      };
    }
    
    // Visão completa: usa dados gerais
    return {
      total: m.totalContemplacoesHistorico,
      taxa: m.taxaGeral
    };
  };

  // Identificar padrões baseados na visão
  const metricasOrdenadas = useMemo(() => {
    return [...metricas].sort((a, b) => {
      const taxaA = calcularTotaisPorVisao(a).taxa;
      const taxaB = calcularTotaisPorVisao(b).taxa;
      return taxaB - taxaA;
    });
  }, [metricas, visao]);
  
  const melhorGeral = metricasOrdenadas[0];
  const maiorCrescimento = [...metricas].sort((a, b) => b.lancelivre.tendencia - a.lancelivre.tendencia)[0];
  const menorCompetição = [...metricas].sort((a, b) => a.totalOfertados - b.totalOfertados)[0];

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-background via-primary/3 to-primary/8 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-6">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Resumo Final - Totais do Período
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Calendar className="h-4 w-4" />
          <span>Análise consolidada baseada nos últimos 6 meses de dados históricos</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Tabela de Totais */}
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left py-4 px-3 font-semibold text-sm">Métrica</th>
                {metricasOrdenadas.map((m) => (
                  <th key={getNome(m)} className="text-center py-4 px-3 font-semibold text-sm">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {getNome(m)}
                    </Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50 transition-colors">
                <td className="py-3 px-3 font-medium">
                  Total Contemplações ({visao === 'lancefixo' ? 'Lance Fixo' : visao === 'lancelivre' ? 'Lance Livre' : 'Todas'})
                  <br/><span className="text-xs text-muted-foreground">(6 meses)</span>
                </td>
                {metricasOrdenadas.map((m, idx) => {
                  const { total } = calcularTotaisPorVisao(m);
                  return (
                    <td 
                      key={getNome(m)} 
                      className={`
                        text-center py-3 px-3 font-bold text-lg transition-all duration-300
                        ${idx === 0 ? 'text-primary scale-105' : ''}
                      `}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {total}
                        {idx === 0 && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b hover:bg-muted/50 transition-colors">
                <td className="py-3 px-3 font-medium">Média mensal</td>
                {metricasOrdenadas.map((m) => {
                  const { total } = calcularTotaisPorVisao(m);
                  return (
                    <td key={getNome(m)} className="text-center py-3 px-3">
                      {(total / 6).toFixed(1)}/mês
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-3 font-medium">Taxa média</td>
                {metricasOrdenadas.map((m) => {
                  const { taxa } = calcularTotaisPorVisao(m);
                  return (
                    <td key={getNome(m)} className="text-center py-3 px-3 font-semibold">
                      {taxa.toFixed(2)}%
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Conclusões e Recomendações */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Conclusões e Recomendações
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-5 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-2 border-green-200 dark:border-green-900">
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              </div>
              <p className="text-sm leading-relaxed">
                <strong>{getNome(melhorGeral)}:</strong> Melhor performance em{' '}
                {visao === 'lancefixo' ? 'Lance Fixo' : visao === 'lancelivre' ? 'Lance Livre' : 'geral'} com taxa de{' '}
                <strong>{calcularTotaisPorVisao(melhorGeral).taxa.toFixed(2)}%</strong>
                {metricasOrdenadas.length > 1 && 
                  ` (${(calcularTotaisPorVisao(melhorGeral).taxa / calcularTotaisPorVisao(metricasOrdenadas[1]).taxa).toFixed(1)}x melhor que o segundo colocado)`}
              </p>
            </div>

            {(visao === 'lancelivre' || visao === 'completa') && maiorCrescimento.lancelivre.tendencia > 0 && (
              <div className="flex items-start gap-3 p-5 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-2 border-blue-200 dark:border-blue-900">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                </div>
                <p className="text-sm leading-relaxed">
                  <strong>{getNome(maiorCrescimento)}:</strong> Crescimento de <strong>{maiorCrescimento.lancelivre.tendencia.toFixed(1)}%</strong> em lances livres, 
                  indicando tendência positiva no período
                </p>
              </div>
            )}

            <div className="flex items-start gap-3 p-5 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border-2 border-orange-200 dark:border-orange-900">
              <div className="p-2 rounded-full bg-orange-500/10">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
              </div>
              <p className="text-sm leading-relaxed">
                <strong>{getNome(menorCompetição)}:</strong> Menor competição com <strong>{menorCompetição.totalOfertados.toLocaleString('pt-BR')}</strong> cotas/mês, 
                ideal para estratégias {visao === 'lancefixo' ? 'com lances fixos' : visao === 'lancelivre' ? 'com lances livres' : 'com lances mais conservadores'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
