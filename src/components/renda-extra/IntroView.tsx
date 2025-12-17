
import { DollarSign, Home } from "lucide-react";
import RCButton from "@/components/RCButton";

interface IntroViewProps {
  monthlyInvestment: number;
  formatCurrency: (value: number) => string;
  onAdvance: () => void;
  onBack: () => void;
}

const IntroView = ({ monthlyInvestment, formatCurrency, onAdvance, onBack }: IntroViewProps) => {
  return (
    <div className="min-h-screen bg-[#F7F5F0] font-manrope">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-[#193D32] mb-6">
              Projeção Financeira
            </h1>
            <p className="text-xl text-[#355F4D] mb-6 max-w-3xl mx-auto leading-relaxed">
              Veja como seu patrimônio e renda podem crescer. A cada ciclo, um novo imóvel. A cada imóvel, mais renda.
            </p>
          </div>

          {/* Badge */}
          <div className="mb-12">
            <div className="inline-flex items-center bg-[#E9F7F2] border-2 border-[#355F4D] rounded-full px-8 py-4 shadow-lg">
              <DollarSign className="w-6 h-6 text-[#193D32] mr-3" />
              <span className="text-lg font-bold text-[#193D32]">Aporte constante: {formatCurrency(monthlyInvestment)}/mês</span>
            </div>
          </div>

          {/* Illustration */}
          <div className="mb-12">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-[#E9F7F2] max-w-2xl mx-auto">
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#355F4D] to-[#193D32] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <DollarSign className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-[#333333] font-semibold">{formatCurrency(monthlyInvestment)}/mês</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-[#B78D4A] to-[#355F4D]"></div>
                  <div className="w-4 h-4 bg-[#B78D4A] rounded-full ml-2"></div>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#B78D4A] to-[#355F4D] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Home className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-[#333333] font-semibold">4 Imóveis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-6 items-center">
            <RCButton 
              variant="primary" 
              onClick={onAdvance}
              className="bg-[#B78D4A] hover:bg-[#B78D4A]/90 text-white text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Começar Jornada
            </RCButton>
            
            <RCButton 
              variant="auxiliary" 
              onClick={onBack}
              className="border border-[#355F4D] text-[#355F4D] hover:bg-[#355F4D] hover:text-white px-8 py-3 rounded-full transition-all duration-300"
            >
              Voltar
            </RCButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroView;
