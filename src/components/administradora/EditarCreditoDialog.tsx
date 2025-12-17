import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreditPrice, CreditPrice } from "@/hooks/useCreditPrice";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formSchema = z.object({
  credito: z.string()
    .min(1, "Valor do crédito é obrigatório")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Valor deve ser maior que zero"),
  parcela: z.string()
    .min(1, "Valor da parcela é obrigatório")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Valor deve ser maior que zero"),
  grupo_descricao: z.string().optional(),
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

interface EditarCreditoDialogProps {
  credito: CreditPrice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditarCreditoDialog({ credito, open, onOpenChange }: EditarCreditoDialogProps) {
  const { updateCredito } = useCreditPrice();
  const creditoInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validação em tempo real
    defaultValues: {
      credito: credito?.credito.toString() || "",
      parcela: credito?.parcela.toString() || "",
      grupo_descricao: credito?.grupo_descricao || "",
    },
  });

  // Reset form when credito changes
  useEffect(() => {
    if (credito) {
      form.reset({
        credito: credito.credito.toString(),
        parcela: credito.parcela.toString(),
        grupo_descricao: credito.grupo_descricao || "",
      });
    }
  }, [credito, form]);

  // Auto-focus on first field when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => creditoInputRef.current?.focus(), 100);
    }
  }, [open]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!credito) return;

    await updateCredito.mutateAsync({
      id: credito.id,
      updates: {
        credito: parseFloat(values.credito),
        parcela: parseFloat(values.parcela),
        grupo_descricao: values.grupo_descricao || null,
      },
    });

    onOpenChange(false);
    form.reset();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const creditoValue = form.watch("credito");
  const parcelaValue = form.watch("parcela");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-rc-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl text-rc-primary">Editar Crédito</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Comparação de valores */}
            {credito && (creditoValue !== credito.credito.toString() || parcelaValue !== credito.parcela.toString()) && (
              <div className="p-3 bg-rc-accent/30 border border-rc-primary/20 rounded-lg space-y-1 animate-fade-in">
                <p className="text-sm text-rc-type">
                  <span className="text-gray-600">Crédito:</span>{" "}
                  <span className="line-through text-gray-400">{formatCurrency(Number(credito.credito))}</span>
                  {" → "}
                  <span className="text-rc-secondary font-medium">{creditoValue && formatCurrency(Number(creditoValue))}</span>
                </p>
                <p className="text-sm text-rc-type">
                  <span className="text-gray-600">Parcela:</span>{" "}
                  <span className="line-through text-gray-400">{formatCurrency(Number(credito.parcela))}</span>
                  {" → "}
                  <span className="text-rc-secondary font-medium">{parcelaValue && formatCurrency(Number(parcelaValue))}</span>
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
                          <FormLabel className="cursor-help text-rc-type font-medium">Valor do Crédito (R$)</FormLabel>
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
                    {field.value && !isNaN(Number(field.value)) && (
                      <p className="text-xs text-rc-secondary">
                        {formatCurrency(Number(field.value))}
                      </p>
                    )}
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
                          <FormLabel className="cursor-help text-rc-type font-medium">Valor da Parcela (R$)</FormLabel>
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
                    {field.value && !isNaN(Number(field.value)) && (
                      <p className="text-xs text-rc-secondary">
                        {formatCurrency(Number(field.value))}
                      </p>
                    )}
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
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateCredito.isPending} className="bg-rc-primary hover:bg-rc-primary/90 text-white">
                {updateCredito.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
