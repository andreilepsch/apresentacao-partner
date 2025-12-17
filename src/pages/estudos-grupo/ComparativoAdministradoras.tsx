import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGruposConsorcio } from '@/hooks/useGruposConsorcio';
import { useComparativoAdministradoras } from '@/hooks/useComparativoAdministradoras';
import { ArrowLeft, BarChart3, CheckCircle2, RefreshCw } from 'lucide-react';
import { ADMINISTRADORAS } from '@/types/gruposConsorcio';
import { SeletorVisao, Visao } from '@/components/estudos-grupo/comparativo/SeletorVisao';
import { MetricasComparativas } from '@/components/estudos-grupo/comparativo/MetricasComparativas';
import { GraficoTaxaContemplacao } from '@/components/estudos-grupo/comparativo/GraficoTaxaContemplacao';
import { GraficoEvolucao } from '@/components/estudos-grupo/comparativo/GraficoEvolucao';
import { GraficoRadar } from '@/components/estudos-grupo/comparativo/GraficoRadar';
import { TabelaComparativa } from '@/components/estudos-grupo/comparativo/TabelaComparativa';
import { ResumoFinal } from '@/components/estudos-grupo/comparativo/ResumoFinal';

export default function ComparativoAdministradoras() {
  const navigate = useNavigate();
  const { grupos, refetch } = useGruposConsorcio();
  const [selectedAdms, setSelectedAdms] = useState<string[]>([]);
  const [visao, setVisao] = useState<Visao>('completa');

  const { metricas } = useComparativoAdministradoras(grupos || [], selectedAdms);

  const toggleAdministradora = (adm: string) => {
    setSelectedAdms(prev => 
      prev.includes(adm) 
        ? prev.filter(a => a !== adm)
        : [...prev, adm]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/estudos-grupo')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-rc-primary" />
              Comparativo Inteligente de Administradoras
            </h1>
            <p className="text-muted-foreground">
              Selecione pelo menos 2 administradoras para análise comparativa
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Seleção de Administradoras */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Selecione as Administradoras para Comparar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ADMINISTRADORAS.map((adm) => (
                <Badge
                  key={adm}
                  variant={selectedAdms.includes(adm) ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm hover:scale-105 transition-transform"
                  onClick={() => toggleAdministradora(adm)}
                >
                  {selectedAdms.includes(adm) && (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  )}
                  {adm}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedAdms.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecione pelo menos uma administradora para começar a análise
              </p>
            </CardContent>
          </Card>
        ) : selectedAdms.length === 1 ? (
          <Card className="border-dashed border-yellow-500/50">
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecione pelo menos 2 administradoras para ver comparações completas
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Seletor de Visão */}
            <SeletorVisao visao={visao} onChange={setVisao} />

            {/* Métricas Principais */}
            <MetricasComparativas metricas={metricas} modo="administradoras" visao={visao} />

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraficoTaxaContemplacao metricas={metricas} modo="administradoras" visao={visao} />
              <GraficoEvolucao metricas={metricas} modo="administradoras" visao={visao} />
            </div>

            {/* Gráfico Radar */}
            <GraficoRadar metricas={metricas} modo="administradoras" visao={visao} />

            {/* Tabela Comparativa */}
            <TabelaComparativa metricas={metricas} modo="administradoras" visao={visao} />

            {/* Resumo Final */}
            <ResumoFinal metricas={metricas} modo="administradoras" visao={visao} />
          </div>
        )}
      </div>
    </div>
  );
}
