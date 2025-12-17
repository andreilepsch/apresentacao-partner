import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormGrupo } from '@/components/estudos-grupo/FormGrupo';
import { useGrupoDetalhes, useGruposConsorcio } from '@/hooks/useGruposConsorcio';
import { ArrowLeft } from 'lucide-react';

export default function EditarGrupo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { grupo } = useGrupoDetalhes(id!);
  const { updateGrupo } = useGruposConsorcio();

  if (!grupo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando grupo...</p>
      </div>
    );
  }

  const handleSubmit = (values: any) => {
    updateGrupo.mutate(
      { id: id!, ...values },
      {
        onSuccess: () => {
          navigate(`/estudos-grupo/${id}`);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/estudos-grupo/${id}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Grupo</h1>
            <p className="text-muted-foreground">
              Atualize as informações do grupo de consórcio
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGrupo
              defaultValues={{
                administradora: grupo.administradora,
                numero_grupo: grupo.numero_grupo,
                prazo_meses: grupo.prazo_meses,
                capacidade_cotas: grupo.capacidade_cotas,
                participantes_atual: grupo.participantes_atual,
                data_inicio: new Date(grupo.data_inicio),
                data_fim: new Date(grupo.data_fim)
              }}
              onSubmit={handleSubmit}
              onCancel={() => navigate(`/estudos-grupo/${id}`)}
              isLoading={updateGrupo.isPending}
              isEditMode={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
