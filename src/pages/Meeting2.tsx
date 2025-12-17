import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, User, DollarSign, Target, Clock, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ADMINISTRADORAS, ADMINISTRADORA_LABELS, type Administradora } from "@/types/administradoras";

const formSchema = z.object({
  nomeCliente: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  administradora: z.string()
    .min(1, "Selecione uma administradora")
    .refine((val) => val === 'Canopus' || val === 'Rodobens', {
      message: "Selecione uma administradora válida"
    }),
  group_code: z.string().min(1, "Selecione um grupo"),
  prazo_months: z.string().min(1, "Selecione um prazo"),
  approx_installment_brl: z.string().min(1, "Valor da parcela é obrigatório"),
  objetivo: z.enum(["moradia", "renda-extra", "aposentadoria"]),
});

type FormValues = z.infer<typeof formSchema>;

interface CreditPriceResult {
  id: string;
  group_code: number;
  prazo_months: number;
  credito: number;
  parcela: number;
}

interface QuotaComposition {
  credito: number;
  parcela: number;
  count: number;
}

interface CardBenefits {
  imoveis: number;
  reformasMobilia: number;
  includeMobilia?: boolean; // default true - controla se é "Reforma + Mobília" ou "Reforma"
  consultoria: '12x R$ 1.000' | '3x R$ 200' | '3x R$ 500' | '6x R$ 200' | '6x R$ 500' | '12x R$ 500' | '12x R$ 200';
  assessoriaJuridicaContabil: boolean;
  cashback: number; // Agora representa porcentagem (30, 50, 70, 100)
  maiorPadrao?: {
    ativo: boolean;
    quantidade: number;
  };
  recommended?: boolean; // default false - opcional, apenas 1 card pode ser marcado
}

interface Meeting2State {
  client_name: string;
  objective: string;
  administradora: Administradora;
  group_code: string;
  prazo_months: string;
  approx_installment_brl: string;
  target_installment_num: number;
  chosen: {
    group_code: number;
    prazo_months: number;
    credito: number;
    parcela: number;
    fator: number;
  };
  combination: {
    quotas: QuotaComposition[];
    total_credito: number;
    total_parcela: number;
  };
  options_cache: {
    prazos: number[];
    prices: Array<{ credito: number; parcela: number }>;
  };
  benefitsPerCard: CardBenefits[];
}

export default function Meeting2() {
  const navigate = useNavigate();
  useScrollToTop();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<CreditPriceResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [availableGroups, setAvailableGroups] = useState<number[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [availablePrazos, setAvailablePrazos] = useState<number[]>([]);
  const [availablePrices, setAvailablePrices] = useState<Array<{ credito: number; parcela: number }>>([]);
  const [quotaComposition, setQuotaComposition] = useState<QuotaComposition[]>([]);
  const [compositionTotals, setCompositionTotals] = useState<{ total_credito: number; total_parcela: number }>({ total_credito: 0, total_parcela: 0 });
  const [isLoadingPrazos, setIsLoadingPrazos] = useState(false);
  const [quotaPreference, setQuotaPreference] = useState<'min' | 'max'>('min');
  
  // Benefits configuration states
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [benefitsPerCard, setBenefitsPerCard] = useState<CardBenefits[]>([
    { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: '12x R$ 500', assessoriaJuridicaContabil: false, cashback: 0, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false },
    { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: '3x R$ 200', assessoriaJuridicaContabil: false, cashback: 30, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false },
    { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: '3x R$ 200', assessoriaJuridicaContabil: false, cashback: 30, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false }
  ]);
  
  // Cache para composições de cotas
  const compositionCache = useMemo(() => new Map<string, QuotaComposition[]>(), []);
  const [cardsCompleted, setCardsCompleted] = useState<boolean[]>([false, false, false]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCliente: "",
      administradora: undefined,
      group_code: "",
      prazo_months: "",
      approx_installment_brl: "",
      objetivo: undefined,
    },
  });
  
  useEffect(() => {
    const savedAdmin = localStorage.getItem('meeting2_administradora');
    if (savedAdmin && !form.getValues("administradora")) {
      form.setValue("administradora", savedAdmin as Administradora);
      setAvailableGroups([]);
      setAvailablePrazos([]);
      setAvailablePrices([]);
      setSelectedCredit(null);
      setQuotaComposition([]);
      setCompositionTotals({ total_credito: 0, total_parcela: 0 });
      fetchAvailableGroups(savedAdmin);
    }
  }, []);
  
  // Função para buscar prazos disponíveis baseado no grupo
  const fetchAvailablePrazos = async (administradora: string, groupCode: string) => {
    if (!administradora || !groupCode) return [];

    try {
      setIsLoadingPrazos(true);
      const { data, error } = await supabase
        .from('credit_price')
        .select('prazo_months')
        .eq('administradora', administradora)
        .eq('group_code', parseInt(groupCode))
        .order('prazo_months', { ascending: true });

      if (error) {
        console.error('Error fetching prazos:', error);
        return [];
      }

      const uniquePrazos = [...new Set(data.map(item => item.prazo_months))];
      setAvailablePrazos(uniquePrazos);
      return uniquePrazos;
    } catch (error) {
      console.error('Error in fetchAvailablePrazos:', error);
      return [];
    } finally {
      setIsLoadingPrazos(false);
    }
  };

  // Função para buscar grupos disponíveis por administradora
  const fetchAvailableGroups = async (administradora: string) => {
    if (!administradora) return;

    setIsLoadingGroups(true);
    try {
      const { data, error } = await supabase
        .from('credit_price')
        .select('group_code')
        .eq('administradora', administradora)
        .order('group_code', { ascending: true });

      if (error) {
        console.error('Error fetching groups:', error);
        toast.error('Erro ao carregar grupos');
        return;
      }

      // Extrair grupos únicos
      const uniqueGroups = Array.from(new Set(data.map(item => item.group_code))).sort((a, b) => a - b);
      setAvailableGroups(uniqueGroups);
    } catch (error) {
      console.error('Error in fetchAvailableGroups:', error);
      toast.error('Erro ao carregar grupos');
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Função para buscar todas as parcelas disponíveis para um par (grupo, prazo)
  const fetchAvailablePrices = async (administradora: string, groupCode: string, prazoMonths: string) => {
    if (!administradora || !groupCode || !prazoMonths) return [];

    try {
      const { data, error } = await supabase
        .from('credit_price')
        .select('credito, parcela')
        .eq('administradora', administradora)
        .eq('group_code', parseInt(groupCode))
        .eq('prazo_months', parseInt(prazoMonths))
        .order('parcela', { ascending: true });

      if (error) {
        console.error('Error fetching prices:', error);
        return [];
      }

      setAvailablePrices(data || []);
      return data || [];
    } catch (error) {
      console.error('Error in fetchAvailablePrices:', error);
      return [];
    }
  };

  // Algoritmo de composição otimizado (greedy approach)
  const findBestQuotaComposition = (prices: Array<{ credito: number; parcela: number }>, targetValue: number, preference: 'min' | 'max' = 'min') => {
    if (!prices.length || targetValue <= 0) return [];

    // Verificar cache
    const cacheKey = `${targetValue}-${preference}-${prices.length}`;
    const cached = compositionCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Ordenar por eficiência (credito/parcela ratio)
    const sortedPrices = [...prices].sort((a, b) => {
      const ratioA = a.credito / a.parcela;
      const ratioB = b.credito / b.parcela;
      return preference === 'min' ? ratioB - ratioA : ratioA - ratioB;
    });

    // Usar apenas os top 10 preços mais eficientes
    const topPrices = sortedPrices.slice(0, 10);
    let bestComposition: QuotaComposition[] = [];
    let bestExcess = Infinity;

    // Testar cada preço eficiente
    for (const price of topPrices) {
      const composition: QuotaComposition[] = [];
      let currentTotal = 0;

      // Abordagem gulosa: adicionar blocos de cotas até atingir o target
      while (currentTotal < targetValue) {
        const remaining = targetValue - currentTotal;
        const quotasNeeded = Math.ceil(remaining / price.parcela);
        
        // Adicionar de 1 a 10 cotas por vez
        const quotasToAdd = Math.min(quotasNeeded, 10);
        
        composition.push({
          credito: price.credito,
          parcela: price.parcela,
          count: quotasToAdd
        });
        
        currentTotal += price.parcela * quotasToAdd;

        // Se atingiu ou ultrapassou, verificar se é a melhor composição
        if (currentTotal >= targetValue) {
          const excess = currentTotal - targetValue;
          if (excess < bestExcess) {
            bestExcess = excess;
            bestComposition = [...composition];
          }
          break;
        }
      }
    }

    // Fallback seguro se nenhuma composição foi encontrada
    if (bestComposition.length === 0) {
      const fallbackPrice = sortedPrices[0];
      const quotasNeeded = Math.ceil(targetValue / fallbackPrice.parcela);
      bestComposition = [{
        credito: fallbackPrice.credito,
        parcela: fallbackPrice.parcela,
        count: quotasNeeded
      }];
    }

    // Salvar no cache
    compositionCache.set(cacheKey, bestComposition);
    return bestComposition;
  };

  const searchCredit = async (administradora: string, groupCode: string, prazoMonths: string, targetValue: number) => {
    if (!administradora || !groupCode || !prazoMonths) return null;

    try {
      setIsSearching(true);
      
      // Query 1: Buscar primeira parcela >= target
      const { data: upperData, error: upperError } = await supabase
        .from('credit_price')
        .select('*')
        .eq('administradora', administradora)
        .eq('group_code', parseInt(groupCode))
        .eq('prazo_months', parseInt(prazoMonths))
        .gte('parcela', targetValue)
        .order('parcela', { ascending: true })
        .limit(1);

      if (upperError) {
        console.error('Error in upper query:', upperError);
        throw upperError;
      }

      // Se encontrou uma parcela >= target, usa ela
      if (upperData && upperData.length > 0) {
        return upperData[0];
      }

      // Query 2: Fallback - buscar a maior parcela disponível
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('credit_price')
        .select('*')
        .eq('administradora', administradora)
        .eq('group_code', parseInt(groupCode))
        .eq('prazo_months', parseInt(prazoMonths))
        .order('parcela', { ascending: false })
        .limit(1);

      if (fallbackError) {
        console.error('Error in fallback query:', fallbackError);
        throw fallbackError;
      }

      return fallbackData && fallbackData.length > 0 ? fallbackData[0] : null;
    } catch (error) {
      console.error('Error searching credit:', error);
      toast.error('Erro ao buscar dados de crédito');
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  // Função para calcular patrimônio e renda baseado na parcela (mantida para compatibilidade)
  const calculatePatrimonyAndIncome = (parcelaValue: string) => {
    // Remove formatação e converte para número
    const parcela = Number(parcelaValue.replace(/\D/g, '')) / 100;
    
    // A cada 600 reais = 125k de crédito
    const creditoImobiliario = (parcela / 600) * 125000;
    
    // Patrimônio = crédito * 5, arredondado para múltiplos de 100k
    const patrimonioBase = Math.ceil(creditoImobiliario * 5);
    const patrimonio = Math.ceil(patrimonioBase / 100000) * 100000;
    
    // Renda mensal = 1% do patrimônio, arredondado para múltiplos de 1k
    const rendaBase = Math.ceil(patrimonio * 0.01);
    const rendaMensal = Math.ceil(rendaBase / 1000) * 1000;
    
    return {
      patrimonio,
      rendaMensal,
      creditoImobiliario
    };
  };

  // Handler para mudança no campo de parcela com composição de cotas
  const handleInstallmentChange = async (value: string, administradora: string, groupCode: string, prazoMonths: string) => {
    if (!groupCode || !prazoMonths) {
      toast.error('Selecione Grupo e Prazo antes de informar a parcela.');
      return;
    }

    const numericValue = Number(value.replace(/\D/g, '')) / 100;
    
    // Guard clauses: só calcular se temos dados válidos e disponíveis
    if (numericValue <= 0 || availablePrices.length === 0) {
      return;
    }
    
    // Aviso para valores muito altos (sem truncar)
    if (numericValue > 50000) {
      toast.info('⚠️ Valor alto detectado. O cálculo pode demorar alguns segundos.', {
        duration: 3000
      });
    }
    
    if (numericValue > 0) {
      // Buscar resultado de cota única (ceiling)
      const result = await searchCredit(administradora, groupCode, prazoMonths, numericValue);
      setSelectedCredit(result);
      
      // Calcular composição de múltiplas cotas
      if (availablePrices.length > 0) {
        const composition = findBestQuotaComposition(availablePrices, numericValue, quotaPreference);
        setQuotaComposition(composition);
        
        // Calcular totais da composição
        const totals = composition.reduce(
          (acc, quota) => ({
            total_credito: acc.total_credito + (quota.credito * quota.count),
            total_parcela: acc.total_parcela + (quota.parcela * quota.count)
          }),
          { total_credito: 0, total_parcela: 0 }
        );
        setCompositionTotals(totals);
      } else {
        setQuotaComposition([]);
        setCompositionTotals({ total_credito: 0, total_parcela: 0 });
      }
      
      if (!result) {
        toast.error('Nenhum dado encontrado para essa combinação de Grupo e Prazo. Verifique se a combinação está disponível.');
      }
    }
  };

  // Handler para mudança de grupo
  const handleGroupChange = async (value: string, administradora: string) => {
    // Reset campos dependentes
    form.setValue("prazo_months", "");
    form.setValue("approx_installment_brl", "");
    setSelectedCredit(null);
    setAvailablePrices([]);
    setQuotaComposition([]);
    setCompositionTotals({ total_credito: 0, total_parcela: 0 });
    
    // Buscar prazos disponíveis
    await fetchAvailablePrazos(administradora, value);
  };

  // Handler para mudança de prazo
  const handlePrazoChange = async (value: string, administradora: string, groupCode: string) => {
    // Reset campos dependentes
    form.setValue("approx_installment_brl", "");
    setSelectedCredit(null);
    setQuotaComposition([]);
    setCompositionTotals({ total_credito: 0, total_parcela: 0 });
    
    if (groupCode && value) {
      // Buscar todas as parcelas disponíveis para este par
      await fetchAvailablePrices(administradora, groupCode, value);
    }
  };

  // Handler para alterar a preferência de composição de cotas
  const handleQuotaPreferenceChange = (newPreference: 'min' | 'max') => {
    setQuotaPreference(newPreference);
    
    // Recalcular composição se já temos dados
    const installmentValue = form.watch("approx_installment_brl");
    if (installmentValue && availablePrices.length > 0) {
      const numericValue = Number(installmentValue.replace(/\D/g, '')) / 100;
      const composition = findBestQuotaComposition(availablePrices, numericValue, newPreference);
      setQuotaComposition(composition);
      
      const totals = composition.reduce(
        (acc, quota) => ({
          total_credito: acc.total_credito + (quota.credito * quota.count),
          total_parcela: acc.total_parcela + (quota.parcela * quota.count)
        }),
        { total_credito: 0, total_parcela: 0 }
      );
      setCompositionTotals(totals);
    }
  };

  const watchObjetivo = form.watch("objetivo");
  const watchAdministradora = form.watch("administradora");
  const watchGroupCode = form.watch("group_code");
  const watchPrazoMonths = form.watch("prazo_months");

  // Memoizar cálculo de crédito previsto por card para evitar recalcular a cada render
  const creditPreviewPerCard = useMemo(() => {
    if (!availablePrices.length || compositionTotals.total_parcela === 0) {
      return [0, 0, 0];
    }
    
    return [0, 1, 2].map((cardIndex) => {
      const targetInstallment = compositionTotals.total_parcela + (cardIndex * 500);
      const composition = findBestQuotaComposition(availablePrices, targetInstallment, 'min');
      return composition.reduce((acc, quota) => acc + (quota.credito * quota.count), 0);
    });
  }, [availablePrices, compositionTotals.total_parcela, quotaPreference]);

  const onSubmit = (data: FormValues) => {
    // Salvar administradora escolhida no localStorage
    localStorage.setItem('meeting2_administradora', data.administradora);
    
    // Calcular patrimônio e renda automaticamente (mantido para compatibilidade com valor da parcela existente)
    const calculations = calculatePatrimonyAndIncome(data.approx_installment_brl);
    
    // Preparar dados do Meeting2 com nova estrutura
    const targetInstallmentNum = Number(data.approx_installment_brl.replace(/\D/g, '')) / 100;
    
    const meeting2State: Meeting2State = {
      client_name: data.nomeCliente,
      objective: data.objetivo,
      administradora: data.administradora as Administradora,
      group_code: data.group_code,
      prazo_months: data.prazo_months,
      approx_installment_brl: data.approx_installment_brl,
      target_installment_num: targetInstallmentNum,
      chosen: selectedCredit ? {
        group_code: selectedCredit.group_code,
        prazo_months: selectedCredit.prazo_months,
        credito: selectedCredit.credito,
        parcela: selectedCredit.parcela,
        fator: selectedCredit.parcela / selectedCredit.credito
      } : {
        group_code: 0,
        prazo_months: 0,
        credito: 0,
        parcela: 0,
        fator: 0
      },
      combination: {
        quotas: quotaComposition,
        total_credito: compositionTotals.total_credito,
        total_parcela: compositionTotals.total_parcela
      },
      options_cache: {
        prazos: availablePrazos,
        prices: availablePrices
      },
      benefitsPerCard: benefitsPerCard
    };
    
    // Criar objeto com dados completos (mantido para compatibilidade)
    const completeData = {
      ...data,
      valorParcela: data.approx_installment_brl, // Manter compatibilidade
      patrimonio: calculations.patrimonio.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      rendaMensal: calculations.rendaMensal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      creditoImobiliario: calculations.creditoImobiliario,
      meeting2: meeting2State
    };
    
    // Salvar dados no localStorage
    localStorage.setItem("clienteInfo", JSON.stringify(completeData));
    
    setIsSubmitted(true);
    
    // Redirecionar para meeting2/steps
    navigate("/meeting2/steps");
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (Number(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
    return formattedValue;
  };

  // Benefits card handlers
  const handleCardBenefitChange = (field: keyof CardBenefits, value: any) => {
    const updatedBenefits = [...benefitsPerCard];
    
    // Prevent card 1 (index 0) from having cashback
    if (field === 'cashback' && currentCardIndex === 0) {
      return; // Don't allow changing cashback for card 1
    }
    
    // Handle recommended logic - only one card can be recommended
    if (field === 'recommended' && value === true) {
      // Unmark all other cards as recommended
      updatedBenefits.forEach((benefit, index) => {
        if (index !== currentCardIndex) {
          benefit.recommended = false;
        }
      });
    }
    
    updatedBenefits[currentCardIndex] = {
      ...updatedBenefits[currentCardIndex],
      [field]: value
    };
    setBenefitsPerCard(updatedBenefits);
  };

  const handleMaiorPadraoChange = (field: 'ativo' | 'quantidade', value: boolean | number) => {
    const updatedBenefits = [...benefitsPerCard];
    updatedBenefits[currentCardIndex] = {
      ...updatedBenefits[currentCardIndex],
      maiorPadrao: {
        ...updatedBenefits[currentCardIndex].maiorPadrao!,
        [field]: value
      }
    };
    setBenefitsPerCard(updatedBenefits);
  };

  const saveCardAndAdvance = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('saveCardAndAdvance called - currentCardIndex:', currentCardIndex);
    
    const currentCard = benefitsPerCard[currentCardIndex];
    
    // Validação mínima: consultoria obrigatória
    if (!currentCard.consultoria) {
      toast.error('Consultoria é obrigatória');
      return;
    }

    // Marcar card como completo
    const updatedCompleted = [...cardsCompleted];
    updatedCompleted[currentCardIndex] = true;
    setCardsCompleted(updatedCompleted);

    // Se for o último card, navegar para steps
    if (currentCardIndex === 2) {
      console.log('Final card - preparing navigation to steps');
      
      // Validar se todos os campos necessários estão preenchidos
      const formValues = form.getValues();
      console.log('Form values:', formValues);
      
      if (!formValues.nomeCliente || !formValues.objetivo || !formValues.administradora || 
          !formValues.group_code || !formValues.prazo_months || !formValues.approx_installment_brl) {
        toast.error('Preencha todos os campos obrigatórios antes de continuar');
        return;
      }
      
      // Preparar dados para navegação
      const installmentValue = formValues.approx_installment_brl;
      const numericValue = Number(installmentValue.replace(/\D/g, '')) / 100;
      
      const meeting2State: Meeting2State = {
        client_name: formValues.nomeCliente,
        objective: formValues.objetivo,
        administradora: formValues.administradora as Administradora,
        group_code: formValues.group_code,
        prazo_months: formValues.prazo_months,
        approx_installment_brl: installmentValue,
        target_installment_num: numericValue,
        chosen: selectedCredit ? {
          group_code: parseInt(formValues.group_code),
          prazo_months: parseInt(formValues.prazo_months),
          credito: selectedCredit.credito,
          parcela: selectedCredit.parcela,
          fator: 0.004 // Default factor
        } : {
          group_code: parseInt(formValues.group_code),
          prazo_months: parseInt(formValues.prazo_months),
          credito: numericValue * 240, // Estimate based on typical ratio
          parcela: numericValue,
          fator: 0.004
        },
        combination: {
          quotas: quotaComposition,
          total_credito: compositionTotals.total_credito,
          total_parcela: compositionTotals.total_parcela
        },
        options_cache: {
          prazos: availablePrazos,
          prices: availablePrices
        },
        benefitsPerCard: benefitsPerCard
      };

      console.log('Meeting2 state prepared:', meeting2State);
      
      // Calcular patrimônio e renda para clienteInfo
      const calculations = calculatePatrimonyAndIncome(formValues.approx_installment_brl);
      
      // Criar objeto completo com dados compatíveis
      const completeData = {
        nomeCliente: formValues.nomeCliente,
        objetivo: formValues.objetivo,
        group_code: formValues.group_code,
        prazo_months: formValues.prazo_months,
        approx_installment_brl: formValues.approx_installment_brl,
        valorParcela: formValues.approx_installment_brl, // Manter compatibilidade
        patrimonio: calculations.patrimonio.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }),
        rendaMensal: calculations.rendaMensal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }),
        creditoImobiliario: calculations.creditoImobiliario,
        meeting2: meeting2State
      };
      
      // Salvar ambos os dados no localStorage
      localStorage.setItem('meeting2_state', JSON.stringify(meeting2State));
      localStorage.setItem('clienteInfo', JSON.stringify(completeData));
      
      console.log('Navigating to /meeting2/steps');
      // Navegar para steps
      navigate('/meeting2/steps');
      return;
    }

    // Avançar para próximo card se não for o último
    if (currentCardIndex < 2) {
      console.log('Advancing to next card:', currentCardIndex + 1);
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const isCurrentCardValid = () => {
    const currentCard = benefitsPerCard[currentCardIndex];
    return currentCard.consultoria && 
           currentCard.imoveis >= 0 && 
           currentCard.reformasMobilia >= 0 && 
           currentCard.cashback >= 0;
  };

  return (
    <div className="min-h-screen px-4 py-6" style={{ backgroundColor: "#163B36" }}>
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      <div className="max-w-6xl mx-auto">
        {/* Header with Navigation and Badge */}
        <header className="flex items-center justify-between mb-16">
          <Button
            onClick={() => navigate("/meeting-selection")}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold text-white shadow-lg backdrop-blur-sm" style={{ 
            background: "linear-gradient(135deg, rgba(201, 164, 92, 0.2) 0%, rgba(229, 200, 117, 0.1) 100%)",
            border: "1px solid rgba(201, 164, 92, 0.3)"
          }}>
            <User className="w-4 h-4" style={{ color: "#C9A45C" }} />
            SIMULADOR INTELIGENTE
          </div>

          <div className="w-10"></div> {/* Spacer for centering */}
        </header>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Vamos criar o perfil do cliente
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#C4D5D2" }}>
            Com base nas informações, vamos encontrar opções de consórcio para o objetivo do cliente
          </p>
        </div>

        {/* Form */}
        <Card className="rounded-3xl shadow-2xl" style={{ backgroundColor: "#1F4A43" }}>
          <CardHeader className="text-center mb-8">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-3">
              <User className="w-8 h-8" style={{ color: "#C9A45C" }} />
              Informações do Cliente
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Nome do Cliente */}
                <FormField
                  control={form.control}
                  name="nomeCliente"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel className="text-white font-semibold flex items-center gap-2">
                         <User className="w-4 h-4" />
                         Dois Primeiros Nomes
                       </FormLabel>
                       <FormControl>
                         <Input
                           placeholder="Ex: Tasso Cézar"
                           {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-[#C9A45C] transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Objetivo */}
                <FormField
                  control={form.control}
                  name="objetivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Objetivo Principal
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#C9A45C]/50 transition-all cursor-pointer">
                            <RadioGroupItem value="moradia" id="moradia" style={{ color: "#C9A45C" }} className="border-white/40" />
                            <Label htmlFor="moradia" className="text-white font-medium cursor-pointer flex-1">
                              Casa Própria
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#C9A45C]/50 transition-all cursor-pointer">
                            <RadioGroupItem value="renda-extra" id="renda-extra" style={{ color: "#C9A45C" }} className="border-white/40" />
                            <Label htmlFor="renda-extra" className="text-white font-medium cursor-pointer flex-1">
                              Renda Extra
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#C9A45C]/50 transition-all cursor-pointer">
                            <RadioGroupItem value="aposentadoria" id="aposentadoria" style={{ color: "#C9A45C" }} className="border-white/40" />
                            <Label htmlFor="aposentadoria" className="text-white font-medium cursor-pointer flex-1">
                              Aposentadoria
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Administradora */}
                <FormField
                  control={form.control}
                  name="administradora"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-white/90 font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Administradora
                      </FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Persistir escolha para outras páginas
                          localStorage.setItem('meeting2_administradora', value);
                          // Reset campos dependentes quando mudar administradora
                          form.setValue("group_code", "");
                          form.setValue("prazo_months", "");
                          form.setValue("approx_installment_brl", "");
                          setAvailableGroups([]);
                          setAvailablePrazos([]);
                          setAvailablePrices([]);
                          setSelectedCredit(null);
                          setQuotaComposition([]);
                          setCompositionTotals({ total_credito: 0, total_parcela: 0 });
                          // Buscar grupos disponíveis para esta administradora
                          fetchAvailableGroups(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white focus:bg-white/20 focus:border-[#C9A45C]">
                            <SelectValue placeholder="Selecione a administradora" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1a1a2e] border-white/20">
                          {ADMINISTRADORAS.map((admin) => (
                            <SelectItem 
                              key={admin} 
                              value={admin}
                              className="text-white hover:bg-white/10 focus:bg-white/10"
                            >
                              {ADMINISTRADORA_LABELS[admin]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Grupo */}
                <FormField
                  control={form.control}
                  name="group_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Grupo
                      </FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); handleGroupChange(value, watchAdministradora); }} disabled={!watchAdministradora || isLoadingGroups}>
                        <FormControl>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white focus:bg-white/20 focus:border-[#C9A45C] disabled:opacity-50">
                            <SelectValue placeholder={
                              !watchAdministradora 
                                ? "Selecione a administradora primeiro" 
                                : isLoadingGroups 
                                ? "Carregando grupos..." 
                                : availableGroups.length === 0
                                ? "Nenhum grupo disponível"
                                : "Selecione o grupo"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent style={{ backgroundColor: "#1F4A43" }} className="border-white/20">
                          {availableGroups.map((group) => (
                            <SelectItem 
                              key={group} 
                              value={group.toString()} 
                              className="text-white hover:bg-white/10 focus:bg-white/10"
                            >
                              Grupo {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Prazo */}
                <FormField
                  control={form.control}
                  name="prazo_months"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Prazo (meses)
                      </FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); handlePrazoChange(value, watchAdministradora, watchGroupCode); }} disabled={!watchGroupCode || isLoadingPrazos}>
                        <FormControl>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white focus:bg-white/20 focus:border-[#C9A45C] disabled:opacity-50">
                            <SelectValue placeholder={isLoadingPrazos ? "Carregando..." : availablePrazos.length === 0 ? "Selecione um grupo primeiro" : "Selecione o prazo"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent style={{ backgroundColor: "#1F4A43" }} className="border-white/20">
                          {availablePrazos.map(prazo => (
                            <SelectItem key={prazo} value={prazo.toString()} className="text-white hover:bg-white/10 focus:bg-white/10">
                              {prazo} meses
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferência de Composição */}
                {watchGroupCode && watchPrazoMonths && (
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <Label className="text-white font-semibold mb-4 block">
                      Preferência de Composição
                    </Label>
                    <RadioGroup
                      value={quotaPreference}
                      onValueChange={handleQuotaPreferenceChange}
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="min" id="min" style={{ color: "#C9A45C" }} className="border-white/40" />
                        <Label htmlFor="min" className="text-white cursor-pointer">
                          Menor número de cotas
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="max" id="max" style={{ color: "#C9A45C" }} className="border-white/40" />
                        <Label htmlFor="max" className="text-white cursor-pointer">
                          Maior número de cotas
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Valor da Parcela */}
                <FormField
                  control={form.control}
                  name="approx_installment_brl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold flex items-center gap-2 mb-4">
                        <DollarSign className="w-4 h-4" />
                        Valor da Parcela Aproximada
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: R$ 3.500,00"
                          {...field}
                          disabled={!watchGroupCode || !watchPrazoMonths}
                          onChange={(e) => {
                            const formatted = formatCurrency(e.target.value);
                            field.onChange(formatted);
                            handleInstallmentChange(formatted, watchAdministradora, watchGroupCode, watchPrazoMonths);
                          }}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-[#C9A45C] transition-all disabled:opacity-50 text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Results Display */}
                {(selectedCredit || quotaComposition.length > 0) && (
                  <div className="mt-8 space-y-6">
                    {/* Cota única (ceiling) */}
                    {selectedCredit && (
                      <div className="p-6 rounded-2xl border border-[#C9A45C]/40" style={{ 
                        background: "linear-gradient(135deg, rgba(201, 164, 92, 0.2) 0%, rgba(229, 200, 117, 0.1) 100%)"
                      }}>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5" style={{ color: "#C9A45C" }} />
                          Opção de Cota Única (Teto)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold" style={{ color: "#C9A45C" }}>
                              {selectedCredit.group_code}
                            </div>
                            <div className="text-sm" style={{ color: "#C4D5D2" }}>Grupo</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold" style={{ color: "#C9A45C" }}>
                              {selectedCredit.prazo_months}
                            </div>
                            <div className="text-sm" style={{ color: "#C4D5D2" }}>Meses</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold" style={{ color: "#C9A45C" }}>
                              {selectedCredit.credito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
                            </div>
                            <div className="text-sm" style={{ color: "#C4D5D2" }}>Crédito</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold" style={{ color: "#C9A45C" }}>
                              {selectedCredit.parcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                            <div className="text-sm" style={{ color: "#C4D5D2" }}>Parcela</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Composição de múltiplas cotas */}
                    {quotaComposition.length > 0 && (
                      <div className="p-6 rounded-2xl border border-emerald-400/40" style={{ 
                        background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(20, 184, 166, 0.1) 100%)"
                      }}>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-emerald-400" />
                          Composição de Múltiplas Cotas ({quotaPreference === 'min' ? 'Mínimo' : 'Máximo'} de Cotas)
                        </h3>
                        
                        {/* Detalhamento das cotas */}
                        <div className="space-y-3 mb-6">
                          {quotaComposition.map((quota, index) => (
                            <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-white/10">
                              <div className="text-white">
                                <span className="font-bold">{quota.count}x</span> cota de {quota.credito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
                              </div>
                              <div className="text-emerald-400 font-bold">
                                {(quota.parcela * quota.count).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Totais */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400">
                              {compositionTotals.total_credito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
                            </div>
                            <div className="text-sm text-white/70">Total Crédito</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400">
                              {compositionTotals.total_parcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                            <div className="text-sm text-white/70">Total Parcela</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Benefits Configuration Section - Only show after form is filled */}
                {watchObjetivo && watchAdministradora && watchGroupCode && watchPrazoMonths && form.watch("approx_installment_brl") && (
                  <div className="mt-8 p-6 rounded-2xl border border-[#C9A45C]/40" style={{ 
                    background: "linear-gradient(135deg, rgba(201, 164, 92, 0.2) 0%, rgba(229, 200, 117, 0.1) 100%)"
                  }}>
                    <h3 className="text-lg font-bold text-white mb-6 text-center">
                      Configuração de Benefícios por Card
                    </h3>
                    
                    {/* Credit Preview */}
                    {availablePrices.length > 0 && (
                      <div className="mb-6 p-4 rounded-xl bg-white/10">
                         <h4 className="text-white font-semibold mb-3 text-center">Crédito Previsto por Card</h4>
                        <div className="flex justify-center gap-4 flex-wrap">
                          {[0, 1, 2].map((cardIndex) => {
                            const creditTotal = creditPreviewPerCard[cardIndex];
                            
                            return (
                              <div 
                                key={cardIndex}
                                className={`px-3 py-2 rounded-lg text-sm font-bold ${
                                  currentCardIndex === cardIndex 
                                    ? 'bg-[#C9A45C] text-black' 
                                    : 'bg-white/20 text-white'
                                }`}
                              >
                                Card {cardIndex + 1}: {creditTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    
                    {/* Progress Indicator */}
                    <div className="flex justify-center mb-6">
                      <div className="flex items-center space-x-4">
                        {[1, 2, 3].map((cardNum) => (
                          <div key={cardNum} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              currentCardIndex + 1 === cardNum 
                                ? "bg-rc-secondary text-rc-primary" 
                                : cardsCompleted[cardNum - 1]
                                ? "bg-emerald-500 text-white"
                                : "bg-white/20 text-white"
                            }`}>
                              {cardsCompleted[cardNum - 1] ? "✓" : cardNum}
                            </div>
                            {cardNum < 3 && (
                              <div className={`w-12 h-0.5 ${
                                cardsCompleted[cardNum - 1] ? "bg-emerald-500" : "bg-white/20"
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <span className="text-white font-semibold">
                        Card {currentCardIndex + 1} de 3
                      </span>
                    </div>

                    {/* Benefits Configuration Form */}
                    <div className="space-y-6">
                      {/* First Row - Core Selections */}
                      <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-6">
                        <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#C9A45C] rounded-full"></div>
                          Configurações Básicas
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Imóveis */}
                          <div className="space-y-2">
                            <Label htmlFor="imoveis" className="text-white text-sm font-medium flex items-center gap-2">
                              Imóveis <span className="text-[#C9A45C] text-xs">(0 a 20)</span>
                            </Label>
                            <Select
                              value={benefitsPerCard[currentCardIndex].imoveis.toString()}
                              onValueChange={(value) => handleCardBenefitChange('imoveis', parseInt(value))}
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 rounded-lg hover:bg-white/20 transition-colors">
                                <SelectValue placeholder="Selecione a quantidade" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1F4A43] border-white/20">
                                {Array.from({ length: 21 }, (_, i) => (
                                  <SelectItem key={i} value={i.toString()} className="text-white hover:bg-white/10">{i}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Reformas + Mobília */}
                          <div className="space-y-2">
                            <Label htmlFor="reformasMobilia" className="text-white text-sm font-medium flex items-center gap-2">
                              Reformas{benefitsPerCard[currentCardIndex].includeMobilia ? ' + Mobília' : ''} 
                              <span className="text-[#C9A45C] text-xs">(0 a 10)</span>
                            </Label>
                            <Select
                              value={benefitsPerCard[currentCardIndex].reformasMobilia.toString()}
                              onValueChange={(value) => handleCardBenefitChange('reformasMobilia', parseInt(value))}
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 rounded-lg hover:bg-white/20 transition-colors">
                                <SelectValue placeholder="Selecione a quantidade" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1F4A43] border-white/20">
                                {Array.from({ length: 11 }, (_, i) => (
                                  <SelectItem key={i} value={i.toString()} className="text-white hover:bg-white/10">{i}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {/* Toggle Incluir Mobília */}
                            <div className="flex items-center space-x-3 mt-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  id="includeMobilia"
                                  checked={benefitsPerCard[currentCardIndex].includeMobilia || false}
                                  onChange={(e) => handleCardBenefitChange('includeMobilia', e.target.checked)}
                                  className="w-4 h-4 rounded border-2 border-white/40 bg-white/10 text-[#C9A45C] focus:ring-2 focus:ring-[#C9A45C] focus:ring-offset-0 checked:bg-[#C9A45C] checked:border-[#C9A45C]"
                                />
                              </div>
                              <Label htmlFor="includeMobilia" className="text-white text-sm cursor-pointer">
                                Incluir Mobília
                              </Label>
                            </div>
                          </div>
                        </div>

                        {/* Consultoria - Full width */}
                        <div className="space-y-2">
                          <Label htmlFor="consultoria" className="text-white text-sm font-medium flex items-center gap-2">
                            Consultoria <span className="text-red-400 text-xs">*</span>
                          </Label>
                          <Select
                            value={benefitsPerCard[currentCardIndex].consultoria}
            onValueChange={(value: '12x R$ 1.000' | '3x R$ 200' | '3x R$ 500' | '6x R$ 200' | '6x R$ 500' | '12x R$ 500' | '12x R$ 200') => handleCardBenefitChange('consultoria', value)}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50">
                              <SelectValue placeholder="Selecione a consultoria" />
                            </SelectTrigger>
            <SelectContent className="bg-[#1F4A43] border-white/20">
                              <SelectItem value="3x R$ 200" className="text-white hover:bg-white/10">3x R$ 200</SelectItem>
                              <SelectItem value="3x R$ 500" className="text-white hover:bg-white/10">3x R$ 500</SelectItem>
                              <SelectItem value="6x R$ 200" className="text-white hover:bg-white/10">6x R$ 200</SelectItem>
                              <SelectItem value="6x R$ 500" className="text-white hover:bg-white/10">6x R$ 500</SelectItem>
                              <SelectItem value="12x R$ 200" className="text-white hover:bg-white/10">12x R$ 200</SelectItem>
                              <SelectItem value="12x R$ 500" className="text-white hover:bg-white/10">12x R$ 500</SelectItem>
                              <SelectItem value="12x R$ 1.000" className="text-white hover:bg-white/10">12x R$ 1.000</SelectItem>
                            </SelectContent>
          </Select>
                        </div>
                      </div>

                      {/* Second Row - Additional Services */}
                      <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-6">
                        <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#C9A45C] rounded-full"></div>
                          Serviços Adicionais
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Assessoria Jurídica e Contábil */}
                          <div className="space-y-2">
                            <Label className="text-white text-sm font-medium block">Assessoria</Label>
                            <div className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  id="assessoria"
                                  checked={benefitsPerCard[currentCardIndex].assessoriaJuridicaContabil}
                                  onChange={(e) => handleCardBenefitChange('assessoriaJuridicaContabil', e.target.checked)}
                                  className="w-5 h-5 rounded border-2 border-white/40 bg-white/10 text-[#C9A45C] focus:ring-2 focus:ring-[#C9A45C] focus:ring-offset-0 checked:bg-[#C9A45C] checked:border-[#C9A45C]"
                                />
                              </div>
                              <Label htmlFor="assessoria" className="text-white font-medium cursor-pointer">
                                Assessoria jurídica e contábil
                              </Label>
                            </div>
                          </div>

                           {/* Cashback */}
                           <div className="space-y-2">
                             <Label htmlFor="cashback" className="text-white text-sm font-medium">Cashback (%)</Label>
                             <Select
                               value={benefitsPerCard[currentCardIndex].cashback.toString()}
                               onValueChange={(value) => handleCardBenefitChange('cashback', parseInt(value))}
                               disabled={currentCardIndex === 0}
                             >
                               <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50">
                                 <SelectValue placeholder="Selecione a porcentagem" />
                               </SelectTrigger>
                               <SelectContent className="bg-[#1F4A43] border-white/20">
                                 <SelectItem value="0" className="text-white hover:bg-white/10">0% (Sem cashback)</SelectItem>
                                 <SelectItem value="30" className="text-white hover:bg-white/10">30%</SelectItem>
                                 <SelectItem value="50" className="text-white hover:bg-white/10">50%</SelectItem>
                                 <SelectItem value="70" className="text-white hover:bg-white/10">70%</SelectItem>
                                 <SelectItem value="100" className="text-white hover:bg-white/10">100%</SelectItem>
                               </SelectContent>
                             </Select>
                             {currentCardIndex === 0 && (
                               <p className="text-xs text-white/60 mt-1">Card 1 não possui cashback</p>
                             )}
                           </div>
                        </div>
                      </div>

                      {/* Third Row - Badges and Highlights */}
                      <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-6">
                        <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#C9A45C] rounded-full"></div>
                          Destaques e Badges
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Badge Maior Padrão */}
                          <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  id="maiorPadrao"
                                  checked={benefitsPerCard[currentCardIndex].maiorPadrao?.ativo || false}
                                  onChange={(e) => handleMaiorPadraoChange('ativo', e.target.checked)}
                                  className="w-5 h-5 rounded border-2 border-white/40 bg-white/10 text-[#C9A45C] focus:ring-2 focus:ring-[#C9A45C] focus:ring-offset-0 checked:bg-[#C9A45C] checked:border-[#C9A45C]"
                                />
                              </div>
                              <Label htmlFor="maiorPadrao" className="text-white font-medium cursor-pointer">
                                Badge "Padrão maior"
                              </Label>
                            </div>
                            
                            {benefitsPerCard[currentCardIndex].maiorPadrao?.ativo && (
                              <div className="space-y-2 pl-8">
                                <Label htmlFor="quantidadeMaiorPadrao" className="text-white text-sm block">
                                  Até quantos imóveis <span className="text-[#C9A45C] text-xs">(até 5)</span>
                                </Label>
                                <Select
                                  value={(benefitsPerCard[currentCardIndex].maiorPadrao?.quantidade || 0).toString()}
                                  onValueChange={(value) => handleMaiorPadraoChange('quantidade', parseInt(value))}
                                >
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-10 rounded-lg hover:bg-white/20 transition-colors">
                                    <SelectValue placeholder="Qtd" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#1F4A43] border-white/20">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <SelectItem key={i + 1} value={(i + 1).toString()} className="text-white hover:bg-white/10">
                                        {i + 1} {i === 0 ? 'imóvel' : 'imóveis'}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          {/* Badge RECOMENDADO */}
                          <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  id="recommended"
                                  checked={benefitsPerCard[currentCardIndex].recommended || false}
                                  onChange={(e) => handleCardBenefitChange('recommended', e.target.checked)}
                                  className="w-5 h-5 rounded border-2 border-white/40 bg-white/10 text-[#C9A45C] focus:ring-2 focus:ring-[#C9A45C] focus:ring-offset-0 checked:bg-[#C9A45C] checked:border-[#C9A45C]"
                                />
                              </div>
                              <Label htmlFor="recommended" className="text-white font-medium cursor-pointer">
                                Marcar como RECOMENDADO
                              </Label>
                            </div>
                            
                            <div className="pl-8 space-y-2">
                              {benefitsPerCard[currentCardIndex].recommended && (
                                <div className="px-3 py-1.5 rounded-full text-xs font-bold text-black bg-gradient-to-r from-[#C9A45C] to-[#E5C875] border-2 border-[#E5C875] shadow-lg inline-block">
                                  RECOMENDADO
                                </div>
                              )}
                              <p className="text-xs text-white/60">Apenas 1 card pode ser recomendado</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                      <Button
                        type="button"
                        onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
                        disabled={currentCardIndex === 0}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Voltar
                      </Button>
                      
                      {currentCardIndex < 2 ? (
                        <Button
                          type="button"
                          onClick={(e) => saveCardAndAdvance(e)}
                          disabled={!isCurrentCardValid()}
                          className="bg-rc-secondary text-rc-primary hover:bg-rc-secondary/90"
                        >
                          Salvar e avançar
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={(e) => saveCardAndAdvance(e)}
                          disabled={!isCurrentCardValid()}
                          className="bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          Iniciar Reunião
                        </Button>
                      )}
                    </div>
                </div>
               )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer with Disclaimer */}
        <footer className="mt-12 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-xs max-w-2xl mx-auto leading-relaxed" style={{ color: "#C4D5D2" }}>
              As simulações são estimativas baseadas em dados históricos e não garantem resultados futuros.
              Consórcio é um sistema de autofinanciamento regulamentado pelo Banco Central do Brasil.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}