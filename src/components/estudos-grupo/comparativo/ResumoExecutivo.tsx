import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Trophy, Users } from 'lucide-react';
import { MetricasAdministradora } from '@/hooks/useComparativoAdministradoras';
import { MetricasGrupo } from '@/hooks/useComparativoGrupos';

type Metricas = MetricasAdministradora | MetricasGrupo;

interface ResumoExecutivoProps {
  metricas: Metricas[];
  modo: 'administradoras' | 'grupos';
}

export function ResumoExecutivo({ metricas, modo }: ResumoExecutivoProps) {
  if (metricas.length === 0) return null;

  const melhorTaxa = metricas[0];
  const menorCompetição = [...metricas].sort((a, b) => a.totalOfertados - b.totalOfertados)[0];
  const maiorVolume = [...metricas].sort((a, b) => b.totalContemplacoesHistorico - a.totalContemplacoesHistorico)[0];

  const getNome = (m: Metricas) => {
    if ('numeroGrupo' in m) {
      return `${m.administradora} - ${m.numeroGrupo}`;
    }
    return m.administradora;
  };

  // Calcular período de análise (últimos 6 meses)
  const dataAtual = new Date();
  const mesAtual = dataAtual.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  const dataInicio = new Date(dataAtual);
  dataInicio.setMonth(dataInicio.getMonth() - 5);
  const mesInicio = dataInicio.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Resumo Executivo
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              📊 Período de análise: {mesInicio} - {mesAtual}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {metricas.length} {modo === 'administradoras' ? 'administradoras' : 'grupos'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Melhor Taxa */}
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-1">🎯 Melhor Taxa Geral</p>
                <p className="font-bold text-lg truncate">{getNome(melhorTaxa)}</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {melhorTaxa.taxaGeral.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {melhorTaxa.mediaContemplacoesMensal.toFixed(1)} contemplações/mês
                </p>
              </div>
            </div>
          </div>

          {/* Maior Volume */}
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-1">📈 Maior Volume</p>
                <p className="font-bold text-lg truncate">{getNome(maiorVolume)}</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {maiorVolume.totalContemplacoesHistorico}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  contemplações em 6 meses
                </p>
              </div>
            </div>
          </div>

          {/* Menor Competição */}
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-1">👥 Menor Competição</p>
                <p className="font-bold text-lg truncate">{getNome(menorCompetição)}</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {menorCompetição.totalOfertados.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  cotas ofertadas/mês
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
