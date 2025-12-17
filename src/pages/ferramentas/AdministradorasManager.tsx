import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building2, Plus, Edit, Trash2, Save, X, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCreditPrice } from "@/hooks/useCreditPrice";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const administradoraSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  contemplacoes_mes: z.number().min(0, "Deve ser maior ou igual a 0"),
  anos_mercado: z.number().min(1, "Anos no mercado é obrigatório"),
  clientes_contemplados: z.string().min(1, "Campo obrigatório"),
  descricao_adicional: z.string().optional(),
  link_reclame_aqui: z.string().url("Link inválido"),
  parceira1_nome: z.string().min(1, "Nome da parceira 1 é obrigatório"),
  parceira1_link: z.string().url("Link inválido").optional().or(z.literal('')),
  parceira2_nome: z.string().min(1, "Nome da parceira 2 é obrigatório"),
  parceira2_link: z.string().url("Link inválido").optional().or(z.literal('')),
  parceira3_nome: z.string().min(1, "Nome da parceira 3 é obrigatório"),
  parceira3_link: z.string().url("Link inválido").optional().or(z.literal('')),
});

type AdministradoraFormData = z.infer<typeof administradoraSchema>;

interface Administradora extends AdministradoraFormData {
  id: string;
  created_at: string;
  updated_at: string;
}

interface AdministradoraCardProps {
  admin: Administradora;
  onEdit: (admin: Administradora) => void;
  onDelete: (id: string) => void;
}

const AdministradoraCard = ({ admin, onEdit, onDelete }: AdministradoraCardProps) => {
  const navigate = useNavigate();
  const { useAdministradoraStats } = useCreditPrice();
  const { data: stats } = useAdministradoraStats(admin.nome);

  return (
    <Card className="bg-white border-rc-primary/20 hover:border-rc-primary/40 transition-all duration-300 hover:shadow-lg animate-fade-in group h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-rc-accent/50 group-hover:bg-rc-accent/70 transition-colors">
              <Building2 className="h-6 w-6 text-rc-secondary" />
            </div>
            <div>
              <CardTitle className="text-xl text-rc-primary mb-1">{admin.nome}</CardTitle>
              <CardDescription className="text-gray-600 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rc-secondary"></span>
                {admin.anos_mercado} anos no mercado
              </CardDescription>
            </div>
          </div>
          {stats && stats.totalGrupos > 0 && (
            <Badge variant="secondary" className="bg-rc-accent text-rc-primary border-rc-primary/20 shrink-0">
              {stats.totalGrupos} Grupos
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Informações principais */}
        <div className="grid grid-cols-1 gap-3 p-4 rounded-lg bg-rc-accent/30 border border-rc-primary/20 min-h-[140px]">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-rc-secondary"></div>
            <span className="text-rc-type font-medium">{admin.contemplacoes_mes}</span>
            <span className="text-gray-600">contemplações/mês</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-rc-secondary"></div>
            <span className="text-rc-type font-medium">{admin.clientes_contemplados}</span>
            <span className="text-gray-600">clientes contemplados</span>
          </div>
          {admin.descricao_adicional && (
            <div className="flex items-start gap-2 text-sm pt-2 border-t border-rc-primary/20">
              <div className="w-2 h-2 rounded-full bg-rc-secondary mt-1.5"></div>
              <p className="text-rc-secondary italic flex-1">{admin.descricao_adicional}</p>
            </div>
          )}
        </div>

        {/* Parceiras */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-rc-type">Parceiras</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs bg-white border-rc-primary/30 text-rc-type">{admin.parceira1_nome}</Badge>
            <Badge variant="outline" className="text-xs bg-white border-rc-primary/30 text-rc-type">{admin.parceira2_nome}</Badge>
            <Badge variant="outline" className="text-xs bg-white border-rc-primary/30 text-rc-type">{admin.parceira3_nome}</Badge>
          </div>
        </div>

        {/* Estatísticas de Créditos */}
        {stats && stats.totalCreditos > 0 && (
          <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-rc-accent/30 border border-rc-primary/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-rc-secondary">{stats.totalGrupos}</p>
              <p className="text-xs text-gray-600 mt-1">Grupos</p>
            </div>
            <div className="text-center border-x border-rc-primary/20">
              <p className="text-2xl font-bold text-rc-secondary">{stats.totalCreditos}</p>
              <p className="text-xs text-gray-600 mt-1">Créditos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-rc-secondary">{stats.prazoMedio}m</p>
              <p className="text-xs text-gray-600 mt-1">Prazo Médio</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 mt-auto">
          <Button
            size="sm"
            variant="default"
            onClick={() => navigate(`/ferramentas/administradoras/${admin.id}/grupos`)}
            className="w-full gap-2 mb-2"
          >
            <FileText className="h-4 w-4" />
            Ver Grupos
          </Button>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(admin)}
              className="flex-1 gap-1"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(admin.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdministradorasManager = () => {
  const navigate = useNavigate();
  const [administradoras, setAdministradoras] = useState<Administradora[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { useAdministradoraStats } = useCreditPrice();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdministradoraFormData>({
    resolver: zodResolver(administradoraSchema),
  });

  useEffect(() => {
    fetchAdministradoras();
  }, []);

  const fetchAdministradoras = async () => {
    const { data, error } = await supabase
      .from("administradoras_info")
      .select("*")
      .order("nome");

    if (error) {
      toast.error("Erro ao carregar administradoras");
      return;
    }

    setAdministradoras(data || []);
  };

  const onSubmit = async (data: AdministradoraFormData) => {
    setLoading(true);
    
    const payload = {
      ...data,
      parceira1_link: data.parceira1_link || null,
      parceira2_link: data.parceira2_link || null,
      parceira3_link: data.parceira3_link || null,
      descricao_adicional: data.descricao_adicional || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("administradoras_info")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        toast.error("Erro ao atualizar administradora");
      } else {
        toast.success("Administradora atualizada com sucesso!");
        setIsFormOpen(false);
        setEditingId(null);
        reset();
        fetchAdministradoras();
      }
    } else {
      const { error } = await supabase
        .from("administradoras_info")
        .insert([payload]);

      if (error) {
        toast.error("Erro ao cadastrar administradora");
      } else {
        toast.success("Administradora cadastrada com sucesso!");
        setIsFormOpen(false);
        reset();
        fetchAdministradoras();
      }
    }
    
    setLoading(false);
  };

  const handleEdit = (admin: Administradora) => {
    setEditingId(admin.id);
    reset({
      nome: admin.nome,
      contemplacoes_mes: admin.contemplacoes_mes,
      anos_mercado: admin.anos_mercado,
      clientes_contemplados: admin.clientes_contemplados,
      descricao_adicional: admin.descricao_adicional || '',
      link_reclame_aqui: admin.link_reclame_aqui,
      parceira1_nome: admin.parceira1_nome,
      parceira1_link: admin.parceira1_link || '',
      parceira2_nome: admin.parceira2_nome,
      parceira2_link: admin.parceira2_link || '',
      parceira3_nome: admin.parceira3_nome,
      parceira3_link: admin.parceira3_link || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    const { error } = await supabase
      .from("administradoras_info")
      .delete()
      .eq("id", deletingId);

    if (error) {
      toast.error("Erro ao excluir administradora");
    } else {
      toast.success("Administradora excluída com sucesso!");
      fetchAdministradoras();
    }

    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/ferramentas")}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rc-accent/50">
                <Building2 className="h-7 w-7 text-rc-secondary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-rc-primary">
                  Gestão de Administradoras
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ml-0 sm:ml-11">
            <p className="text-gray-600">
              Configure as informações das administradoras de consórcio
            </p>
            {!isFormOpen && (
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="gap-2 shrink-0"
              >
                <Plus className="h-4 w-4" />
                Nova Administradora
              </Button>
            )}
          </div>
        </div>

        {/* Form */}
        {isFormOpen && (
          <Card className="mb-8 border-rc-primary/30 shadow-lg animate-fade-in bg-white">
            <CardHeader className="border-b border-rc-primary/20 bg-rc-accent/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rc-accent/50">
                  {editingId ? (
                    <Edit className="h-5 w-5 text-rc-secondary" />
                  ) : (
                    <Plus className="h-5 w-5 text-rc-secondary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl text-rc-primary">
                    {editingId ? "Editar Administradora" : "Nova Administradora"}
                  </CardTitle>
                  <CardDescription className="mt-1 text-gray-600">
                    Preencha todos os campos obrigatórios
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-rc-primary flex items-center gap-2">
                    <div className="w-1 h-5 bg-rc-secondary rounded-full"></div>
                    Informações Básicas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome" className="text-rc-type font-medium">Nome da Administradora *</Label>
                      <Input
                        id="nome"
                        className="bg-white border-rc-primary/20 focus:border-rc-primary"
                        {...register("nome")}
                      />
                      {errors.nome && (
                        <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contemplacoes_mes" className="text-rc-type font-medium">Contemplações por Mês *</Label>
                      <Input
                        id="contemplacoes_mes"
                        type="number"
                        className="bg-white border-rc-primary/20 focus:border-rc-primary"
                        {...register("contemplacoes_mes", { valueAsNumber: true })}
                      />
                      {errors.contemplacoes_mes && (
                        <p className="text-red-600 text-sm mt-1">{errors.contemplacoes_mes.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="anos_mercado" className="text-rc-type font-medium">Anos no Mercado *</Label>
                      <Input
                        id="anos_mercado"
                        type="number"
                        className="bg-white border-rc-primary/20 focus:border-rc-primary"
                        {...register("anos_mercado", { valueAsNumber: true })}
                      />
                      {errors.anos_mercado && (
                        <p className="text-red-600 text-sm mt-1">{errors.anos_mercado.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="clientes_contemplados" className="text-rc-type font-medium">Clientes Contemplados *</Label>
                      <Input
                        id="clientes_contemplados"
                        placeholder="Ex: +178 mil"
                        className="bg-white border-rc-primary/20 focus:border-rc-primary"
                        {...register("clientes_contemplados")}
                      />
                      {errors.clientes_contemplados && (
                        <p className="text-red-600 text-sm mt-1">{errors.clientes_contemplados.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="link_reclame_aqui" className="text-rc-type font-medium">Link Reclame Aqui *</Label>
                      <Input
                        id="link_reclame_aqui"
                        type="url"
                        placeholder="https://..."
                        className="bg-white border-rc-primary/20 focus:border-rc-primary"
                        {...register("link_reclame_aqui")}
                      />
                      {errors.link_reclame_aqui && (
                        <p className="text-red-600 text-sm mt-1">{errors.link_reclame_aqui.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="descricao_adicional" className="text-rc-type font-medium">Descrição Adicional</Label>
                      <Textarea
                        id="descricao_adicional"
                        placeholder="Ex: Primeira administradora nacional de consórcios"
                        className="bg-white border-rc-primary/20 focus:border-rc-primary resize-none"
                        rows={3}
                        {...register("descricao_adicional")}
                      />
                    </div>
                  </div>
                </div>

                {/* Parceiras */}
                <div className="space-y-4 pt-6 border-t border-rc-primary/20">
                  <h3 className="text-lg font-semibold text-rc-primary flex items-center gap-2">
                    <div className="w-1 h-5 bg-rc-secondary rounded-full"></div>
                    Parceiras (3 obrigatórias)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Parceira 1 */}
                    <div>
                      <Label htmlFor="parceira1_nome" className="text-foreground">Parceira 1 - Nome *</Label>
                      <Input
                        id="parceira1_nome"
                        className="bg-background border-border"
                        {...register("parceira1_nome")}
                      />
                      {errors.parceira1_nome && (
                        <p className="text-destructive text-sm mt-1">{errors.parceira1_nome.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="parceira1_link" className="text-foreground">Parceira 1 - Link (opcional)</Label>
                      <Input
                        id="parceira1_link"
                        type="url"
                        placeholder="https://..."
                        className="bg-background border-border"
                        {...register("parceira1_link")}
                      />
                      {errors.parceira1_link && (
                        <p className="text-destructive text-sm mt-1">{errors.parceira1_link.message}</p>
                      )}
                    </div>

                    {/* Parceira 2 */}
                    <div>
                      <Label htmlFor="parceira2_nome" className="text-foreground">Parceira 2 - Nome *</Label>
                      <Input
                        id="parceira2_nome"
                        className="bg-background border-border"
                        {...register("parceira2_nome")}
                      />
                      {errors.parceira2_nome && (
                        <p className="text-destructive text-sm mt-1">{errors.parceira2_nome.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="parceira2_link" className="text-foreground">Parceira 2 - Link (opcional)</Label>
                      <Input
                        id="parceira2_link"
                        type="url"
                        placeholder="https://..."
                        className="bg-background border-border"
                        {...register("parceira2_link")}
                      />
                      {errors.parceira2_link && (
                        <p className="text-destructive text-sm mt-1">{errors.parceira2_link.message}</p>
                      )}
                    </div>

                    {/* Parceira 3 */}
                    <div>
                      <Label htmlFor="parceira3_nome" className="text-foreground">Parceira 3 - Nome *</Label>
                      <Input
                        id="parceira3_nome"
                        className="bg-background border-border"
                        {...register("parceira3_nome")}
                      />
                      {errors.parceira3_nome && (
                        <p className="text-destructive text-sm mt-1">{errors.parceira3_nome.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="parceira3_link" className="text-foreground">Parceira 3 - Link (opcional)</Label>
                      <Input
                        id="parceira3_link"
                        type="url"
                        placeholder="https://..."
                        className="bg-background border-border"
                        {...register("parceira3_link")}
                      />
                      {errors.parceira3_link && (
                        <p className="text-destructive text-sm mt-1">{errors.parceira3_link.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelForm}
                    disabled={loading}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="gap-2">
                    <Save className="h-4 w-4" />
                    {loading ? "Salvando..." : editingId ? "Atualizar" : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Administradoras */}
        {administradoras.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {administradoras.length} {administradoras.length === 1 ? 'Administradora' : 'Administradoras'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {administradoras.map((admin) => (
                <AdministradoraCard
                  key={admin.id}
                  admin={admin}
                  onEdit={handleEdit}
                  onDelete={(id) => {
                    setDeletingId(id);
                    setDeleteDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {administradoras.length === 0 && !isFormOpen && (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="text-center py-16">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma administradora cadastrada
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Comece cadastrando sua primeira administradora de consórcio
              </p>
              <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar Primeira Administradora
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-foreground">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir esta administradora? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Excluir Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdministradorasManager;
