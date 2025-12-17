
import RCButton from "@/components/RCButton";
import ResultsCards from "@/components/renda-extra/ResultsCards";
import { TrendingUp, RotateCcw, Trophy, Target } from "lucide-react";
import { useInvestmentSimulation } from "@/hooks/useInvestmentSimulation";

interface FinalViewProps {
  monthlyInvestment: number;
  formatCurrency: (value: number) => string;
  formatPatrimonyCompact: (value: number) => string;
  onRestart: () => void;
  onNext: () => void;
}

const FinalView = ({ monthlyInvestment, formatCurrency, formatPatrimonyCompact, onRestart, onNext }: FinalViewProps) => {
  const { getAppreciatedTotalPatrimony } = useInvestmentSimulation();

  // Cálculos com valorização
  const basePropertyValue = (monthlyInvestment / 500) * 100000;
  const totalPatrimony = getAppreciatedTotalPatrimony(basePropertyValue, 4);
  const monthlyIncome = totalPatrimony * 0.01;
  const totalInvested = monthlyInvestment * 12 * 5 * 4; // 4 ciclos de 5 anos cada
  const totalProperties = 4;

  const results = {
    totalProperties,
    totalPatrimony,
    totalInvested,
    monthlyIncome
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-manrope">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header com Badge */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B78D4A] to-[#355F4D] text-white rounded-full px-6 py-3 mb-8 shadow-lg">
              <Trophy className="w-5 h-5" />
              <span className="font-bold text-sm tracking-wide uppercase">RESULTADO FINAL</span>
            </div>
            
            <h1 className="text-4xl font-bold text-[#193D32] mb-6 leading-tight">
              🎯 Parabéns! Você completou os 4 ciclos
            </h1>
            <p className="text-xl text-[#333333] max-w-3xl mx-auto leading-relaxed">
              Agora você tem um portfólio robusto de imóveis gerando renda passiva consistente.
            </p>
          </div>

          {/* Cards de Resultado Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#355F4D] to-[#193D32] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-[#B78D4A] mb-3">{totalProperties}</div>
              <div className="text-xl text-[#193D32] font-semibold mb-2">Imóveis Conquistados</div>
              <div className="text-sm text-gray-600">Patrimônio construído com inteligência</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B78D4A] to-[#355F4D] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#193D32] mb-3">{formatCurrency(totalPatrimony)}</div>
              <div className="text-xl text-[#193D32] font-semibold mb-2">Patrimônio Acumulado</div>
              <div className="text-sm text-gray-600">Valor total em imóveis</div>
            </div>
          </div>

          {/* Resumo da Jornada */}
          <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100 mb-12 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#193D32] mb-4">Resumo da Sua Jornada</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#B78D4A] to-[#355F4D] rounded-full mx-auto mb-6"></div>
              <p className="text-[#333333] text-lg">
                Com um investimento mensal de {formatCurrency(monthlyInvestment)}, você construiu um patrimônio sólido
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-[#F7F5F0] rounded-xl border-l-4 border-[#B78D4A]">
                <div className="text-3xl font-bold text-[#193D32] mb-2">{formatPatrimonyCompact(totalPatrimony)}</div>
                <div className="text-sm text-gray-600 font-medium">Patrimônio Total</div>
              </div>
              <div className="text-center p-6 bg-[#F7F5F0] rounded-xl border-l-4 border-green-500">
                <div className="text-3xl font-bold text-green-700 mb-2">{formatCurrency(monthlyIncome)}</div>
                <div className="text-sm text-gray-600 font-medium">Renda Mensal Passiva</div>
              </div>
              <div className="text-center p-6 bg-[#F7F5F0] rounded-xl border-l-4 border-[#355F4D]">
                <div className="text-3xl font-bold text-[#355F4D] mb-2">{totalProperties}</div>
                <div className="text-sm text-gray-600 font-medium">Imóveis no Portfólio</div>
              </div>
            </div>
          </div>

          {/* ROI Destacado */}
          <div className="bg-gradient-to-br from-[#B78D4A] to-[#355F4D] rounded-2xl p-8 text-center text-white shadow-2xl mb-12 animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">Resultado Impressionante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-sm uppercase opacity-90 mb-2">Investimento Total</div>
                <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
              </div>
              <div>
                <div className="text-sm uppercase opacity-90 mb-2">Retorno Mensal</div>
                <div className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</div>
              </div>
            </div>
            <div className="w-20 h-1 bg-white/40 rounded-full mx-auto mt-6"></div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
            <RCButton 
              variant="primary" 
              onClick={onNext}
              className="bg-[#B78D4A] hover:bg-[#355F4D] text-white text-xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Ver Caso Real
            </RCButton>
            
            <RCButton 
              variant="auxiliary" 
              onClick={onRestart}
              className="border-2 border-[#355F4D] text-[#355F4D] hover:bg-[#355F4D] hover:text-white px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Refazer Simulação
            </RCButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalView;
