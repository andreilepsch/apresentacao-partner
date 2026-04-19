import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gruposApi, analisesApi, GrupoConsorcio, AnaliseMensal, CreditoInsert } from '@/lib/api';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

function formatDateToISO(date: string | Date): string {
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return date;
}

export function useGruposConsorcio() {
  const queryClient = useQueryClient();
  const { clerkUserId } = useAuthContext();

  const { data: grupos, isLoading } = useQuery({
    queryKey: ['grupos-consorcio', clerkUserId],
    queryFn: () => gruposApi.list(clerkUserId!),
    enabled: !!clerkUserId,
  });

  const createGrupo = useMutation({
    mutationFn: async (grupo: Omit<GrupoConsorcio, 'id' | 'clerk_user_id' | 'created_at' | 'updated_at'>) => {
      return gruposApi.create(clerkUserId!, {
        ...grupo,
        data_inicio: formatDateToISO(grupo.data_inicio),
        data_fim: formatDateToISO(grupo.data_fim),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] });
      toast.success('Grupo criado com sucesso');
    },
    onError: (error: Error) => toast.error(`Erro ao criar grupo: ${error.message}`),
  });

  const updateGrupo = useMutation({
    mutationFn: async ({ id, ...grupo }: Partial<GrupoConsorcio> & { id: string }) => {
      return gruposApi.update(clerkUserId!, id, {
        ...grupo,
        ...(grupo.data_inicio && { data_inicio: formatDateToISO(grupo.data_inicio) }),
        ...(grupo.data_fim && { data_fim: formatDateToISO(grupo.data_fim) }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] });
      toast.success('Grupo atualizado com sucesso');
    },
    onError: (error: Error) => toast.error(`Erro ao atualizar grupo: ${error.message}`),
  });

  const deleteGrupo = useMutation({
    mutationFn: (id: string) => gruposApi.delete(clerkUserId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] });
      queryClient.invalidateQueries({ queryKey: ['grupo'] });
      queryClient.invalidateQueries({ queryKey: ['analises'] });
      toast.success('Grupo excluído com sucesso');
    },
    onError: (error: Error) => toast.error(`Erro ao excluir grupo: ${error.message}`),
  });

  const createGrupoComCreditos = useMutation({
    mutationFn: async ({
      grupo,
      creditos,
    }: {
      grupo: Omit<GrupoConsorcio, 'id' | 'clerk_user_id' | 'created_at' | 'updated_at'>;
      creditos: CreditoInsert[];
    }) => {
      return gruposApi.createComCreditos(clerkUserId!, {
        ...grupo,
        data_inicio: formatDateToISO(grupo.data_inicio),
        data_fim: formatDateToISO(grupo.data_fim),
      }, creditos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] });
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Grupo e créditos criados com sucesso');
    },
    onError: (error: Error) => toast.error(`Erro ao criar grupo: ${error.message}`),
  });

  const updateGrupoComCreditos = useMutation({
    mutationFn: async ({
      id,
      grupo,
      creditos,
    }: {
      id: string;
      grupo: Partial<GrupoConsorcio>;
      creditos: CreditoInsert[];
    }) => {
      return gruposApi.updateComCreditos(clerkUserId!, id, {
        ...grupo,
        ...(grupo.data_inicio && { data_inicio: formatDateToISO(grupo.data_inicio) }),
        ...(grupo.data_fim && { data_fim: formatDateToISO(grupo.data_fim) }),
      }, creditos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] });
      queryClient.invalidateQueries({ queryKey: ['grupo'] });
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      queryClient.invalidateQueries({ queryKey: ['creditos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Grupo e créditos atualizados com sucesso');
    },
    onError: (error: Error) => toast.error(`Erro ao atualizar grupo: ${error.message}`),
  });

  return {
    grupos,
    isLoading,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] }),
    createGrupo,
    updateGrupo,
    deleteGrupo,
    createGrupoComCreditos,
    updateGrupoComCreditos,
  };
}

export function useGrupoDetalhes(grupoId: string) {
  const { clerkUserId } = useAuthContext();

  const { data: grupo } = useQuery({
    queryKey: ['grupo', grupoId],
    queryFn: () => gruposApi.get(clerkUserId!, grupoId),
    enabled: !!grupoId && !!clerkUserId,
  });

  const { data: analises } = useQuery({
    queryKey: ['analises', grupoId],
    queryFn: () => gruposApi.getAnalises(clerkUserId!, grupoId),
    enabled: !!grupoId && !!clerkUserId,
  });

  return { grupo, analises };
}

export function useAnalisesMensais(grupoId: string) {
  const queryClient = useQueryClient();
  const { clerkUserId } = useAuthContext();

  const createAnalise = useMutation({
    mutationFn: (analise: Omit<AnaliseMensal, 'id' | 'created_at'>) =>
      gruposApi.createAnalise(clerkUserId!, grupoId, analise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analises', grupoId] });
      toast.success('Análise mensal salva com sucesso');
    },
    onError: (error: Error) => toast.error(`Erro ao salvar análise: ${error.message}`),
  });

  const updateAnalise = useMutation({
    mutationFn: ({ id, ...analise }: Partial<AnaliseMensal> & { id: string }) =>
      analisesApi.update(clerkUserId!, id, analise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analises', grupoId] });
      toast.success('Análise atualizada com sucesso');
    },
    onError: (error: Error) => toast.error(`Erro ao atualizar análise: ${error.message}`),
  });

  const deleteAnalise = useMutation({
    mutationFn: (id: string) => analisesApi.delete(clerkUserId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analises', grupoId] });
      toast.success('Análise excluída com sucesso');
    },
    onError: (error: Error) => toast.error(`Erro ao excluir análise: ${error.message}`),
  });

  return { createAnalise, updateAnalise, deleteAnalise };
}
