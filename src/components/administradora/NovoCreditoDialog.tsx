import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreditPrice } from "@/hooks/useCreditPrice";
import { Loader2, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const formSchema = z.object({
  group_code: z.string()
    .min(1, "Número do grupo é obrigatório")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Deve ser um número válido"),
  grupo_descricao: z.string().optional(),
  prazo_months: z.string()
    .min(1, "Prazo é obrigatório")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Deve ser maior que zero"),
  credito: z.string()
    .min(1, "Valor do crédito é obrigatório")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Valor deve ser maior que zero"),
  parcela: z.string()
    .min(1, "Valor da parcela é obrigatório")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Valor deve ser maior que zero"),
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

type FormData = z.infer<typeof formSchema>;

interface NovoCreditoDialogProps {
  administradora: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  prefilledGroup?: {
    group_code: number;
    prazo_months: number;
    grupo_descricao?: string;
  };
}

export default function NovoCreditoDialog({ administradora, open, onOpenChange, onSuccess, prefilledGroup }: NovoCreditoDialogProps) {
  const { addCredito } = useCreditPrice();
  const groupCodeInputRef = React.useRef<HTMLInputElement>(null);
  const creditoInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      group_code: prefilledGroup ? String(prefilledGroup.group_code) : "",
      grupo_descricao: prefilledGroup?.grupo_descricao || "",
      prazo_months: prefilledGroup ? String(prefilledGroup.prazo_months) : "",
      credito: "",
      parcela: "",
    },
  });

  // Auto-focus on first field when dialog opens
  useEffect(() => {
    if (open) {
      if (prefilledGroup) {
        setTimeout(() => creditoInputRef.current?.focus(), 100);
      } else {
        setTimeout(() => groupCodeInputRef.current?.focus(), 100);
      }
    }
  }, [open, prefilledGroup]);

  const handleAddAndClose = async (data: FormData) => {
    try {
      await addCredito.mutateAsync({
        administradora,
        group_code: Number(data.group_code),
        grupo_descricao: data.grupo_descricao || null,
        prazo_months: Number(data.prazo_months),
        credito: Number(data.credito),
        parcela: Number(data.parcela),
      });
      
      // Aguardar um momento para garantir que as queries foram invalidadas
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast.success("Crédito adicionado com sucesso!");
      onSuccess?.();
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao adicionar crédito:", error);
      // Erro já tratado pelo hook
    }
  };

  const handleAddAndContinue = async (data: FormData) => {
    try {
      await addCredito.mutateAsync({
        administradora,
        group_code: Number(data.group_code),
        grupo_descricao: data.grupo_descricao || null,
        prazo_months: Number(data.prazo_months),
        credito: Number(data.credito),
        parcela: Number(data.parcela),
      });
      
      // Aguardar um momento para garantir que as queries foram invalidadas
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast.success("Crédito adicionado! Adicione mais créditos.");
      onSuccess?.();
      
      // Limpar apenas os campos de crédito e parcela
      form.setValue("credito", "");
      form.setValue("parcela", "");
      
      // Focar no campo de crédito
      setTimeout(() => creditoInputRef.current?.focus(), 100);
    } catch (error) {
      console.error("Erro ao adicionar crédito:", error);
      // Erro já tratado pelo hook
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !addCredito.isPending) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const creditoValue = form.watch("credito");
  const parcelaValue = form.watch("parcela");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white border-rc-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl text-rc-primary">
            {prefilledGroup ? `Adicionar Crédito ao Grupo ${prefilledGroup.group_code}` : "Novo Grupo de Crédito"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {prefilledGroup 
              ? `Adicione mais créditos ao grupo ${prefilledGroup.group_code} na administradora ${administradora}`
              : `Cadastre o primeiro crédito para criar um novo grupo na administradora ${administradora}`
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="group_code"
                render={({ field }) => (
                  <FormItem>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="cursor-help text-rc-type font-medium">Número do Grupo *</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white border-rc-primary/30">Identificador único do grupo na administradora</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormControl>
                      <Input
                        ref={groupCodeInputRef}
                        type="number"
                        placeholder="Ex: 123"
                        {...field}
                        disabled={!!prefilledGroup}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prazo_months"
                render={({ field }) => (
                  <FormItem>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="cursor-help text-rc-type font-medium">Prazo (meses) *</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white border-rc-primary/30">Duração total do consórcio</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 120"
                        {...field}
                        disabled={!!prefilledGroup}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="grupo_descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-rc-type font-medium">Descrição do Grupo (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Grupo Premium"
                      {...field}
                      disabled={!!prefilledGroup}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t border-gray-300 pt-4 mt-4">
              <h3 className="text-sm font-medium text-rc-type mb-3">
                {prefilledGroup ? "Dados do Novo Crédito" : "Primeiro Crédito do Grupo"}
              </h3>
              
              {/* Preview de valores formatados */}
              {(creditoValue || parcelaValue) && (
                <div className="mb-3 p-3 bg-rc-accent/30 border border-rc-primary/20 rounded-lg animate-fade-in">
                  <p className="text-sm text-rc-type">
                    {creditoValue && !isNaN(Number(creditoValue)) && (
                      <span className="block">
                        <span className="text-gray-600">Crédito:</span>{" "}
                        <span className="text-rc-secondary font-medium">{formatCurrency(Number(creditoValue))}</span>
                      </span>
                    )}
                    {parcelaValue && !isNaN(Number(parcelaValue)) && (
                      <span className="block">
                        <span className="text-gray-600">Parcela:</span>{" "}
                        <span className="text-rc-secondary font-medium">{formatCurrency(Number(parcelaValue))}</span>
                      </span>
                    )}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="credito"
                  render={({ field }) => (
                    <FormItem>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FormLabel className="cursor-help text-rc-type font-medium">Valor do Crédito (R$) *</FormLabel>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white border-rc-primary/30">Valor total do bem/crédito do consórcio</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <FormControl>
                        <Input
                          ref={creditoInputRef}
                          type="number"
                          step="0.01"
                          placeholder="50000"
                          {...field}
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parcela"
                  render={({ field }) => (
                    <FormItem>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FormLabel className="cursor-help text-rc-type font-medium">Valor da Parcela (R$) *</FormLabel>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white border-rc-primary/30">Valor mensal da parcela do consórcio</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="850"
                          {...field}
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => handleOpenChange(false)}
                disabled={addCredito.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-rc-primary/30 text-rc-primary hover:bg-rc-accent/50"
                onClick={() => form.handleSubmit(handleAddAndContinue)()}
                disabled={addCredito.isPending}
              >
                {addCredito.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar e Continuar
                  </>
                )}
              </Button>
              <Button
                type="button"
                className="flex-1 bg-rc-primary hover:bg-rc-primary/90 text-white"
                onClick={() => form.handleSubmit(handleAddAndClose)()}
                disabled={addCredito.isPending}
              >
                {addCredito.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Adicionar e Fechar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
