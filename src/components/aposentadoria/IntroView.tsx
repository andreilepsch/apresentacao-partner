import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, Target, TrendingUp } from "lucide-react";

interface IntroViewProps {
  monthlyInvestment: number;
  formatCurrency: (value: number) => string;
  onAdvance: () => void;
  onBack: () => void;
}

const IntroView = ({ monthlyInvestment, formatCurrency, onAdvance, onBack }: IntroViewProps) => {
  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Badge e Título da Seção */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F7F5F0] border border-[#B78D4A]/20 rounded-full px-4 py-2 mb-8">
            <Calculator className="w-4 h-4 text-[#B78D4A]" />
            <span className="text-[#B78D4A] font-bold text-xs tracking-wide uppercase">SIMULAÇÃO</span>
          </div>

          <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
            Projeção da sua Aposentadoria
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            Vamos mostrar como seus <strong>{formatCurrency(monthlyInvestment)}</strong> mensais 
            se transformarão em patrimônio e renda na aposentadoria
          </p>
          
          {/* Divider dourado */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="w-3 h-3 bg-[#B78D4A] rounded-full"></div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Metodologia */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#EEE] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div className="w-16 h-16 bg-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7 text-[#193D32]" />
            </div>
            <h3 className="text-xl font-bold text-[#193D32] text-center mb-3">
              Defina seus objetivos
            </h3>
            <p className="text-sm text-[#333333] text-center leading-relaxed">
              Quanto de renda passiva você quer ter e em quanto tempo?
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#EEE] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div className="w-16 h-16 bg-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-7 h-7 text-[#193D32]" />
            </div>
            <h3 className="text-xl font-bold text-[#193D32] text-center mb-3">
              Simule cenários
            </h3>
            <p className="text-sm text-[#333333] text-center leading-relaxed">
              Veja o passo a passo de como transformar seus investimentos em 
              renda mensal crescente.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#EEE] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div className="w-16 h-16 bg-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-7 h-7 text-[#193D32]" />
            </div>
            <h3 className="text-xl font-bold text-[#193D32] text-center mb-3">
              Acompanhe a evolução
            </h3>
            <p className="text-sm text-[#333333] text-center leading-relaxed">
              Monitore seus resultados e ajuste a rota para alcançar seus objetivos 
              de renda na aposentadoria.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar
          </Button>
          <Button
            onClick={onAdvance}
            className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
          >
            Avançar →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntroView;
