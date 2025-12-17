import { useMemo } from 'react';
import { Cenario } from '@/types/simulador';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ScatterChart, ZAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineChartProps {
  cenarios: Cenario[];
  prazo_meses: number;
  percentualLance: number;
  faixaHistorica: { min: number; med: number; max: number };
  competitividade: string;
}

export function TimelineChart({ 
  cenarios, 
  prazo_meses, 
  percentualLance,
  faixaHistorica,
  competitividade
}: TimelineChartProps) {
  // Criar pontos da linha do tempo (um a cada 3 meses para não poluir)
  const timelinePoints = useMemo(() => {
    const points = [];
    for (let mes = 1; mes <= prazo_meses; mes += 3) {
      points.push({ mes, value: 1, type: 'timeline' });
    }
    return points;
  }, [prazo_meses]);

  const scatterData = useMemo(() => {
    return cenarios.map(c => ({
      mes: c.mes_estimado,
      value: 1, // Centralizar verticalmente
      nome: c.nome,
      probabilidade: c.probabilidade,
      cor: c.cor,
    }));
  }, [cenarios]);

  // Ajustar domínio do eixo X dinamicamente
  const minMes = Math.min(...cenarios.map(c => c.mes_estimado), 0);
  const maxMes = Math.max(...cenarios.map(c => c.mes_estimado), prazo_meses);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    const modeloUsado = cenarios[0]?.modelo_usado || 'leilao';

    return (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
        <p className="font-semibold mb-2">{data.nome}</p>
        <p className="text-sm text-muted-foreground">Mês provável: {data.mes}</p>
        
        {modeloUsado === 'leilao' && (
          <>
            <p className="text-sm text-muted-foreground">Seu lance: {percentualLance.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">
              Faixa histórica: {faixaHistorica.min.toFixed(1)}% | {faixaHistorica.med.toFixed(1)}% | {faixaHistorica.max.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Competitividade: {competitividade}</p>
          </>
        )}
        
        {modeloUsado === 'fila' && (
          <p className="text-sm text-muted-foreground">Modelo: Fila por ordem de entrada (FIFO)</p>
        )}
        
        {modeloUsado === 'sorteio' && (
          <p className="text-sm text-muted-foreground">Modelo: Probabilidade uniforme (loteria)</p>
        )}
        
        <p className="text-sm text-muted-foreground mt-1">
          <span className="font-medium">Probabilidade:</span> {data.probabilidade}
        </p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeção de Contemplação</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number" 
              dataKey="mes" 
              domain={[Math.max(0, minMes - 10), Math.min(prazo_meses, maxMes + 10)]}
              label={{ value: 'Meses do Ciclo', position: 'insideBottom', offset: -10 }}
            />
            <YAxis type="number" hide domain={[0, 2]} />
            <ZAxis range={[50, 400]} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Linha do tempo (pontos pequenos cinzas) */}
            <Scatter 
              name="Timeline" 
              data={timelinePoints} 
              fill="#e5e7eb" 
              shape="circle"
            />
            
            {/* Cenários (pontos grandes coloridos) */}
            <Scatter
              name="Cenários"
              data={scatterData}
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={15}
                      fill={payload.cor}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                    <text
                      x={cx}
                      y={cy - 25}
                      textAnchor="middle"
                      fill="hsl(var(--foreground))"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {payload.nome}
                    </text>
                  </g>
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>

        {/* Legenda */}
        <div className="flex items-center justify-center gap-6 mt-4">
          {cenarios.map((c) => (
            <div key={c.nome} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white" 
                style={{ backgroundColor: c.cor }}
              />
              <span className="text-sm">
                {c.nome} ({c.probabilidade} de chance)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
