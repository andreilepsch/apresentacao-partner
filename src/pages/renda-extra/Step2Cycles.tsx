
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { useState, useEffect } from "react";
import { useInvestmentSimulation } from "@/hooks/useInvestmentSimulation";
import IntroView from "@/components/renda-extra/IntroView";
import FinalView from "@/components/renda-extra/FinalView";
import CycleView from "@/components/renda-extra/CycleView";

const RendaExtraStep2 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  const [currentStep, setCurrentStep] = useState('intro');
  const [animateProperty, setAnimateProperty] = useState(false);
  const [monthlyInvestment, setMonthlyInvestment] = useState(3000);
  const { formatCurrency, getCycleData } = useInvestmentSimulation();

  // Recuperar dados do formulário do localStorage
  useEffect(() => {
    const formData = localStorage.getItem('rendaExtraFormData');
    if (formData) {
      const parsed = JSON.parse(formData);
      // Extrair apenas números do valor de investimento mensal
      const investmentValue = parsed.monthlyInvestment.replace(/[^\d]/g, '');
      setMonthlyInvestment(parseInt(investmentValue) || 3000);
    }
  }, []);

  const cycles = getCycleData(monthlyInvestment);

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

  const handleAdvance = () => {
    setAnimateProperty(true);
    setTimeout(() => {
      setAnimateProperty(false);
      if (currentStep === 'intro') {
        setCurrentStep('cycle1');
      } else if (currentStep === 'cycle1') {
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

  const handleBack = () => {
    if (currentStep === 'cycle1') {
      setCurrentStep('intro');
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

  if (currentStep === 'intro') {
    return (
      <IntroView
        monthlyInvestment={monthlyInvestment}
        formatCurrency={formatCurrency}
        onAdvance={handleAdvance}
        onBack={() => navigateWithPreview("/renda-extra/step1")}
      />
    );
  }

  if (currentStep === 'final') {
    return (
      <FinalView
        monthlyInvestment={monthlyInvestment}
        formatCurrency={formatCurrency}
        formatPatrimonyCompact={formatPatrimonyCompact}
        onRestart={() => setCurrentStep('intro')}
        onNext={() => navigateWithPreview("/renda-extra/step4")}
      />
    );
  }

  // Cycle view - Now using CycleView component
  const currentCycle = getCurrentCycle();
  const cycleNumber = getProgressStep();

  return (
    <CycleView
      currentCycle={currentCycle!}
      cycleNumber={cycleNumber}
      monthlyInvestment={monthlyInvestment}
      formatCurrency={formatCurrency}
      onAdvance={handleAdvance}
      onBack={handleBack}
    />
  );
};

export default RendaExtraStep2;
