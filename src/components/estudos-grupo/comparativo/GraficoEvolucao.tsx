import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricasAdministradora } from '@/hooks/useComparativoAdministradoras';
import { MetricasGrupo } from '@/hooks/useComparativoGrupos';
import { Visao } from './SeletorVisao';
import { Info, TrendingUp } from 'lucide-react';

type Metricas = MetricasAdministradora | MetricasGrupo;

interface GraficoEvolucaoProps {
  metricas: Metricas[];
  modo: 'administradoras' | 'grupos';
  visao: Visao;
}

const CORES = ['#1e3a8a', '#991b1b', '#065f46', '#92400e', '#581c87'];

export function GraficoEvolucao({ metricas, modo, visao }: GraficoEvolucaoProps) {
  if (metricas.length === 0 || metricas.every(m => m.evolucao.length === 0)) return null;

  const getNome = (m: Metricas) => {
    if ('numeroGrupo' in m) {
      return `${m.administradora} - G${m.numeroGrupo}`;
    }
    return m.administradora;
  };

  // Combinar dados de evolução
  const todosMeses = [...new Set(metricas.flatMap(m => m.evolucao.map(e => e.mes)))];
  
  const data = todosMeses.map(mes => {
    const ponto: any = { mes };
    metricas.forEach(m => {
      const evolucaoMes = m.evolucao.find(e => e.mes === mes);
      ponto[getNome(m)] = evolucaoMes ? evolucaoMes.taxa : null;
    });
    return ponto;
  });

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Evolução da Taxa de Contemplação</CardTitle>
        <CardDescription className="text-xs mt-3">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md border border-border/50">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">
              Acompanhe a evolução mês a mês. Curvas ascendentes indicam melhoria consistente.
            </span>
          </div>
        </CardDescription>
        {visao !== 'completa' && (
          <Badge variant="outline" className="mt-2 text-xs flex items-center gap-1 w-fit">
            <Info className="h-3 w-3" />
            Este gráfico sempre mostra a taxa geral (todas as modalidades)
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis label={{ value: 'Taxa (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number | null) => value ? `${value.toFixed(1)}%` : 'N/A'} />
            <Legend />
            {metricas.map((m, idx) => (
              <Line 
                key={'numeroGrupo' in m ? m.grupoId : m.administradora}
                type="monotone"
                dataKey={getNome(m)}
                stroke={CORES[idx % CORES.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
