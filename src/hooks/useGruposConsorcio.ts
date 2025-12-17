import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GrupoConsorcio, AnalyseMensal } from '@/types/gruposConsorcio';
import { toast } from 'sonner';

// Helper para converter Date para string ISO
function formatDateToISO(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date;
}

export function useGruposConsorcio() {
  const queryClient = useQueryClient();

  const { data: grupos, isLoading } = useQuery({
    queryKey: ['grupos-consorcio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grupos_consorcio')
        .select(`
          *,
          analises:analises_mensais(*)
        `)
        .order('created_at', { ascending: false })
        .order('data_analise', { foreignTable: 'analises_mensais', ascending: false });
      
      if (error) throw error;
      return data as GrupoConsorcio[];
    }
  });

  const createGrupo = useMutation({
    mutationFn: async (grupo: Omit<GrupoConsorcio, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const grupoParaInserir = {
        ...grupo,
        user_id: user.id,
        data_inicio: formatDateToISO(grupo.data_inicio),
        data_fim: formatDateToISO(grupo.data_fim),
      };

      const { data, error } = await supabase
        .from('grupos_consorcio')
        .insert(grupoParaInserir)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] });
      toast.success('Grupo criado com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao criar grupo: ${error.message}`);
    }
  });

  const updateGrupo = useMutation({
    mutationFn: async ({ id, ...grupo }: Partial<GrupoConsorcio> & { id: string }) => {
      const grupoParaAtualizar = {
        ...grupo,
        ...(grupo.data_inicio && {
          data_inicio: formatDateToISO(grupo.data_inicio)
        }),
        ...(grupo.data_fim && {
          data_fim: formatDateToISO(grupo.data_fim)
        })
      };

      const { data, error } = await supabase
        .from('grupos_consorcio')
        .update(grupoParaAtualizar)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] });
      toast.success('Grupo atualizado com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar grupo: ${error.message}`);
    }
  });

  const deleteGrupo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('grupos_consorcio')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] });
      queryClient.invalidateQueries({ queryKey: ['grupo'] });
      queryClient.invalidateQueries({ queryKey: ['analises'] });
      toast.success('Grupo excluído com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir grupo: ${error.message}`);
    }
  });

  // Criar grupo com créditos
  const createGrupoComCreditos = useMutation({
    mutationFn: async ({ 
      grupo, 
      creditos 
    }: { 
      grupo: Omit<GrupoConsorcio, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
      creditos: Array<{ credito: number; parcela: number; grupo_descricao?: string }>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // 1. Criar o grupo
      const grupoParaInserir = {
        ...grupo,
        user_id: user.id,
        data_inicio: formatDateToISO(grupo.data_inicio),
        data_fim: formatDateToISO(grupo.data_fim),
      };

      const { data: grupoData, error: grupoError } = await supabase
        .from('grupos_consorcio')
        .insert(grupoParaInserir)
        .select()
        .single();
      
      if (grupoError) throw grupoError;

      // 2. Adicionar créditos na tabela credit_price
      if (creditos.length > 0) {
        const creditosParaInserir = creditos.map(c => ({
          administradora: grupo.administradora,
          group_code: parseInt(grupo.numero_grupo),
          prazo_months: grupo.prazo_meses,
          credito: c.credito,
          parcela: c.parcela,
          grupo_descricao: c.grupo_descricao || null
        }));

        const { error: creditosError } = await supabase
          .from('credit_price')
          .insert(creditosParaInserir);

        if (creditosError) throw creditosError;
      }

      return grupoData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] });
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Grupo e créditos criados com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao criar grupo: ${error.message}`);
    }
  });

  // Atualizar grupo com créditos
  const updateGrupoComCreditos = useMutation({
    mutationFn: async ({ 
      id,
      grupo, 
      creditos 
    }: { 
      id: string;
      grupo: Partial<GrupoConsorcio>;
      creditos: Array<{ credito: number; parcela: number; grupo_descricao?: string }>;
    }) => {
      // 1. Atualizar o grupo
      const grupoParaAtualizar = {
        ...grupo,
        ...(grupo.data_inicio && {
          data_inicio: formatDateToISO(grupo.data_inicio)
        }),
        ...(grupo.data_fim && {
          data_fim: formatDateToISO(grupo.data_fim)
        })
      };

      const { data: grupoData, error: grupoError } = await supabase
        .from('grupos_consorcio')
        .update(grupoParaAtualizar)
        .eq('id', id)
        .select()
        .single();
      
      if (grupoError) throw grupoError;

      // 2. Remover créditos antigos
      if (grupo.administradora && grupo.numero_grupo) {
        await supabase
          .from('credit_price')
          .delete()
          .eq('administradora', grupo.administradora)
          .eq('group_code', parseInt(grupo.numero_grupo));

        // 3. Adicionar novos créditos
        if (creditos.length > 0) {
          const creditosParaInserir = creditos.map(c => ({
            administradora: grupo.administradora!,
            group_code: parseInt(grupo.numero_grupo!),
            prazo_months: grupo.prazo_meses!,
            credito: c.credito,
            parcela: c.parcela,
            grupo_descricao: c.grupo_descricao || null
          }));

          const { error: creditosError } = await supabase
            .from('credit_price')
            .insert(creditosParaInserir);

          if (creditosError) throw creditosError;
        }
      }

      return grupoData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] });
      queryClient.invalidateQueries({ queryKey: ['grupo'] });
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      queryClient.invalidateQueries({ queryKey: ['creditos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Grupo e créditos atualizados com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar grupo: ${error.message}`);
    }
  });

  return {
    grupos,
    isLoading,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['grupos-consorcio'] }),
    createGrupo,
    updateGrupo,
    deleteGrupo,
    createGrupoComCreditos,
    updateGrupoComCreditos
  };
}

export function useGrupoDetalhes(grupoId: string) {
  const { data: grupo } = useQuery({
    queryKey: ['grupo', grupoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grupos_consorcio')
        .select('*')
        .eq('id', grupoId)
        .single();
      
      if (error) throw error;
      return data as GrupoConsorcio;
    },
    enabled: !!grupoId
  });

  const { data: analises } = useQuery({
    queryKey: ['analises', grupoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analises_mensais')
        .select('*')
        .eq('grupo_id', grupoId)
        .order('data_analise', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as AnalyseMensal[];
    },
    enabled: !!grupoId
  });

  return { grupo, analises };
}

export function useAnalisesMensais(grupoId: string) {
  const queryClient = useQueryClient();

  const createAnalise = useMutation({
    mutationFn: async (analise: Omit<AnalyseMensal, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('analises_mensais')
        .insert(analise)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analises', grupoId] });
      toast.success('Análise mensal salva com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao salvar análise: ${error.message}`);
    }
  });

  const updateAnalise = useMutation({
    mutationFn: async ({ id, ...analise }: Partial<AnalyseMensal> & { id: string }) => {
      const { data, error } = await supabase
        .from('analises_mensais')
        .update(analise)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analises', grupoId] });
      toast.success('Análise atualizada com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar análise: ${error.message}`);
    }
  });

  const deleteAnalise = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('analises_mensais')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analises', grupoId] });
      toast.success('Análise excluída com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir análise: ${error.message}`);
    }
  });

  return {
    createAnalise,
    updateAnalise,
    deleteAnalise
  };
}
