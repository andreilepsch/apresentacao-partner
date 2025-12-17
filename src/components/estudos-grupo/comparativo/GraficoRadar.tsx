import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { MetricasAdministradora } from '@/hooks/useComparativoAdministradoras';
import { MetricasGrupo } from '@/hooks/useComparativoGrupos';
import { Visao } from './SeletorVisao';

type Metricas = MetricasAdministradora | MetricasGrupo;

interface GraficoRadarProps {
  metricas: Metricas[];
  modo: 'administradoras' | 'grupos';
  visao: Visao;
}

const CORES = ['#1e3a8a', '#991b1b', '#065f46', '#92400e', '#581c87'];

export function GraficoRadar({ metricas, modo, visao }: GraficoRadarProps) {
  if (metricas.length === 0) return null;

  const getNome = (m: Metricas) => {
    if ('numeroGrupo' in m) {
      return `${m.administradora} - G${m.numeroGrupo}`;
    }
    return m.administradora;
  };

  // Encontrar valores máximos para normalização
  const maxCompeticaoFixoI = Math.max(...metricas.map(m => m.lancefixoi.totalOfertados), 1);
  const maxCompeticaoFixoII = Math.max(...metricas.map(m => m.lancefixoii.totalOfertados), 1);

  const todosOsDados = [
    {
      metrica: 'Taxa Geral',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.taxaGeral
      }), {})
    },
    {
      metrica: 'Sorteio',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.sorteio.taxa
      }), {})
    },
    {
      metrica: 'Lance Fixo I',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.lancefixoi.taxa
      }), {})
    },
    {
      metrica: 'Lance Fixo II',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.lancefixoii.taxa
      }), {})
    },
    {
      metrica: 'Lance Livre',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.lancelivre.taxa
      }), {})
    },
    {
      metrica: 'Lance Limitado',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.lancelimitado.taxa
      }), {})
    },
    {
      metrica: 'Baixa Comp. Fixo I',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: maxCompeticaoFixoI > 0 
          ? ((maxCompeticaoFixoI - m.lancefixoi.totalOfertados) / maxCompeticaoFixoI) * 100
          : 0
      }), {})
    },
    {
      metrica: 'Baixa Comp. Fixo II',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: maxCompeticaoFixoII > 0 
          ? ((maxCompeticaoFixoII - m.lancefixoii.totalOfertados) / maxCompeticaoFixoII) * 100
          : 0
      }), {})
    }
  ];

  // Aplicar filtro de visão
  const metricasVisiveis = visao === 'lancefixo'
    ? ['Sorteio', 'Lance Fixo I', 'Lance Fixo II', 'Baixa Comp. Fixo I', 'Baixa Comp. Fixo II']
    : visao === 'lancelivre'
    ? ['Lance Livre', 'Lance Limitado']
    : ['Taxa Geral', 'Lance Livre', 'Lance Limitado', 'Baixa Comp. Fixo I', 'Baixa Comp. Fixo II'];

  const data = todosOsDados.filter(item => metricasVisiveis.includes(item.metrica));

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Performance Geral (Radar)</CardTitle>
        <CardDescription className="text-xs mt-3">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md border border-border/50">
            <span className="text-muted-foreground">
              Visão multidimensional comparando todas as métricas simultaneamente. Quanto maior a área preenchida, melhor o desempenho geral.
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metrica" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Legend />
            {metricas.map((m, idx) => (
              <Radar
                key={'numeroGrupo' in m ? m.grupoId : m.administradora}
                name={getNome(m)}
                dataKey={getNome(m)}
                stroke={CORES[idx % CORES.length]}
                fill={CORES[idx % CORES.length]}
                fillOpacity={0.3}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
