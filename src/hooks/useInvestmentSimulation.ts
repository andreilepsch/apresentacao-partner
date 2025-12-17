
import { useState } from "react";

interface SimulationData {
  year: number;
  invested: number;
  patrimony: number;
  properties: number;
}

interface SimulationResults {
  totalProperties: number;
  totalPatrimony: number;
  totalInvested: number;
  monthlyIncome: number;
  chartData: SimulationData[];
}

// Constantes para valorização
const YEARS_PER_CYCLE = 5;
const APPRECIATION_RATE = 0.04; // 4% ao ano
const APPRECIATION_FACTOR = Math.pow(1 + APPRECIATION_RATE, YEARS_PER_CYCLE); // ≈ 1.216652902

export const useInvestmentSimulation = () => {
  // Helper para arredondar para dezenas de milhares (10.000)
  const roundToTenThousand = (value: number): number => {
    return Math.round(value / 10000) * 10000;
  };

  // Calcula o patrimônio apreciado para um ciclo específico
  const getAppreciatedPatrimonyForCycle = (basePropertyValue: number, cycleIndex: number): number => {
    let totalPatrimony = 0;
    
    // Para cada imóvel adquirido em ciclos anteriores (1..cycleIndex)
    for (let j = 1; j <= cycleIndex; j++) {
      // Calcular quantos ciclos de valorização se passaram desde a aquisição
      const cyclesElapsed = cycleIndex - j;
      // Aplicar valorização e arredondar para dezenas de milhares individualmente
      const appreciatedValue = basePropertyValue * Math.pow(APPRECIATION_FACTOR, cyclesElapsed);
      totalPatrimony += roundToTenThousand(appreciatedValue);
    }
    
    return totalPatrimony;
  };

  // Calcula o patrimônio total apreciado no final
  const getAppreciatedTotalPatrimony = (basePropertyValue: number, totalCycles: number): number => {
    return getAppreciatedPatrimonyForCycle(basePropertyValue, totalCycles);
  };
  // Função para determinar o valor do patrimônio baseado no investimento mensal
  const getPropertyValue = (monthlyInvestment: number): number => {
    if (monthlyInvestment >= 4001 && monthlyInvestment <= 5000) {
      return 1000000; // R$ 1.000.000
    } else if (monthlyInvestment >= 3501 && monthlyInvestment <= 4000) {
      return 850000; // R$ 850.000
    } else if (monthlyInvestment >= 3001 && monthlyInvestment <= 3500) {
      return 750000; // R$ 750.000
    } else if (monthlyInvestment >= 2501 && monthlyInvestment <= 3000) {
      return 650000; // R$ 650.000
    } else if (monthlyInvestment >= 1500 && monthlyInvestment <= 2500) {
      return 500000; // R$ 500.000
    } else {
      return 500000; // R$ 500.000 (padrão para valores abaixo de R$ 1.500)
    }
  };

  const calculateSimulation = (monthlyInvestmentInput: number, timeframeYears: number): SimulationResults => {
    const initialPropertyValue = getPropertyValue(monthlyInvestmentInput);
    const monthlyRentPerProperty = initialPropertyValue * 0.01; // 1% do valor do patrimônio
    
    let properties = 0;
    let totalInvested = 0;
    const chartData: SimulationData[] = [];
    
    // Calcular por anos
    for (let year = 1; year <= timeframeYears; year++) {
      // Investimento acumulado ano a ano
      totalInvested += monthlyInvestmentInput * 12;
      
      // Primeiro imóvel vem após 5 anos (60 meses), depois a cada 5 anos
      if (year >= 5 && (year - 5) % 5 === 0) {
        properties += 1;
      }
      
      // Patrimônio = número de imóveis × valor de cada imóvel
      const totalPatrimony = properties * initialPropertyValue;
      
      chartData.push({
        year,
        invested: totalInvested,
        patrimony: totalPatrimony,
        properties
      });
    }
    
    const finalPatrimony = properties * initialPropertyValue;
    const monthlyIncome = properties * monthlyRentPerProperty;
    
    return {
      totalProperties: properties,
      totalPatrimony: finalPatrimony,
      totalInvested,
      monthlyIncome,
      chartData
    };
  };

  const calculateRequiredInvestment = (desiredMonthlyIncome: number, timeframeYears: number): number | null => {
    // Usar valor médio para calcular investimento necessário
    const averagePropertyValue = 650000; // Valor médio entre as faixas
    const monthlyRentPerProperty = averagePropertyValue * 0.01;
    const requiredProperties = Math.ceil(desiredMonthlyIncome / monthlyRentPerProperty);
    
    const cycles = Math.floor(timeframeYears / 5);
    
    if (cycles === 0) {
      return null;
    }
    
    const maxPossibleProperties = cycles;
    
    if (requiredProperties > maxPossibleProperties) {
      return null;
    }
    
    const investmentPerProperty = 300000;
    const totalRequiredInvestment = requiredProperties * investmentPerProperty;
    const requiredMonthlyInvestment = totalRequiredInvestment / (timeframeYears * 12);
    
    return requiredMonthlyInvestment;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para renda extra - sempre 4 ciclos com valorização
  const getCycleData = (monthlyInvestment: number) => {
    // Validação de entrada
    if (!monthlyInvestment || monthlyInvestment <= 0) {
      return [];
    }

    // Nova regra: A cada 500 reais de valor investido = 100 mil de patrimônio
    const basePropertyValue = (monthlyInvestment / 500) * 100000;
    const installment = monthlyInvestment; // Parcela = valor que o cliente investe mensalmente
    
    return [
      {
        cycle: 1,
        patrimony: formatCurrency(getAppreciatedPatrimonyForCycle(basePropertyValue, 1)),
        installment: formatCurrency(installment),
        income: formatCurrency(getAppreciatedPatrimonyForCycle(basePropertyValue, 1) * 0.01),
        profit: formatCurrency((getAppreciatedPatrimonyForCycle(basePropertyValue, 1) * 0.01) - installment),
      },
      {
        cycle: 2,
        patrimony: formatCurrency(getAppreciatedPatrimonyForCycle(basePropertyValue, 2)),
        installment: formatCurrency(installment * 2),
        income: formatCurrency(getAppreciatedPatrimonyForCycle(basePropertyValue, 2) * 0.01),
        profit: formatCurrency((getAppreciatedPatrimonyForCycle(basePropertyValue, 2) * 0.01) - (installment * 2)),
      },
      {
        cycle: 3,
        patrimony: formatCurrency(getAppreciatedPatrimonyForCycle(basePropertyValue, 3)),
        installment: formatCurrency(installment * 3),
        income: formatCurrency(getAppreciatedPatrimonyForCycle(basePropertyValue, 3) * 0.01),
        profit: formatCurrency((getAppreciatedPatrimonyForCycle(basePropertyValue, 3) * 0.01) - (installment * 3)),
      },
      {
        cycle: 4,
        patrimony: formatCurrency(getAppreciatedPatrimonyForCycle(basePropertyValue, 4)),
        installment: formatCurrency(installment * 4),
        income: formatCurrency(getAppreciatedPatrimonyForCycle(basePropertyValue, 4) * 0.01),
        profit: formatCurrency((getAppreciatedPatrimonyForCycle(basePropertyValue, 4) * 0.01) - (installment * 4)),
      }
    ];
  };

  // Nova função para aposentadoria - ciclos dinâmicos baseados na idade com valorização
  const getRetirementCycleData = (monthlyInvestment: number, currentAge: number, retirementAge: number) => {
    // Validação de entrada
    if (!monthlyInvestment || monthlyInvestment <= 0 || currentAge >= retirementAge) {
      return [];
    }

    const yearsToRetirement = retirementAge - currentAge;
    const totalCycles = Math.floor(yearsToRetirement / 5); // Um ciclo a cada 5 anos
    
    if (totalCycles === 0) {
      return [];
    }
    
    // Nova regra: A cada 500 reais de valor investido = 100 mil de patrimônio
    const basePropertyValue = (monthlyInvestment / 500) * 100000;
    const installment = monthlyInvestment; // Parcela = valor que o cliente investe mensalmente
    
    const cycles = [];
    for (let i = 1; i <= totalCycles; i++) {
      const patrimonyNumeric = getAppreciatedPatrimonyForCycle(basePropertyValue, i);
      const incomeNumeric = patrimonyNumeric * 0.01;
      const installmentNumeric = installment * i;
      const profitNumeric = incomeNumeric - installmentNumeric;
      
      cycles.push({
        cycle: i,
        patrimony: formatCurrency(patrimonyNumeric),
        installment: formatCurrency(installmentNumeric),
        income: formatCurrency(incomeNumeric),
        profit: formatCurrency(profitNumeric),
      });
    }
    
    return cycles;
  };

  return {
    calculateSimulation,
    calculateRequiredInvestment,
    formatCurrency,
    getCycleData,
    getRetirementCycleData,
    getAppreciatedTotalPatrimony,
    roundToTenThousand
  };
};
