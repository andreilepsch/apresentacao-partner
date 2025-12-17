
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import RetirementProjection from "./RetirementProjection";

interface FinalViewProps {
  monthlyInvestment: number;
  targetRetirement: number;
  currentAge: number;
  retirementAge: number;
  formatCurrency: (value: number) => string;
  onRestart: () => void;
  onNext: () => void;
}

const FinalView = ({ 
  monthlyInvestment, 
  targetRetirement, 
  currentAge, 
  retirementAge,
  formatCurrency,
  onRestart,
  onNext
}: FinalViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F7F5F0] font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Badge e Título da Seção */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B78D4A] to-[#B78D4A]/90 rounded-full px-6 py-3 mb-8 shadow-lg">
            <Calculator className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-sm tracking-wide uppercase">SIMULAÇÃO COMPLETA</span>
          </div>

          <h1 className="text-3xl font-bold text-[#193D32] mb-6 leading-tight">
            Projeção da sua Aposentadoria
          </h1>
          
          {/* Divider dourado aprimorado */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#B78D4A]"></div>
            <div className="w-4 h-4 bg-[#B78D4A] rounded-full shadow-md"></div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#B78D4A]"></div>
          </div>
        </div>

        {/* Componente de Projeção */}
        <RetirementProjection
          monthlyInvestment={monthlyInvestment}
          targetRetirement={targetRetirement}
          currentAge={currentAge}
          retirementAge={retirementAge}
          formatCurrency={formatCurrency}
        />

        {/* Navigation com design aprimorado */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center mt-12 pt-8 border-t border-[#B78D4A]/20">
          <Button
            variant="outline"
            onClick={onRestart}
            className="px-8 py-4 border-2 border-[#193D32] text-[#193D32] hover:bg-[#193D32] hover:text-white transition-all duration-300 font-semibold rounded-xl"
          >
            ← Ver Simulação Novamente
          </Button>
          <Button
            onClick={onNext}
            className="px-8 py-4 bg-gradient-to-r from-[#B78D4A] to-[#B78D4A]/90 hover:from-[#355F4D] hover:to-[#355F4D]/90 text-white border-0 shadow-lg font-semibold rounded-xl transition-all duration-300"
          >
            Continuar Jornada →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalView;
