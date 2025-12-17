import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Users, Target, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { MetricasAdministradora } from '@/hooks/useComparativoAdministradoras';
import { MetricasGrupo } from '@/hooks/useComparativoGrupos';
import { Visao } from './SeletorVisao';

type Metricas = MetricasAdministradora | MetricasGrupo;

interface MetricasComparativasProps {
  metricas: Metricas[];
  modo: 'administradoras' | 'grupos';
  visao: Visao;
}

export function MetricasComparativas({ metricas, modo, visao }: MetricasComparativasProps) {
  if (metricas.length === 0) return null;

  const getNome = (m: Metricas) => {
    if ('administradora' in m && 'numeroGrupo' in m) {
      return `${m.administradora} - Grupo ${m.numeroGrupo}`;
    }
    return m.administradora;
  };

  const calcularMedia = (campo: (m: Metricas) => number) => {
    const soma = metricas.reduce((acc, m) => acc + campo(m), 0);
    return soma / metricas.length;
  };

  const formatarDiferenca = (valor: number, media: number) => {
    const diff = ((valor - media) / media) * 100;
    if (Math.abs(diff) < 5) return null;
    return (
      <Badge variant={diff > 0 ? "default" : "secondary"} className="text-xs gap-1">
        {diff > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        {Math.abs(diff).toFixed(0)}% {diff > 0 ? 'acima' : 'abaixo'} da média
      </Badge>
    );
  };

  // Visão Completa
  if (visao === 'completa') {
    const melhorLanceFixoI = [...metricas].sort((a, b) => b.lancefixoi.taxa - a.lancefixoi.taxa)[0];
    const melhorPerformance = melhorLanceFixoI.lancefixoi.taxa > 0.5 
      ? {
          entidade: melhorLanceFixoI,
          metrica: 'Lance Fixo I',
          taxa: melhorLanceFixoI.lancefixoi.taxa,
          subtitulo: `${melhorLanceFixoI.lancefixoi.mediaContemplacoes.toFixed(1)} contemplações/mês`
        }
      : {
          entidade: metricas[0],
          metrica: 'Taxa Geral',
          taxa: metricas[0].taxaGeral,
          subtitulo: `${metricas[0].mediaContemplacoesMensal.toFixed(1)} contemplações/mês`
        };

    const melhorLanceLivre = [...metricas].sort((a, b) => b.lancelivre.taxa - a.lancelivre.taxa)[0];
    const menorCompeticaoFixoI = [...metricas].sort((a, b) => a.lancefixoi.totalOfertados - b.lancefixoi.totalOfertados)[0];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 md:gap-8">
        <Card className="border-primary/30 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Melhor Performance
            </CardTitle>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-bold text-foreground">{getNome(melhorPerformance.entidade)}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Modalidade:</span>
                <span className="font-medium">{melhorPerformance.metrica}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxa:</span>
                <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {melhorPerformance.taxa.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Média mensal:</span>
                <span className="font-medium">{melhorPerformance.subtitulo}</span>
              </div>
            </div>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                style={{ width: `${Math.min(melhorPerformance.taxa * 10, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Melhor em Lance Livre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{getNome(melhorLanceLivre)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lance médio:</span>
                  <span className="font-medium">
                    {melhorLanceLivre.lancelivre.lanceMedio > 0 
                      ? `${melhorLanceLivre.lancelivre.lanceMedio.toFixed(1)}%` 
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tendência:</span>
                  <span className={`font-medium flex items-center gap-1 ${
                    melhorLanceLivre.lancelivre.tendencia > 0 ? 'text-green-600' : 
                    melhorLanceLivre.lancelivre.tendencia < 0 ? 'text-red-600' : ''
                  }`}>
                    {melhorLanceLivre.lancelivre.tendencia > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : melhorLanceLivre.lancelivre.tendencia < 0 ? (
                      <TrendingUp className="h-3 w-3 rotate-180" />
                    ) : (
                      <span>→</span>
                    )}
                    {melhorLanceLivre.lancelivre.tendencia !== 0 
                      ? `${melhorLanceLivre.lancelivre.tendencia > 0 ? '+' : ''}${melhorLanceLivre.lancelivre.tendencia.toFixed(1)}%`
                      : 'Estável'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {modo === 'administradoras' ? 'Grupos analisados:' : 'Meses analisados:'}
                  </span>
                  <span className="font-medium">
                    {'totalGrupos' in melhorLanceLivre 
                      ? melhorLanceLivre.totalGrupos 
                      : melhorLanceLivre.mesesAnalisados}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Menor Competição (Fixo I)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{getNome(menorCompeticaoFixoI)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total ofertados:</span>
                  <span className="font-medium">
                    {menorCompeticaoFixoI.lancefixoi.totalOfertados > 0 
                      ? Math.round(menorCompeticaoFixoI.lancefixoi.totalOfertados).toLocaleString('pt-BR')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Visão Lance Fixo
  if (visao === 'lancefixo') {
    const melhorFixoI = [...metricas].sort((a, b) => b.lancefixoi.taxa - a.lancefixoi.taxa)[0];
    const melhorFixoII = [...metricas].sort((a, b) => b.lancefixoii.taxa - a.lancefixoii.taxa)[0];
    const menorCompeticao = [...metricas].sort((a, b) => a.lancefixoi.totalOfertados - b.lancefixoi.totalOfertados)[0];
    
    const mediaFixoI = calcularMedia(m => m.lancefixoi.taxa);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 md:gap-8">
        <Card className="border-blue-500/30 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Melhor Lance Fixo I
            </CardTitle>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{getNome(melhorFixoI)}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxa:</span>
                <span className="font-bold text-primary">{melhorFixoI.lancefixoi.taxa.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Média mensal:</span>
                <span className="font-medium">{melhorFixoI.lancefixoi.mediaContemplacoes.toFixed(1)}/mês</span>
              </div>
              {formatarDiferenca(melhorFixoI.lancefixoi.taxa, mediaFixoI)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Melhor Lance Fixo II
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{getNome(melhorFixoII)}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxa:</span>
                <span className="font-bold text-primary">{melhorFixoII.lancefixoii.taxa.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Média mensal:</span>
                <span className="font-medium">{melhorFixoII.lancefixoii.mediaContemplacoes.toFixed(1)}/mês</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Menor Competição
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{getNome(menorCompeticao)}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total ofertados:</span>
                <span className="font-medium">
                  {Math.round(menorCompeticao.lancefixoi.totalOfertados).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Visão Lance Livre
  const melhorLivre = [...metricas].sort((a, b) => b.lancelivre.taxa - a.lancelivre.taxa)[0];
  const melhorLimitado = [...metricas].sort((a, b) => b.lancelimitado.taxa - a.lancelimitado.taxa)[0];
  const maiorCrescimento = [...metricas].sort((a, b) => b.lancelivre.tendencia - a.lancelivre.tendencia)[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 md:gap-8">
      <Card className="border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Melhor Lance Livre
          </CardTitle>
          <Trophy className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{getNome(melhorLivre)}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa:</span>
              <span className="font-bold text-primary">{melhorLivre.lancelivre.taxa.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lance médio:</span>
              <span className="font-medium">
                {melhorLivre.lancelivre.lanceMedio > 0 ? `${melhorLivre.lancelivre.lanceMedio.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Melhor Lance Limitado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{getNome(melhorLimitado)}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa:</span>
              <span className="font-bold text-primary">{melhorLimitado.lancelimitado.taxa.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lance médio:</span>
              <span className="font-medium">
                {melhorLimitado.lancelimitado.lanceMedio > 0 ? `${melhorLimitado.lancelimitado.lanceMedio.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Maior Crescimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{getNome(maiorCrescimento)}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tendência:</span>
              <span className={`font-bold ${maiorCrescimento.lancelivre.tendencia > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {maiorCrescimento.lancelivre.tendencia > 0 ? '+' : ''}{maiorCrescimento.lancelivre.tendencia.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

}
