
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import CasaPropriaFinalView from "@/components/casa-propria/FinalView";
import CasaPropriaCycleView from "@/components/casa-propria/CycleView";
import CasaPropriaPathSelection from "@/components/casa-propria/PathSelection";
import SimpleInvestmentCard from "@/components/casa-propria/SimpleInvestmentCard";
import { useStep2Logic } from "@/components/casa-propria/hooks/useStep2Logic";
import { Button } from "@/components/ui/button";

const CasaPropriaStep2 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  const {
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
  } = useStep2Logic();

  // Path Selection View
  if (currentStep === 'path-selection') {
    return (
      <CasaPropriaPathSelection
        monthlyRent={currentRent}
        availableSavings={availableSavings}
        formatCurrency={formatCurrency}
        onSelectPath={handlePathSelection}
        onBack={() => handleBack(navigateWithPreview)}
      />
    );
  }

  // Simple Card View for Path 1 (rent-and-credit)
  if (currentStep === 'simple-card') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] py-12">
        <div className="container mx-auto px-4">
          <SimpleInvestmentCard
            monthlyRent={monthlyRent}
            formatCurrency={formatCurrency}
          />
          
          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-12 max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={() => handleBack(navigateWithPreview)}
              className="px-8 py-3 border-2 border-[#193D32] text-[#193D32] hover:bg-[#F7F5F0] hover:border-[#193D32] rounded-xl font-semibold text-lg"
            >
              ← Voltar
            </Button>
            
            <Button
              onClick={() => navigateWithPreview("/casa-propria/step8")}
              className="px-8 py-3 bg-[#193D32] text-white hover:bg-[#355F4D] rounded-xl font-semibold text-lg"
            >
              Continuar →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Final View
  if (currentStep === 'final') {
    const cycle4 = cycles[3]; // Ciclo 4 (índice 3)
    
    // Extrair valores numéricos dos dados do ciclo 4 - conversão correta
    const parseFormattedCurrency = (value: string): number => {
      // Remove "R$" e espaços, depois converte pontos de milhares e vírgulas decimais
      return parseFloat(value.replace(/R\$\s?/, '').replace(/\./g, '').replace(',', '.'));
    };
    
    const cycle4Data = {
      totalInvested: monthlyRent * 4 * 12 * 5, // 4 ciclos × 12 meses × 5 anos
      patrimony: parseFormattedCurrency(cycle4.patrimony),
      rentalIncome: parseFormattedCurrency(cycle4.income)
    };

    return (
      <CasaPropriaFinalView
        monthlyRent={monthlyRent}
        availableSavings={availableSavings}
        formatCurrency={formatCurrency}
        formatPatrimonyCompact={formatPatrimonyCompact}
        selectedPath={selectedPath}
        cycle4Data={cycle4Data}
        onRestart={() => setCurrentStep('path-selection')}
        onNext={() => navigateWithPreview("/casa-propria/step4")}
      />
    );
  }

  // Cycle view
  const currentCycle = getCurrentCycle();
  const cycleNumber = getProgressStep();

  return (
    <CasaPropriaCycleView
      currentCycle={currentCycle!}
      cycleNumber={cycleNumber}
      monthlyRent={monthlyRent}
      availableSavings={availableSavings}
      selectedPath={selectedPath}
      formatCurrency={formatCurrency}
      onAdvance={handleAdvance}
      onBack={() => handleBack(navigateWithPreview)}
    />
  );
};

export default CasaPropriaStep2;
