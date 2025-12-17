import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Building2, Plus, ChevronDown, ChevronUp, ExternalLink, FileText, Eye, EyeOff, Trash2, Loader2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCreditPrice, CreditPrice } from "@/hooks/useCreditPrice";
import { toast } from "sonner";
import NovoCreditoDialog from "@/components/administradora/NovoCreditoDialog";
import { EditarCreditoDialog } from "@/components/administradora/EditarCreditoDialog";

interface Administradora {
  id: string;
  nome: string;
  contemplacoes_mes: number;
  anos_mercado: number;
  clientes_contemplados: string;
  descricao_adicional: string | null;
  link_reclame_aqui: string;
  parceira1_nome: string;
  parceira1_link: string | null;
  parceira2_nome: string;
  parceira2_link: string | null;
  parceira3_nome: string;
  parceira3_link: string | null;
}

const AdministradoraDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [administradora, setAdministradora] = useState<Administradora | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { useGruposByAdministradora } = useCreditPrice();
  
  const grupos = useGruposByAdministradora(administradora?.nome || "");

  useEffect(() => {
    fetchAdministradora();
  }, [id]);

  const fetchAdministradora = async () => {
    if (!id) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("administradoras_info")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Erro ao carregar administradora");
      navigate("/ferramentas/administradoras");
      return;
    }

    setAdministradora(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-rc-secondary mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!administradora) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Administradora não encontrada</p>
          <Button className="mt-4 bg-rc-primary hover:bg-rc-primary/90" onClick={() => navigate("/ferramentas/administradoras")}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/ferramentas/administradoras")}
                className="hover:bg-rc-accent/50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Building2 className="h-8 w-8 text-rc-secondary" />
              <h1 className="text-3xl font-bold text-rc-primary">{administradora.nome}</h1>
            </div>
            <p className="text-gray-600 ml-11">
              Gerencie informações e grupos de crédito
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-rc-accent/30">
            <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:text-rc-primary">Informações Gerais</TabsTrigger>
            <TabsTrigger value="grupos" className="data-[state=active]:bg-white data-[state=active]:text-rc-primary">Grupos e Créditos</TabsTrigger>
          </TabsList>

          {/* Aba 1: Informações Gerais */}
          <TabsContent value="info" className="space-y-4">
            <Card className="bg-white border-rc-primary/20">
              <CardHeader>
                <CardTitle className="text-rc-primary">Informações da Administradora</CardTitle>
                <CardDescription className="text-gray-600">Dados cadastrados no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dados Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nome</p>
                    <p className="font-medium text-rc-type">{administradora.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Anos no Mercado</p>
                    <p className="font-medium text-rc-type">{administradora.anos_mercado} anos</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Contemplações/Mês</p>
                    <p className="font-medium text-rc-type">{administradora.contemplacoes_mes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Clientes Contemplados</p>
                    <p className="font-medium text-rc-type">{administradora.clientes_contemplados}</p>
                  </div>
                </div>

                {/* Descrição Adicional */}
                {administradora.descricao_adicional && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Descrição Adicional</p>
                    <p className="font-medium text-rc-secondary italic">
                      {administradora.descricao_adicional}
                    </p>
                  </div>
                )}

                {/* Link Reclame Aqui */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reclame Aqui</p>
                  <a
                    href={administradora.link_reclame_aqui}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rc-secondary hover:text-rc-secondary/80 flex items-center gap-1"
                  >
                    Ver perfil <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Parceiras */}
                <div className="border-t border-rc-primary/20 pt-4">
                  <p className="text-sm text-gray-600 mb-3">Parceiras</p>
                  <div className="space-y-2">
                    {[
                      { nome: administradora.parceira1_nome, link: administradora.parceira1_link },
                      { nome: administradora.parceira2_nome, link: administradora.parceira2_link },
                      { nome: administradora.parceira3_nome, link: administradora.parceira3_link },
                    ].map((parceira, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-rc-accent text-rc-primary border-rc-primary/20">{parceira.nome}</Badge>
                        {parceira.link && (
                          <a
                            href={parceira.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rc-secondary hover:text-rc-secondary/80"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botão Editar */}
            <Button
              variant="outline"
              onClick={() => navigate("/ferramentas/administradoras")}
              className="w-full border-rc-primary/30 text-rc-primary hover:bg-rc-accent/50"
            >
              Editar Informações
            </Button>
          </TabsContent>

          {/* Aba 2: Grupos e Créditos */}
          <TabsContent value="grupos" className="space-y-4">
            {grupos.isLoading ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-rc-secondary mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Carregando grupos...</p>
              </div>
            ) : grupos.data && grupos.data.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    {grupos.data.length} {grupos.data.length === 1 ? "grupo encontrado" : "grupos encontrados"}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-rc-primary/30 text-rc-primary hover:bg-rc-accent/50"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Grupo
                  </Button>
                </div>

                <div className="space-y-3">
              {grupos.data.map((grupo) => (
                <GrupoCard key={grupo.group_code} grupo={grupo} administradora={administradora.nome} />
              ))}
                </div>
              </>
            ) : (
              <Card className="bg-white border-rc-primary/20">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Nenhum grupo cadastrado ainda
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-rc-primary/30 text-rc-primary hover:bg-rc-accent/50"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Grupo
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de Novo Crédito */}
      {administradora && (
        <NovoCreditoDialog
          administradora={administradora.nome}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={() => {
            grupos.refetch();
          }}
        />
      )}
    </div>
  );
};

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

interface GrupoCardProps {
  grupo: {
    group_code: number;
    grupo_descricao: string | null;
    total_creditos: number;
    prazo_months: number;
  };
  administradora: string;
}

const GrupoCard = ({ grupo, administradora }: GrupoCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreditos, setShowCreditos] = useState(false);
  const [editingCredito, setEditingCredito] = useState<CreditPrice | null>(null);
  const [deletingCredito, setDeletingCredito] = useState<CreditPrice | null>(null);
  const [addingCreditoToGrupo, setAddingCreditoToGrupo] = useState(false);
  
  const { useCreditosByGrupo, deleteCredito } = useCreditPrice();
  const creditos = useCreditosByGrupo(administradora, grupo.group_code, showCreditos);

  const handleDeleteCredito = async () => {
    if (!deletingCredito) return;
    
    try {
      await deleteCredito.mutateAsync({
        id: deletingCredito.id,
        administradora: deletingCredito.administradora,
        group_code: deletingCredito.group_code,
      });
      
      setDeletingCredito(null);
    } catch (error) {
      console.error("Erro ao deletar crédito:", error);
    }
  };

  const isLastCreditInGroup = creditos.data?.length === 1;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-white border-rc-primary/20 hover:border-rc-primary/40 transition-all">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <FileText className="h-5 w-5 text-rc-secondary flex-shrink-0" />
                <div>
                  <CardTitle className="text-base text-rc-primary">
                    Grupo {grupo.group_code}
                  </CardTitle>
                  {grupo.grupo_descricao && (
                    <CardDescription className="text-sm text-gray-600">
                      {grupo.grupo_descricao}
                    </CardDescription>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-rc-accent text-rc-primary border-rc-primary/20">
                  {grupo.total_creditos} {grupo.total_creditos === 1 ? "crédito" : "créditos"}
                </Badge>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="border-t border-rc-primary/20 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Prazo:</span>
                <span className="text-rc-type font-medium">{grupo.prazo_months} meses</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de Créditos:</span>
                <span className="text-rc-type font-medium">{grupo.total_creditos}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-rc-primary/20">
              <Button
                size="sm"
                variant="outline"
                className="w-full border-rc-primary/30 text-rc-primary hover:bg-rc-accent/50"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCreditos(!showCreditos);
                }}
              >
                {showCreditos ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Ocultar Créditos
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Todos os Créditos
                  </>
                )}
              </Button>
            </div>

            {showCreditos && (
              <div className="mt-4 space-y-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-rc-primary/30 text-rc-primary hover:bg-rc-accent/50"
                  onClick={() => setAddingCreditoToGrupo(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Crédito
                </Button>

                {creditos.isLoading && (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                )}

                {creditos.isError && (
                  <div className="text-center py-4 text-red-600">
                    <p>Erro ao carregar créditos</p>
                  </div>
                )}

                {creditos.data && creditos.data.length === 0 && (
                  <div className="text-center py-4 text-gray-600">
                    <p>Nenhum crédito encontrado</p>
                  </div>
                )}

                {creditos.data && creditos.data.length > 0 && (
                  <div className="rounded-md border border-rc-primary/20 overflow-x-auto animate-fade-in">
                    <Table>
                      <TableHeader className="bg-rc-accent/30">
                        <TableRow className="border-rc-primary/10 hover:bg-rc-accent/50">
                          <TableHead className="text-rc-primary font-semibold">Crédito</TableHead>
                          <TableHead className="text-rc-primary font-semibold">Parcela</TableHead>
                          <TableHead className="text-rc-primary font-semibold">Prazo</TableHead>
                          <TableHead className="text-right text-rc-primary font-semibold">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {creditos.data.map((credito) => (
                          <TableRow key={credito.id} className="border-rc-primary/10 hover:bg-rc-accent/20">
                            <TableCell className="font-medium text-rc-type">
                              {formatCurrency(Number(credito.credito))}
                            </TableCell>
                            <TableCell className="text-rc-type">
                              {formatCurrency(Number(credito.parcela))}
                            </TableCell>
                            <TableCell className="text-rc-type">{credito.prazo_months} meses</TableCell>
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <div className="flex justify-end gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setEditingCredito(credito)}
                                        className="text-rc-secondary hover:text-rc-secondary/80"
                                        aria-label="Editar crédito"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar crédito</TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setDeletingCredito(credito)}
                                        className="text-red-600 hover:text-red-700"
                                        aria-label="Deletar crédito"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Deletar crédito</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
      
      <EditarCreditoDialog
        credito={editingCredito}
        open={!!editingCredito}
        onOpenChange={(open) => !open && setEditingCredito(null)}
      />

      <NovoCreditoDialog
        administradora={administradora}
        open={addingCreditoToGrupo}
        onOpenChange={setAddingCreditoToGrupo}
        onSuccess={() => {
          setShowCreditos(true);
          creditos.refetch();
        }}
        prefilledGroup={{
          group_code: grupo.group_code,
          prazo_months: grupo.prazo_months,
          grupo_descricao: grupo.grupo_descricao || undefined,
        }}
      />

      <AlertDialog open={!!deletingCredito} onOpenChange={(open) => !open && setDeletingCredito(null)}>
        <AlertDialogContent className="bg-white border-rc-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-rc-primary">
              {isLastCreditInGroup ? "⚠️ Atenção: Último crédito do grupo!" : "Confirmar exclusão"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-gray-700">
...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCredito.isPending} className="bg-white border-gray-300 text-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCredito}
              disabled={deleteCredito.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteCredito.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                isLastCreditInGroup ? "Deletar Grupo" : "Deletar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Collapsible>
  );
};

export default AdministradoraDetalhes;
