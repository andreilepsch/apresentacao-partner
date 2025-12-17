import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CreditPrice {
  id: string;
  administradora: string;
  group_code: number;
  prazo_months: number;
  credito: number;
  parcela: number;
  grupo_descricao: string | null;
  created_at: string;
}

export interface GrupoInfo {
  group_code: number;
  grupo_descricao: string | null;
  prazo_months: number;
  total_creditos: number;
}

export interface AddCreditoData {
  administradora: string;
  group_code: number;
  prazo_months: number;
  credito: number;
  parcela: number;
  grupo_descricao?: string | null;
}

export const useCreditPrice = () => {
  const queryClient = useQueryClient();

  // Buscar todos os grupos de uma administradora
  const useGruposByAdministradora = (administradora: string) => {
    return useQuery({
      queryKey: ["grupos", administradora],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("credit_price")
          .select("group_code, grupo_descricao, prazo_months")
          .eq("administradora", administradora)
          .order("group_code", { ascending: true });

        if (error) throw error;

        // Agrupar por group_code e contar créditos
        const gruposMap = new Map<number, GrupoInfo>();
        
        data?.forEach((item) => {
          if (!gruposMap.has(item.group_code)) {
            gruposMap.set(item.group_code, {
              group_code: item.group_code,
              grupo_descricao: item.grupo_descricao,
              prazo_months: item.prazo_months,
              total_creditos: 1,
            });
          } else {
            const grupo = gruposMap.get(item.group_code)!;
            grupo.total_creditos++;
          }
        });

        return Array.from(gruposMap.values());
      },
      enabled: !!administradora,
    });
  };

  // Buscar créditos de um grupo específico
  const useCreditosByGrupo = (administradora: string, groupCode: number, enabled = true) => {
    return useQuery({
      queryKey: ["creditos", administradora, groupCode],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("credit_price")
          .select("*")
          .eq("administradora", administradora)
          .eq("group_code", groupCode)
          .order("credito", { ascending: true });

        if (error) throw error;
        return data as CreditPrice[];
      },
      enabled: enabled && !!administradora && !!groupCode,
    });
  };

  // Buscar estatísticas de uma administradora
  const useAdministradoraStats = (administradora: string) => {
    return useQuery({
      queryKey: ["stats", administradora],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("credit_price")
          .select("group_code, prazo_months")
          .eq("administradora", administradora);

        if (error) throw error;

        const grupos = new Set(data?.map((item) => item.group_code) || []);
        const prazoMedio =
          data && data.length > 0
            ? Math.round(
                data.reduce((acc, item) => acc + item.prazo_months, 0) /
                  data.length
              )
            : 0;

        return {
          totalGrupos: grupos.size,
          totalCreditos: data?.length || 0,
          prazoMedio,
        };
      },
      enabled: !!administradora,
    });
  };

  // Adicionar novo crédito
  const addCredito = useMutation({
    mutationFn: async (creditoData: AddCreditoData) => {
      const { data, error } = await supabase
        .from("credit_price")
        .insert([creditoData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["grupos", variables.administradora],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ 
        queryKey: ["creditos", variables.administradora, variables.group_code],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ 
        queryKey: ["stats", variables.administradora],
        refetchType: 'all'
      });
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.error("Este crédito já existe neste grupo!");
      } else {
        toast.error("Erro ao adicionar crédito: " + error.message);
      }
    },
  });

  // Editar crédito
  const updateCredito = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreditPrice> }) => {
      const { data, error } = await supabase
        .from("credit_price")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["grupos", data.administradora] });
      queryClient.invalidateQueries({ 
        queryKey: ["creditos", data.administradora, data.group_code] 
      });
      queryClient.invalidateQueries({ queryKey: ["stats", data.administradora] });
      toast.success("Crédito atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar crédito: " + error.message);
    },
  });

  // Deletar crédito
  const deleteCredito = useMutation({
    mutationFn: async ({ id, administradora, group_code }: { 
      id: string; 
      administradora: string; 
      group_code: number 
    }) => {
      const { error } = await supabase
        .from("credit_price")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { administradora, group_code };
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ["grupos", variables.administradora] });
      queryClient.invalidateQueries({ 
        queryKey: ["creditos", variables.administradora, variables.group_code] 
      });
      queryClient.invalidateQueries({ queryKey: ["stats", variables.administradora] });
      toast.success("Crédito deletado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao deletar crédito: " + error.message);
    },
  });

  // Deletar grupo completo (todos os créditos)
  const deleteGrupo = useMutation({
    mutationFn: async ({ administradora, group_code }: { 
      administradora: string; 
      group_code: number 
    }) => {
      const { error } = await supabase
        .from("credit_price")
        .delete()
        .eq("administradora", administradora)
        .eq("group_code", group_code);

      if (error) throw error;
      return { administradora, group_code };
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ["grupos", variables.administradora] });
      queryClient.invalidateQueries({ queryKey: ["stats", variables.administradora] });
      toast.success("Grupo deletado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao deletar grupo: " + error.message);
    },
  });

  // Adicionar múltiplos créditos de uma vez
  const addCreditosBatch = useMutation({
    mutationFn: async (creditos: AddCreditoData[]) => {
      const { data, error } = await supabase
        .from("credit_price")
        .insert(creditos)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      if (variables.length > 0) {
        const administradora = variables[0].administradora;
        const group_code = variables[0].group_code;
        
        queryClient.invalidateQueries({ queryKey: ["grupos", administradora] });
        queryClient.invalidateQueries({ queryKey: ["creditos", administradora, group_code] });
        queryClient.invalidateQueries({ queryKey: ["stats", administradora] });
      }
      toast.success(`${variables.length} crédito(s) adicionado(s) com sucesso!`);
    },
    onError: (error: any) => {
      toast.error("Erro ao adicionar créditos: " + error.message);
    },
  });

  return {
    useGruposByAdministradora,
    useCreditosByGrupo,
    useAdministradoraStats,
    addCredito,
    updateCredito,
    deleteCredito,
    deleteGrupo,
    addCreditosBatch,
  };
};
