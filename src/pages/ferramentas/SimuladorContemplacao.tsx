import { useState } from 'react';
import { SimulacaoParams } from '@/types/simulador';
import { useSimulacao } from '@/hooks/useSimuladorContemplacao';
import { InputPanel } from '@/components/simulador/InputPanel';
import { TimelineChart } from '@/components/simulador/TimelineChart';
import { SummaryCard } from '@/components/simulador/SummaryCard';
import { HistoricalRangeDisplay } from '@/components/simulador/HistoricalRangeDisplay';
import { DynamicsCard } from '@/components/simulador/DynamicsCard';
import { LegalDisclaimer } from '@/components/simulador/LegalDisclaimer';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import PageBadge from '@/components/common/PageBadge';
import { Calculator } from 'lucide-react';

export default function SimuladorContemplacao() {
  const [params, setParams] = useState<SimulacaoParams | null>(null);
  const { data: resultado, isLoading, error } = useSimulacao(params);

  const handleSimulate = (newParams: SimulacaoParams) => {
    setParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <PageBadge icon={Calculator} text="Ferramenta Estratégica" />
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
            Simulador de Data Provável de Contemplação
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Utilize dados estatísticos históricos para estimar cenários prováveis de contemplação 
            por administradora, grupo e tipo de lance.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel (Left) */}
          <div className="lg:col-span-1">
            <InputPanel onSimulate={handleSimulate} isSimulating={isLoading} />
          </div>

          {/* Results (Right) */}
          <div className="lg:col-span-2 space-y-6">
            {!params && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Aguardando Simulação</AlertTitle>
                <AlertDescription>
                  Preencha os parâmetros à esquerda e clique em "Simular" para visualizar os cenários de contemplação.
                </AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="space-y-6">
                <Skeleton className="h-[400px] w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-[400px] w-full" />
                  <Skeleton className="h-[400px] w-full" />
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro na Simulação</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : 'Ocorreu um erro ao processar a simulação. Tente novamente.'}
                </AlertDescription>
              </Alert>
            )}

            {resultado && !isLoading && (() => {
              const modeloUsado = resultado.cenarios[0]?.modelo_usado || 'leilao';
              const ehLeilao = modeloUsado === 'leilao';
              
              return (
                <>
                  {/* Timeline Chart */}
                  <TimelineChart
                    cenarios={resultado.cenarios}
                    prazo_meses={resultado.grupo.prazo_meses}
                    percentualLance={resultado.params.percentualLance || resultado.metricas.p_med}
                    faixaHistorica={{
                      min: resultado.metricas.p_min,
                      med: resultado.metricas.p_med,
                      max: resultado.metricas.p_max,
                    }}
                    competitividade={resultado.competitividade.nivel}
                  />

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SummaryCard resultado={resultado} />
                    
                    {/* Condicional: HistoricalRangeDisplay apenas para leilão */}
                    {ehLeilao ? (
                      <HistoricalRangeDisplay
                        metricas={resultado.metricas}
                        competitividade={resultado.competitividade}
                        percentualLance={resultado.params.percentualLance || 0}
                      />
                    ) : (
                      <DynamicsCard
                        dinamica={resultado.dinamica}
                        tipo={modeloUsado === 'fila' ? 'fila' : 'sorteio'}
                      />
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <LegalDisclaimer />
      </div>
    </div>
  );
}
