import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, ArrowLeft, Shield, RefreshCw, HelpCircle } from 'lucide-react';
import { PreviewCard } from '@/components/calculadora/PreviewCard';
import { ExampleCasesModal } from '@/components/calculadora/ExampleCasesModal';
import { EvolutionTab } from '@/components/calculadora/EvolutionTab';

const formSchema = z.object({
  valorCredito: z.number().min(1000, 'Valor mínimo: R$ 1.000'),
  duracaoCiclo: z.number().min(12).max(360),
  taxaRendimento: z.enum(['0.8', '1.2', '1.5']),
  taxaJuros: z.number().min(0).max(100),
  tipoEstrategia: z.enum(['Financiamento Bancário', 'Consórcio']),
  valorParcela: z.number().min(100, 'Valor mínimo: R$ 100'),
  correcaoINCC: z.enum(['4.5', '6']),
  mesContemplacao: z.number().min(1),
});

type FormData = z.infer<typeof formSchema>;

const CalculadoraInteligente = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('parametros');
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorCredito: 500000,
      duracaoCiclo: 180,
      taxaRendimento: '1.2',
      taxaJuros: 10,
      tipoEstrategia: 'Financiamento Bancário',
      valorParcela: 2000,
      correcaoINCC: '4.5',
      mesContemplacao: 30,
    },
  });

  const duracaoCiclo = watch('duracaoCiclo');
  const taxaRendimento = watch('taxaRendimento');
  const taxaJuros = watch('taxaJuros');
  const correcaoINCC = watch('correcaoINCC');
  const mesContemplacao = watch('mesContemplacao');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const onSubmit = (data: FormData) => {
    console.log('Dados do formulário:', data);
    setActiveTab('evolucao');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/ferramentas')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Calculadora Inteligente</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-2 mb-8 h-auto">
            <TabsTrigger value="parametros" className="text-sm md:text-base py-3">
              Parâmetros
            </TabsTrigger>
            <TabsTrigger value="evolucao" className="text-sm md:text-base py-3">
              Valorização do Crédito
            </TabsTrigger>
          </TabsList>

          {/* Aba de Parâmetros */}
          <TabsContent value="parametros">
        <Card className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
          <div className="p-8">
            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Parâmetros do Investimento
              </h2>
              
              {/* Selos de Transparência */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 px-3 py-1">
                  <Shield className="w-3.5 h-3.5" />
                  Cálculos 100% Transparentes
                </Badge>
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 px-3 py-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Atualizado em Tempo Real
                </Badge>
              </div>
              
              <p className="text-muted-foreground">
                Configure os parâmetros para simular seu investimento imobiliário
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Grid de 2 colunas para campos do formulário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Coluna 1 */}
                    <div className="space-y-6">
                      {/* Valor do Crédito/Imóvel */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="valorCredito">Valor do Crédito / Imóvel</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Valor total do imóvel ou crédito de consórcio desejado</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                    <Input
                      id="valorCredito"
                      type="number"
                      step="1000"
                      {...register('valorCredito', { valueAsNumber: true })}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(watch('valorCredito') || 0)}
                    </p>
                    {errors.valorCredito && (
                      <p className="text-sm text-destructive">{errors.valorCredito.message}</p>
                    )}
                  </div>

                      {/* Duração do Ciclo */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="duracaoCiclo">Duração do Ciclo (meses)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Período total do consórcio ou financiamento em meses</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                    <Input
                      id="duracaoCiclo"
                      type="number"
                      {...register('duracaoCiclo', { valueAsNumber: true })}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      {duracaoCiclo} meses ({(duracaoCiclo / 12).toFixed(1)} anos)
                    </p>
                    {errors.duracaoCiclo && (
                      <p className="text-sm text-destructive">{errors.duracaoCiclo.message}</p>
                    )}
                  </div>

                      {/* Taxa de Rendimento Mensal */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="taxaRendimento">Taxa de Rendimento Mensal (%)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Rendimento esperado em investimentos ou aluguel mensal</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                    <Select
                      value={watch('taxaRendimento')}
                      onValueChange={(value) => setValue('taxaRendimento', value as '0.8' | '1.2' | '1.5')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a taxa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.8">0,8% (Pessimista)</SelectItem>
                        <SelectItem value="1.2">1,2% (Conservador)</SelectItem>
                        <SelectItem value="1.5">1,5% (Otimista)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {taxaRendimento ? taxaRendimento.replace('.', ',') : '1,2'}% ao mês
                    </p>
                    {errors.taxaRendimento && (
                      <p className="text-sm text-destructive">{errors.taxaRendimento.message}</p>
                    )}
                  </div>

                      {/* Taxa Juros Financiamento */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="taxaJuros">Taxa Juros Financiamento (% a.a.)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Taxa de juros anual cobrada no financiamento bancário</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                    <Input
                      id="taxaJuros"
                      type="number"
                      step="0.1"
                      {...register('taxaJuros', { valueAsNumber: true })}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      {taxaJuros}% ao ano
                    </p>
                    {errors.taxaJuros && (
                      <p className="text-sm text-destructive">{errors.taxaJuros.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Coluna 2 */}
                    <div className="space-y-6">
                      {/* Tipo de Estratégia Principal */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="tipoEstrategia">Tipo de Estratégia Principal</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Escolha entre financiamento bancário ou consórcio</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                    <Select
                      value={watch('tipoEstrategia')}
                      onValueChange={(value) => setValue('tipoEstrategia', value as 'Financiamento Bancário' | 'Consórcio')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a estratégia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Financiamento Bancário">Financiamento Bancário</SelectItem>
                        <SelectItem value="Consórcio">Consórcio</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.tipoEstrategia && (
                      <p className="text-sm text-destructive">{errors.tipoEstrategia.message}</p>
                    )}
                  </div>

                      {/* Valor da Parcela Mensal */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="valorParcela">Valor da Parcela Mensal</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Valor mensal que você pode investir ou pagar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                    <Input
                      id="valorParcela"
                      type="number"
                      step="100"
                      {...register('valorParcela', { valueAsNumber: true })}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(watch('valorParcela') || 0)}
                    </p>
                    {errors.valorParcela && (
                      <p className="text-sm text-destructive">{errors.valorParcela.message}</p>
                    )}
                  </div>

                      {/* Correção Anual pelo INCC */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="correcaoINCC">Correção Anual pelo INCC (%)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Índice de correção anual aplicado ao valor do imóvel</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Select
                          value={watch('correcaoINCC')}
                          onValueChange={(value) => {
                            setValue('correcaoINCC', value as '4.5' | '6', { shouldValidate: true, shouldDirty: true });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a correção" />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="4.5">4,5% (Conservador)</SelectItem>
                            <SelectItem value="6">6% (Otimista)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          {correcaoINCC ? correcaoINCC.replace('.', ',') : '4,5'}% ao ano
                        </p>
                        {errors.correcaoINCC && (
                          <p className="text-sm text-destructive">{errors.correcaoINCC.message}</p>
                        )}
                      </div>

                      {/* Mês de Contemplação */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="mesContemplacao">Mês de Contemplação</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Mês estimado para receber o crédito do consórcio</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                    <Input
                      id="mesContemplacao"
                      type="number"
                      {...register('mesContemplacao', { valueAsNumber: true })}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      Mês {mesContemplacao} de {duracaoCiclo}
                    </p>
                    {errors.mesContemplacao && (
                      <p className="text-sm text-destructive">{errors.mesContemplacao.message}</p>
                        )}
                      </div>
                    </div>
              </div>

              {/* Preview Card - Abaixo do formulário */}
              <div className="pt-4">
                <PreviewCard
                  valorCredito={watch('valorCredito') || 0}
                  duracaoCiclo={watch('duracaoCiclo') || 180}
                  taxaRendimento={watch('taxaRendimento') || '1.2'}
                  valorParcela={watch('valorParcela') || 0}
                  correcaoINCC={watch('correcaoINCC') || '4.5'}
                />
              </div>

              {/* Texto de Confiança */}
              <div className="text-center text-sm text-muted-foreground py-4">
                <p>✓ Todos os cálculos consideram inflação, valorização e correção monetária</p>
              </div>

              {/* Botão de Ação e Exemplos */}
              <div className="flex flex-col items-center gap-4 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full lg:w-auto px-12 py-6 text-lg"
                >
                  Calcular e Ver Resultados
                </Button>
                
                {/* Modal de Casos Similares */}
                <ExampleCasesModal />
              </div>

              {/* Rodapé de Metodologia */}
              <div className="text-center text-xs text-muted-foreground pt-6 border-t">
                <p>Metodologia baseada em dados do mercado imobiliário brasileiro</p>
              </div>
            </form>
          </div>
        </Card>
          </TabsContent>

          {/* Aba de Evolução do Patrimônio */}
          <TabsContent value="evolucao">
            <EvolutionTab
              valorCredito={watch('valorCredito') || 500000}
              duracaoCiclo={watch('duracaoCiclo') || 180}
              taxaRendimento={parseFloat(watch('taxaRendimento') || '1.2')}
              valorParcela={watch('valorParcela') || 2000}
              correcaoINCC={parseFloat(watch('correcaoINCC') || '4.5')}
            />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default CalculadoraInteligente;
