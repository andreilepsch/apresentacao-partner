import { ResultadoSimulacao } from '@/types/simulador';
import { TIPOS_LANCE_LABELS } from '@/types/simulador';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompetitividadeIndicator } from './CompetitividadeIndicator';

interface SummaryCardProps {
  resultado: ResultadoSimulacao;
}

export function SummaryCard({ resultado }: SummaryCardProps) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatPercent = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'percent', 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value / 100);

  const getConfiancaBadge = () => {
    const { confianca } = resultado.metricas;
    const variant = confianca === 'alta' ? 'default' : confianca === 'media' ? 'secondary' : 'outline';
    const label = confianca === 'alta' ? 'Alta' : confianca === 'media' ? 'Média' : 'Baixa';
    return <Badge variant={variant}>Confiança: {label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da Simulação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Administradora</p>
            <p className="font-medium">{resultado.grupo.administradora}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Grupo</p>
            <p className="font-medium">{resultado.grupo.numero_grupo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prazo</p>
            <p className="font-medium">{resultado.grupo.prazo_meses} meses</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Capacidade</p>
            <p className="font-medium">{resultado.grupo.capacidade_cotas} cotas</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Tipo de Lance</p>
            <p className="font-medium">{TIPOS_LANCE_LABELS[resultado.params.tipoLance]}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor da Carta</p>
            <p className="font-medium">{formatCurrency(resultado.params.valorCarta)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Seu Lance</p>
            <p className="font-medium text-lg">{resultado.params.percentualLance.toFixed(1)}%</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          {/* Modelo usado */}
          {resultado.cenarios[0]?.modelo_usado && (
            <div className={`p-3 rounded-lg ${
              resultado.cenarios[0].modelo_usado === 'fila' ? 'bg-blue-50 dark:bg-blue-950/20' :
              resultado.cenarios[0].modelo_usado === 'leilao' ? 'bg-green-50 dark:bg-green-950/20' :
              'bg-yellow-50 dark:bg-yellow-950/20'
            }`}>
              <p className="text-sm font-semibold">
                Modelo: {
                  resultado.cenarios[0].modelo_usado === 'fila' ? 'Fila Determinística' :
                  resultado.cenarios[0].modelo_usado === 'leilao' ? 'Leilão Competitivo' :
                  'Loteria Pura'
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {resultado.cenarios[0].modelo_usado === 'fila' 
                  ? 'Lance fixo: contemplação por ordem de entrada (FIFO com decaimento de participantes)'
                  : resultado.cenarios[0].modelo_usado === 'leilao'
                  ? 'Lance livre/limitado: quanto maior o lance, maior a chance de contemplação'
                  : 'Sorteio: todos têm a mesma chance (probabilidade uniforme com decaimento)'}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">Taxa Média de Contemplação</p>
            <p className="font-medium">{formatPercent(resultado.metricas.taxa_media_contemplacao * 100)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Janela Histórica</p>
            <p className="font-medium">
              {resultado.metricas.meses_com_contemplacao} análises utilizadas 
              (últimos {resultado.params.janelaHistorica} meses)
            </p>
          </div>
          
          {/* Competitividade (apenas para leilão) */}
          {resultado.cenarios[0]?.modelo_usado === 'leilao' && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Competitividade do Lance</p>
              <CompetitividadeIndicator competitividade={resultado.competitividade} />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {getConfiancaBadge()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
