import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabelaLances } from '@/components/estudos-grupo/TabelaLances';
import { useGrupoDetalhes, useAnalisesMensais } from '@/hooks/useGruposConsorcio';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export default function NovaAnalise() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { grupo } = useGrupoDetalhes(id!);
  const { createAnalise } = useAnalisesMensais(id!);
  
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

  const handleChange = (field: string, value: number) => {
    setLanceData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const mesAno = format(dataAnalise, 'MMMM yyyy', { locale: ptBR });
    
    createAnalise.mutate({
      grupo_id: id!,
      mes_ano: mesAno,
      data_analise: format(dataAnalise, 'yyyy-MM-dd'),
      ...lanceData
    }, {
      onSuccess: () => {
        navigate(`/estudos-grupo/${id}`);
      }
    });
  };

  if (!grupo) return null;

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
            onClick={() => navigate(`/estudos-grupo/${id}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nova Análise Mensal</h1>
            <p className="text-muted-foreground">
              {grupo.administradora} - Grupo {grupo.numero_grupo}
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selecione o Mês da Análise</CardTitle>
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
                  <CalendarComponent
                    mode="single"
                    selected={dataAnalise}
                    onSelect={(date) => date && setDataAnalise(date)}
                    initialFocus
                    className="pointer-events-auto"
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
                onClick={() => navigate(`/estudos-grupo/${id}`)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={createAnalise.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {createAnalise.isPending ? 'Salvando...' : 'Salvar Análise'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
