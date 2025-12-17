import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GrupoCard } from '@/components/estudos-grupo/GrupoCard';
import { FiltrosGrupos } from '@/components/estudos-grupo/FiltrosGrupos';
import { useGruposConsorcio } from '@/hooks/useGruposConsorcio';
import { Plus, ArrowLeft, BarChart3, FileText, TrendingUp } from 'lucide-react';
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function EstudosDeGrupo() {
  const navigate = useNavigate();
  const { grupos, isLoading, deleteGrupo } = useGruposConsorcio();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filtroAdmin, setFiltroAdmin] = useState('Todas');
  const [filtroPrazo, setFiltroPrazo] = useState('Todos');
  const [filtroMes, setFiltroMes] = useState('Todos');

  // Fetch all analyses to get available months
  const { data: todasAnalises } = useQuery({
    queryKey: ['todas-analises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analises_mensais')
        .select('mes_ano');
      
      if (error) throw error;
      return data;
    }
  });

  // Get unique months
  const mesesDisponiveis = useMemo(() => {
    if (!todasAnalises) return [];
    const mesesUnicos = Array.from(new Set(todasAnalises.map(a => a.mes_ano)));
    return mesesUnicos.sort();
  }, [todasAnalises]);

  const handleDelete = () => {
    if (deleteId) {
      deleteGrupo.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleLimparFiltros = () => {
    setFiltroAdmin('Todas');
    setFiltroPrazo('Todos');
    setFiltroMes('Todos');
  };

  // Filter groups
  const gruposFiltrados = useMemo(() => {
    if (!grupos) return [];
    
    return grupos.filter(grupo => {
      // Filter by administrator
      if (filtroAdmin !== 'Todas' && grupo.administradora !== filtroAdmin) {
        return false;
      }
      
      // Filter by term
      if (filtroPrazo !== 'Todos' && grupo.prazo_meses !== Number(filtroPrazo)) {
        return false;
      }
      
      // Filter by month (check if group has analysis in that month)
      if (filtroMes !== 'Todos') {
        const temAnaliseNoMes = grupo.analises?.some(a => a.mes_ano === filtroMes);
        if (!temAnaliseNoMes) return false;
      }
      
      return true;
    });
  }, [grupos, filtroAdmin, filtroPrazo, filtroMes]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/ferramentas')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold">Estudos de Grupo</h1>
            </div>
            <p className="text-muted-foreground ml-11">
              Análise comparativa entre administradoras de consórcio
            </p>
          </div>
          <Button onClick={() => navigate('/estudos-grupo/novo')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Grupo
          </Button>
        </div>

        {/* Filters */}
        <FiltrosGrupos
          filtroAdmin={filtroAdmin}
          filtroPrazo={filtroPrazo}
          filtroMes={filtroMes}
          mesesDisponiveis={mesesDisponiveis}
          onAdminChange={setFiltroAdmin}
          onPrazoChange={setFiltroPrazo}
          onMesChange={setFiltroMes}
          onLimpar={handleLimparFiltros}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-rc-primary/20" onClick={() => navigate('/estudos-grupo/novo')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rc-primary/10">
                  <Plus className="h-6 w-6 text-rc-primary" />
                </div>
                <CardTitle className="text-lg">Novo Estudo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Criar um novo grupo de consórcio para análise
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-rc-primary/20" onClick={() => navigate('/estudos-grupo/comparativo')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rc-primary/10">
                  <BarChart3 className="h-6 w-6 text-rc-primary" />
                </div>
                <CardTitle className="text-lg">Comparativo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comparar performance entre administradoras
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Groups List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-rc-primary" />
            Grupos Cadastrados
            {gruposFiltrados.length !== grupos?.length && (
              <span className="text-sm text-muted-foreground font-normal">
                (Mostrando {gruposFiltrados.length} de {grupos?.length})
              </span>
            )}
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Carregando grupos...
            </div>
          ) : gruposFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gruposFiltrados.map((grupo) => (
                <GrupoCard
                  key={grupo.id}
                  grupo={grupo}
                  onView={(id) => navigate(`/estudos-grupo/${id}`)}
                  onEdit={(id) => navigate(`/estudos-grupo/${id}/editar`)}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nenhum grupo cadastrado</h3>
                <p className="text-muted-foreground mb-4 text-center">
                  Comece criando seu primeiro estudo de grupo para análise
                </p>
                <Button onClick={() => navigate('/estudos-grupo/novo')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Grupo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita e todas as análises mensais associadas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
