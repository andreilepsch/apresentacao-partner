import { useState } from "react";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PageBadge from "@/components/common/PageBadge";
import SectionDivider from "@/components/common/SectionDivider";
import AposentadoriaForm from "@/components/aposentadoria/AposentadoriaForm";
import LoadingAnalysis from "@/components/renda-extra/LoadingAnalysis";

const AposentadoriaStep7 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();
  
  const [formData, setFormData] = useState({
    monthlyInvestment: "",
    targetRetirement: "",
    currentAge: "",
    retirementAge: "",
    irpfDeclaration: [] as string[]
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = () => {
    localStorage.setItem('aposentadoriaFormData', JSON.stringify(formData));
    setIsAnalyzing(true);
  };

  // Loading screen
  if (isAnalyzing) {
    return (
      <LoadingAnalysis 
        durationMs={12000}
        onComplete={() => navigateWithPreview("/aposentadoria/step8")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <PageBadge icon={Target} text="DIAGNÓSTICO" className="mb-8" />

          <h1 className="text-[32px] font-bold text-[#193D32] mb-4 leading-tight">
            Diagnóstico para Aposentadoria
          </h1>
          <p className="text-[18px] font-normal text-[#333333] mb-6 max-w-3xl mx-auto leading-relaxed">
            Vamos analisar seu perfil e criar uma estratégia personalizada para sua aposentadoria através de investimentos imobiliários
          </p>
          
          <SectionDivider className="mb-12" />
        </div>

        {/* Form Container */}
        <AposentadoriaForm 
          formData={formData}
          setFormData={setFormData}
          onAnalysis={handleAnalysis}
        />

        {/* Navigation */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/aposentadoria/step6")}
            className="px-8 py-3 border-2 border-[#193D32] text-[#193D32] hover:bg-[#F7F5F0] hover:border-[#193D32] rounded-xl font-semibold text-lg"
          >
            ← Voltar para etapa anterior
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AposentadoriaStep7;
