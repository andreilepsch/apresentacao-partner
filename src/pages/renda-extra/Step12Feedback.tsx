import { useState } from "react";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Star, Heart, Download } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PageBadge from "@/components/common/PageBadge";
import SectionDivider from "@/components/common/SectionDivider";
import FeedbackRating from "@/components/common/FeedbackRating";
import DynamicFeedbackQuestion from "@/components/DynamicFeedbackQuestion";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import { useInvestmentSimulation } from "@/hooks/useInvestmentSimulation";
import { useBranding } from "@/contexts/BrandingContext";

const RendaExtraStep12 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  const [rating, setRating] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { generatePDF } = usePDFGenerator();
  const { formatCurrency, calculateSimulation, getCycleData } = useInvestmentSimulation();
  const { branding, isLoading: isBrandingLoading } = useBranding();
  useScrollToTop();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleFinalizarJornada = async () => {
    if (isBrandingLoading) {
      console.warn('⏳ Aguardando branding carregar...');
      return;
    }
    
    setIsGeneratingPDF(true);
    
    try {
      // Recuperar dados do localStorage
      const savedFormData = JSON.parse(localStorage.getItem('rendaExtraFormData') || '{}');
      
      const formData = {
        monthlyInvestment: savedFormData.monthlyInvestment || 'N/A',
        downPayment: savedFormData.downPayment || 'N/A',
        timeframe: savedFormData.timeframe || 'N/A',
        irpfDeclaration: savedFormData.irpfDeclaration || []
      };
      
      // Usar os valores numéricos para cálculos
      const monthlyInvestmentValue = parseFloat(savedFormData.monthlyInvestment?.replace(/[R$\s.]/g, '').replace(',', '.') || '0');
      const timeframeYears = parseInt(savedFormData.timeframe?.split(' ')[0] || '10');
      
      const simulation = calculateSimulation(monthlyInvestmentValue, timeframeYears);
      
      const results = {
        totalProperties: simulation.totalProperties.toString(),
        totalPatrimony: formatCurrency(simulation.totalPatrimony),
        monthlyIncome: formatCurrency(simulation.monthlyIncome)
      };
      
      // Usar os dados dos ciclos apresentados na UI (getCycleData)
      const cycles = getCycleData(monthlyInvestmentValue);
      
      console.log('📄 Gerando PDF com branding atual:', {
        companyName: branding.companyName,
        pdfLogoUrl: branding.pdfLogoUrl
      });
      
      await generatePDF({
        type: 'renda-extra',
        formData,
        results,
        cycles
      }, branding);
      
      // Aguardar um pouco para o PDF ser gerado antes de navegar
      setTimeout(() => {
        navigateWithPreview("/step1-authority");
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      navigateWithPreview("/step1-authority");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#193D32] to-[#2A5A47] font-manrope">
      <div className="container mx-auto px-4 py-16 max-w-[1140px]">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <PageBadge 
            icon={Star} 
            text="AVALIAÇÃO" 
            className="mb-12 bg-white/10 text-white border-white/20 backdrop-blur-sm"
          />

          <DynamicFeedbackQuestion className="text-[36px] md:text-[44px] font-bold text-white mb-8 leading-tight max-w-4xl mx-auto" />
          
          <SectionDivider className="mb-16 opacity-30" />
        </div>

        {/* Rating Component */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <FeedbackRating 
              rating={rating}
              onRatingChange={handleRatingChange}
            />
          </div>
        </div>

        {/* Thank you message */}
        {rating > 0 && (
          <div className="max-w-4xl mx-auto mb-16 animate-fade-in">
            <div className="bg-gradient-to-r from-[#B78D4A] to-[#D4A562] rounded-2xl p-10 text-center text-white shadow-2xl">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6">
                Obrigado pelo seu feedback!
              </h3>
              <p className="text-white/95 leading-relaxed text-lg max-w-2xl mx-auto">
                Sua opinião é muito importante para continuarmos melhorando nossos serviços 
                e oferecendo sempre a melhor experiência para nossos clientes.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/renda-extra/step11")}
            className="px-8 py-4 border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent backdrop-blur-sm text-lg"
          >
            ← Voltar
          </Button>
          <Button
            onClick={handleFinalizarJornada}
            className={`text-lg px-10 py-4 font-semibold border-0 shadow-2xl transition-all duration-500 transform ${
              rating > 0 
                ? "bg-gradient-to-r from-[#B78D4A] to-[#D4A562] hover:from-[#D4A562] hover:to-[#B78D4A] text-white hover:scale-105" 
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            disabled={rating === 0 || isGeneratingPDF || isBrandingLoading}
          >
            {isGeneratingPDF ? (
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 animate-pulse" />
                Gerando PDF...
              </div>
            ) : rating > 0 ? (
              "Finalizar Jornada →"
            ) : (
              "Avalie para continuar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RendaExtraStep12;