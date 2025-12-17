
import { useState, useEffect } from "react";
import { useInvestmentSimulation } from "@/hooks/useInvestmentSimulation";

export const useStep2Logic = () => {
  const [currentStep, setCurrentStep] = useState('path-selection');
  const [selectedPath, setSelectedPath] = useState<'rent-and-credit' | 'investment-first' | null>(null);
  const [animateProperty, setAnimateProperty] = useState(false);
  const [monthlyRent, setMonthlyRent] = useState(2500); // Parcela mensal para investimento
  const [currentRent, setCurrentRent] = useState(2500); // Aluguel atual
  const [availableSavings, setAvailableSavings] = useState(50000);
  const { formatCurrency } = useInvestmentSimulation();

  // Função customizada para casa própria que considera corretamente os imóveis rentáveis
  const getCasaPropriaCycleData = (monthlyInvestment: number, selectedPath: 'rent-and-credit' | 'investment-first' | null) => {
    // Nova regra: A cada 500 reais de valor investido = 100 mil de patrimônio
    const patrimonyPerCycle = (monthlyInvestment / 500) * 100000;
    const installment = monthlyInvestment;
    
    return [
      {
        cycle: 1,
        patrimony: formatCurrency(patrimonyPerCycle),
        installment: formatCurrency(installment),
        income: formatCurrency(selectedPath === 'investment-first' ? patrimonyPerCycle * 0.01 : 0),
        profit: formatCurrency(selectedPath === 'investment-first' ? (patrimonyPerCycle * 0.01) - installment : 0),
      },
      {
        cycle: 2,
        patrimony: formatCurrency(patrimonyPerCycle * 2),
        installment: formatCurrency(installment * 2),
        income: formatCurrency(selectedPath === 'investment-first' ? (patrimonyPerCycle * 2) * 0.01 : patrimonyPerCycle * 0.01),
        profit: formatCurrency(selectedPath === 'investment-first' ? ((patrimonyPerCycle * 2) * 0.01) - (installment * 2) : (patrimonyPerCycle * 0.01) - (installment * 2)),
      },
      {
        cycle: 3,
        patrimony: formatCurrency(patrimonyPerCycle * 3),
        installment: formatCurrency(installment * 3),
        income: formatCurrency(selectedPath === 'investment-first' ? (patrimonyPerCycle * 2) * 0.01 : (patrimonyPerCycle * 2) * 0.01), // Para caminho 2: 2 imóveis rentáveis + 1 casa própria
        profit: formatCurrency(selectedPath === 'investment-first' ? ((patrimonyPerCycle * 2) * 0.01) - (installment * 3) : ((patrimonyPerCycle * 2) * 0.01) - (installment * 3)),
      },
      {
        cycle: 4,
        patrimony: formatCurrency(patrimonyPerCycle * 4),
        installment: formatCurrency(installment * 4),
        income: formatCurrency(selectedPath === 'investment-first' ? (patrimonyPerCycle * 3) * 0.01 : (patrimonyPerCycle * 3) * 0.01), // Para caminho 2: 3 imóveis rentáveis + 1 casa própria
        profit: formatCurrency(selectedPath === 'investment-first' ? ((patrimonyPerCycle * 3) * 0.01) - (installment * 4) : ((patrimonyPerCycle * 3) * 0.01) - (installment * 4)),
      }
    ];
  };

  // Recuperar dados do formulário do localStorage
  useEffect(() => {
    const formData = localStorage.getItem('casaPropriaFormData');
    const savedPath = localStorage.getItem('casaPropriaSelectedPath');
    
    if (formData) {
      const parsed = JSON.parse(formData);
      // Usar monthlyInstallment como parcela mensal (valor que consegue pagar junto do aluguel)
      const installmentValue = typeof parsed.monthlyInstallment === 'string' ? 
        parsed.monthlyInstallment.replace(/[^\d]/g, '') : 
        String(parsed.monthlyInstallment);
      // Usar monthlyRent como aluguel atual
      const rentValue = typeof parsed.monthlyRent === 'string' ? 
        parsed.monthlyRent.replace(/[^\d]/g, '') : 
        String(parsed.monthlyRent);
      const savingsValue = typeof parsed.availableSavings === 'string' ? 
        parsed.availableSavings.replace(/[^\d]/g, '') : 
        String(parsed.availableSavings);
      
      setMonthlyRent(parseInt(installmentValue) || 2500); // Usando installment como parcela mensal
      setCurrentRent(parseInt(rentValue) || 2500); // Aluguel atual
      setAvailableSavings(parseInt(savingsValue) || 50000);
      
      // Recuperar selectedPath se existir
      if (parsed.selectedPath || savedPath) {
        setSelectedPath((parsed.selectedPath || savedPath) as 'rent-and-credit' | 'investment-first');
      }
    }
  }, []);

  const cycles = getCasaPropriaCycleData(monthlyRent, selectedPath);

  // Função para formatar patrimônio em formato compacto (ex: R$ 960K, R$ 1.2MM)
  const formatPatrimonyCompact = (value: number): string => {
    const millions = value / 1000000;
    const thousands = value / 1000;
    
    if (millions >= 1) {
      // Para milhões, usar MM
      if (millions % 1 === 0) {
        return `R$ ${millions.toFixed(0)}MM`;
      }
      return `R$ ${millions.toFixed(1)}MM`;
    } else if (thousands >= 1) {
      // Para milhares, usar K
      if (thousands % 1 === 0) {
        return `R$ ${thousands.toFixed(0)}K`;
      }
      return `R$ ${thousands.toFixed(0)}K`;
    }
    
    // Para valores menores que 1000, usar formatação normal
    return formatCurrency(value);
  };

  const handlePathSelection = (path: 'rent-and-credit' | 'investment-first') => {
    setSelectedPath(path);
    
    // Persistir selectedPath no localStorage
    localStorage.setItem('casaPropriaSelectedPath', path);
    
    // Também atualizar formData existente
    const existingFormData = JSON.parse(localStorage.getItem('casaPropriaFormData') || '{}');
    existingFormData.selectedPath = path;
    localStorage.setItem('casaPropriaFormData', JSON.stringify(existingFormData));
    
    // Para caminho 01 (rent-and-credit), vai direto para o card simples
    if (path === 'rent-and-credit') {
      setCurrentStep('simple-card');
    } else {
      setCurrentStep('cycle1');
    }
  };

  const handleAdvance = () => {
    setAnimateProperty(true);
    setTimeout(() => {
      setAnimateProperty(false);
      if (currentStep === 'cycle1') {
        setCurrentStep('cycle2');
      } else if (currentStep === 'cycle2') {
        setCurrentStep('cycle3');
      } else if (currentStep === 'cycle3') {
        setCurrentStep('cycle4');
      } else if (currentStep === 'cycle4') {
        setCurrentStep('final');
      }
    }, 300);
  };

  const getProgressStep = () => {
    switch (currentStep) {
      case 'cycle1': return 1;
      case 'cycle2': return 2;
      case 'cycle3': return 3;
      case 'cycle4': return 4;
      default: return 0;
    }
  };

  const handleBack = (navigate: (path: string) => void) => {
    if (currentStep === 'path-selection') {
      navigate("/casa-propria/step1");
    } else if (currentStep === 'simple-card') {
      setCurrentStep('path-selection');
    } else if (currentStep === 'cycle1') {
      setCurrentStep('path-selection');
    } else if (currentStep === 'cycle2') {
      setCurrentStep('cycle1');
    } else if (currentStep === 'cycle3') {
      setCurrentStep('cycle2');
    } else if (currentStep === 'cycle4') {
      setCurrentStep('cycle3');
    }
  };

  const getCurrentCycle = () => {
    const cycleNum = getProgressStep();
    return cycleNum > 0 ? cycles[cycleNum - 1] : null;
  };

  return {
    currentStep,
    selectedPath,
    monthlyRent,
    currentRent,
    availableSavings,
    formatCurrency,
    formatPatrimonyCompact,
    cycles,
    handlePathSelection,
    handleAdvance,
    handleBack,
    getCurrentCycle,
    getProgressStep,
    setCurrentStep
  };
};
