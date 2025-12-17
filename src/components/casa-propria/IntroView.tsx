
import RCButton from "@/components/RCButton";
import { Home, DollarSign, Calendar, Target } from "lucide-react";

interface IntroViewProps {
  monthlyRent: number;
  availableSavings: number;
  formatCurrency: (value: number) => string;
  onAdvance: () => void;
  onBack: () => void;
}

const CasaPropriaIntroView = ({ monthlyRent, availableSavings, formatCurrency, onAdvance, onBack }: IntroViewProps) => {
  const annualRent = monthlyRent * 12;
  const threeYearRent = monthlyRent * 36;

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-manrope">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-white border border-[#B78D4A]/20 rounded-full px-4 py-2 mb-8">
              <Home className="w-4 h-4 text-[#B78D4A]" />
              <span className="text-[#B78D4A] font-bold text-xs tracking-wide uppercase">ANÁLISE</span>
            </div>
            
            <h1 className="text-[32px] font-bold text-[#193D32] mb-4 leading-tight">
              Sua Situação Atual
            </h1>
            <p className="text-[18px] text-[#333333] max-w-2xl mx-auto leading-relaxed">
              Vamos analisar quanto você está gastando com aluguel e como isso impacta seu planejamento
            </p>
          </div>

          {/* Cards de Análise */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Aluguel Mensal */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B78D4A] to-[#D4B570] rounded-xl flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#193D32] mb-2">Aluguel Mensal</h3>
              <p className="text-3xl font-bold text-[#B78D4A] mb-2">{formatCurrency(monthlyRent)}</p>
              <p className="text-sm text-gray-600">Valor atual do seu aluguel</p>
            </div>

            {/* Gasto Anual */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#193D32] to-[#355F4D] rounded-xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#193D32] mb-2">Gasto Anual</h3>
              <p className="text-3xl font-bold text-[#193D32] mb-2">{formatCurrency(annualRent)}</p>
              <p className="text-sm text-gray-600">Total gasto em 12 meses</p>
            </div>

            {/* Valor Disponível */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#355F4D] to-[#193D32] rounded-xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#193D32] mb-2">Entrada Disponível</h3>
              <p className="text-3xl font-bold text-[#355F4D] mb-2">{formatCurrency(availableSavings)}</p>
              <p className="text-sm text-gray-600">Valor para entrada</p>
            </div>
          </div>

          {/* Destaque Principal */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 mb-12">
            <Target className="w-16 h-16 text-[#B78D4A] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#193D32] mb-4">
              Impacto Financeiro do Aluguel
            </h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-[#333333] mb-6 leading-relaxed">
                Em 3 anos, você gastará <span className="font-bold text-[#B78D4A]">{formatCurrency(threeYearRent)}</span> com aluguel. 
                Esse valor poderia ser usado para financiar sua casa própria.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
                  <h4 className="font-bold text-red-700 mb-2">Continuando no Aluguel</h4>
                  <p className="text-red-600">• Dinheiro "perdido" mensalmente</p>
                  <p className="text-red-600">• Sem patrimônio construído</p>
                  <p className="text-red-600">• Dependência do proprietário</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="font-bold text-green-700 mb-2">Comprando sua Casa</h4>
                  <p className="text-green-600">• Construção de patrimônio</p>
                  <p className="text-green-600">• Segurança e estabilidade</p>
                  <p className="text-green-600">• Independência habitacional</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mb-8">
            <RCButton 
              variant="primary" 
              onClick={onAdvance}
              className="bg-[#B78D4A] hover:bg-[#B78D4A]/90 text-white text-xl px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Ver Cenários de Compra
            </RCButton>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <RCButton 
              variant="auxiliary" 
              onClick={onBack}
              className="border border-[#355F4D] text-[#355F4D] hover:bg-[#355F4D] hover:text-white px-6 py-2 rounded-full transition-all duration-300"
            >
              Voltar
            </RCButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasaPropriaIntroView;
