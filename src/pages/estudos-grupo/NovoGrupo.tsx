import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormGrupo } from '@/components/estudos-grupo/FormGrupo';
import { useGruposConsorcio } from '@/hooks/useGruposConsorcio';
import { ArrowLeft } from 'lucide-react';

export default function NovoGrupo() {
  const navigate = useNavigate();
  const { createGrupo } = useGruposConsorcio();

  const handleSubmit = (values: any) => {
    createGrupo.mutate(values, {
      onSuccess: (data) => {
        navigate(`/estudos-grupo/${data.id}`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/estudos-grupo')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Novo Grupo de Consórcio</h1>
            <p className="text-muted-foreground">
              Cadastre as informações gerais do grupo para iniciar a análise
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGrupo
              onSubmit={handleSubmit}
              onCancel={() => navigate('/estudos-grupo')}
              isLoading={createGrupo.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
