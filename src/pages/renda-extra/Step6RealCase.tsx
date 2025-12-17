
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, ArrowRight } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import FinancialAnalysis from "@/components/renda-extra/FinancialAnalysis";
import ComparisonCards from "@/components/renda-extra/ComparisonCards";
import PageBadge from "@/components/common/PageBadge";
import OptimizedImage from "@/components/common/OptimizedImage";

const RendaExtraStep6 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  const caseData = {
    propertyValue: "R$ 379.000",
    occupancy: "75%",
    dailyRate: "R$ 250",
    monthlyCosts: "R$ 2.054,10",
    grossReturn: "R$ 5.750",
    netReturn: "R$ 3.695,90"
  };

  const comparisonData = [
    {
      type: "Locação Tradicional",
      monthlyIncome: "R$ 2.300",
      costs: "R$ 800",
      netIncome: "R$ 1.500",
      yearlyReturn: "4.7%",
      color: "bg-gray-500"
    },
    {
      type: "Locação Estratégica",
      monthlyIncome: "R$ 5.750",
      costs: "R$ 2.054,10",
      netIncome: "R$ 3.695,90",
      yearlyReturn: "11.7%",
      color: "bg-[#B78D4A]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F8F9FA] to-[#F7F5F0] font-manrope">
      <div className="container mx-auto px-4 py-16 max-w-[1140px]">
        
        {/* Header with improved styling */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="mb-8">
            <PageBadge icon={Target} text="VIABILIDADE" className="shadow-sm" />
          </div>

          <h1 className="text-[32px] lg:text-[36px] font-bold text-[#193D32] mb-6 leading-tight">
            Veja um caso real:
            <span className="block text-[#B78D4A] mt-2">Domingos de Moraes</span>
          </h1>
          <p className="text-[18px] font-normal text-[#666666] mb-8 max-w-3xl mx-auto leading-relaxed">
            Entenda como analisamos viabilidade e projetamos rentabilidade real
            com dados concretos do mercado
          </p>
          
          {/* Enhanced divider */}
          <div className="flex items-center justify-center mb-16">
            <div className="w-[80px] h-[3px] bg-gradient-to-r from-[#B78D4A] to-[#D4B366] rounded-full shadow-sm"></div>
          </div>
        </div>

        {/* Property Layout and Analysis - Enhanced Design */}
        <div className="max-w-5xl mx-auto mb-16">
          {/* Property Floor Plan Otimizado */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 max-w-3xl mx-auto p-8 hover:shadow-[0_12px_50px_rgba(0,0,0,0.15)] transition-all duration-300">
              <OptimizedImage
                src="/lovable-uploads/12bb212a-4962-47e3-b038-679ec6ad1cbf.png"
                alt="Planta baixa - Domingos de Moraes - 29,71m²"
                className="w-full h-auto"
                priority={true}
                placeholder="Carregando planta baixa..."
              />
            </div>
            <div className="text-center mt-6">
              <div className="text-xl font-bold text-[#193D32] mb-2">Planta Domingos de Moraes</div>
              <div className="text-base text-[#666666] font-medium">29,71m² • 1 quarto • 1 banheiro</div>
            </div>
          </div>

          {/* Financial Analysis - Enhanced container */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-2 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100">
              <FinancialAnalysis data={caseData} />
            </div>
          </div>
        </div>

        {/* Enhanced Comparison Cards */}
        <div className="mb-20">
          <ComparisonCards data={comparisonData} />
        </div>

        {/* Key Insight - Redesigned with gradient */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-[#193D32] via-[#224239] to-[#2A5441] rounded-2xl p-10 text-center text-white shadow-[0_12px_50px_rgba(25,61,50,0.3)] border border-[#355F4D]/20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#B78D4A]/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#B78D4A]/5 rounded-full translate-y-16 -translate-x-16"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#B78D4A]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#B78D4A]/30">
                <TrendingUp className="w-8 h-8 text-[#B78D4A]" />
              </div>
              <h3 className="text-[28px] font-bold mb-6 leading-tight">
                Resultado: <span className="text-[#B78D4A]">3x mais rentável</span>
              </h3>
              <p className="text-white/90 leading-relaxed text-lg max-w-2xl mx-auto">
                A locação estratégica por temporada gera mais que o dobro da rentabilidade 
                comparada à locação tradicional, mantendo o mesmo nível de risco.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/renda-extra/step5")}
            className="px-8 py-4 border-2 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32] rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
          >
            ← Voltar
          </Button>
          <Button
            onClick={() => navigateWithPreview("/renda-extra/step7")}
            className="text-[16px] px-8 py-4 bg-gradient-to-r from-[#B78D4A] to-[#D4B366] hover:from-[#A67B42] hover:to-[#C4A356] text-white border-0 shadow-lg hover:shadow-xl rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
          >
            Estudo de Mercado <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RendaExtraStep6;
