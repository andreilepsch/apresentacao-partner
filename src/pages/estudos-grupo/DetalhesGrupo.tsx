import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabelaLances } from '@/components/estudos-grupo/TabelaLances';
import { useGrupoDetalhes, useAnalisesMensais } from '@/hooks/useGruposConsorcio';
import { ArrowLeft, Plus, Calendar, Building2, Users, Clock, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AnalyseMensal } from '@/types/gruposConsorcio';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function DetalhesGrupo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { grupo, analises } = useGrupoDetalhes(id!);
  const { deleteAnalise } = useAnalisesMensais(id!);
  const [deleteAnaliseId, setDeleteAnaliseId] = useState<string | null>(null);

  const handleDeleteAnalise = () => {
    if (deleteAnaliseId) {
      deleteAnalise.mutate(deleteAnaliseId);
      setDeleteAnaliseId(null);
    }
  };

  if (!grupo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando grupo...</p>
        </div>
      </div>
    );
  }

  const convertAnaliseToTableData = (analise: AnalyseMensal) => ({
    sorteio: {
      ofertados: analise.sorteio_ofertados,
      contemplacoes: analise.sorteio_contemplacoes,
      percentual: analise.sorteio_percentual
    },
    lance_fixo_i: {
      ofertados: analise.lance_fixo_i_ofertados,
      contemplacoes: analise.lance_fixo_i_contemplacoes,
      percentual: analise.lance_fixo_i_percentual
    },
    lance_fixo_ii: {
      ofertados: analise.lance_fixo_ii_ofertados,
      contemplacoes: analise.lance_fixo_ii_contemplacoes,
      percentual: analise.lance_fixo_ii_percentual
    },
    lance_livre: {
      ofertados: analise.lance_livre_ofertados,
      contemplacoes: analise.lance_livre_contemplacoes,
      percentual: analise.lance_livre_percentual
    },
    lance_limitado: {
      ofertados: analise.lance_limitado_ofertados,
      contemplacoes: analise.lance_limitado_contemplacoes,
      percentual: analise.lance_limitado_percentual
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/estudos-grupo')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                {grupo.administradora}
                <Badge variant="secondary">Grupo {grupo.numero_grupo}</Badge>
              </h1>
              <p className="text-muted-foreground">
                Histórico de análises dos últimos 6 meses
              </p>
            </div>
          </div>
          <Button onClick={() => navigate(`/estudos-grupo/${id}/nova-analise`)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Análise
          </Button>
        </div>

        {/* Group Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-rc-primary" />
              Informações do Grupo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Prazo
                </div>
                <p className="text-lg font-semibold">{grupo.prazo_meses} meses</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  Capacidade
                </div>
                <p className="text-lg font-semibold">{grupo.capacidade_cotas} cotas</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  Início
                </div>
                <p className="text-lg font-semibold">
                  {format(new Date(grupo.data_inicio), 'MMM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  Fim
                </div>
                <p className="text-lg font-semibold">
                  {format(new Date(grupo.data_fim), 'MMM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Analyses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Histórico de Análises</h2>
          
          {analises && analises.length > 0 ? (
            <div className="space-y-6">
              {analises.map((analise) => (
                <Card key={analise.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-rc-primary" />
                        {analise.mes_ano}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {format(new Date(analise.data_analise), 'dd/MM/yyyy')}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/estudos-grupo/${id}/analise/${analise.id}/editar`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteAnaliseId(analise.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TabelaLances
                      data={convertAnaliseToTableData(analise)}
                      readOnly
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma análise cadastrada</h3>
                <p className="text-muted-foreground mb-4">
                  Adicione a primeira análise mensal deste grupo
                </p>
                <Button onClick={() => navigate(`/estudos-grupo/${id}/nova-analise`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Análise
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteAnaliseId} onOpenChange={() => setDeleteAnaliseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta análise mensal? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAnalise} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
