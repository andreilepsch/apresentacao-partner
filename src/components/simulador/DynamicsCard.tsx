import { DadosDinamicos } from '@/types/simulador';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface DynamicsCardProps {
  dinamica: DadosDinamicos;
  tipo: 'fila' | 'sorteio';
}

export function DynamicsCard({ dinamica, tipo }: DynamicsCardProps) {
  const mediaContemplacoes = dinamica.contemplacoes_historico.length > 0
    ? dinamica.contemplacoes_historico.reduce((sum, c) => sum + c, 0) / dinamica.contemplacoes_historico.length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {tipo === 'fila' ? 'Dinâmica da Fila' : 'Dinâmica do Sorteio'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Participantes Atuais</p>
            <p className="text-2xl font-bold">{dinamica.participantes_atual}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Contemplações/Mês</p>
            <p className="text-2xl font-bold">{mediaContemplacoes.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Taxa de Saída</p>
            <p className="text-lg">{dinamica.taxa_saida_mensal.toFixed(1)}/mês</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Volatilidade</p>
            <p className="text-lg">±{dinamica.volatilidade.toFixed(0)}</p>
          </div>
        </div>
        
        {tipo === 'fila' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Como o percentual é fixo (igual para todos), a contemplação 
              funciona por <strong>ordem de entrada</strong> no grupo (FIFO).
            </AlertDescription>
          </Alert>
        )}
        
        {tipo === 'sorteio' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Todos têm a mesma chance. A probabilidade individual aumenta 
              conforme participantes são contemplados (grupo menor = mais chance).
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
