import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TabelaLances } from '@/components/estudos-grupo/TabelaLances';
import { useGrupoDetalhes, useAnalisesMensais } from '@/hooks/useGruposConsorcio';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MonthYearCalendar } from '@/components/ui/month-year-calendar';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function EditarAnalise() {
  const navigate = useNavigate();
  const { grupoId, analiseId } = useParams<{ grupoId: string; analiseId: string }>();
  const { grupo } = useGrupoDetalhes(grupoId!);
  const { updateAnalise } = useAnalisesMensais(grupoId!);
  
  const [dataAnalise, setDataAnalise] = useState<Date>(new Date());
  const [lanceData, setLanceData] = useState({
    sorteio_ofertados: 0,
    sorteio_contemplacoes: 0,
    sorteio_percentual: 0,
    lance_fixo_i_ofertados: 0,
    lance_fixo_i_contemplacoes: 0,
    lance_fixo_i_percentual: 0,
    lance_fixo_ii_ofertados: 0,
    lance_fixo_ii_contemplacoes: 0,
    lance_fixo_ii_percentual: 0,
    lance_livre_ofertados: 0,
    lance_livre_contemplacoes: 0,
    lance_livre_percentual: 0,
    lance_limitado_ofertados: 0,
    lance_limitado_contemplacoes: 0,
    lance_limitado_percentual: 0
  });

  // Fetch existing analysis
  const { data: analise } = useQuery({
    queryKey: ['analise', analiseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analises_mensais')
        .select('*')
        .eq('id', analiseId!)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!analiseId
  });

  // Pre-fill form with existing data
  useEffect(() => {
    if (analise) {
      setDataAnalise(new Date(analise.data_analise));
      setLanceData({
        sorteio_ofertados: analise.sorteio_ofertados,
        sorteio_contemplacoes: analise.sorteio_contemplacoes,
        sorteio_percentual: analise.sorteio_percentual,
        lance_fixo_i_ofertados: analise.lance_fixo_i_ofertados,
        lance_fixo_i_contemplacoes: analise.lance_fixo_i_contemplacoes,
        lance_fixo_i_percentual: analise.lance_fixo_i_percentual,
        lance_fixo_ii_ofertados: analise.lance_fixo_ii_ofertados,
        lance_fixo_ii_contemplacoes: analise.lance_fixo_ii_contemplacoes,
        lance_fixo_ii_percentual: analise.lance_fixo_ii_percentual,
        lance_livre_ofertados: analise.lance_livre_ofertados,
        lance_livre_contemplacoes: analise.lance_livre_contemplacoes,
        lance_livre_percentual: analise.lance_livre_percentual,
        lance_limitado_ofertados: analise.lance_limitado_ofertados,
        lance_limitado_contemplacoes: analise.lance_limitado_contemplacoes,
        lance_limitado_percentual: analise.lance_limitado_percentual
      });
    }
  }, [analise]);

  const handleChange = (field: string, value: number) => {
    setLanceData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const mesAno = format(dataAnalise, 'MMMM yyyy', { locale: ptBR });
    
    updateAnalise.mutate({
      id: analiseId!,
      grupo_id: grupoId!,
      mes_ano: mesAno,
      data_analise: format(dataAnalise, 'yyyy-MM-dd'),
      ...lanceData
    }, {
      onSuccess: () => {
        navigate(`/estudos-grupo/${grupoId}`);
      }
    });
  };

  if (!grupo || !analise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando análise...</p>
      </div>
    );
  }

  const tableData = {
    sorteio: {
      ofertados: lanceData.sorteio_ofertados,
      contemplacoes: lanceData.sorteio_contemplacoes,
      percentual: lanceData.sorteio_percentual
    },
    lance_fixo_i: {
      ofertados: lanceData.lance_fixo_i_ofertados,
      contemplacoes: lanceData.lance_fixo_i_contemplacoes,
      percentual: lanceData.lance_fixo_i_percentual
    },
    lance_fixo_ii: {
      ofertados: lanceData.lance_fixo_ii_ofertados,
      contemplacoes: lanceData.lance_fixo_ii_contemplacoes,
      percentual: lanceData.lance_fixo_ii_percentual
    },
    lance_livre: {
      ofertados: lanceData.lance_livre_ofertados,
      contemplacoes: lanceData.lance_livre_contemplacoes,
      percentual: lanceData.lance_livre_percentual
    },
    lance_limitado: {
      ofertados: lanceData.lance_limitado_ofertados,
      contemplacoes: lanceData.lance_limitado_contemplacoes,
      percentual: lanceData.lance_limitado_percentual
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/estudos-grupo/${grupoId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Análise Mensal</h1>
            <p className="text-muted-foreground">
              {grupo.administradora} - Grupo {grupo.numero_grupo}
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mês da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label>Data da Análise:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[240px] justify-start text-left font-normal',
                      !dataAnalise && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dataAnalise ? format(dataAnalise, 'PPP', { locale: ptBR }) : 'Selecione...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <MonthYearCalendar
                    mode="single"
                    selected={dataAnalise}
                    onSelect={(date) => date && setDataAnalise(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabela de Lances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <TabelaLances
              data={tableData}
              onChange={handleChange}
            />
            
            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/estudos-grupo/${grupoId}`)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={updateAnalise.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateAnalise.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
