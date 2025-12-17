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

const CasaPropriaStep12 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  const [rating, setRating] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { generatePDF } = usePDFGenerator();
  const { formatCurrency, getCycleData } = useInvestmentSimulation();
  const { branding, isLoading: isBrandingLoading } = useBranding();
  useScrollToTop();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleFinalizarJornada = async () => {
    console.log('=== INICIANDO FINALIZAR JORNADA ===');
    
    if (isBrandingLoading) {
      console.warn('⏳ Aguardando branding carregar...');
      return;
    }
    
    setIsGeneratingPDF(true);
    
    try {
      // Recuperar dados do localStorage
      const savedFormData = JSON.parse(localStorage.getItem('casaPropriaFormData') || '{}');
      const selectedPath = savedFormData.selectedPath || localStorage.getItem('casaPropriaSelectedPath');
      
      console.log('Dados recuperados:', { savedFormData, selectedPath });
      
      // Só gerar PDF se for "investment-first"
      if (selectedPath !== 'investment-first') {
        console.log('PDF não gerado: caminho deve ser "Investimento Primeiro", caminho atual:', selectedPath);
        navigateWithPreview("/step1-authority");
        return;
      }
      
      const formData = {
        monthlyRent: savedFormData.monthlyRent || 'N/A',
        availableSavings: savedFormData.availableSavings || 'N/A',
        selectedPath: selectedPath === 'investment-first' ? 'Investimento Primeiro' : 'Aluguel + Consórcio'
      };
      
      // Usar monthlyInstallment para os cálculos (parcela mensal que consegue pagar)
      const monthlyInstallmentValue = parseFloat(savedFormData.monthlyInstallment?.replace(/[R$\s.]/g, '').replace(',', '.') || '0');
      
      // Usar os dados dos ciclos da UI (useStep2Logic)
      const { useStep2Logic } = await import('@/components/casa-propria/hooks/useStep2Logic');
      const getCasaPropriaCycleData = (monthlyInvestment: number) => {
        const patrimonyPerCycle = (monthlyInvestment / 500) * 100000;
        const installment = monthlyInvestment;
        
        return [
          {
            cycle: 1,
            patrimony: formatCurrency(patrimonyPerCycle),
            installment: formatCurrency(installment),
            income: formatCurrency(patrimonyPerCycle * 0.01),
            profit: formatCurrency((patrimonyPerCycle * 0.01) - installment),
          },
          {
            cycle: 2,
            patrimony: formatCurrency(patrimonyPerCycle * 2),
            installment: formatCurrency(installment * 2),
            income: formatCurrency((patrimonyPerCycle * 2) * 0.01),
            profit: formatCurrency(((patrimonyPerCycle * 2) * 0.01) - (installment * 2)),
          },
          {
            cycle: 3,
            patrimony: formatCurrency(patrimonyPerCycle * 3),
            installment: formatCurrency(installment * 3),
            income: formatCurrency((patrimonyPerCycle * 2) * 0.01), // 2 imóveis rentáveis + 1 casa própria
            profit: formatCurrency(((patrimonyPerCycle * 2) * 0.01) - (installment * 3)),
          },
          {
            cycle: 4,
            patrimony: formatCurrency(patrimonyPerCycle * 4),
            installment: formatCurrency(installment * 4),
            income: formatCurrency((patrimonyPerCycle * 3) * 0.01), // 3 imóveis rentáveis + 1 casa própria
            profit: formatCurrency(((patrimonyPerCycle * 3) * 0.01) - (installment * 4)),
          }
        ];
      };
      
      const cycles = getCasaPropriaCycleData(monthlyInstallmentValue);
      const finalCycle = cycles[cycles.length - 1];
      
      const results = {
        totalPatrimony: finalCycle.patrimony,
        rentalIncome: finalCycle.income,
        totalInvested: formatCurrency(monthlyInstallmentValue * 4 * 60) // 4 ciclos x 60 meses
      };
      
      console.log('Gerando PDF com dados:', { formData, results, cycles });
      
      console.log('📄 Gerando PDF com branding atual:', {
        companyName: branding.companyName,
        pdfLogoUrl: branding.pdfLogoUrl
      });
      
      await generatePDF({
        type: 'casa-propria',
        formData,
        results,
        cycles
      }, branding);
      
      console.log('PDF gerado com sucesso, navegando...');
      
      // Aguardar um pouco para o PDF ser gerado antes de navegar
      setTimeout(() => {
        navigateWithPreview("/step1-authority");
      }, 1000);
      
    } catch (error) {
      console.error('=== ERRO AO GERAR PDF ===', error);
      navigateWithPreview("/step1-authority");
    } finally {
      console.log('=== FINALIZANDO PROCESSO ===');
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
            onClick={() => navigateWithPreview("/casa-propria/step11")}
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

export default CasaPropriaStep12;