import { useState, useEffect } from "react";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useInvestmentSimulation } from "@/hooks/useInvestmentSimulation";
import IntroView from "@/components/aposentadoria/IntroView";
import CycleView from "@/components/aposentadoria/CycleView";
import FinalView from "@/components/aposentadoria/FinalView";

const AposentadoriaStep8 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();
  const { formatCurrency, getRetirementCycleData } = useInvestmentSimulation();
  
  const [currentStep, setCurrentStep] = useState('intro');
  const [animateProperty, setAnimateProperty] = useState(false);
  const [formData, setFormData] = useState({
    monthlyInvestment: 0,
    targetRetirement: 0,
    currentAge: 0,
    retirementAge: 0,
    irpfDeclaration: [] as string[]
  });

  useEffect(() => {
    const savedData = localStorage.getItem('aposentadoriaFormData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      
      // Extrair valores numéricos dos campos formatados
      const monthlyValue = parsed.monthlyInvestment.replace(/[^\d]/g, '');
      const targetValue = parseInt(parsed.targetRetirement) || 0;
      const currentAgeValue = parseInt(parsed.currentAge) || 0;
      const retirementAgeValue = parseInt(parsed.retirementAge) || 0;
      
      setFormData({
        monthlyInvestment: parseInt(monthlyValue) || 0,
        targetRetirement: targetValue,
        currentAge: currentAgeValue,
        retirementAge: retirementAgeValue,
        irpfDeclaration: parsed.irpfDeclaration
      });
    }
  }, []);

  const cycles = getRetirementCycleData(formData.monthlyInvestment, formData.currentAge, formData.retirementAge);
  const totalCycles = cycles.length;

  const handleAdvance = () => {
    setAnimateProperty(true);
    setTimeout(() => {
      setAnimateProperty(false);
      const stepNumber = getProgressStep();
      if (currentStep === 'intro') {
        setCurrentStep('cycle1');
      } else if (stepNumber < totalCycles) {
        setCurrentStep(`cycle${stepNumber + 1}`);
      } else {
        setCurrentStep('final');
      }
    }, 300);
  };

  const getProgressStep = () => {
    if (currentStep.startsWith('cycle')) {
      return parseInt(currentStep.replace('cycle', ''));
    }
    return 0;
  };

  const handleBack = () => {
    const stepNumber = getProgressStep();
    if (stepNumber === 1) {
      setCurrentStep('intro');
    } else if (stepNumber > 1) {
      setCurrentStep(`cycle${stepNumber - 1}`);
    } else if (currentStep === 'intro') {
      navigateWithPreview("/aposentadoria/step7");
    }
  };

  const getCurrentCycle = () => {
    const cycleNum = getProgressStep();
    return cycleNum > 0 ? cycles[cycleNum - 1] : null;
  };

  if (currentStep === 'intro') {
    return (
      <IntroView
        monthlyInvestment={formData.monthlyInvestment}
        formatCurrency={formatCurrency}
        onAdvance={handleAdvance}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === 'final') {
    return (
      <FinalView
        monthlyInvestment={formData.monthlyInvestment}
        targetRetirement={formData.targetRetirement}
        currentAge={formData.currentAge}
        retirementAge={formData.retirementAge}
        formatCurrency={formatCurrency}
        onRestart={() => setCurrentStep('intro')}
        onNext={() => navigateWithPreview("/aposentadoria/step9")}
      />
    );
  }

  // Cycle view
  const currentCycle = getCurrentCycle();
  const cycleNumber = getProgressStep();

  return (
    <CycleView
      currentCycle={currentCycle!}
      cycleNumber={cycleNumber}
      totalCycles={totalCycles}
      monthlyInvestment={formData.monthlyInvestment}
      formatCurrency={formatCurrency}
      onAdvance={handleAdvance}
      onBack={handleBack}
    />
  );
};

export default AposentadoriaStep8;
