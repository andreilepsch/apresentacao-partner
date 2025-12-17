import { MetricasBase, IndicadorCompetitividade } from '@/types/simulador';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HistoricalRangeDisplayProps {
  metricas: MetricasBase;
  competitividade: IndicadorCompetitividade;
  percentualLance: number;
}

export function HistoricalRangeDisplay({ 
  metricas, 
  competitividade,
  percentualLance 
}: HistoricalRangeDisplayProps) {
  const { p_min, p_med, p_max } = metricas;
  const IC = competitividade.valor;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faixa Histórica de Lances</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Mínimo: {p_min.toFixed(1)}%</span>
            <span>Mediana: {p_med.toFixed(1)}%</span>
            <span>Máximo: {p_max.toFixed(1)}%</span>
          </div>
          
          <div className="relative">
            <div className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
            
            {/* Marcador do lance do usuário */}
            <div 
              className="absolute top-0 w-1 h-6 bg-foreground -translate-y-1 transition-all duration-300 shadow-lg"
              style={{ left: `${IC * 100}%` }}
              title={`Seu lance: ${percentualLance.toFixed(1)}%`}
            />
          </div>
          
          <div className="text-center text-sm font-medium mt-2">
            Seu lance: <span className="text-lg">{percentualLance.toFixed(1)}%</span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Posição relativa:</span>
            <span className="font-medium">{(IC * 100).toFixed(0)}º percentil</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {IC < 0.33 && 'Seu lance está na faixa inferior (menos competitivo)'}
            {IC >= 0.33 && IC < 0.66 && 'Seu lance está na faixa intermediária (moderadamente competitivo)'}
            {IC >= 0.66 && 'Seu lance está na faixa superior (muito competitivo)'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
