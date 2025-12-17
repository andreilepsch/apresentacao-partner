import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ArrowLeft, Check, Coins, Star, Info, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useInvestmentSimulation } from "@/hooks/useInvestmentSimulation";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { SimulatorButton } from "@/components/meeting2/SimulatorButton";
import { SimulatorModal } from "@/components/meeting2/SimulatorModal";

// Constantes para cálculo de alocação
const BASE_IMOVEL = 380000;          // imóvel + mobília
const BASE_IMOVEL_REFORMA = 400000;  // imóvel + mobília + reforma
const LIMIAR_MAIOR_PADRAO = 80000;   // sobra mínima p/ considerar upgrade

interface CardBenefits {
  imoveis: number;
  reformasMobilia: number;
  includeMobilia?: boolean; // default true - controla se é "Reforma + Mobília" ou "Reforma"
  consultoria: 'Isenta' | '12x R$ 1.000' | '3x R$ 200' | '3x R$ 500' | '6x R$ 200' | '6x R$ 500' | '12x R$ 500' | '12x R$ 200';
  assessoriaJuridicaContabil: boolean;
  cashback: number; // Agora representa porcentagem (30, 50, 70, 100)
  maiorPadrao?: {
    ativo: boolean;
    quantidade: number;
  };
  recommended?: boolean; // default false - opcional, apenas 1 card pode ser marcado
}

interface ClientInfo {
  nomeCliente: string;
  valorParcela: string;
  objetivo: string;
  patrimonio: string;
  rendaMensal: string;
  meeting2?: Meeting2Data;
  selectedPricing?: {
    id: string;
    installment_num: number;
    installment_brl: string;
    credit_num: number;
    credit_brl: string;
    estimatedIncome_num: number;
    estimatedIncome_brl: string;
    yieldRate: number;
    composition?: {
      quotas: QuotaComposition[];
      total_credito: number;
      total_parcela: number;
    };
  };
}

interface QuotaComposition {
  credito: number;
  parcela: number;
  count: number;
}

interface CreditOption {
  id: string;
  creditValue: string;
  installment: string;
  properties: string;
  renovations: string;
  consulting: string;
  estimatedIncome: string;
  recommended: boolean;
  maiorPadrao?: {
    ativo: boolean;
    quantidade: number;
  };
  composition: {
    quotas: QuotaComposition[];
    total_credito: number;
    total_parcela: number;
  };
  cardBenefits?: CardBenefits;
}

interface Meeting2Data {
  combination?: {
    quotas?: QuotaComposition[];
    total_credito?: number;
    total_parcela: number;
  };
  chosen?: {
    group_code?: number;
    prazo_months?: number;
    credito: number;
    parcela: number;
    fator: number;
  };
  target_installment_num?: number;
  options_cache?: {
    prazos: number[];
    prices: Array<{ credito: number; parcela: number }>;
  };
  benefitsPerCard?: CardBenefits[];
}

export default function Meeting2PricingOptions() {
  const navigate = useNavigate();
  useScrollToTop();
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [selectedCredit, setSelectedCredit] = useState<string>("");
  const [creditOptions, setCreditOptions] = useState<CreditOption[]>([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryOption, setSummaryOption] = useState<CreditOption | null>(null);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [originalOptions, setOriginalOptions] = useState<CreditOption[]>([]);
  const { getCycleData, formatCurrency } = useInvestmentSimulation();

  // Cache de composições para evitar recalcular
  const compositionCache = useMemo(() => new Map<string, QuotaComposition[]>(), []);

  // Função específica para Meeting2 - cada imóvel vale o CRÉDITO TOTAL
  const getMeeting2CycleData = (totalCredito: number, totalParcela: number) => {
    const cycles = [];
    const baseParcela = totalParcela; // Parcela base de um contrato
    
    for (let cycle = 1; cycle <= 4; cycle++) {
      // Contratos ativos: ciclos 1-3 acumulam, ciclo 4 mantém 3 (o 1º finaliza)
      const activeContracts = cycle <= 3 ? cycle : 3;
      const monthlyInstallment = baseParcela * activeContracts;
      
      // Patrimônio: soma de todos os imóveis com suas respectivas valorizações
      let patrimony = 0;
      
      for (let propertyIndex = 1; propertyIndex <= cycle; propertyIndex++) {
        // Quantos ciclos se passaram desde a aquisição deste imóvel
        const cyclesElapsed = cycle - propertyIndex;
        // Cada ciclo = 5 anos, valorização de 4% ao ano
        const yearsElapsed = cyclesElapsed * 5;
        // Cada imóvel vale o crédito total, valorizado
        const propertyValue = totalCredito * Math.pow(1.04, yearsElapsed);
        patrimony += propertyValue;
      }
      
      // Renda: 1% do patrimônio por mês
      const monthlyIncome = patrimony * 0.01;
      
      // Lucro: renda menos parcela mensal acumulada
      const monthlyProfit = monthlyIncome - monthlyInstallment;
      
      cycles.push({
        cycle,
        patrimony: formatCurrency(patrimony),
        installment: formatCurrency(monthlyInstallment),
        income: formatCurrency(monthlyIncome),
        profit: formatCurrency(monthlyProfit),
        color: '#355F4D',
        iconColor: '#B78D4A'
      });
    }
    
    return cycles;
  };

  // Helper functions
  const toBRL = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getYieldRate = (objetivo: string): number => {
    switch (objetivo) {
      case 'renda-extra': return 0.012; // 1.2%
      case 'aposentadoria': return 0.010; // 1.0%
      case 'moradia': return 0.009; // 0.9%
      default: return 0.010; // Default to aposentadoria
    }
  };

  // Função de cálculo de alocação dinâmica
  const calculateAllocation = (credito: number) => {
    // 1) IMÓVEIS (apenas propriedades que cabem no orçamento)
    const nImoveis = Math.floor(credito / BASE_IMOVEL);
    
    // 2) REFORMAS  
    const nReformasPossiveis = Math.floor(credito / BASE_IMOVEL_REFORMA);
    const reformas = Math.min(nImoveis, nReformasPossiveis);
    
    // 3) SOBRA (após alocar os imóveis arredondados)
    const sobra = credito - (nImoveis * BASE_IMOVEL);
    
    // 4) MAIOR PADRÃO
    const maior_padrao_flag = sobra >= LIMIAR_MAIOR_PADRAO;
    const maior_padrao_qtd = maior_padrao_flag 
      ? Math.min(nImoveis, Math.floor(sobra / LIMIAR_MAIOR_PADRAO))
      : 0;

    const result = {
      credito,
      imoveis: nImoveis,
      reformas,
      maior_padrao: {
        ativo: maior_padrao_flag,
        quantidade: maior_padrao_qtd,
        limiar: LIMIAR_MAIOR_PADRAO
      },
      parametros: {
        base_imovel: BASE_IMOVEL,
        base_imovel_reforma: BASE_IMOVEL_REFORMA
      }
    };

    // Calculate best property allocation
    return result;
  };

  // Algoritmo guloso otimizado para composição de cotas
  const findBestQuotaComposition = (prices: Array<{ credito: number; parcela: number }>, targetValue: number, preference: 'min' | 'max' = 'min'): QuotaComposition[] => {
    if (!prices.length || targetValue <= 0) return [];

    // Verificar cache primeiro
    const cacheKey = `${targetValue}-${preference}-${prices.length}`;
    if (compositionCache.has(cacheKey)) {
      console.log('✅ Cache hit para composição');
      return compositionCache.get(cacheKey)!;
    }

    // 1) Ordenar por eficiência (credito/parcela ratio)
    const sortedPrices = [...prices].sort((a, b) => {
      const ratioA = a.credito / a.parcela;
      const ratioB = b.credito / b.parcela;
      return preference === 'min' ? ratioB - ratioA : ratioA - ratioB;
    });

    let bestComposition: QuotaComposition[] = [];
    let bestExcess = Infinity;

    // 2) Tentar APENAS com os top 10 preços mais eficientes
    const topPrices = sortedPrices.slice(0, 10);

    for (let i = 0; i < topPrices.length; i++) {
      const price = topPrices[i];
      const composition: QuotaComposition[] = [];
      let currentTotal = 0;

      // 3) Abordagem gulosa: adicionar múltiplas cotas do mesmo tipo
      while (currentTotal < targetValue) {
        const remaining = targetValue - currentTotal;
        
        // Quantas cotas faltam?
        const quotasNeeded = Math.ceil(remaining / price.parcela);
        
        // Adicionar de 1 a 10 cotas por vez (ao invés de 1 a 50)
        const quotasToAdd = Math.min(quotasNeeded, 10);
        
        composition.push({
          credito: price.credito,
          parcela: price.parcela,
          count: quotasToAdd
        });
        
        currentTotal += price.parcela * quotasToAdd;
        
        // Se ultrapassou, verificar se é melhor que a anterior
        if (currentTotal >= targetValue) {
          const excess = currentTotal - targetValue;
          if (excess < bestExcess) {
            bestExcess = excess;
            bestComposition = composition;
          }
          break;
        }
      }
    }

    // 4) Fallback seguro
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

  // Generate simulated options based on new installment
  const generateSimulatedOptions = async (newInstallment: number, meeting2Data: Meeting2Data, objetivo: string): Promise<CreditOption[]> => {
    const yieldRate = getYieldRate(objetivo);

    // Fixed benefits for simulated options
    const benefitsPerCard = [
      { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: '6x R$ 500' as const, assessoriaJuridicaContabil: true, cashback: 0, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false },
      { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: '6x R$ 200' as const, assessoriaJuridicaContabil: true, cashback: 0, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false },
      { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: 'Isenta' as const, assessoriaJuridicaContabil: true, cashback: 0, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false }
    ];

    // Get available prices for simulation
    let availablePrices: Array<{ credito: number; parcela: number }> = [];
    
    if (meeting2Data?.options_cache?.prices?.length) {
      availablePrices = meeting2Data.options_cache.prices;
    } else if (meeting2Data?.chosen?.group_code && meeting2Data?.chosen?.prazo_months) {
      try {
        const { data: creditPrices, error } = await supabase
          .from('credit_price')
          .select('credito, parcela')
          .eq('group_code', meeting2Data.chosen.group_code)
          .eq('prazo_months', meeting2Data.chosen.prazo_months)
          .order('parcela', { ascending: true });

        if (error) throw error;
        if (creditPrices?.length) {
          availablePrices = creditPrices.map(p => ({
            credito: Number(p.credito),
            parcela: Number(p.parcela)
          }));
        }
      } catch (error) {
        console.error('❌ Error fetching filtered credit prices for simulation:', error);
      }
    }

    if (!availablePrices.length) {
      // Fallback to all prices
      try {
        const { data: creditPrices, error } = await supabase
          .from('credit_price')
          .select('credito, parcela')
          .order('parcela', { ascending: true });

        if (error) throw error;
        if (creditPrices?.length) {
          availablePrices = creditPrices.map(p => ({
            credito: Number(p.credito),
            parcela: Number(p.parcela)
          }));
        }
      } catch (error) {
        console.error('❌ Error fetching all credit prices for simulation:', error);
        toast.error("Erro ao buscar dados para simulação");
        return [];
      }
    }

    // Define 3 target installments: new value, +R$500, +R$1000
    const targetInstallments = [
      newInstallment,
      newInstallment + 500,
      newInstallment + 1000
    ];

    const options: CreditOption[] = targetInstallments.map((targetInstallment, index) => {
      // Find best quota composition for this target
      const composition = findBestQuotaComposition(availablePrices, targetInstallment, 'min');
      
      if (!composition.length) {
        // Fallback: use the highest available single quota
        const maxPrice = availablePrices.reduce((max, current) => 
          current.parcela > max.parcela ? current : max
        );
        composition.push({
          credito: maxPrice.credito,
          parcela: maxPrice.parcela,
          count: 1
        });
      }

      // Calculate totals
      const totals = composition.reduce(
        (acc, quota) => ({
          total_credito: acc.total_credito + (quota.credito * quota.count),
          total_parcela: acc.total_parcela + (quota.parcela * quota.count)
        }),
        { total_credito: 0, total_parcela: 0 }
      );

      // Calculate estimated income using Meeting2-specific logic
      const cyclesData = getMeeting2CycleData(totals.total_credito, totals.total_parcela);
      const estimatedIncome = cyclesData.length >= 4 
        ? parseFloat(cyclesData[3].profit.replace(/[^\d,-]/g, '').replace(',', '.')) 
        : Math.round(totals.total_credito * yieldRate);

      // Get benefits for this card index
      const cardBenefits = benefitsPerCard[index] || benefitsPerCard[0];

      return {
        id: `simulated-option-${index + 1}`,
        creditValue: toBRL(totals.total_credito),
        installment: toBRL(totals.total_parcela),
        properties: cardBenefits.imoveis > 0 ? `${cardBenefits.imoveis} ${cardBenefits.imoveis === 1 ? 'Imóvel' : 'Imóveis'}` : '',
        renovations: cardBenefits.reformasMobilia > 0 ? 
          `${cardBenefits.reformasMobilia} Reforma${cardBenefits.reformasMobilia === 1 ? '' : 's'}${
            cardBenefits.includeMobilia !== false ? ' + Mobília' : ''
          }` : '',
        consulting: cardBenefits.consultoria,
        estimatedIncome: toBRL(estimatedIncome),
        recommended: cardBenefits.recommended || (index === 1), // Second option recommended by default
        maiorPadrao: cardBenefits.maiorPadrao,
        composition: {
          quotas: composition,
          total_credito: totals.total_credito,
          total_parcela: totals.total_parcela
        },
        cardBenefits
      };
    });

    return options;
  };

  // Fetch real credit options from Supabase database
  const generateDynamicOptions = async (meeting2Data: Meeting2Data, objetivo: string): Promise<CreditOption[]> => {
    // Get base installment from meeting2 data - PRIORITIZE combination data
    const baseParcela = meeting2Data?.combination?.total_parcela || 
                       meeting2Data?.target_installment_num || 
                       meeting2Data?.chosen?.parcela || 
                       3007.30;
    
    const yieldRate = getYieldRate(objetivo);

    // Get manually configured benefits or use defaults (WITHOUT cashback)
    const benefitsPerCard = meeting2Data?.benefitsPerCard || [
      { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: 'Isenta' as const, assessoriaJuridicaContabil: false, cashback: 0, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false },
      { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: 'Isenta' as const, assessoriaJuridicaContabil: false, cashback: 0, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false },
      { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: 'Isenta' as const, assessoriaJuridicaContabil: false, cashback: 0, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false }
    ];

    // Try to use cached prices from meeting2 data first (PRIORITIZED)
    let availablePrices: Array<{ credito: number; parcela: number }> = [];
    
    if (meeting2Data?.options_cache?.prices?.length) {
      availablePrices = meeting2Data.options_cache.prices;
    } else {
      // Check if we have group_code and prazo_months for filtered query
      if (meeting2Data?.chosen?.group_code && meeting2Data?.chosen?.prazo_months) {
        
        try {
          const { data: creditPrices, error } = await supabase
            .from('credit_price')
            .select('credito, parcela')
            .eq('group_code', meeting2Data.chosen.group_code)
            .eq('prazo_months', meeting2Data.chosen.prazo_months)
            .order('parcela', { ascending: true });

          if (error) throw error;
          if (creditPrices?.length) {
            availablePrices = creditPrices.map(p => ({
              credito: Number(p.credito),
              parcela: Number(p.parcela)
            }));
            console.log(`✅ Found ${availablePrices.length} filtered prices`);
          }
        } catch (error) {
          console.error('❌ Error fetching filtered credit prices:', error);
        }
      }
      
      // Fallback to all prices if filtered query failed
      if (!availablePrices.length) {
        console.log('📊 Fetching all available prices as fallback');
        try {
          const { data: creditPrices, error } = await supabase
            .from('credit_price')
            .select('credito, parcela')
            .order('parcela', { ascending: true });

          if (error) {
            console.error('❌ Error fetching all credit prices:', error);
            throw error;
          }

          if (!creditPrices || creditPrices.length === 0) {
            throw new Error('No credit prices found in database');
          }

          availablePrices = creditPrices.map(p => ({
            credito: Number(p.credito),
            parcela: Number(p.parcela)
          }));
          console.log(`✅ Found ${availablePrices.length} fallback prices`);
        } catch (error) {
          console.error('❌ Error in database fetch:', error);
          throw error;
        }
      }
    }

    if (!availablePrices.length) {
      throw new Error('No price data available for quota composition');
    }

    // Define 3 target installments: base, +R$500, +R$1000
    const targetInstallments = [
      baseParcela,
      baseParcela + 500,
      baseParcela + 1000
    ];

    try {
      // For each target installment, calculate the best quota composition
      const options: CreditOption[] = targetInstallments.map((targetInstallment, index) => {
        // Find best quota composition for this target (using 'min' preference like Meeting2.tsx)
        const composition = findBestQuotaComposition(availablePrices, targetInstallment, 'min');
        
        if (!composition.length) {
          console.warn(`⚠️  No composition found for target: R$ ${targetInstallment}`);
          // Fallback: use the highest available single quota
          const maxPrice = availablePrices.reduce((max, current) => 
            current.parcela > max.parcela ? current : max
          );
          composition.push({
            credito: maxPrice.credito,
            parcela: maxPrice.parcela,
            count: 1
          });
          console.log(`🔄 Using fallback single quota: R$ ${maxPrice.credito} / R$ ${maxPrice.parcela}`);
        }

        // Calculate totals (without rounding credit values to preserve precision)
        const totals = composition.reduce(
          (acc, quota) => ({
            total_credito: acc.total_credito + (quota.credito * quota.count),
            total_parcela: acc.total_parcela + (quota.parcela * quota.count)
          }),
          { total_credito: 0, total_parcela: 0 }
        );

        // DETAILED AUDIT LOG
        console.log(`📋 AUDIT - Option ${index + 1} for R$ ${targetInstallment}:`);
        console.log(`   Quotas found: ${composition.length} different types`);
        console.log(`   Total quotas: ${composition.reduce((sum, q) => sum + q.count, 0)}`);
        console.log(`   Quota details:`, composition.map(q => `${q.count}x (R$ ${q.credito}/R$ ${q.parcela})`));
        console.log(`   TOTAL CREDITO: R$ ${totals.total_credito.toLocaleString('pt-BR')}`);
        console.log(`   TOTAL PARCELA: R$ ${totals.total_parcela.toLocaleString('pt-BR')}`);
        console.log(`   Excess: R$ ${(totals.total_parcela - targetInstallment).toLocaleString('pt-BR')}`);
        
        // Special validation for R$ 5,049 case
        if (targetInstallment === baseParcela && Math.abs(targetInstallment - 5049) < 100) {
          console.log(`🔍 SPECIAL CASE R$ 5,049 VALIDATION:`);
          console.log(`   Expected credit around: R$ 1,080,000`);
          console.log(`   Actual credit: R$ ${totals.total_credito.toLocaleString('pt-BR')}`);
          if (totals.total_credito > 1200000) {
            console.warn(`⚠️  Credit seems too high! Expected ~R$ 1,080,000, got R$ ${totals.total_credito.toLocaleString('pt-BR')}`);
          }
        }

        // Calculate estimated income using Meeting2-specific logic (Cycle 4 profit)
        const cyclesData = getMeeting2CycleData(totals.total_credito, totals.total_parcela);
        const estimatedIncome = cyclesData.length >= 4 
          ? parseFloat(cyclesData[3].profit.replace(/[^\d,-]/g, '').replace(',', '.')) 
          : Math.round(totals.total_credito * yieldRate);

        // Get benefits for this card index
        const cardBenefits = benefitsPerCard[index] || benefitsPerCard[0]; // Fallback to first card if index doesn't exist

        return {
          id: `option-${index + 1}`,
          creditValue: toBRL(totals.total_credito),
          installment: toBRL(totals.total_parcela),
          properties: cardBenefits.imoveis > 0 ? `${cardBenefits.imoveis} ${cardBenefits.imoveis === 1 ? 'Imóvel' : 'Imóveis'}` : '',
          renovations: cardBenefits.reformasMobilia > 0 ? 
            `${cardBenefits.reformasMobilia} Reforma${cardBenefits.reformasMobilia === 1 ? '' : 's'}${
              cardBenefits.includeMobilia !== false ? ' + Mobília' : ''
            }` : '',
          consulting: cardBenefits.consultoria,
          estimatedIncome: toBRL(estimatedIncome),
          recommended: cardBenefits.recommended || false, // Use configured recommendation
          maiorPadrao: cardBenefits.maiorPadrao,
          composition: {
            quotas: composition,
            total_credito: totals.total_credito,
            total_parcela: totals.total_parcela
          },
          cardBenefits // Add this for easy access
        };
      });

      return options;

    } catch (error) {
      console.error('Failed to fetch credit options from database:', error);
      toast.error("Erro ao carregar opções de crédito. Usando valores padrão.");
      
      // Fallback to calculated values
      return generateFallbackOptions(baseParcela, yieldRate, benefitsPerCard);
    }
  };

  // Fallback function for when database fetch fails
  const generateFallbackOptions = (baseParcela: number, yieldRate: number, benefitsPerCard?: CardBenefits[]): CreditOption[] => {
    const baseFator = 0.004; // Default factor
    
    // Default benefits if none provided (USE SAME DEFAULTS AS generateDynamicOptions)
    const defaultBenefits = benefitsPerCard || [
      { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: 'Isenta' as const, assessoriaJuridicaContabil: false, cashback: 0, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false },
      { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: 'Isenta' as const, assessoriaJuridicaContabil: false, cashback: 0, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false },
      { imoveis: 0, reformasMobilia: 0, includeMobilia: false, consultoria: 'Isenta' as const, assessoriaJuridicaContabil: false, cashback: 0, maiorPadrao: { ativo: false, quantidade: 0 }, recommended: false }
    ];
    
    const options = [
      { id: "option-1", installment: baseParcela, recommended: true },
      { id: "option-2", installment: baseParcela + 500, recommended: false },
      { id: "option-3", installment: baseParcela + 1000, recommended: false }
    ];

      return options.map((option, index) => {
        let credit = Math.round(option.installment / baseFator);
        
        // Round to appropriate increments
        if (credit > 1000000) {
          credit = Math.round(credit / 10000) * 10000;
        } else if (credit > 100000) {
          credit = Math.round(credit / 5000) * 5000;
        } else {
          credit = Math.round(credit / 1000) * 1000;
        }
        
        // Calculate estimated income using cycles logic (Cycle 4 profit)
        const cyclesData = getMeeting2CycleData(credit, option.installment);
        const estimatedIncome = cyclesData.length >= 4 
          ? parseFloat(cyclesData[3].profit.replace(/[^\d,-]/g, '').replace(',', '.')) 
          : Math.round(credit * yieldRate);
        
        const cardBenefits = defaultBenefits[index];
        
        return {
          id: option.id,
          creditValue: toBRL(credit),
          installment: toBRL(option.installment),
          properties: cardBenefits.imoveis > 0 ? `${cardBenefits.imoveis} ${cardBenefits.imoveis === 1 ? 'Imóvel' : 'Imóveis'}` : '',
          renovations: cardBenefits.reformasMobilia > 0 ? 
            `${cardBenefits.reformasMobilia} Reforma${cardBenefits.reformasMobilia === 1 ? '' : 's'}${
              cardBenefits.includeMobilia !== false ? ' + Mobília' : ''
            }` : '',
          consulting: cardBenefits.consultoria,
          estimatedIncome: toBRL(estimatedIncome),
          recommended: cardBenefits.recommended || false,
          maiorPadrao: cardBenefits.maiorPadrao,
          composition: {
            quotas: [{ credito: credit, parcela: option.installment, count: 1 }],
            total_credito: credit,
            total_parcela: option.installment
          },
          cardBenefits
        };
      });
  };

  useEffect(() => {
    // Try both localStorage keys for compatibility
    const savedMeeting2State = localStorage.getItem("meeting2_state");
    const savedClientInfo = localStorage.getItem("clienteInfo");
    
    if (savedMeeting2State) {
      // New format: use meeting2_state directly
      const parsedMeeting2State = JSON.parse(savedMeeting2State);
      const clientInfoData: ClientInfo = {
        nomeCliente: parsedMeeting2State.client_name,
        valorParcela: String(parsedMeeting2State.target_installment_num || 0),
        patrimonio: "0",
        rendaMensal: "0",
        objetivo: parsedMeeting2State.objective,
        meeting2: parsedMeeting2State
      };
      setClientInfo(clientInfoData);
      
      // Load credit options using the meeting2 state data
      const loadCreditOptions = async () => {
        try {
          const options = await generateDynamicOptions(parsedMeeting2State, parsedMeeting2State.objective);
          setCreditOptions(options);
        } catch (error) {
          console.error('Error loading credit options:', error);
          toast.error("Erro ao carregar opções de crédito.");
        }
      };
      
      loadCreditOptions();
    } else if (savedClientInfo) {
      // Legacy format: fallback compatibility
      const parsedClientInfo = JSON.parse(savedClientInfo);
      setClientInfo(parsedClientInfo);
      
      const loadCreditOptions = async () => {
        try {
          let options: CreditOption[];
          
          if (parsedClientInfo.meeting2) {
            options = await generateDynamicOptions(parsedClientInfo.meeting2, parsedClientInfo.objetivo);
          } else {
            options = await generateDynamicOptions({}, parsedClientInfo.objetivo);
            toast.info("Usando valores padrão para as opções de crédito.");
          }
          
          setCreditOptions(options);
        } catch (error) {
          toast.error("Erro ao carregar opções de crédito.");
        }
      };
      
      loadCreditOptions();
    } else {
      navigate("/meeting2/chosen-administrator");
    }
  }, [navigate]);

  // Handle simulation
  const handleSimulate = async (newInstallment: number) => {
    if (!clientInfo?.meeting2) {
      toast.error("Dados da reunião não encontrados");
      return;
    }

    try {
      // Store original options if not already stored
      if (!isSimulated) {
        setOriginalOptions([...creditOptions]);
      }

      const simulatedOptions = await generateSimulatedOptions(
        newInstallment, 
        clientInfo.meeting2, 
        clientInfo.objetivo
      );
      
      setCreditOptions(simulatedOptions);
      setIsSimulated(true);
      toast.success(`Simulação gerada para parcela base de ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(newInstallment)}`);
    } catch (error) {
      console.error('Error generating simulation:', error);
      toast.error("Erro ao gerar simulação");
    }
  };

  // Reset to original options
  const handleResetOptions = () => {
    if (originalOptions.length > 0) {
      setCreditOptions(originalOptions);
      setIsSimulated(false);
      setOriginalOptions([]);
      toast.success("Opções originais restauradas");
    }
  };


  const openSummary = (option: CreditOption) => {
    setSummaryOption(option);
    setSummaryOpen(true);
  };

  const handleSelectCredit = (creditId: string) => {
    setSelectedCredit(creditId);
    
    // Find the selected credit option and save detailed data
    const selectedOption = creditOptions.find(option => option.id === creditId);
    if (selectedOption && clientInfo) {
      // Parse numeric values from formatted strings
      const parseBRLToNumber = (brlString: string): number => {
        return parseFloat(brlString.replace(/[^\d,]/g, '').replace(',', '.'));
      };
      
      const selectedPricing = {
        id: creditId,
        installment_num: parseBRLToNumber(selectedOption.installment),
        installment_brl: selectedOption.installment,
        credit_num: parseBRLToNumber(selectedOption.creditValue),
        credit_brl: selectedOption.creditValue,
        estimatedIncome_num: parseBRLToNumber(selectedOption.estimatedIncome),
        estimatedIncome_brl: selectedOption.estimatedIncome,
        yieldRate: getYieldRate(clientInfo.objetivo),
        composition: selectedOption.composition
      };
      
      const updatedInfo = { 
        ...clientInfo, 
        selectedCredit: creditId,
        selectedPricing 
      };
      
      // Also update meeting2 data with complete composition (CONSISTENT PERSISTENCE)
      if (updatedInfo.meeting2) {
        updatedInfo.meeting2.combination = {
          quotas: selectedOption.composition.quotas,
          total_credito: selectedOption.composition.total_credito,
          total_parcela: selectedOption.composition.total_parcela
        };
      }
      
      localStorage.setItem("clienteInfo", JSON.stringify(updatedInfo));
      
      console.log('💾 Selected pricing option saved:', {
        credit: selectedOption.creditValue,
        installment: selectedOption.installment,
        composition: selectedOption.composition,
        meeting2_combination: updatedInfo.meeting2?.combination
      });
    }

    // Navigate to commitments page
    navigate("/meeting2/commitments");
  };

  if (!clientInfo) return null;

  return (
    <div className="min-h-screen px-4 py-6" style={{ backgroundColor: "#163B36" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header with Navigation and Badge */}
        <header className="flex items-center justify-between mb-16">
          <Button
            onClick={() => navigate("/meeting2/security")}
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
            <Coins className="w-4 h-4" style={{ color: "#C9A45C" }} />
            OPÇÕES DE CRÉDITO
          </div>

          <div className="w-10"></div> {/* Spacer for centering */}
        </header>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Compare e escolha a renda que cabe no seu futuro
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#C4D5D2" }}>
            Veja as opções de crédito disponíveis e escolha a que faz mais sentido para você.
          </p>
          
          {/* Simulation Status */}
          {isSimulated && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-4 px-6 py-3 rounded-2xl border border-[#C9A45C]/30" style={{ 
                background: "linear-gradient(135deg, rgba(201, 164, 92, 0.1) 0%, rgba(229, 200, 117, 0.05) 100%)"
              }}>
                <div className="text-sm font-medium text-[#C9A45C]">
                  ✨ Opções simuladas baseadas na nova parcela
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetOptions}
                  className="text-[#C9A45C] hover:bg-[#C9A45C]/10 text-xs px-3 py-1 h-auto"
                >
                  Voltar ao original
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Credit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-8 pt-4">
          {creditOptions.map((credit) => {
            const isSelected = selectedCredit === credit.id;
            
            return (
              <Card 
                key={credit.id}
                className={`relative cursor-pointer transition-all duration-300 rounded-3xl ${
                  isSelected ? 'ring-2 ring-[#C9A45C] scale-[1.02]' : 'hover:scale-[1.01]'
                } ${
                  credit.recommended ? 'ring-2 ring-[#C9A45C]' : ''
                }`}
                onClick={() => openSummary(credit)}
                style={{ backgroundColor: "#1F4A43" }}
              >
                {/* Recommended Badge */}
                {credit.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="px-4 py-1.5 rounded-full text-xs font-bold text-black shadow-lg whitespace-nowrap" style={{ 
                      background: "linear-gradient(135deg, #C9A45C 0%, #E5C875 100%)",
                      border: "2px solid #E5C875",
                      boxShadow: "0 4px 15px rgba(201, 164, 92, 0.3)"
                    }}>
                      RECOMENDADO
                    </div>
                  </div>
                )}

                <CardContent className="p-6 flex flex-col h-full">
                  {/* Credit Value */}
                  <div className="text-center mb-6">
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      Crédito de {credit.creditValue}
                    </div>
                  </div>

                   {/* Key Features */}
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#C9A45C" }} />
                      <span className="text-white">Parcela de {credit.installment}</span>
                    </div>
                    
                    {/* Properties - Only show if configured */}
                    {credit.properties && (
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#C9A45C" }} />
                        <span className="text-white">{credit.properties}</span>
                      </div>
                    )}
                    
                    {/* Renovations + Furniture - Only show if configured */}
                    {credit.renovations && (
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#C9A45C" }} />
                        <span className="text-white">{credit.renovations}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#C9A45C" }} />
                      <span className="text-white">
                        Consultoria {credit.consulting === 'Isenta' ? (
                          <>
                            <span className="font-bold">Isenta</span>
                          </>
                        ) : (
                          <>
                            <span className="font-bold">{credit.consulting}</span>
                          </>
                        )}
                      </span>
                    </div>
                    
                    {/* Assessoria Jurídica e Contábil - Only show if configured */}
                    {credit.cardBenefits?.assessoriaJuridicaContabil && (
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#C9A45C" }} />
                        <span className="text-white">Assessoria jurídica e contábil</span>
                      </div>
                    )}

                     {/* Cashback - Only show if configured and > 0 */}
                     {(credit.cardBenefits?.cashback ?? 0) > 0 && (
                       <div className="flex items-center gap-2 text-sm">
                         <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#C9A45C" }} />
                         <span className="text-white">Cashback de {credit.cardBenefits.cashback}%</span>
                       </div>
                     )}
                  </div>

              {/* Maior Padrão Badge - Only show if configured */}
              {credit.maiorPadrao?.ativo && credit.maiorPadrao?.quantidade > 0 && (
                    <div className="mb-4">
                      <Badge 
                        variant="secondary" 
                        className="w-full justify-center py-2 px-3 font-semibold text-xs rounded-xl border-2"
                        style={{ 
                          background: "linear-gradient(135deg, rgba(201, 164, 92, 0.15) 0%, rgba(229, 200, 117, 0.05) 100%)",
                          border: "2px solid #C9A45C",
                          color: "#C9A45C"
                        }}
                       >
                         <Star className="w-3 h-3 mr-1 fill-current" />
                         Padrão maior em até {credit.maiorPadrao.quantidade} {credit.maiorPadrao.quantidade === 1 ? 'imóvel' : 'imóveis'}
                       </Badge>
                    </div>
                  )}

                  {/* Income Highlight */}
                  <div className="text-center mb-4 p-6 rounded-2xl shadow-lg" style={{ 
                    background: "linear-gradient(135deg, #DFFFEF 0%, #C4D5D2 100%)",
                    border: "2px solid #C9A45C"
                  }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: "#163B36" }}>
                      RENDA ESTIMADA
                    </div>
                    <div className="text-2xl font-bold" style={{ color: "#163B36" }}>
                      {credit.estimatedIncome}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#163B36" }}>
                      seguindo o planejamento dos ciclos
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#163B36" }}>
                      por mês
                    </div>
                  </div>

                  {/* Select Button */}
                  <Button 
                    className="w-full font-bold py-3 rounded-xl transition-all duration-300 text-black hover:scale-105"
                    style={{ 
                      background: isSelected 
                        ? "linear-gradient(135deg, #E5C875 0%, #C9A45C 100%)"
                        : "linear-gradient(135deg, #C9A45C 0%, #E5C875 100%)"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCredit(credit.id);
                    }}
                  >
                    {isSelected ? "Selecionado ✓" : "Selecionar"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer with Disclaimer */}
        <footer className="mt-12 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-xs max-w-2xl mx-auto leading-relaxed" style={{ color: "#C4D5D2" }}>
              As estimativas apresentadas não garantem rentabilidade ou contemplação no consórcio. 
              Os resultados podem variar conforme mercado, ocupação do imóvel e regras da administradora.
            </p>
          </div>
        </footer>

        {/* Cycle Summary Modal */}
        <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:text-white [&>button]:hover:bg-white/10" style={{ backgroundColor: "#1F4A43" }}>
            <div className="p-8 pt-12">

              {summaryOption && (() => {
                const cyclesData = getMeeting2CycleData(summaryOption.composition.total_credito, summaryOption.composition.total_parcela);
                return (
                  <>
                    {/* Header */}
                    <div className="text-center mb-8 pt-4">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Resumo dos Ciclos
                      </h2>
                      <p className="text-lg mb-4" style={{ color: "#C4D5D2" }}>
                        Parcela: {summaryOption.installment}
                      </p>
                      
                      {/* Income Badge */}
                      <div className="flex justify-center mb-4">
                        <div className="px-8 py-4 rounded-full text-sm font-semibold shadow-lg" style={{ 
                          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.15) 50%, rgba(6, 182, 212, 0.1) 100%)",
                          color: "#FFFFFF",
                          border: "1px solid rgba(34, 197, 94, 0.3)"
                        }}>
                          Renda líquida estimada (Ciclo 4) por mês: {cyclesData.length >= 4 ? cyclesData[3].profit : summaryOption.estimatedIncome}
                        </div>
                      </div>
                    </div>

                    {/* Cycles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {cyclesData.slice(0, 4).map((cycle, index) => (
                        <div 
                          key={index}
                          className="p-6 rounded-2xl border border-white/20"
                          style={{ backgroundColor: "#163B36" }}
                        >
                          <h3 className="text-lg font-bold text-white mb-4 text-center">
                            Ciclo {cycle.cycle}
                          </h3>
                          
                          {/* House Icons */}
                          <div className="flex items-center justify-center gap-2 my-4">
                            {[...Array(cycle.cycle)].map((_, iconIndex) => (
                              <div
                                key={iconIndex}
                                className="transform transition-all duration-500"
                                style={{ animationDelay: `${iconIndex * 100}ms` }}
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-[#C9A45C] to-[#B78D4A] rounded-lg flex items-center justify-center shadow-lg">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                                  </svg>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs font-semibold mb-1 text-slate-300">
                                PATRIMÔNIO
                              </div>
                              <div className="text-sm font-bold text-white">
                                {cycle.patrimony}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs font-semibold mb-1 text-slate-300">
                                ALUGUEL LÍQUIDO
                              </div>
                              <div className="text-sm font-bold text-white">
                                {cycle.income}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs font-semibold mb-1 text-slate-300">
                                PARCELA
                              </div>
                              <div className="text-sm font-bold text-white">
                                {cycle.installment}
                              </div>
                            </div>
                            
                            <div className="pt-3 border-t border-white/10">
                              <div className="text-xs font-semibold mb-2 text-emerald-300">
                                LUCRO
                              </div>
                              <div className="text-lg font-bold text-emerald-400">
                                {cycle.profit}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* How we calculate */}
                    <div className="flex justify-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-white hover:bg-white/10 gap-2"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M12 16v-4"/>
                              <path d="M12 8h.01"/>
                            </svg>
                            Como calculamos?
                          </Button>
                        </PopoverTrigger>
                         <PopoverContent className="w-80 p-4" style={{ backgroundColor: "#1F4A43", border: "1px solid rgba(255,255,255,0.2)" }}>
                          <div className="text-sm text-white space-y-2">
                            <p><strong>Metodologia dos 4 ciclos:</strong></p>
                            <p>• Cada imóvel = valor total do crédito</p>
                            <p>• A cada ciclo você adquire 1 imóvel novo</p>
                            <p>• Imóveis anteriores se valorizam 4% a.a.</p>
                            <p>• Renda mensal = 1% do patrimônio total</p>
                            <p>• Lucro = renda - parcela mensal</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>

        {/* Simulator Button */}
        <SimulatorButton onClick={() => setSimulatorOpen(true)} />

        {/* Simulator Modal */}
        <SimulatorModal
          open={simulatorOpen}
          onOpenChange={setSimulatorOpen}
          onSimulate={handleSimulate}
          currentInstallment={clientInfo?.meeting2?.combination?.total_parcela || clientInfo?.meeting2?.target_installment_num || 0}
        />
      </div>
    </div>
  );
}