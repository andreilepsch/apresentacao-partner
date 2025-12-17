
import { useState } from "react";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import DiagnosisHeader from "@/components/renda-extra/DiagnosisHeader";
import DiagnosisForm from "@/components/renda-extra/DiagnosisForm";
import LoadingAnalysis from "@/components/renda-extra/LoadingAnalysis";

const RendaExtraStep1 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  
  const [formData, setFormData] = useState({
    monthlyInvestment: "",
    downPayment: "",
    irpfDeclaration: [] as string[]
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = () => {
    localStorage.setItem('rendaExtraFormData', JSON.stringify(formData));
    setIsAnalyzing(true);
  };

  // Loading screen
  if (isAnalyzing) {
    return (
      <LoadingAnalysis 
        durationMs={12000}
        onComplete={() => navigateWithPreview("/renda-extra/step2")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        <DiagnosisHeader />

        {/* Form Container */}
        <DiagnosisForm 
          formData={formData}
          setFormData={setFormData}
          onAnalysis={handleAnalysis}
        />

        {/* Navigation */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/step6-investment-options")}
            className="px-8 py-3 border-2 border-[#193D32] text-[#193D32] hover:bg-[#F7F5F0] hover:border-[#193D32] rounded-xl font-semibold text-lg"
          >
            ← Voltar para etapa anterior
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RendaExtraStep1;
