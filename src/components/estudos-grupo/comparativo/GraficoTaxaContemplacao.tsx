import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricasAdministradora } from '@/hooks/useComparativoAdministradoras';
import { MetricasGrupo } from '@/hooks/useComparativoGrupos';
import { Visao } from './SeletorVisao';

type Metricas = MetricasAdministradora | MetricasGrupo;

interface GraficoTaxaContemplacaoProps {
  metricas: Metricas[];
  modo: 'administradoras' | 'grupos';
  visao: Visao;
}

const CORES = ['#1e3a8a', '#991b1b', '#065f46', '#92400e', '#581c87'];

export function GraficoTaxaContemplacao({ metricas, modo, visao }: GraficoTaxaContemplacaoProps) {
  if (metricas.length === 0) return null;

  const getNome = (m: Metricas) => {
    if ('numeroGrupo' in m) {
      return `${m.administradora} - G${m.numeroGrupo}`;
    }
    return m.administradora;
  };

  const todosOsDados = [
    {
      tipo: 'Sorteio',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.sorteio.taxa
      }), {})
    },
    {
      tipo: 'Lance Fixo I',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.lancefixoi.taxa
      }), {})
    },
    {
      tipo: 'Lance Fixo II',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.lancefixoii.taxa
      }), {})
    },
    {
      tipo: 'Lance Livre',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.lancelivre.taxa
      }), {})
    },
    {
      tipo: 'Lance Limitado',
      ...metricas.reduce((acc, m) => ({
        ...acc,
        [getNome(m)]: m.lancelimitado.taxa
      }), {})
    }
  ];

  // Aplicar filtro de visão
  const tiposVisiveis = visao === 'lancefixo'
    ? ['Sorteio', 'Lance Fixo I', 'Lance Fixo II']
    : visao === 'lancelivre'
    ? ['Lance Livre', 'Lance Limitado']
    : ['Sorteio', 'Lance Fixo I', 'Lance Fixo II', 'Lance Livre', 'Lance Limitado'];

  const data = todosOsDados.filter(item => tiposVisiveis.includes(item.tipo));

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart className="h-4 w-4 text-primary" />
              </div>
              Taxa de Contemplação por Modalidade
            </CardTitle>
            <CardDescription className="text-xs mt-3 flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-primary to-primary/40 rounded" />
              Compare visualmente o desempenho entre diferentes tipos de lance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis label={{ value: 'Taxa (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            <Legend />
            {metricas.map((m, idx) => (
              <Bar 
                key={'numeroGrupo' in m ? m.grupoId : m.administradora} 
                dataKey={getNome(m)} 
                fill={CORES[idx % CORES.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
