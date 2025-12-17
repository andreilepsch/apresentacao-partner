import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGruposConsorcio } from '@/hooks/useGruposConsorcio';
import { useComparativoAdministradoras } from '@/hooks/useComparativoAdministradoras';
import { useComparativoGrupos } from '@/hooks/useComparativoGrupos';
import { ArrowLeft, BarChart3, RefreshCw, TrendingUp, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FiltroInteligente } from '@/components/estudos-grupo/comparativo/FiltroInteligente';
import { SeletorGrupos } from '@/components/estudos-grupo/comparativo/SeletorGrupos';
import { SeletorVisao, Visao } from '@/components/estudos-grupo/comparativo/SeletorVisao';
import { MetricasComparativas } from '@/components/estudos-grupo/comparativo/MetricasComparativas';
import { GraficoTaxaContemplacao } from '@/components/estudos-grupo/comparativo/GraficoTaxaContemplacao';
import { GraficoEvolucao } from '@/components/estudos-grupo/comparativo/GraficoEvolucao';
import { GraficoRadar } from '@/components/estudos-grupo/comparativo/GraficoRadar';
import { TabelaComparativa } from '@/components/estudos-grupo/comparativo/TabelaComparativa';
import { ResumoFinal } from '@/components/estudos-grupo/comparativo/ResumoFinal';
import { AnimatedSection } from '@/components/estudos-grupo/comparativo/AnimatedSection';

export default function Comparativo() {
  const navigate = useNavigate();
  const { grupos, refetch } = useGruposConsorcio();
  
  const [modoComparacao, setModoComparacao] = useState<'administradoras' | 'grupos'>('administradoras');
  const [selectedAdms, setSelectedAdms] = useState<string[]>([]);
  const [selectedGrupos, setSelectedGrupos] = useState<string[]>([]);
  const [visao, setVisao] = useState<Visao>('completa');
  const [filtrosExpanded, setFiltrosExpanded] = useState(true);
  const [gruposExpanded, setGruposExpanded] = useState(true);

  const { metricas: metricasAdm } = useComparativoAdministradoras(grupos || [], selectedAdms);
  const { metricas: metricasGrupo } = useComparativoGrupos(grupos || [], selectedGrupos);

  const metricas = modoComparacao === 'administradoras' ? metricasAdm : metricasGrupo;
  const minSelections = modoComparacao === 'administradoras' 
    ? selectedAdms.length 
    : selectedGrupos.length;

  const handleModoChange = (modo: 'administradoras' | 'grupos') => {
    setModoComparacao(modo);
    // Limpar seleção de grupos ao mudar para modo administradoras
    if (modo === 'administradoras') {
      setSelectedGrupos([]);
    }
  };

  // Auto-recolher filtros após seleção
  useEffect(() => {
    if (selectedAdms.length > 0 && filtrosExpanded) {
      const timer = setTimeout(() => setFiltrosExpanded(false), 800);
      return () => clearTimeout(timer);
    }
  }, [selectedAdms.length, filtrosExpanded]);

  // Auto-recolher seletor de grupos após seleção
  useEffect(() => {
    if (selectedGrupos.length > 0 && gruposExpanded) {
      const timer = setTimeout(() => setGruposExpanded(false), 800);
      return () => clearTimeout(timer);
    }
  }, [selectedGrupos.length, gruposExpanded]);

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-10 max-w-[1400px]">
        {/* Header Hero com gradiente sutil */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 mb-10 border border-primary/20 shadow-sm">
          <div className="flex items-start justify-between">
            {/* Lado esquerdo: Título + Descrição */}
            <div className="flex items-start gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/estudos-grupo')}
                className="mt-1 hover:bg-primary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Comparativo Inteligente
                  </h1>
                </div>
                <p className="text-muted-foreground text-sm ml-14">
                  {modoComparacao === 'administradoras' 
                    ? 'Compare o desempenho entre administradoras' 
                    : 'Compare grupos específicos de consórcio'}
                </p>
                
                {/* Badges de informação reorganizadas */}
                {metricas.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 ml-14">
                    <Badge variant="secondary" className="gap-1.5">
                      <span className="font-bold">{metricas.length}</span>
                      <span className="text-xs">
                        {modoComparacao === 'administradoras' ? 'administradoras' : 'grupos'}
                      </span>
                    </Badge>
                    <Badge variant="outline" className="gap-1.5">
                      <span className="font-bold">{metricas[0]?.mesesAnalisados || 0}</span>
                      <span className="text-xs">meses analisados</span>
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            {/* Lado direito: Botão Atualizar */}
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Filtro Inteligente */}
        <div className="mb-10">
          <FiltroInteligente
            modoComparacao={modoComparacao}
            onModoChange={handleModoChange}
            selectedAdms={selectedAdms}
            onAdmsChange={setSelectedAdms}
            isExpanded={filtrosExpanded}
            onExpandedChange={setFiltrosExpanded}
          />
        </div>

        {/* Seletor de Grupos (apenas em modo grupos) */}
        {modoComparacao === 'grupos' && (
          <div className="mb-10">
            <SeletorGrupos
              grupos={grupos || []}
              gruposSelecionados={selectedGrupos}
              administradorasFiltradas={selectedAdms}
              onChange={setSelectedGrupos}
            />
          </div>
        )}

        {/* Seletor de Visão */}
        {minSelections >= 2 && (
          <div className="mb-8">
            <SeletorVisao visao={visao} onChange={setVisao} />
          </div>
        )}

        {/* Conteúdo */}
        {minSelections === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {modoComparacao === 'administradoras' 
                  ? 'Selecione pelo menos uma administradora para começar a análise' 
                  : 'Selecione pelo menos um grupo para começar a análise'}
              </p>
            </CardContent>
          </Card>
        ) : minSelections === 1 ? (
          <Card className="border-dashed border-yellow-500/50">
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecione pelo menos 2 {modoComparacao === 'administradoras' ? 'administradoras' : 'grupos'} para ver comparações completas
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {/* Métricas Principais */}
            <AnimatedSection delay={0}>
              <MetricasComparativas metricas={metricas} modo={modoComparacao} visao={visao} />
            </AnimatedSection>

            {/* Divisor com gradiente */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="p-1.5 rounded-full bg-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
            </div>

            {/* Gráficos */}
            <AnimatedSection delay={100}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Evolução Temporal das Taxas</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GraficoTaxaContemplacao metricas={metricas} modo={modoComparacao} visao={visao} />
                <GraficoEvolucao metricas={metricas} modo={modoComparacao} visao={visao} />
              </div>
            </AnimatedSection>

            {/* Divisor com gradiente */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="p-1.5 rounded-full bg-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
            </div>

            {/* Gráfico Radar */}
            <AnimatedSection delay={200}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Análise Multidimensional</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              <GraficoRadar metricas={metricas} modo={modoComparacao} visao={visao} />
            </AnimatedSection>

            {/* Divisor com gradiente */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="p-1.5 rounded-full bg-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
            </div>

            {/* Tabela Comparativa */}
            <AnimatedSection delay={300}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Detalhamento Completo por Modalidade</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              <TabelaComparativa metricas={metricas} modo={modoComparacao} visao={visao} />
            </AnimatedSection>

            {/* Divisor com gradiente */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="p-1.5 rounded-full bg-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
            </div>

            {/* Resumo Final */}
            <AnimatedSection delay={400}>
              <ResumoFinal metricas={metricas} modo={modoComparacao} visao={visao} />
            </AnimatedSection>
          </div>
        )}
      </div>
    </div>
  );
}
